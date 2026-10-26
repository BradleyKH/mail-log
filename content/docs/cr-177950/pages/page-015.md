---
pdfPage: 15
folio: "7"
sectionId: "2.6.1"
kind: text
source: ocr
confidence: 92.5
figures: []
---
will be positioned at the first field in the record and the user may tab to
the Incorrect field for re-input. if a 'Q' response is selected, the record
will not be added to the data base and an empty Input screen will be displayed
for additional input. If an 'L' response Is selected, the record wil]
be added to the data base and the user is exited from the input screen. If
an 'E' response jis selected, the record will not be added to the data base,

and the user Is exited from the input screen.

2.5.2 FORTRAN |NPUT FORMS

The FIPPS program uses a FORTRAN input form in Its input mode of
operation. FIPPS represents Fabrication Inspection Process Procedures.
All data field entries must be placed between exclamation points, one line
(or one field) at a time. For example:

\#3) AUTHOR
!

When all the data has been entered for a record, the entire record will be
displayed along with the prompt 'RECORD CORRECT (COR OR REV) >'. If the
user responds with 'COR' the record will be added to the data base. If the
'REV' response is selected the system will prompt for the number of fields,

and which fields, that are to be corrected.

2.6 UPDATE OPERATIONS

The purpose of this section Is to describe the procedures used to

update or revise a record within the data base.

2.6.1 INFO UPDATE SCREENS

All INFO update screens are identical to their corresponding Input
