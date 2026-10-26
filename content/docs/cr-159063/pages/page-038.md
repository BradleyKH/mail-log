---
pdfPage: 38
folio: "24"
sectionId: "4.2.12"
kind: text
source: ocr
confidence: 93.5
figures: []
---
output file and displayed on the terminal. Flowchart Figure 5.4.2-8 depicts the
flow diagram for this subroutine.

4.2.9 DIRN

This subroutine is called by the SEARCH MODE to perform the DIR/REPORT
NUMBER type of search. If the desired number is not located, a special Not
Found message is displayed on the terminal. When the search is finished, this
routine returns to the SEARCH MODE. Flowchart Figure 5.4.2-9 depicts the flow
diagram for this subroutine.

4.2.10 DATDR

This subroutine is called by the SEARCH MODE to perform the DOCUMENT
DATE type of search. The DATE search has the capability of retrieving an
entire month's or year's worth of data by entering 00 for the day or month.
For example, entering 110078 would result in finding all the documents within
the data base in the eleventh month, November, for the year 1978. Likewise,
an entry of 000078 would retrieve all documents for the year 1978. Flowchart
Figure 5.4.2-10 depicts the flow diagram for this subroutine.

4.2.11 WANUM

This subroutine is called by the SEARCH MODE to perform a WORK
AUTHORIZATION/ID CODE type of search. This procedure may perform partial
searches using the W.A. Number only or W.A. Number in conjunction with the
first two (2) letters of the ID Code. This routine formats document records
found and builds an output file. When the file has been finished, this
routine returns to the SEARCH MODE. Flowchart Figure 5.4.2-11 depicts the
flow diagram for this subroutine.

4.2.12 SYSDR

This subroutine is called by the SEARCH MODE to perform a SYSTEM
search. This routine formats document records found and builds an output
file. When the file has been finished, this routine returns to the SEARCH |
MODE. Flowchart Figure 5. 4. 2-12. depicts the flow diagram for this subroutine.
