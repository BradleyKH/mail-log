---
pdfPage: 31
folio: "19"
sectionId: "5.2.3"
kind: text
source: ocr
confidence: 95.1
figures: []
---
Otherwise, when the desired document record is found, it will
be displayed on the terminal for verification. If it is not the correct
record, search for the document will continue. After the revision has been made,
the document record is again displayed on the terminal for user reassurance
that the revision has been made. Flowchart Figure 6.3.2 depicts the REVISE MODE
of the DIR/REPORT subfile.

5.2.3 DRAWING/ENGINEERING ORDER

The only information necessary in order to revise or delete a drawing
or engineering order is the drawing number or E.0. number. When the desired
record is found, it will be displayed on the terminal for verification. If
it is not the correct record, search for the desired record will continue. After
the revision has been made the entire record is again displayed on the terminal
for user reassurance that the revision has been made.

The REVISE MODE may change the revision of a sheet. During this
modification, all engineering orders referenced by that drawing sheet are
automatically deleted. The REVISE MODE may also be used as an Input operation
by adding a new sheet(s) to any existing drawing.

Flowchart Figure 6.3.3 depicts the REVISE MODE of the DRAWING/E.O.
subfile. .
