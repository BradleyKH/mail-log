"""Scout G-1 display model: rocket (2 pieces), fin (print x4), and base. Units mm.

Stations are inches from SCOUT User's Manual (NASA TM-82271) Figure I-1,
converted at S mm per inch (about 1:106).
"""
import numpy as np
import trimesh
from manifold3d import Manifold, CrossSection, FillRule
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
from shapely.geometry import Polygon

S = 0.24
SEG = 64
AFT = 847.95        # first stage body aft end (fins trail to 856.60)
SPLIT = 437.56      # top of the Algol-to-Castor transition; piece boundary
NOSE = -44.97
CLR = 0.2           # sliding clearance per side


def rev(pts):
    """Revolve (z, r) points about Z."""
    cs = CrossSection([np.array([(r, z) for z, r in pts], dtype=float)])
    return Manifold.revolve(cs, SEG)


def cyl(r, h, z0=0.0, seg=SEG):
    return Manifold.cylinder(h, r, r, seg).translate((0, 0, z0))


def ring(z, w, r_body, extra=0.3):
    return cyl(r_body + extra, w, z - w / 2)


# ---------------- rocket ----------------
R1, R2, RH = 22.5 * S, 15.5 * S, 17.0 * S


def zA(sta):  # piece A local z (aft = 0)
    return (AFT - sta) * S


def zB(sta):  # piece B local z (split plane = 0)
    return (SPLIT - sta) * S


def piece_a():
    top = zA(SPLIT)
    prof = [(0, 0), (0, R1), (zA(496.30), R1), (top, R2), (top, 0)]
    body = rev(prof)
    for sta in (809.92, 496.30):
        body = body + ring(zA(sta), 1.0, R1)
    # aft bore for the base post
    body = body - cyl(2.0, 12.0, -0.01)
    # four pinwheel T-slots for the fins, open at the aft end
    slot_len = (AFT - 786.0) * S
    for k in range(4):
        body = body - fin_slot(slot_len).rotate((0, 0, 90 * k))
    # alignment pin
    body = body + cyl(1.5, 9.0, top - 0.5)
    return body


def fin_slot(length):
    neck = Manifold.cube((1.6, 2.0, length + 0.01)).translate((4.2, -1.0, -0.01))
    head = Manifold.cube((1.2, 3.2, length + 0.01)).translate((3.0, -1.0, -0.01))
    return neck + head


def piece_b():
    pts = [(0, 0), (0, R2)]
    for sta, r in ((253.06, R2), (103.81, R2), (84.52, RH), (47.77, RH)):
        pts.append((zB(sta), r))
    # tangent ogive heatshield
    L = (47.77 - NOSE) * S
    rho = (RH ** 2 + L ** 2) / (2 * RH)
    for t in np.linspace(0, 1, 30)[1:-1]:
        d = t * L                       # distance from the ogive base toward the nose
        x = L - d                       # distance from the tip
        y = np.sqrt(rho ** 2 - (L - x) ** 2) + RH - rho
        pts.append((zB(47.77) + d, max(y, 0.3)))
    pts.append((zB(NOSE), 0.25))
    pts.append((zB(NOSE), 0))
    body = rev(pts)
    for sta in (253.06, 238.18, 103.81):
        body = body + ring(zB(sta), 1.0, R2)
    body = body - cyl(1.5 + 2 * CLR, 9.5, -0.01)
    return body


# ---------------- fin ----------------
def fin_part():
    """Flat fin in the XY plane (x axial, y radial), lying on its v=-0.8 face."""
    t = 1.6
    rt = 112 * S
    root_le = (AFT - 786.0) * S - CLR  # tab stops short of the slot end
    pts = [(-8.65 * S, 3.6), (-8.65 * S, rt), ((AFT - 833.0) * S, rt),
           ((AFT - 836.0) * S, 88 * S), (root_le, R1 - 0.6), (root_le, 3.6)]  # blade root meets body surface
    # blade
    pts = list(Polygon(pts).exterior.coords)[:-1]
    if Polygon(pts).exterior.is_ccw is False:
        pts = pts[::-1]
    blade = Manifold.extrude(CrossSection([np.array(pts)]), t)
    # T head, offset to +v so the bottom face stays flat on the bed
    head = Manifold.cube((root_le + 8.65 * S - 0.4, 0.8, 2.8)).translate((-8.65 * S + 0.2, 3.2, 0))
    fin = blade + head
    # tip control surface: separating groove
    r_g = 88 * S
    groove = Manifold.cube((30, 0.4, 0.5)).translate((-8, r_g - 0.2, t - 0.4 + 0.0))
    fin = fin - groove
    return fin


# ---------------- base ----------------
def text_cs(s, cap, x, y, bold=True):
    fp = FontProperties(family="DejaVu Sans", weight="bold" if bold else "normal")
    size = cap / 0.729
    tp = TextPath((0, 0), s, size=size, prop=fp)
    polys = [np.array(p) for p in tp.to_polygons() if len(p) > 2]
    cs = CrossSection(polys, FillRule.EvenOdd)
    return cs.translate((x, y)), cs.bounds()


def base_part():
    W, D, H = 210.0, 90.0, 8.0
    poly = Polygon([(-W / 2, -D / 2), (W / 2, -D / 2), (W / 2, D / 2), (-W / 2, D / 2)]).buffer(-5).buffer(5, 24)
    pts = np.array(poly.exterior.coords)[:-1]
    if not poly.exterior.is_ccw:
        pts = pts[::-1]
    plate = Manifold.extrude(CrossSection([pts]), H)
    px = -72.0
    boss = cyl(R1 + 0.2, 8.0, H).translate((px, 0, 0))
    post = cyl(2.0 - CLR, 19.5, H).translate((px, 0, 0))
    base = plate + boss + post
    lines = [("MAIL LOG", 9.0), ("NASA CR-159065", 6.0), ("Danny K. Harris", 6.0),
             ("Vought Corporation,", 5.0), ("Hampton Technical Center", 5.0), ("May 1979", 5.0)]
    gap = 4.5
    total = sum(c for _, c in lines) + gap * (len(lines) - 1)
    y = total / 2
    x0 = -35.0
    for s, cap in lines:
        y -= cap
        cs, _ = text_cs(s, cap, x0, y)
        base = base + Manifold.extrude(cs, 0.8).translate((0, 0, H))
        y -= gap
    return base


def to_trimesh(m):
    mesh = m.to_mesh()
    return trimesh.Trimesh(np.array(mesh.vert_properties)[:, :3], np.array(mesh.tri_verts), process=False)


if __name__ == "__main__":
    parts = {"rocket_lower": piece_a(), "rocket_upper": piece_b(), "fin": fin_part(), "base": base_part()}
    for name, m in parts.items():
        tm = to_trimesh(m)
        tm.export(f"{name}.stl")
        print(name, tm.is_watertight, round(tm.volume, 1), np.round(tm.extents, 1))
