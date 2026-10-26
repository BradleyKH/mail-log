---
pdfPage: 102
folio: "94"
sectionId: "7.5"
kind: text
source: ocr
confidence: 84
figures: []
---
trieved by the TRW drawing number. The report may be sorted by LARC drawing
number or by TRW drawing number, and will display drawing information only.
The records found will be cisplayed at the terminal screen with an option for
printer output. After the report has been generated, the user will be re-

turned tc the Report menu. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 3
THIS PROGRAM DISPLAYS A SPECIFIED DRAWING IN TWO (2) FORMATS:

(1) DRAWING INFORMATION SORTED BY LARC DRAWING NUMBER
(2) DRAWING INFORMATION SORTED BY TRW DRAWING NUMBER

ENTER OPTION > 1
ENTER TRW DRAWING NUMBER > 425333
12/13/84 PAGE 1

DRAWING REPORT - BRIEF

errr te eee ee te eee er

LARC NUMBER REV. TITLE
TRW NUMBER L.R. NEXT ASSEMBLIES

eee weee es Hee eee we we we wwe ew ee ww ee we ee we me we ow ee ee we we eo eee

```text
LD = 817351    A(L) GEAR, SPUR ~ TORQUER
425333         R     425328
```

OUTPUT TO PRINTER (Y OR N) > N

Option 4 generates a parts inventory report with either the assocI-
ated LARC drawing number or the associated TRW drawing number. The report may
include all drawings, only those with a value of 'R' in the tupdate! data
field, or only those without a value of 'R' ir the 'update' data field.
Several sort messages will! appear on the terminal screen, but only printer
output is available for the report. After the report has been generated, the
data base will be resorted back to its original form, and the user will be
returned to the Report menu. See Appendix C-3 for an example of the Special
