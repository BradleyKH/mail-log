---
pdfPage: 538
folio: "524"
sectionId: "6.3.3"
kind: text
source: ocr
confidence: 85
figures: []
---
6.3.3

used in the DRAWING/E.O. subroutines 4.3.1 through 4.3.25.

DRAWING/ENGINEERING ORDER

This Section provides a description of all variables and arrays

```text
VARIABLE/ARRAY DESCRIPTION                            SIZE. TYPE
A         ARRAY CONTAINING. USER 1D        -     30        ALPHA:
BLNK         BLANK                                 2        ALPHA
CoD          VENDOR CODE PORTION OF THE       :               ALPHA
```

DRAWING NUMBER |

```text
D            DATE DESIRED         6        NUMERIC
boc          DOCUMENT RECORD COUNTER FOR EACH     2        NUMERIC
```

DRAWING FOUND DURING WORD TITLE SEARCH

```text
DS           SYSTEM DESIRED                         12        ALPHA
EOKNT        E.0. COUNTER FOR EACH SHEET                 NUMERIC
FINISH       FLAG FOR REVISION OF DATA BASE          1      ~ NUMERIC
```

COMPLETED
FIRST FLAG FOR FIRST SHEET OPERATION; . 1 NUMERIC
DRAW SUBFILE

```text
IANS         USER RESPONSE STORAGE                   1        ALPHA
IC           RETURN ERROR CODE                       2        NUMERIC
ICODE        DESIRED VENDOR CODE                     3        ALPHA
ICON         NUMBER OF WORDS TO SEARCH IN TITLE      2        NUMERIC
IDES         USER RESPONSE STORAGE         .         2        ALPHA _
IDR          TEMPORARY DRAWING NUMBER STORAGE       14        ALPHA
~ IDRAW        DRAWING NUMBER DESIRED.                14        ALPHA
1EO          E.0. NUMBER DESIRED                     8        ALPHA
IEOUP        E.0. UPDATE FLAG FOR NEW REVISION       1        NUMERIC
IEX         WORDS OF TITLE SEARCHED       a    10 char,- ALPHA
,                                 4 entries
II           NUMBER OF E:0.'s ON 1ST SHEET           2.       NUMERIC
TIEORF       REFERENCED E.0.'s FOR NEW SHEET       -8char.- ALPHA
               ,        l0entries
TINEO        NUMBER OF E.0.'s FOR NEW SHEET          2        NUMERIC
IIREV        REVISION FOR NEW SHEET =             2        ALPHA
IISHTN       SHEET NUMBER FOR NEW SHEET ~            4        NUMERIC
LKNT         NUMBEP OF DATA ITEMS TO BE REYiSED      2        NUMERIC
ILINE        OUTPUT PAGE LINE COUNTER —              2
```

NUMERIC
