---
pdfPage: 548
folio: "534"
sectionId: "8.2.3"
kind: text
source: ocr
confidence: 93.1
figures: []
---
8.2 MISCELLANEOUS ROUTINES

The following subroutines are used by the SPADS MAIL LOG software
package, but are not found within the PRIMOS operation system. These

routines are defined at load time and shown in Appendix E.
8.2.1 CLEAR

This subroutine is used to clear the user terminal. Appendix E,
Figure 1 depicts the source code for this subroutine.

8.2.2 ~ PAUS
This subroutine performs the following functions:

If many document records are found during.a search and it is observed
that needed information will soon disappear from the screen, the user may
temporarily stop terminal display by depressing the space bar. Terminal
display may be restarted by depressing the 'Q' key.

At this time the source code for this subroutine is not available.
However, a routine used by this PAUS routine, CHKLIN, is available. Appendix E,
Figure 2 depicts the source code for the Check Line subroutine.
8.2.3 JTIME

This subroutine is only used in the MAIL. CORRESPONDENCE portion of —

program. This procedure converts a given date, month, date, and year, into
Julian time. Appendix E, Figure 3 depicts the source code for this subroutine.
