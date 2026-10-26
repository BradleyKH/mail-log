---
pdfPage: 36
folio: "22"
sectionId: "4.2.4"
kind: text
source: ocr
confidence: 94.3
figures: []
---
if a user declares the first valid vehicle as 198 and is searching for vehicle
number 200, not only would all documents containing vehicle 200 be found, but
also those with numbers 198S, 199S, and 2008; where S represents all subsequent
vehicles. Default for the first valid vehicle number is zero (0) whereas, the
last valid vehicle number becomes 999.

Flowchart Figure 5.4.2-2 depicts the SEARCH MODE of the DIR/REPORT
subfile.

4.2.3 REVSDR

This subroutine is the revise routine for the SPADS MAIL LOG
DIR/REPORT subfile.

The only information needed in order to revise or delete a DIR or
Report is the DIR or REPORT Number. Note that the REVISE MODE may be entered
in two (2) ways: a direct REVISE command or thru an INPUT MODE option. If a
DIR or REPORT is entered and found already to be in the file, the user may
change to the REVISE MODE for modification of old data items.

Otherwise, when the desired document record is found, it will be
displayed on the terminal for verification. If it is not the correct record,
search for the document will continue. After the revision has been made, the
document record is again displayed on the terminal for user edification.
Flowchart Figure 5.4.2-3 depicts the REVISE MODE of the DIR/REPORT subfile.

4.2.4 ARCDR

This subroutine is the archive routine for the SPADS MAIL LOG
DIR/REPORT subfile.

The necessary information needed in order to archive a DIR or
Report is the DIR Number. The user may also designate how many documents
to be archived at one session. The file in which all archived records are
placed is called INACT. Flowchart Figure 5.4.2-4 depicts the ARCHIVE MODE
of the DIR/REPORT subfile.
