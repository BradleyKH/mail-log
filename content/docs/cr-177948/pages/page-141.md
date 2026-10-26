---
pdfPage: 141
folio: "132"
sectionId: "11.2.1"
kind: text
source: ocr
confidence: 91.8
figures: []
---
~

return. Typing 'QUIT' will return the user to the program main menu. If no
records containing the desired part number are found, a message stating so
will be displayed and the user may enter another part number. If some
records are found containing the desired part number, the user must enter the
approprtate Identity number. If the desired record is found It wil! be
displayed in an update screen Identical to the Input screen illustrated in
section 11.1 of this document. If the desired record is not found, "ITEM NOT
FOUND' will be displayed, and the user may enter another identity number.
if there are multiple records having the same identity number, only the first
record will be displayed on the input / update screen. To retrieve the
subsequent records, type an '=' at the prompt 'IDENT-TAG-NUMBER?>'. To retrieve
a blank identity number, hit the space bar once and then the carriage
return at 'IDENT-TAG-NUMBER?>' or at 'ITEM NOT FOUND'. If a carriage return
is entered at either ‘ITEM NOT FOUND! or 'NO RECORD FOUND! or if updating has
been completed, the user will be returned to the program main menu. See the

example below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1

ENTER PART NUMBER > 144-098
TYPE "QUIT" TO EXIT

NO RECORD FOUND FOR 144-098

TRY AGAIN 2.065

ENTER PART NUMBER > ** return ** Note that entering a return Invokes a
search for a blank part number.

IDENT-TAG-NUMBER?> 24

(TEM NOT FOUND

{DENT-TAG-NUMBER?> ** return **
