---
pdfPage: 41
folio: "27"
sectionId: "4.3.2"
kind: text
source: ocr
confidence: 92.3
figures: []
---
4.3. DRAWING/ENGINEERING ORDER
4.3.1 INPTDW

This subroutine is the input routine for the SPADS MAIL LOG
DRAWING/E.0. subfile. The DRAWING subfile data record consists of eleven
(11) data items. If the drawing contains more than one (1) sheet, an
additional sheet record consisting of five (5) data items is kept for each
sheet in the SHEET subfile. See Figure 6.2.3.1. The ENGINEERING ORDER
subfile data record consists of six (6) data items. See Figure 6.2.3.3.
The main body of data for these three (3) subfiles are sent from Dallas rather

than manually input. Unfortunately, vehicle system and section and
engineering order titles are not available in the original Dallas Data Base.

However, these fields may be entered in manually input Drawings and E.0.'s.
The INPUT MODE has two (2) optional operations:

(1) E.0. - input of new engineering orders.
' (2) Drawings and E.0.'s - input of new drawings along with their
referenced E.0.'Ss.
During option number 2, entry of referenced E.0.'s, option
number 1-is automatically performed if the E.0.'s are new to
the data base.

Entry of new engineering orders may result in one (1) of three (3)
terminal messages if the drawing sheet already has three (3), four (4), or
more E.0.'s referenced. Flowchart Figure 5.4.3-1 depicts the. INPUT MODE of

the DRAWING/E.0O. subfile.
4.3.2 REVSDW

This subroutine is the revise routine for the SPADS MAIL LOG
DRAWING/E.O. subfile. The only information necessary in order to revise or.

delete a drawing or engineering order is the Drawing Number or E.0. Number.
When the desired record is found, it will be displayed on the terminal for
