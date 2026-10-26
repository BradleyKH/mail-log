---
pdfPage: 84
folio: "76"
sectionId: "7.2.5"
kind: text
source: ocr
confidence: 89.7
figures: []
---
RELEASED.O3> ** return **
MLP-REQD> ** return **
MLP=-DONE> ** return **
FRACTURE> ** return **
COMMENT> ** return **
HAVE~COUNT> ** return **
FILLERI> ** return **
QUANTITY> ** return **
FILLER2> ** return **

ITEM-NO?> ** return **

7.2.5 UPDATE RECORD IN CATEGORY LOOKUP TABLE

Option 5 allows the user to update a record within the category
lookup table. A listing of the records in the current lookup table Is displayed
within the update routine. To end the update session, the user must
enter a carriage return at the prompt 'RECNO?>'. The user will then be re-

turned to the Update menu. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 5
THIS PROGRAM UPDATES RECORDS IN THE CATEGORY LOOKUP TABLE

THE CURRENT CATEGORY LOOKUP TABLE CONTAINS THE FOLLOWING RECORDS

$RECNO CATEGORY DESCRIPTION

```text
1    1       *

2    2       INORGANIC

3    3       POLYMERIC

4    4       LUBRICANT

5    5       PROCESS

6 15       NONE
```

RECNGO? >6

6

```text
CATEGORY        =15
DESCRIPTION     =NONE
```

CATEGORY> 15
DESCRIPTION> ORGANIC
RECNO?> ** return **
