---
pdfPage: 52
folio: "40"
sectionId: "4.2.3.1"
kind: text
source: ocr
confidence: 94.1
figures: []
---
4.2.3 SEARCH MODE
4.2.3.1 DESCRIPTION OF SEARCH MODE

Of the nine (9) possible data items within a DIR/REPORT record,
all but one, REVISION, are searchable. It should also be noted that the
Revision Date is searched during a Date search. This allows the Date
search to check only the most recent date associated with a document.

See Figure 7. The Date search has the capability of retrieving an entire
month's or year's worth of data by entering 00 for the day or month. For
example, entering 110078 would result in finding all the documents within
the data base in the eleventh month, November, for the year 1978. Likewise,
an entry of 000078 would retrieve all documents for the year 1978,

There is a specialized ALL search which outputs al] documents in
the DIR/REPORT subfile. This ALL search has an optional output along with
the normal output consisting of the entire nine item record. This optional
output only displays the number of documents found on the terminal and
automatically spools to the high speed printer the DIR number and Revision.

. The Vehicle search also has a special quality. A group of vehicles
may be found by using the first and last valid vehicle options. For example,
if a user declares the first valid vehicle as 198 and is searching for vehicle

number 200, not only would all documents containing vehicle 200 be found, but
also those with numbers 198S, 199S, and 200S; where S represents all subsequent
vehicles. Default for the first valid vehicle number is zero (0) whereas, the
last valid vehicle number becomes 999,

If many documents are found during a seach and it is observed that
needed information will soon disappear from the screen, the user may temporarily
stop terminal display by depressing the space bar. Terminal display may be
restarted by depressing the 'Q' key.
