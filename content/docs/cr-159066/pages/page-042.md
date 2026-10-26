---
pdfPage: 42
folio: "30"
sectionId: "5.4.2"
kind: text
source: ocr
confidence: 94.9
figures: []
---
5.4 ARCHIVE

The user must be validated to execute in the ARCHIVE mode. If not
properly logged in, an invalid user message will be displayed on the terminal
as follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE.
IF IT IS NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

When the document or data record has been archived, the user is
automatically returned to the program mode selection level as shown in
Section 4.2 (Program Entry).

5.4.1 CORRESPONDENCE

To archive a document not only is the input date and daily counter code
needed, but also the specific data subfile in which it is located. After
these requirements have been satisfied, a pause of 15 to 50 seconds occurs
for the system to update all files involved.

All archived document records are placed in a file called INACTS,
except for those records stored in the TRANSMITTAL data subfile. These
records are archived to a file called INACTL, because of their extra data
item, DESCRIPTION. Flowchart Figure 6.5.1] depicts the ARCHIVE MODE of the
Correspondence subfile.

5.4.2 DESIGN INFORMATION RELEASE/REPORT

The necessary information needed in order to archive a DIR or
Report is the DIR number. The user may also designate how many documents
to be archived at one session. The file in which all archived records are
placed is called INACT. Flowchart Figure 6.5.2 depicts the ARCHIVE MODE
of the DIR/REPORT subfile.
