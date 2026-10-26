"""Render each STL plus the assembled display to PNG."""
import numpy as np
import trimesh
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from build import S, AFT, SPLIT, R1


def rotate(v, elev, azim):
    a, e = np.radians(azim), np.radians(elev)
    Rz = np.array([[np.cos(a), -np.sin(a), 0], [np.sin(a), np.cos(a), 0], [0, 0, 1]])
    Rx = np.array([[1, 0, 0], [0, np.cos(e), -np.sin(e)], [0, np.sin(e), np.cos(e)]])
    return v @ Rz.T @ Rx.T  # x right, y depth (away), z up


def save(meshes, colors, name, elev=20, azim=-60, size=(7, 7), zoom=None, px=170):
    """Orthographic z-buffer render so overlapping faces and thin text resolve correctly."""
    W, H = int(size[0] * px / 1.0), int(size[1] * px / 1.0)
    ref = zoom if zoom is not None else meshes
    allv = rotate(np.vstack([m.vertices for m in ref]), elev, azim)
    lo, hi = allv.min(0), allv.max(0)
    sc = min(W / (hi[0] - lo[0]), H / (hi[2] - lo[2])) * 0.92
    cx, cz = (lo[0] + hi[0]) / 2, (lo[2] + hi[2]) / 2
    img = np.ones((H, W, 3))
    zb = np.full((H, W), np.inf)
    light = rotate(np.array([[0.4, -0.6, 0.7]]), elev, azim)[0]
    light /= np.linalg.norm(light)
    for m, col in zip(meshes, colors):
        v = rotate(m.vertices, elev, azim)
        n = rotate(m.face_normals, elev, azim)
        shade = 0.3 + 0.7 * np.clip(-(n @ light) * -1, 0, 1)
        sx = (v[:, 0] - cx) * sc + W / 2
        sy = H / 2 - (v[:, 2] - cz) * sc
        for f, shd in zip(m.faces, shade):
            if n[0, 1] is None:
                pass
            tx, ty, tz = sx[f], sy[f], v[f, 1]
            x0, x1 = int(max(np.floor(tx.min()), 0)), int(min(np.ceil(tx.max()), W - 1))
            y0, y1 = int(max(np.floor(ty.min()), 0)), int(min(np.ceil(ty.max()), H - 1))
            if x1 < x0 or y1 < y0:
                continue
            d = (ty[1] - ty[2]) * (tx[0] - tx[2]) + (tx[2] - tx[1]) * (ty[0] - ty[2])
            if abs(d) < 1e-12:
                continue
            gx, gy = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
            a = ((ty[1] - ty[2]) * (gx - tx[2]) + (tx[2] - tx[1]) * (gy - ty[2])) / d
            b = ((ty[2] - ty[0]) * (gx - tx[2]) + (tx[0] - tx[2]) * (gy - ty[2])) / d
            c = 1 - a - b
            ins = (a >= -1e-6) & (b >= -1e-6) & (c >= -1e-6)
            if not ins.any():
                continue
            depth = a * tz[0] + b * tz[1] + c * tz[2]
            sub = zb[y0:y1 + 1, x0:x1 + 1]
            ok = ins & (depth < sub)
            sub[ok] = depth[ok]
            img[y0:y1 + 1, x0:x1 + 1][ok] = np.array(col) * shd
    # darken silhouette and step edges (depth jumps) so same-normal faces such as raised text read
    fin_z = np.where(np.isfinite(zb), zb, 0)
    gy, gx = np.gradient(fin_z)
    edge = (np.hypot(gx, gy) > 0.15) & np.isfinite(zb)
    img[edge] *= 0.45
    plt.imsave(name, np.clip(img, 0, 1))


def load(n):
    return trimesh.load(f"{n}.stl")


GRAY, WHITE, RED = (0.55, 0.58, 0.62), (0.92, 0.92, 0.9), (0.8, 0.25, 0.2)
lower, upper, fin, base = (load(n) for n in ("rocket_lower", "rocket_upper", "fin", "base"))

# fin (x axial, y radial, z=v+0.8) -> rocket frame (X=u, Y=v, Z=axial)
M = np.array([[0, 1, 0, 0], [0, 0, 1, -0.8], [1, 0, 0, 0], [0, 0, 0, 1]], float)
fins = []
for k in range(4):
    f = fin.copy(); f.apply_transform(M)
    f.apply_transform(trimesh.transformations.rotation_matrix(np.radians(90 * k), [0, 0, 1]))
    fins.append(f)

save([lower], [GRAY], "render_rocket_lower.png", 15, -50, (5, 6))
save([upper], [WHITE], "render_rocket_upper.png", 15, -50, (5, 7))
save([fin], [RED], "render_fin.png", 60, -70, (5, 5))
save([base], [GRAY], "render_base_top.png", 89, 0, (9, 5))
save([base], [GRAY], "render_base.png", 40, -75, (8, 6))

# assembled display
up = upper.copy(); up.apply_translation([0, 0, (AFT - SPLIT) * S])
asm = [lower, up] + fins
px = -72.0
for m in asm:
    pass
disp = []
for m in asm:
    mm = m.copy(); mm.apply_translation([px, 0, 16.0]); disp.append(mm)
disp.append(base)
save(disp, [GRAY, WHITE] + [RED] * 4 + [(0.5, 0.5, 0.55)], "render_display.png", 12, -65, (10, 7))
save(disp[:6], [GRAY, WHITE] + [RED] * 4, "render_rocket_assembled.png", 5, -30, (4, 9.5))
save(disp[:6], [GRAY, WHITE] + [RED] * 4, "render_fins_closeup.png", 20, -40, (6, 6), zoom=[disp[0], disp[2]])
