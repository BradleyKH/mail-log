---
pdfPage: 21
folio: "9"
sectionId: "4.1.1.1"
kind: text
source: ocr
confidence: 94.9
figures: []
---
4.1 CORRESPONDENCE
4.1.1 INPUT MODE
4.1.1.1 . DESCRIPTION OF INPUT MODE

The user must have clearance to execute within the INPUT mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE, IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The Correspondence data record for each document consists of up
to sixteen data items as shown in Figure 3. Following each complete document
entry, all items are displayed on the terminal to be checked for errors at
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

When a daily input session is complete, thts output fs normally
spooled to the printer in two formats: a complete record output and a brief
or partial record output. If a computer or printer malfunction occurs during
this output, another copy may be obtained by re-entering the INPUT mode as
previously described and selecting option (b) LAST. For a sample of the
comptete and brief outputs see Section 5.1.1.
