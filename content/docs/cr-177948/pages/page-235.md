---
pdfPage: 235
folio: "226"
sectionId: "17.3"
kind: text
source: ocr
confidence: 90.6
figures: []
---
17.2.1 UPDATE RECORD IN REGISTRATION FILE

Option 1 allows the user to update a record in the Registration file.
In order to retrieve the desired record, the user must enter the appropriate
last name, notated as 'LAST=NAME?>', If the desired record is found,
it will be displayed In an update screen Identical to the input screen
it ftustrated in section 17.1.1 of this document. When update has been com
pleted, *LAST-NAME?>' will again be displayed. A carriage return will return
the user to the program main menu. If there are multiple records having the
same Last Name, only the first record found will be displayed on the Input /
update screen. To retrieve the subsequent records type an '=' at the prompt
"LAST-NAME?>'. If the desired record is not found, 'ITEM NOT FOUND’ will be
displayed and the user must enter another last name or enter a carriage
return, which will return the user to the program main menu. Refer to the

example below which i!lustrates update entry and error / exit path.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1
LAST-NAME?> FOSTER
(TEM NOT FOUND

SEQ-NO?> ** return **
17.2.2 SORTING and HOUSEKEEPING ROUTINE

Option 2 generates the same Houskeeping routine discussed in detail

section 17.1.2 of this document.
17.3 DELETE OPTION

When the delete option Is selected from the main menu and the proper

security clearance has been passed, the Registration file delete menu will
