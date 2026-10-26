---
pdfPage: 173
folio: "164"
sectionId: "13.2.2"
kind: text
source: ocr
confidence: 91.7
figures: []
---
menu. If the desired record is found it will be displayed in an update
screen identical to the input screen illustrated In section 13.1.1 of this
document. If there are multiple records having the same drawing number, only
the first record will be displayed on the input / update screen. To retrieve
the subsequent records, type an '=' at the prompt 'DRAW-NUMBER?>'. Refer to

The example below [tlustreting update entry and error paths.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1
DRAW-NUMBER?> 6-5400
ITEM NOT FOUND

DRAW-NUMBER?> **® return **

13.2.2 UPDATE RECORD IN SPEC FILE

Option 2 allows the user to update a record in the Specificatior data
file. In order to retrieve the desired recrord, the user must enter the
appropriate specification number, which ts notated as 'SPEC-NO?>'. If the
desired record is found it will be displayed in an update screen identical to
the input screen [llustrated in section 13.1.1 of this document. If there
are multiple records having the sane specification number, only the first
record will be displayed on the Input / update screen. To retrieve the subsequent
records type an '=' at the prompt 'SPEC-NO?>'. If no records are
found having the desired specificatior number, "ITEM NOT FOUND! will be displayed
and the user must enter a new specification number or enter a carriage
return, in which case the will be returned to the program main menu. Refer

ta the following example illustrating the error path.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2

SPEC-NO?> 1018
ITEM NOT FOUND
