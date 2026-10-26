---
pdfPage: 82
folio: "74"
sectionId: "7.2.4"
kind: text
source: ocr
confidence: 91.5
figures: []
---
7.2.3 UPDATE SPECIFICATION RECORD

Option 3 allows the user to revise a record from the Specification
file by entering the appropriate drawing number of the record to be modified.
If no records are found having the desired drawing number, 'ITEM NOT FOUND!
will be displayed and the user must either enter anew drawing number or a
carriage return fn order to return to the Update menu. When the desired
record is found it will be displayed in an update screen identical tec the
corresponcing input screen illustrated tn section 7.1.1 of this document. If
multiple records are found having the same drawing number, only the first
found will be displayed on the input / update screen. To retrieve the subsequent
records, type an "=" at the prompt 'DRAW-NUMBER?>'. When update has
been completed the user wil! be returned tc the Update menu. See the fo! low-

ing exampte.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 3

THIS PROGRAM ALLOWS REVISIONS TQ THE SPECIFICATICN FILE BY ENTERING
THE DRAWING NUMBER OF THE RECORD YOU WANT TO BE CHANGED.

DRAW-NUMBER?> &17437
ITEM NOT FOUND

DRAW-NUMBER?> ** return **
7.2.4 UPDATE SCC FILE RECORD

Opticon 4 allows the user to update a record within the SCC file.
Because no input screen exists for this file, the update routine for this
file displays every fieid in the record with a prompt for the new data
field value. If a field is to remain unchangea a carriage return should be

entered for that data field prompt. When update has been completed, the user
