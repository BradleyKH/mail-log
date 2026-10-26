---
pdfPage: 177
folio: "168"
sectionId: "13.3.2"
kind: text
source: ocr
confidence: 92.8
figures: []
---
more than one record js found containing the search criteria, certain fields
of all these records retrieved will be displayed along with their correspond-
Ing record numbers, notated as RECNO. The user must enter the record number
of the record that is to be deleted. If none of the records displayed are to
be deleted, entering a carriage return will return the user to the program
main menu. After entering the proper record number, or If only one record
was retrieved, all of the fields of the specified record will be
displayed with the prompt ‘DELETE THIS RECORD (Y or N) >'. If the user re-

sponds with 'Y', the record will be internally purged. Note that it is not

necessary in this case to run the housekeeping routine. !f the user responds
with 'N', no change will be made to the record. In either the case, the user
will be given the opportunity to delete another record. Note that the user

must type 'QUIT' to return to the program main menu. Refer to the example

below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2
THIS PROGRAM WILL DELETE A SELECTED RECORD FROM THE DATA BASE
TYPE QUIT TO RETURN TO MAIN MENU
ENTER SPECIFICATION NUMBER > 465
NO SUCH SPECIFICATION NUMBER IN THE CURRENT DATA FILE **** TRY AGAIN
ENTER SPECIFICATION NUMBER > 205-235-005
THE FOLLOWING HAS BEEN FOUND:
SPECIFICATION NUMBER >205-23-005 REVISION >A AMENDMENT >

TITLE >
RATE GYRO ACCEPTANCE TEST SPECIFICATION

DELETE THIS RECORD (Y OR N) > Y
THIS PROGRAM WILL DELETE A SELECTED RECORD FROM THE DATA BASE
TYPE QUIT TO RETURN TO MAIN MENU
