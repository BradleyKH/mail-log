---
pdfPage: 130
folio: "121"
sectionId: "10.5"
kind: text
source: ocr
confidence: 92.9
figures: []
---
capability of retrieving an entire month's or year's worth of data by entering
00 for the day or month. For example, entering 110078 would result in
finding all the documents within the data base in the eleventh month,
November, for the year 1978. Likewise, an entry of 000078 would retrieve all
documents for the year 1978.

There is a specialized ALL search which outputs all documents in
the DIR/REPORT subfile. This All search has two output formats: (1) Full
listing gives a two line output of all data Items and (2) Brief listing
gives only the DIR number and Revision. This search only displays the
number of documents found on the terminal and automatically spools the output
to the system printer located in the SPO computer room. Refer to Appendix
E-1 for an example of the DIR/Report ALL search brief report output format.
All other search options use the same report format that [s_ illustrated in
the example on page 122.

The Vehicle search also has a special quality. A group of vehicles
may be found by using the first and last valid vehicle option. For example,
if a user sets the first valid vehicle as 198 and is searching for vehicle
number 200, not only would all documents containing vehicle 200 be found, but
also those with numbers 1988, 199S, and 200S, where S represents all subsequent
vehicles. Default for the first and last vaiid vehicle numbers are
the user desired vehicle number. This will therefore search for only one
vehicle value.

\f many documents are found during a search, only enough records to
fill the terminal screen will be displayed at a time, with 'More?' displayed
at the bottom of the terminal screen. The user may respond with 'Y', to
Indicate that the next screen full of records is to be displayed, or with

'N', to indicate that no more records are to be displayed. If a carriage
