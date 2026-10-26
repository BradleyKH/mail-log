---
pdfPage: 30
folio: "16"
sectionId: "4.1.16"
kind: text
source: ocr
confidence: 95.1
figures: []
---
builds an output file with headers. When the file(s) have been finished, this
routine returns to the SEARCH MODE. Flowchart Figure 5.4.1-13 depicts the
flow diagram for this subroutine.

4.1.14 DDAT

This subroutine is called by the SEARCH MODE to perform an INPUT
DATA DATE type of search.

‘This INPUT DATE search does not use the time framing capability.
However, the INPUT DATE search can retrieve entire month's or an entire year's
worth of data by entering 00. For example, entering 110078 would result in
finding all the documents within the data base in the eleventh month, November,
for the year 1978. Likewise, an entry of 000078 would retrieve all documents
for the year 1978. See Figure 6.2.1.3.

Flowchart Figure 5.4.1-14 depicts the flow diagram for this subroutine.

4.1.15 CNUM

This subroutine is called by the SEARCH MODE to perform a CONTRACT
NUMBER type of search. This routine formats document records found and builds
an output file with headers. When the file(s) have been finished, this routine
returns to the SEARCH MODE. Flowchart Figure 5.4.1-15 depicts the flow diagram
for this subroutine.

4.1.16 CWAID

This subroutine is called by the SEARCH MODE to perform a WORK
AUTHORI ZATION/ID CODE type of search. This procedure may perform partial

searches using the W.A. Number only or W.A. Number in conjunction with the
