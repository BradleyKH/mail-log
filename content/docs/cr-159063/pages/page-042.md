---
pdfPage: 42
folio: "28"
sectionId: "4.3.3"
kind: text
source: ocr
confidence: 94.6
figures: []
---
verification. If it is not the correct record, search for the desired record
will continue. After the revision has been made the entire record is again
displayed on the terminal for user edification.

The REVISE MODE may change the revision of a sheet. During this
modification, all engineering orders referenced by that drawing sheet are
automatically deleted. The REVISE MODE may also be used an an Input operation
by adding a new sheet(s) to any existing drawing.

Flowchart Figure 5.4.3-2 depicts the REVISE MODE of the DRAWING/E.0.
subfi le.

4.3.3. SEADW

This subroutine is the search routine for the SPADS MAIL DRAWING/E.0.
subfile.

Of the eleven (11) data items within the DRAWING subfile, nine (9)

are searchable. The resulting output from these searches always consists

of six (6) data items. See Figure6.2.3.2. The ENGINEERING ORDER subfile
consists of six (6) item records, of which only two (2) are searchable. The
resulting output from these two (2) searches consists of up to all six: (6)
data items. It should be noted that Revision Date is output in place of the
E.0. Date when an E.0. has a revision. This allows only the most recent date
to be displayed. See Figure 6.2.3.4.

Due to the data base source for drawings coming from Dallas and
manual input, three (3) searches have limited capability: SYSTEM, SECTION,
and DATE. The SYSTEM and SECTION searches are only usable for those drawings
which are manually input. However, some Dallas drawing data will contain this
information within the title. Therefore, a TITLE search can be used if either
the SYSTEM or SECTION searches are found unsuccessful. The DATE search is also
limited in that all Dallas drawing data will have the same date. This date
represents the latest information update received from Dallas. Nevertheless,
the DATE search has the capability of retrieving an entire month's or year's
worth of data by entering 00 for the day or month. For example, entering
110078 would result in finding all drawings within the data base in the
