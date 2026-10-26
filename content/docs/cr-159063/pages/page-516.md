---
pdfPage: 516
folio: "502"
sectionId: "6.1.2.3"
kind: text
source: ocr
confidence: 92.7
figures: []
---
6.1.2 STORAGE FILES
6.1.2.1 MAIL CORRESPONDENCE

All archived document records are s

tored in one (1) of two (2) inactive

files called INACTS or INACTL. Transmittal data records which are actively

stored in the TRAN subfile (see Section 6.1.1

_ Any data records which are actively stored in any of the other five (5) subfiles

-1), will be archived to INACTL.

will be archived to INACTS. These data records do not contain the sixteenth

data item, DESCRIPTION, which is found only i

Another storage file, called USER,
time, date, and terminal location number for

NAME - DESCRIPTION

n the TRANSMITTAL subfile.

is used to record the user ID,
each entry.

```text
FUNIT            PUNIT
INACTL           INACTIVE FILE (LONG RECORDS)                           5
INACTS           INACTIVE FILE (SHORT RECORDS)         9                5
USER             USER LOG                     .        19               15
```

6.1.2.2 DESIGN INFORMATION RELEASE/REPORT

All DIR/REPORT data records are stored in an inactive file called

INACT when archived.

Another storage file, called USER,

time, date, and terminal location number for

```text
NAME             DESCRIPTION

INACT            INACTIVE FILE

USER    |        USER LOG
```

6.1.2.3 DRAWING/ENGINEERING ORDER

Each of the three (3) data subfiles

is used to record the user ID,

each entry.
FUNIT UNIT
9 og.
19 1

described in Section 6.1.1.3 has

a corresponding inactive file for archive purposes. The DRAW subfile data
