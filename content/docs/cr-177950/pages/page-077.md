---
pdfPage: 77
folio: "69"
sectionId: "7.1.2"
kind: text
source: ocr
confidence: 88.3
figures: []
---
7.1.2 INPUT TO CATEGORY LOOKUP TABLE

Option 2 allows the user to Input records Into the category lookup
table. A listing of the records in the current lookup table is displayed
within the input routine. A return entered at the prompt 'CATEGORY>! wil]
end the Input session. When input has been completed, the user will return

to the Input menu. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2
THIS PROGRAM INPUTS TO THE CATEGORY LOOKUP TABLE

THE CURRENT CATEGORY LOOKUP TABLE CONTAINS THE FOLLOWING RECORDS

$RECNO CATEGORY DESCRIPTION

1 1

```text
2    2       INORGANIC
3    3       POLYMERIC
4    4       LUBRICANT
b)    5       PROCESS
6 15       NONE
```

7

CATEGORY>6

DESCRIPTION>CATALYST
8
CATEGORY> ** return **
1 RECORD(S) ADDED
THE CATEGORY LOOKUP TABLE NOW CONTAINS THE FOLLOWING RECORDS

$RECNO CATEGORY DESCRIPTION
1 *

2 | NORGAN | C
3 POLYMERIC
4 LUBR| CANT
b) PROCESS

6 CATALYST
5 NONE

SOON BWR
