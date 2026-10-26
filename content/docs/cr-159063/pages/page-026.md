---
pdfPage: 26
folio: "12"
sectionId: "4.1.1"
kind: text
source: ocr
confidence: 94.3
figures: []
---
4.0 SUBROUTINE DESCRIPTION

' This section provides descriptions of all subroutines used by MAIL
CORRESPONDENCE, DESIGN INFORMATION RELEASE/REPORT, and DRAWING/ENGINEERING ORDER
subfile programs.

4.1 MAIL CORRESPONDENCE

4.1.1 INPTC

This subroutine is the input routine for the SPADS MAIL LOG
Correspondence subfile. The Correspondence data record for each document
consists of up to sixteen (16) data items as shown. in Figure 6.2.1.1, Following
each complete document entry, all items are displayed on the terminal to be
checked for errors at this time. After a document record has been declared
correct, the specific subfile must be designated in which this document is to.
be stored. If all documents can not be entered in one (1) input session, the
user has a WAIT option which allows the daily input to be continued at a later
time.. This continuation is declared upon re-entering the INPUT MODE. If the
WAIT option is taken by mistake and there are no other documents to be
entered, recovery is accomplished by declaring this is NOT a continuation upon
re-entry into the INPUT MODE. When this has been done the user now has three
(3) options from which to choose:

a) Start a New Entry (NEW)
b) Spool Last Output Again (LAST)
c) Spool New Data Entered (DATA)

Option (c) DATA will spool to the high speed printer a sorted output of all]
documents entered for that daily input session.

When a daily input session is complete, this output is normally
spooled to the printer in two (2) formats: a complete record output and a
brief or partial record output. If a computer or printer malfunction occurs
during this output, another copy may be obtained by re-entering the INPUT MODE
as previously described and selecting option (b) LAST. Flowchart Figure 5.4.1-1
depicts the INPUT MODE of the Correspondence subfile.
