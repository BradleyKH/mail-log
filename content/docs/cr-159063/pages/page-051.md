---
pdfPage: 51
folio: "37"
sectionId: "4.4.7"
kind: text
source: ocr
confidence: 95
figures: []
---
4.4.5 GETWD

This subroutine is used by the Title Input routine, 4.4.2, to preserve
and store the title as input. This title is used for output formatting.
Flowchart Figure 5.4.4-5 depicts the flow diagram for this subroutine.

4.4.6 GETCON

This subroutine is used by the MAIL CORRESPONDENCE and DIR/REPORT ~ -
subfile programs to fetch a Contract Number from the CONTRACT TABLE, CTAB.
This process is performed by searching the table for a given Work Authorization
Number/ID Code. See Section 6.2.3 for further information concerning the
CTAB Table. If the search if unsuccessful, a special Not Found message is
stored in place of the Contract Number and displayed on the terminal. Flowchart
Figure 5.4.4-6 depicts the flow diagram for this subroutine.

4.4.7 IDUSER

This subroutine is used by the ARCHIVE MODE routine to check the
user identification for a valid entry. If the user identification is not
SYSTEM, a special invalid user message is displayed on the terminal. A special
message is also sent to the system terminal to record the improper entry
attempt into the ARCHIVE MODE. Flowchart Figure 5.4.4-7 depicts the flow
diagram for this subroutine.
