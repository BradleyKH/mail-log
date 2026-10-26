---
pdfPage: 24
folio: null
sectionId: "5.1.3"
kind: text
source: ocr
confidence: 94.5
figures: []
---
When a daily input session is complete, this output is normally
spooled to the printer in two formats: a complete record output and a brief
or partial record output. If a computer or printer malfunction occurs during
this output, another copy may be obtained by re-entering the INPUT MODE as
previously described and selecting option (b) LAST. For a sample of the
complete and brief outputs see Section 7.1.1]. Flowchart Figure 6.2.1 depicts
the INPUT MODE of the Correspondence subfile.

5.1.2 DESIGN INFORMATION RELEASE/REPORT

The DIR/REPORT data record for each document consists of up to nine data
items. See Figure 5.1.2.1. The first item entered is the DIR/REPORT Number.
The file is then checked for a previous entry containing this number. If
the number is found, the user has the option to enter the REVISE MODE.
Normally, changes are required only to two data items: (8) Revision and
(9) Revision Date. Following each completed document entry, all items are
displayed on the terminal. Flowchart Figure 6.2.2 depicts the INPUT MODE of
the DIR/REPORT subfile.

5.1.3 DRAWING/ENGINEERING ORDER

The DRAWING subfile data record consists of eleven data items.
If the drawing contains more than one sheet, an additional sheet record
consisting of five data items is kept for each sheet in the SHEET subfile.
See Figure 5.1.3.1. The ENGINEERING ORDER subfile data record consists of
six data items. See Figure 5.1.3.2. The main body of data for these two
subfiles are sent from Dallas rather than manually input. Unfortunately,
vehicle system and section and engineering order titles are not available
in the original Dallas Data Base. However, these fields may be entered
in manually input drawings and E.0.'s.

The Input mode has two optional operations:
(1) £.0. - input of new engineering orders

(2) Drawings and E.0.'s - input of new drawings along with their
referenced E.0.'s.
