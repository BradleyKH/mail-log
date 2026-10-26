---
pdfPage: 33
folio: "19"
sectionId: "4.1.27"
kind: text
source: ocr
confidence: 95
figures: []
---
4.1.23 CKIR

This subroutine is used by the REVISE MODE to check the data item
selected. If MAIL STATUS, data item number one, is selected, a validity
check is made to verify that the correct item was indicated. A valid or
invalid flag is set according to user response and logic flow returns to the
calling routine. Flowchart Figure 5.4.1-23 depicts the flow diagram for this
subroutine.

4.1.24 RDSUB

This subroutine is used by the SEARCH MODE to read the selected
subfile(s) desired for the specific data item search. When all subfiles are
finished, a read complete flag is set. Flowchart Figure 5.4.1-24 depicts
the flow diagram for this subroutine.

4.1.25 SCRNHD

This subroutine is used by the SEARCH MODE to format and display
on the terminal the appropriate header for each data item search. Flowchart
Figure 5.4.1-25 depicts the flow diagram for this subroutine.

4.1.26 SCRNPT

This subroutine is used by the SEARCH MODE to format and display
on the terminal the appropriate data items for a document record which was
found. If many document records are found during a search and it is observed
that needed information will soon disappear from the screen, the user may
temporarily stop terminal display by depressing the space bar. Terminal display

may be restarted by depressing the 'Q' key. This routine also increments the
number of documents found counter. Flowchart Figure 5.4.1-26 depicts the flow

diagram for this subroutine.
4.1.27 HARDHD

This subroutine is used ty the SEARCH MODE to format for the
output file the appropriate header for each data item search: This header is
