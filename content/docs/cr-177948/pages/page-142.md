---
pdfPage: 142
folio: "133"
sectionId: "11.2.2"
kind: text
source: ocr
confidence: 90.6
figures: []
---
11.2.2 UPDATE CATEGORY AND LOCATION LOOKUP TABLES

Options 2 and 3 allow the user to update records in one of the lookup
tables used In the property file. A listing of the current lookup table Is
displayed at the terminal screen within each update routine. When the update
Is completed, the user is returned to the program main menu. The following

examples illustrate these options.

Example #1 - Option 2 - Update a record in the Category Lookup Table

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2
THIS PROGRAM UPDATES RECORDS IN THE CATEGORY LOOKUP TABLE

THE CURRENT CATEGORY LOOKUP TABLE CONTAINS THE FOLLOWING RECORDS

$RECNO CAT-CODE CATEGORY

TEST EQUIPMENT
PLANT EQUIPMENT
NON- INVENTORY CABLES
PRODUCTION TOOLING
SPECIAL TOOL | NG

ul Bm WD —
ul & WA —

RECNO?> 2
2

```text
CAT-CODE           = 2
CATEGORY           = PLANT EQUIPMENT
CAT-CODE?> ** return **           Note that a return will enter the previous
```

value as default.
CATEGORY?> LOST PLANT EQUIPMENT

THE CATEGORY LOOKUP TABLE NOW CONTAINS THE FOLLOWING RECORDS

$RECNO CAT-CODE CATEGORY

1 TEST EQUIPMENT
LOST PLANT EQUIPMENT
NON- INVENTORY CABLES
PRODUCTION TOOLING
SPECIAL TOOL I NG

nm WN

Example #2 - Option 3 - Update a record In the Location Lookup Table
