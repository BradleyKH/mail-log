---
pdfPage: 175
folio: "166"
sectionId: "13.3.1"
kind: text
source: ocr
confidence: 92.6
figures: []
---
displayed and the user must either begin again by entering the desired draw-
Ing number or type 'QUIT' to return to the program main menu. If more’ than
one record is found containing the search criteria, certain fiétds of all
these records retrieved will be displayed along with their corresponding
record numbers, notated as RECNO. The user must enter the record number of
the record that is to be deleted. If none of the records displayed are to be
deleted, entering a carriage return will return the user to the program main
menu. After entering the proper record number, or if only cne record was
retrieved, all of the fields of the specified record will be displayed with
the prompt ‘DELETE THIS RECORD (Y or N) >'. If the user responds with 'Y',
the record wil! be marked for deletion, and a message reminding the user that
the housekeeping routine must be run in order to internally purge the record
will be displayed. The user will then be given the opportunity to delete another
reocrd. If the user responds with 'N', no change will be made to the
record, and the user will be given the opportunity to delete another record.
Note that the user nust type QUIT! to return to the program main menu.

Refer to the example below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1

THIS PROCFAM WILL DELETE A SELECTED RECORD FROM THE DATA BASE
TYPE QUIT TO RETURN TO MAIN MENU

ENTER DRAWING NUMBER > 7-601

NO SUCH DRAWINC NUMBER {N THE CURRENT DATA FILE **** TRY AGAIN

ENTER DRAWING NUMBER > 23 000101

ENTER SHEET NUMBER > 01

SEARCH IN PROGRESS

PLEASE STAND BY ....
