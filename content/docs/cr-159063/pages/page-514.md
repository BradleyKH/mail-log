---
pdfPage: 514
folio: "500"
sectionId: "6.1.1.3"
kind: text
source: ocr
confidence: 88.8
figures: []
---
6.0 DATA BASE DESIGN

6.1 FILE STRUCTURE

6.1.1 DATA SUBFILES:

6.1.1.1 MAIL CORRESPONDENCE DATA

The Mail Correspondence portion of the Mail Log data base is further.
subdivided into six (6) subfiles representing the six (6) types of documents.
There also exists a seventh data file used for storage of special action due
date items. This file provides fast and efficient access to data during the
ACTION DUE DATE SEARCH,. see Section 4.1.22, which is otherwise scattered throughout
the six (6) data subfiles listed below:

```text
NAME           DESCRIPTION                             FUNIT          PUNIT
TRAN            TRANSMITTALS and SPECIFICATIONS             6               2
ACTD           ACTION DUE DATE                             9               5
MEMO            MEMO's and LETTERS          =              1              7
TWFX            TWX's, MAGNAFAX's and RAPIFAX's             12°            8
ANN       ANNOUNCEMENTS         ,          '         13            9
PR              PURCHASE REQUESTS                    14              10

MIS             MISCELLANEOUS DOCUMENTS and REPORTS         15
```

6.1.1.2 DESIGN INFORMATION RELEASE/REPORT DATA

The Design Information portion of the Mail Log data base consists of
one (1) subfile.

```text
NAME            DESCRIPTION                              FUNIT        PUNIT
DIR             DIR's and REPORT's                         6 |        2
```

6.1.1.3 DRAWING/ENGINEERING ORDER DATA

‘The Drawing portion of the Mail Log data base is further subdivided’
into three (3) subfiles:
