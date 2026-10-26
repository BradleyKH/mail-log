---
pdfPage: 549
folio: "535"
sectionId: "9.0"
kind: text
source: ocr
confidence: 89.6
figures: []
---
9.0 SPECIAL SUPPORT ROUTINES

The main body of the DRAWING/E.0. subfile data must be converted
from magnetic tape to disk and reformatted for the SPADS MAIL LOG data base
subfile structure. See Section 6.1.1.3.

To accomplish this conversion, the following steps and special support
routines - are used: So

(a) MAGRST data from tape to disk; designate data as DDATA file. ©

(b) Manually examine the DDATA file using the EDITOR. Delete all
records referencing to SEI's. Note: SEI's are usually the
first 25 to 50 records on the file.

(c) Begin execution of conversion by using routine PHASE 1.-° This is
accomplished by entering R *PHASE-1. This routine picks out
the necessary data from the Dallas data and builds a new data
file called NEW.

(d) PHASE 2 is executed in the same manner as PHASE 1. This routine
modifies the vehicle numbers and builds a searchable title. The |
\- procedure also formats all data for data base subfile
compatibility. The new data file constructed during this phase
\- is called FINAL.

(e) PHASE 2 has a checking routine called TTEST. This routine
' displays on the terminal each data record within FINAL.

(f) PHASE 3 is actually made up of several subroutines which build
the DRAW and SHEET subfiles from the FINAL data file. Each
subfile has its own checking routine:

(1) DRAW is checked by TEST. The TEST: routine builds an
\- output file called OUT containing all DRAW data. items for
each data record.
