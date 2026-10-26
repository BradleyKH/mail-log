---
pdfPage: 44
folio: "30"
sectionId: "4.3.8"
kind: text
source: ocr
confidence: 95.1
figures: []
---
_ Engineering order data records are automatically archived. E.0.'s
unreferenced by any drawings are placed in a file called INACTE. Flowchart
Figure 5.4.3-4 depicts the ARCHIVE MODE of the DRAWING/E.0O. subfile.

4.3.5 SHOWEO

This subroutine is used to display the entire ENGINEERING ORDER
data record on the terminal for the INPUT or REVISE MODES. Each data item

is numbered in order to verify the data record as either correctly input or
the correct record to be revised or deleted. Flowchart Figure 5.4.3-5 depicts

the flow diagram for this subroutine.

4.3.6 SHOWDW

This subroutine is used to display an entire DRAWING data record
from both the DRAW and SHEET subfiles. This entire data record is displayed

on the terminal during the INPUT or REVISE MODES. Each data item is numbered
in order to verify the data record as either correctly input or the correct

record to be revised or deleted. Flowchart Figure 5.4.3-6 depicts the flow
diagram for this subroutine.

4.3.7 INPSE

This subroutine is used by the INPUT or REVISE MODES to input or
change specific data items within the ENGINEERING ORDER data subfile. Flowchart
Figure 5.4.3-7 depicts the flow diagram for this subroutine.

4.3.8 INPSDW

This subroutine is used by the INPUT or REVISE MODES to input or
change specific data items within the DRAWING and SHEET data subfiles.
Revision of SHEET data records is performed by this routine, whereas, SHEET
data Input is performed by another subroutine described in 4.3.9. Flowchart
Figure 5.4.3-8 depicts the flow diagram for this procedure.
