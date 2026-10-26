---
pdfPage: 33
folio: null
sectionId: "5.3.2"
kind: text
source: ocr
confidence: 94.4
figures: []
---
5.3.1 | CORRESPONDENCE

Of the sixteen (16) possible data items within a document record,
eleven (11) are searchable. The resulting outputs from these searches vary
from five (5) to eight (8) data items. See Figure 5.3.1.1. All searches except
for the Action Due Date search have a multiple subfile selection capability
in which any single or-combination of the six subfiles may be used. The
Action Due Date search automatically searches all six subfiles. There is a
specialized ALL search which outputs all documents in a specified subfile or
combination of subfiles. However, it is not recommended that the general
-user call for the search ALL option.

The searches may also be assigned for a particular time frame. If
no time frame is selected, the first valid date becomes the earliest date in
the data base and the last valid date defaults to 12-31-99. Of course, the Action
Due Date, Document date, and Input Date searches do not use the time framing
capability. However, the Document and Input Date searches can retrieve entire
month's or an entire year's worth of data by entering 00. For example, entering
110078 would result in finding al? the documents within the data base in the
eleventh month, November, for the year 1978, Likewise, an entry of 000078 would
retrieve all documents for the year 1978. See Figure 5.3.1.2.

Flowchart Figure 6.4.1 depicts the SEARCH MODE of the Correspondence
subfile.

5.3.2 DESIGN INFORMATION RELEASE/REPORT

Of the nine (9) possible data items within a DIR/REPORT record,
all but one, REVISION, are searchable. It should also be noted that the
Revision Date is searched during a Date search. This allows the Date
search to check only the most recent date associated with a document.
See Figure 5.3.2.1. The Date search has the capability of retrieving an entire
month's or year's worth of data by entering 00 for the day or month. For
example, entering 110078 would result in finding all the documents within
the data base in the eleventh month, November, for the year 1978. Likewise,
an entry of 000078 would retrieve all documents for the year 1978,
