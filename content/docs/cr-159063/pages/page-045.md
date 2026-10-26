---
pdfPage: 45
folio: "31"
sectionId: "4.3.13"
kind: text
source: ocr
confidence: 93.4
figures: []
---
4.3.9 _ INPSS

This subroutine is used by the INPUT MODE to enter SHEET subfile
data items. If referenced E.0.'s are new to the data base, the user may
enter the Engineering Order Input routine described in 4.3.7. Flowchart
Figure 5.4.3-9 depicts the flow diagram for this procedure,

4.3.10 FIXSHT

This subroutine is used by the REVISE MODE to prepare the SHEET
data subfile for the input of a new sheet for a specified drawing. Flowchart
Figure 5.4.3-10 depicts the flow diagram for this subroutine.

4.3.1] SHTADD

This subroutine is used by the REVISE MODE to input new data items
in the SHEET subfile corresponding to a new sheet for a specified drawing.
This procedure is performed in conjunction with FIXSHT described in 4.3.10.
Flowchart Figure 5.4.3-11 depicts the flow diagram for this subroutine.

4.3.12 NEOADD

This subroutine is used by the INPUT or REVISE MODES to add a new
ENGINEERING ORDER to a sheet of a specified drawing. Entry of new engineering
orders may result in one (1) of three (3) terminal messages if the drawing —
sheet already has three (3), four (4), or more £.0.'s referenced. Flowchart
Figure 5.4.3-12 depicts the flow diagram for this subroutine.

4.3.13 HEADER

This subroutine is used by the SEARCH MODE to format for the output
file the appropriate header for each data item search. This header is
presented on each page of the output file. Flowchart Figure 5.4.3-13 depicts
the flow diagram for this subroutine.
