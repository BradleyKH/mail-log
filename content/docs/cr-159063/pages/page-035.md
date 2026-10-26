---
pdfPage: 35
folio: "21"
sectionId: "4.2.2"
kind: text
source: ocr
confidence: 94.6
figures: []
---
4.2 DESIGN INFORMATION RELEASE/REPORT
4.2.1 INPTDR

This subroutine is the input routine for the SPADS MAIL LOG DIR/

REPORT subfile. The DIR/REPORT data record for each document consists of up
to nine (9) data items. See Figure 6.2.2.1. The first item entered is the
DIR/REPORT:- Number. The file is then checked for a previous entry containing
this number. If the number is found, the user has the option to enter the
REVISE MODE. Normally, changes are required only to two (2) data items: (8)
Revision and (9) Revision Date. Following each completed document entry, all
items are displayed on the terminal. Flowchart Figure 5.4.2-1 depicts the
INPUT MODE of the DIR/REPORT subfile.

4.2.2 SEADR

This subroutine is the search routine for the SPADS MAIL LOG
DIR/REPORT subfile.

Of the nine (9) possible data items within a DIR/REPORT record, all
but one, REVISION, are searchable. It should also be noted that the Revision
Date is searched during a DATE search. This allows the DATE search to check
only the most recent date associated with a document. See Figure 6.2.2.2.

The DATE search has the capability of retrieving an entire month's or year's
worth of data by entering 00 for the day or month. . For example, entering
110078 would result in finding al] the documents within the data base in the
eleventh month, November, for the year 1978. Likewise, an entry of 000078
-would retrieve all documents for the year 1978.

There is a specialized ALL search which outputs all documents in
the DIR/REPORT subfile. This ALL search has an optional output along with
the normal output consisting of the entire nine (9) item record. This
optional output only displays the number of documents found on the terminal and
automatically spools to the high speed printer the DIR Number and Revision.

The VEHICLE search also has a special quality. A group of vehicles
’ may be found by using the first and last valid vehicle options. For example,
