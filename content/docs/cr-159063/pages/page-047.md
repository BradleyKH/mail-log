---
pdfPage: 47
folio: "33"
sectionId: "4.3.19"
kind: text
source: ocr
confidence: 95.7
figures: []
---
the appropriate data items of each DRAWING data record found will be formatted
to an output file and displayed on the terminal. Flowchart Figure 5.4.3-16
depicts the flow diagram for this subroutine.

4.3.17 ALDW

This subroutine is called by the SEARCH MODE to perform a PRINT ALL
type of search. This routine has two (2) options: a complete listing of all
Drawing data including Engineering Orders or a listing of Engineering Orders
only. During this search the break key is inhibited. Each DRAWING or
ENGINEERING ORDER data record is formatted for the output file and displayed
on the terminal. When the designated subfiles are finished, this routine
automatically spools the output file to the high speed printer. Flowchart
Figure 5.4.3-17 depicts the flow diagram for this subroutine.

4.3.18 ACTDUE

This subroutine is called by the SEARCH MODE to perform the REVISION
ACTION DUE type of search. This procedure searches the DRAWING and SHEET
subfiles for all Drawing data sheets referencing five (5) or more Engineering
Orders. Those drawing sheets found which contain the correct number of E.0's
are formatted for the output file and displayed on the terminal. During this
search the break key is inhibited. When all DRAWING data records have been
checked, ‘this routine automatically spools the output file to the high speed
printer. Flowchart Figure 5.4.3-18 depicts the flow diagram for this subroutine.

4.3.19 DRAWN

This subroutine is called by the SEARCH MODE to perform the DRAWING
NUMBER type of search. If the desired number is not located, a special Not
Found message is displayed on the terminal. When the search is finished,
this routine returns to the SEARCH MODE. Flowchart Figure 5.4.3-19 depicts
the flow diagram for this subroutine.
