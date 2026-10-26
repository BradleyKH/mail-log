---
pdfPage: 27
folio: "13"
sectionId: "4.1.3"
kind: text
source: ocr
confidence: 94.6
figures: []
---
4.1.2. REVSC

This subroutine is the revise routine for the SPADS MAIL LOG
Correspondence subfile. To revise or delete a document, the input date and
daily counter code comprise the unique identifier for its location. Additional
time can be saved if the user also knows in which of the six (6) correspondence
data subfiles the document is stored. When the desired document record is
found, it will be displayed on the terminal for verification. If not the
correct record, search for the document will continue. After the revision has
~ been made the document record is again displayed on the terminal for user
edification.

The REVISE MODE also can give the user manual revise or delete
capability for documents in the ACTION DUE file. Flowchart Figure 5.4.1-2
depicts the REVISE MODE of the Correspondence subfile.

4.1.3 SEAC

This subroutine is the search routine for the SPADS MAIL LOG
Correspondence subfile.

Of the sixteen (16) possible data items within a document record,
eleven (11) are searchable. The resulting outputs from these searches vary
from five (5) to eight (8) data items. See Figure 6.2.1.2. Al] searches
except for the ACTION DUE DATE search have a multiple subfile selection
capability in which any single or combination of the six subfiles may be used.
The ACTION BUE DATE search automatically searches all six (6) subfiles. There
is a specialized ALL search which outputs all document records in a specified
subfile or combination of subfiles. However, it is not recommended that the general
user call for the search ALL option.

The searches may also be assigned for a particular time frame. If
no time frame is selected, the first valid date becomes the earliest date in
the data base and the last valid date defaults to 12-31-99. Of course, the
ACTION DUE DATE, DOCUMENT DATE, and INPUT DATE searches do not use the time
framing capability. However, the DOCUMENT and INPUT DATE searches can retrieve
entire month's or an entire year's worth of data by entering 00. For example,
entering 110078 would result in finding all the documents within the data base
in the eleventh month, November, for the year 1978. Likewise, an entry of 000078
would retrieve all documents for the year 1978. See Figure 6.2.1.3.

Flowchart Figure 5.4.1-3 depicts the SEARCH MODE of the Correspondence

subfile,
