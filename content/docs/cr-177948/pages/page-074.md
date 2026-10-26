---
pdfPage: 74
folio: "65"
sectionId: "7.2.1"
kind: text
source: ocr
confidence: 91.3
figures: []
---
\6. Update Category Lookup Table
\7. Update Location Lookup Table
\8. Transfer of Components

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) >
7.2.1 UPDATE SPARES, VEHICLE, AND TEST EXPENDED FILES

Options 1, 2, and 3 allow the user to update a record within one
of three data files: Spares, Vehicle, or Test Expended. In order to
retrieve the deslIred record the user must enter the appropriate vehicle
number (or description If no number exists), stage number, category number,
and component or serial number. A search is performed after the first three
data items are entered In order to retrieve those records having the desIred
stage and category. If some records are found, the user will be prompted for
the component or sertal number. If the desired record is found it will be
displayed in an update screen Identical to the motor file Input screen

Illustrated [In section 7.4 of this document. See the example below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1
ENTER VEHICLE NUMBER > S-205
ENTER STAGE NUMBER > 3

MOTOR

CASE

NOZZLE
IGNITER

M1! SCELLANEOUS
CONTAIN/DOLLY

Auf WHh —

ENTER CATEGORY NO. > 5
COMPONENT-S/N > 5504-5

If no records having the desired stage and category are found, a
message stating so will be displayed at the terminal screen and the user
will be returned to the program main menu. See the example below.
