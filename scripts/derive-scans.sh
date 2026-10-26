#!/usr/bin/env bash
# Derives web-ready page scans (full and thumbnail WebP) from the 300 DPI page
# renders in build/<stem>/pages. Missing renders are produced with pdftoppm.
#
# Usage: scripts/derive-scans.sh [-j JOBS]
# Idempotent: an output is skipped when it exists and is not older than its input.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
JOBS=8
while getopts "j:" opt; do
  case "$opt" in
    j) JOBS="$OPTARG" ;;
    *) echo "usage: $0 [-j JOBS]" >&2; exit 2 ;;
  esac
done

# docId|pdf (relative to ROOT)|stem|page count
DOCS=(
  "cr-159065|NASA-contractor-report.pdf|NASA-contractor-report|150"
  "cr-159063|sources/CR-159063-mail-log-program-theory-vol1.pdf|CR-159063-mail-log-program-theory-vol1|552"
  "cr-159064|sources/CR-159064-mail-log-program-theory-vol2.pdf|CR-159064-mail-log-program-theory-vol2|535"
  "cr-159066|sources/CR-159066-mail-log-summary-and-specifications.pdf|CR-159066-mail-log-summary-and-specifications|126"
  "cr-177948|sources/CR-177948-spads-vol1-scout-project-information-programs.pdf|CR-177948-spads-vol1-scout-project-information-programs|273"
  "cr-177949|sources/CR-177949-spads-vol2-scout-project-financial-analysis.pdf|CR-177949-spads-vol2-scout-project-financial-analysis|173"
  "cr-177950|sources/CR-177950-spads-vol3-projects-directorate-information-programs.pdf|CR-177950-spads-vol3-projects-directorate-information-programs|241"
)

FULL_HEIGHT=1400
THUMB_HEIGHT=300
WEBP_QUALITY=80

# Per-page worker: renders the page if missing, then writes both WebP outputs.
# Writes to a temp file and renames so an interrupted run never leaves a partial output.
WORKER=$(cat <<'PY'
import os, sys, subprocess
from PIL import Image

pdf, stem, docId, page, root = sys.argv[1:6]
n = int(page)
pad = f"{n:03d}"
pages_dir = os.path.join(root, "build", stem, "pages")
png = os.path.join(pages_dir, f"page-{pad}.png")
out_dir = os.path.join(root, "site", "public", "scans", docId)
thumb_dir = os.path.join(out_dir, "thumbs")
full_out = os.path.join(out_dir, f"page-{pad}.webp")
thumb_out = os.path.join(thumb_dir, f"page-{pad}.webp")
FULL_H, THUMB_H, Q = int(sys.argv[6]), int(sys.argv[7]), int(sys.argv[8])

outputs_fresh = os.path.exists(full_out) and os.path.exists(thumb_out)
if outputs_fresh and os.path.exists(png) and \
        os.path.getmtime(full_out) >= os.path.getmtime(png) and \
        os.path.getmtime(thumb_out) >= os.path.getmtime(png):
    sys.exit(0)

if not os.path.exists(png):
    os.makedirs(pages_dir, exist_ok=True)
    prefix = os.path.join(pages_dir, f"page-{pad}")
    subprocess.run(["pdftoppm", "-r", "300", "-gray", "-png", "-f", str(n), "-l", str(n),
                    "-singlefile", pdf, prefix], check=True)

os.makedirs(thumb_dir, exist_ok=True)

def save(img, height, out):
    w = round(img.width * height / img.height)
    tmp = out + ".tmp"
    img.resize((w, height), Image.LANCZOS).save(tmp, "WEBP", quality=Q, method=6)
    os.replace(tmp, out)

with Image.open(png) as src:
    gray = src.convert("L")
    save(gray, FULL_H, full_out)
    save(gray, THUMB_H, thumb_out)
PY
)

export WORKER
JOB_LIST=$(mktemp)
trap 'rm -f "$JOB_LIST"' EXIT

for entry in "${DOCS[@]}"; do
  IFS='|' read -r docId pdfRel stem count <<<"$entry"
  for ((n = 1; n <= count; n++)); do
    printf '%s\t%s\t%s\t%d\n' "$docId" "$pdfRel" "$stem" "$n" >>"$JOB_LIST"
  done
done

# python3 is invoked with Windows paths, so convert the POSIX-style root.
PY_ROOT="$(cygpath -m "$ROOT" 2>/dev/null || echo "$ROOT")"

run_job() {
  IFS=$'\t' read -r docId pdfRel stem n <<<"$1"
  local pdf="$PY_ROOT/$pdfRel"
  python3 -c "$WORKER" "$pdf" "$stem" "$docId" "$n" "$PY_ROOT" "$FULL_HEIGHT" "$THUMB_HEIGHT" "$WEBP_QUALITY" \
    || { echo "FAILED: $docId page $n" >&2; return 1; }
}
export -f run_job
export PY_ROOT FULL_HEIGHT THUMB_HEIGHT WEBP_QUALITY

# Each job is one page; xargs keeps JOBS of them in flight.
tr '\n' '\0' <"$JOB_LIST" | xargs -0 -P "$JOBS" -I{} bash -c 'run_job "$1"' _ {}

echo "done: $(wc -l <"$JOB_LIST") pages processed"
