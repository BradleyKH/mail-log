---
pdfPage: 23
folio: null
sectionId: "5.1.1"
kind: text
source: ocr
confidence: 94.4
figures: []
---
5.0 SOFTWARE FUNCTIONAL DESCRIPTION

The purpose of this section is to provide a functional description
and special terminal interaction the user must perform in order to use the
four modes of operation: INPUT; REVISE; SEARCH; and ARCHIVE. Outputs
resulting from these modes will be discussed in Section 7.0.

5.1 INPUT MODE

The user must have clearance to execute within the INPUT MODE ;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

5.1.1 CORRESPONDENCE

The Correspondence data record for each document consists of up
to sixteen data items as shown in Figure 5.1.1.1. Following each complete document
entry, al] items are displayed on the terminal to be checked for errors at
this time. After a document record has been declared correct, the specific
subfile must be designated in which this document is to be stored. If all
documents can not be entered in one input session, the user has a WAIT option
which allows the daily input to be continued at a later time. This
continuation is declared upon re-entering the INPUT mode. If the WAIT option
is taken by mistake and there are no other documents to be entered, recovery
is accomplished by declaring this is NOT a continuation upon re-entry into
the INPUT mode. When this has been done the user now has three (3) options
from which to choose:

a) Start a New Entry (NEW)
b) Spool Last Output Again (LAST)
c) Spool New Data Entered (DATA)

Option (c) DATA will spool to the high speed printer a sorted output of all
documents entered for that daily input session.
