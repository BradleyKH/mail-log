---
pdfPage: 550
folio: "536"
sectionId: "9.0"
kind: text
source: ocr
confidence: 93.1
figures: []
---
(g)

(h)

(i)

(2) SHEET is checked by CHECKS. The CHECKS routine builds an
output file called SHT containing al] SHEET data items for
each data record.

The output files must be manually spooled.

PHASE 4 must be executed overnight due its long running time.
This routine builds the Engineering Order data file, EO, from
the FINAL data file. Each E.0. number entered is checked for a

previous entry. This process becomes progressively more time

consuming as the E.0. data file builds and exceeds 1500 records.

All data subfiles must be transferred from the TRANSPOSEDRAW
UFD to the F_DRAW UFD. After the old subfiles have been
deleted or their names changed.

The E.0. data file may now. be checked by executing an £.0.
PRINT ALL search in the MAIL LOG program.

Note that all these routines are located in the TRANSPOSEDRAW
UFD in MFD 1. The source code for each of these routines are
given in Appendix F.

```text
Figure 1                            PHASE 1
Figure 2                            PHASE 2
Figure 3                            PHASE 3
Figure 4                            PHASE 4
Figure 5                            TTEST
Figure 6                            TEST
Figure 7                            CHECKS
```
