---
pdfPage: 37
folio: "29"
sectionId: "6.0"
kind: text
source: ocr
confidence: 92.3
figures: []
---
6.0 MAIL LOG CORRESPONDENCE FILE

The Mail Log Correspondence file program tracks the mail correspondence
for the Projects Directorate. Data Is stored in two files In this
area: the Configuration Change Request (CCR) file and the Correspondence
file. A Project lookup table is also contained in this data base area.

Information is stored in the fields listed below.

Field names for the CCR file :

```text
PROJECT CODE              CCR NUMBER                 DATE |ISSUED
INITIATOR                 DOCUMENT AFFECTED          CURRENT STATUS
DISPOSITION               DESCRIPTION                REMARKS
```

INPUT DATE

It should be noted that the Input Date is entered for each record automatically
by the system, and therefore that particular field name will not be

visible on the input screen.

Field names for the Correspondence file :

```text
PROJECT CODE           DOCUMENT DATE             SOURCE
AUTHOR                 REFERENCE NUMBER          FILE CODE
FILE FOLDER            DOCUMENT FILE             DESCRIPTION
SEQUENCE NUMBER                                 INPUT DATE
```

It should be noted that both the Sequence Number and the Input Date are jnput
for each record automatically by the system. Therefore, these fields
do not appear on the Input screen for the Correspondence file. The Sequence
number [s used in the Update and Delete routines, and is visible on the
output resulting from the Search and Report routines.
