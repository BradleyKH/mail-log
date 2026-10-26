#!/usr/bin/env bash
# Deterministic OCR of a scanned report into Markdown.
# Same PDF + same poppler/tesseract versions => byte-identical output.
# Usage: [PSM=6] bash ocr.sh [path/to/report.pdf]   (default: NASA-contractor-report.pdf)
# Writes <same dir>/<stem>.md; page renders and per-page text go to build/<stem>/.
# PSM=6 (uniform block layout) keeps line-numbered program listings on one line;
# non-default modes write <stem>.psm<N>.md and build/<stem>/text-psm<N>/.
# TSV=1 runs only the Tesseract TSV pass: per-word confidence and bounding boxes go to
# build/<stem>/tsv[-psm<N>]/page-NNN.tsv, with the same image, DPI, PSM, and threading as the
# text pass. The Markdown transcript and per-page text files are left untouched. Existing
# TSV files are skipped. Usage: TSV=1 [PSM=6] bash ocr.sh [path/to/report.pdf]
set -euo pipefail

cd "$(dirname "$0")"

PDF="${1:-NASA-contractor-report.pdf}"
STEM="$(basename "$PDF" .pdf)"
PSM="${PSM:-3}"
SUFFIX=""
[ "$PSM" = 3 ] || SUFFIX=".psm$PSM"
OUT="$(dirname "$PDF")/$STEM$SUFFIX.md"
DPI=300
PAGES_DIR="build/$STEM/pages"
TEXT_DIR="build/$STEM/text${SUFFIX/./-}"
TSV="${TSV:-0}"
TSV_DIR="build/$STEM/tsv${SUFFIX/./-}"
TESSERACT="${TESSERACT:-/c/Program Files/Tesseract-OCR/tesseract.exe}"

# OpenMP threading inside tesseract can perturb results; parallelize across pages instead.
export OMP_THREAD_LIMIT=1

mkdir -p "$PAGES_DIR" "$TEXT_DIR"

if [ -z "$(ls -A "$PAGES_DIR")" ]; then
  pdftoppm -r "$DPI" -gray -png "$PDF" "$PAGES_DIR/page"
fi

if [ "$TSV" = 1 ]; then
  mkdir -p "$TSV_DIR"
  export TESSERACT TSV_DIR DPI PSM
  # Tesseract writes <base>.partial.tsv; renaming it on success means an interrupted page is retried.
  ls "$PAGES_DIR"/page-*.png | xargs -P "$(nproc)" -I{} bash -c '
    img="$1"
    base="$(basename "$img" .png)"
    [ -s "$TSV_DIR/$base.tsv" ] && exit 0
    "$TESSERACT" "$img" "$TSV_DIR/$base.partial" --dpi "$DPI" --psm "$PSM" -l eng \
      -c preserve_interword_spaces=1 tsv quiet
    mv "$TSV_DIR/$base.partial.tsv" "$TSV_DIR/$base.tsv"
  ' _ {}
  echo "Wrote $(ls "$TSV_DIR"/page-*.tsv | wc -l) TSV files to $TSV_DIR"
  exit 0
fi

export TESSERACT TEXT_DIR DPI PSM
ls "$PAGES_DIR"/page-*.png | xargs -P "$(nproc)" -I{} bash -c '
  img="$1"
  base="$(basename "$img" .png)"
  [ -s "$TEXT_DIR/$base.txt" ] && exit 0
  "$TESSERACT" "$img" "$TEXT_DIR/$base" --dpi "$DPI" --psm "$PSM" -l eng \
    -c preserve_interword_spaces=1 quiet
' _ {}

# Each page is fenced so the scan's column layout (tables, listings) survives Markdown rendering.
{
  echo "# $STEM (OCR transcript)"
  echo
  echo "Source: \`$(basename "$PDF")\`, OCR by $("$TESSERACT" --version 2>&1 | head -1) at ${DPI} DPI, page segmentation mode ${PSM}."
  for txt in $(ls "$TEXT_DIR"/page-*.txt | sort -V); do
    n="$(basename "$txt" .txt)"
    n="$((10#${n#page-}))"
    echo
    echo "## Page $n"
    echo
    echo '```text'
    sed -e 's/[[:space:]]*$//' -e 's/\f//g' "$txt" | cat -s | sed -e '/./,$!d'
    echo '```'
  done
} > "$OUT"

echo "Wrote $OUT"
