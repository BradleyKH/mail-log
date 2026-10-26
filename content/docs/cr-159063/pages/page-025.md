---
pdfPage: 25
folio: "11"
sectionId: "3.4"
kind: text
source: ocr
confidence: 93.7
figures: []
---
3.2 MAIL CORRESPONDENCE MAIN

This routine provides the executive operations and main program
entry for the MAIL LOG program. It also contains the necessary routines to
handle the Correspondence subfile. The program is called BFILE and is located
within the F_MAIL UFD. If the user selects the Correspondence subfile, a USER
file is built containing the user ID, time, date, and terminal location. Then
the user may proceed with one of four (4) modes of operation within the
Correspondence subfiles. When a user quits operation within the Correspondence
subfiles, return to the executive main entry selection mode is made. The user
again has the option of operating with the DIR/REPORT, DRAWING, or CORRESPONDENCE
data. If either of the first two (2) areas of the data base are selected, the
executive routine attaches the user to the appropriate UFD, F_DIR or F_DRAW
respectively. See Sections 3.3 and 3.4 for further information regarding these
main routines. Flowchart Figure 5.3-1 depicts the CORRESPONDENCE MAIN.

3.3 DESIGN INFORMATION RELEASE/REPORT MAIN

This routine provides the executive operation and main program entry
for the DIR/REPORT data subfile. This program is called *DIR and is located.
within the F_DIR UFD. Upon entry into this program, a USER file is built
containing the user ID, time, date, and terminal location. The user then may
proceed with one of four (4) modes of operation within the DIR/REPORT subfile.

A 'QUIT' at this level will send executive control back to the F_MAIL UFD.
This is accomplished by resuming the BFILE program. Operation then proceeds
as described in Section 3.2. Flowchart Figure 5.3-2 depicts the DIR/REPORT MAIN.

3.4 DRAWING/ENGINEERING ORDER MAIN

This routine provides the executive operation and main program entry
for the DRAWING/E.O. data subfiles. This program is called *DRAW and is located
within the F_DRAW UFD. Upon entry into this program, a USER file is built
containing the user ID, time, date, and terminal location. The user then may
proceed with one (1) of four (4) modes of operation within the DRAWING/E.O.
subfile. A 'QUIT' at this level will send executive control back to the
F MAIL UFD. This is accomplishes by yvesuming the BFIIE »rogram. Operation then
proceeds as described in Section 3.2. Flowchart Figure 5.3-3 depicts the

DRAWING/E.O. MAIN.
