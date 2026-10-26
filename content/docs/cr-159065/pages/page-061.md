---
pdfPage: 61
folio: "49"
sectionId: "4.3.1.1"
kind: text
source: ocr
confidence: 93.2
figures: []
---
4.3 DRAWING/ ENGINEERING ORDER»
4.3.1 INPUT MODE .
4.3.1.1 DESCRIPTION OF INPUT MODE

The user must have clearance to execute within the INPUT mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The DRAWING subfile data record consists of twelve data items.
See Figure 8. The Engineering Order subfile data record consists of six
data items. See Figure 9. The main body of data for these two subfiles are
sent from Dallas rather than manually input. Unfortunately, vehicle system
and section and engineering order titles are not available in the original
Dallas Data Base. However, these fields may be entered in manually input
drawings and E.0.'s.

The Input mode has two optional operations:
(1) E.0. - input of new engineering orders
(2) Drawings and £.0.'s - input of new drawings along with their

referenced £.0.'s.

During option number 2, entry of referenced £.0.'s, option number 1
is automatically performed if the £.0.'s are new to the data base.

Entry of new engineering orders may result in one of three

terminal messages if the drawing sheet already has three, four, or more E.0.'s
referenced. See section 5.3.1 for more information concerning this output.
