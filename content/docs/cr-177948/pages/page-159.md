---
pdfPage: 159
folio: "150"
sectionId: "12.2.1"
kind: text
source: ocr
confidence: 92.6
figures: []
---
for elther volume number or procedure number wil! retrieve records having
a value of 0 for those fields. After entering a volume number and procedure
number for which some records have been retrieved, the user must then enter
the appropriate part number. If no records are found containing the desired
part number, 'ITEM NOT FOUND! will be displayed. The user must either enter
another part number, or enter a carriage return, in which case the user will
be returned to the program main menu. If any records containing the desired
part number are found, they will be displayed in an update screen identical
to the input screen [tllustrated in section 12.1.1 of this document. If there
are multiple records having the same part number, only the first record will
be displayed on the input / update screen. To retrieve the subsequent
records type an '=' at the prompt 'PART-NUMBER?>'. Refer to the example
below illustrating update entry and error paths.

ENTER VOLUME NUMBER > ** return ** Note that a blank value may be
retrieved by entering a carriage

return.
NO RECORDS FOUND FOR VOLUME 0
TRY AGAIN ....
ENTER VOLUME NUMBER > 4 Note that the user must begin again with Volume

Number.
2,095 RECORDS FOUND IN VOLUME 4
ENTER PROCEDURE NO. > 4-3-1
SEARCH NOW IN PROGRESS
PLEASE STAND BY .....
48 RECORDS FOUND WITH PROCEDURE NUMBER = 4-3~1
PART-NUMBER?> 7-65
ITEM NOT FOUND

PART-NUMBER?> ** return **
