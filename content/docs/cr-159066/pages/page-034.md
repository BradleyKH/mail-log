---
pdfPage: 34
folio: null
sectionId: "5.3.3"
kind: text
source: ocr
confidence: 95.6
figures: []
---
There is a specialized ALL search which outputs all documents in
the DIR/REPORT subfile. This ALL search has an optional output along with
the normal output consisting of the entire nine item record. This optional
output only displays the number of documents found on the terminal and
automatically spools to the high speed printer the DIR number and Revision.

The Vehicle search also has a special quality. A group of vehicles
may be found by using the first and last valid vehicle options. For example,
if a user declares the first valid vehicle as 198 and is searching for vehicle
number 200, not only would all documents containing vehicle 200 be found, but
also those with numbers 198S, 199S, and 200S; where S represents all subsequent
vehicles. Default for the first valid vehicle number is zero (0) whereas, the
last valid vehicle number becomes 999.

Flowchart Figure 6.4.2 depicts the SEARCH MODE of the DIR/REPORT
subfile.

5.3.3 DRAWING/ENGINEERING ORDER

Of the eleven (11) data itens within the Drawing subfile, nine
(9) are searchable. The resulting outputs from these searches always
consists of six (6) data items. See Figure 5.3.3.1. The Engineering Order
subfile consists of six (6) item records, of which only two are searchable.
The resulting outputs from these two searches consists of up to all six (6)
data items. It should be noted that Revision Date is output in place of the
E.0. Date when an E.0. has a revision. This allows only the most recent
date to be displayed. See Figure 5.3.3.2.

Due to the data base source for drawings coming from Dallas and
manual input, three searches have limited capability: System, Section,
and Date. The System and Section searches are only usable for those drawings
which are manually input. However, some Dallas drawing data will contain this
information within the title. Therefore, a title search can be used if
either the system or section searches are found unsuccessful. The Date
search is also limited in that all Dallas drawing data will have the same date.
This date represents the latest information update received from Dallas.
Nevertheless, the Date search has the capability of retrieving an entire
