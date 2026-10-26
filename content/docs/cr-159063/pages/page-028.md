---
pdfPage: 28
folio: "14"
sectionId: "4.1.8"
kind: text
source: ocr
confidence: 93.6
figures: []
---
4.1.4 ARCC

This subroutine is the archive routine for the SPADS MAIL LOG
Correspondence subfile. To archive a document not only is the input date and
daily counter code needed, but also the specific data subfile in which it is

located. After these requirements have been satisfied, a pause of 15 to 50 ~
seconds occurs for the system to update all files involved.

All archived document records are placed in a file called INACTS,
except for those records stored in the TRANSMITTAL data subfile. These
records are archived to a file called INACTL, because of their extra data
item, DESCRIPTION. Flowchart Figure 5.4.1-4 depicts the ARCHIVE MODE of the
Correspondence subfile.

4.1.5 SHOWC

This subroutine is used to display an entire data record on the
terminal for the INPUT or REVISE MODE . Each data item is numbered in order
to verify the document record as either correctly input orthe correct record to
be revised or deleted. Flowchart Figure 5.4.1-5 depicts the flow diagram for
this subroutine. |

4.1.6 INPSC

This subroutine is used by the INPUT or REVISE MODES to input or
change specific data items within a document record. Flowchart Figure 5.4.1-6
depicts the flow diagram for this subroutine.

4.1.7 OPEN

This subroutine is used to open all six (6) data subfiles for read
and write functions. Flowchart Figure 5.4.1-7 depicts the flow diagram for
this subroutine.

4.1.8 CLOSE

This subroutine is used to close all six (6) data subfiles which
are open for read and write functions. Flowchart Figure 5.4.1-8 depicts the
flow diagram for this subroutine.
