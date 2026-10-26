---
pdfPage: 31
folio: "17"
sectionId: "4.1.19"
kind: text
source: ocr
confidence: 95.8
figures: []
---
first two (2) letters of the ID Code. This routine formats document records
found and builds an output file with headers. When the file(s) have been
finished, this routine returns to the SEARCH MODE. Flowchart Figure 5.4.1-16
depicts the flow diagram for this subroutine.

4.1.17 AUSEA

This subroutine is called by the SEARCH MODE to perform an AUTHOR/
SOURCE type of search. This routine formats document records found and
builds an output file with headers. When the file(s) have been finished,
this routine returns to the SEARCH MODE. Flowchart Figure 5.4.1-17 depicts
the flow diagram for this subroutine.

4.1.18 DLSEA

This subroutine is called by the SEARCH MODE to perform a DOCUMENT/
LETTER NUMBER type of search. This procedure may perform partial searches as
long as the desired parameter is four (4) characters in length. This routine
formats document records found and builds an output file with headers. When
the file(s) have been finished, this routine returns to the SEARCH MODE.
Flowchart Figure 5.4.1-18 depicts the flow diagram for this subroutine.

4.1.19 DATC

This subroutine is called by the SEARCH MODE to perform the DOCUMENT
DATE type of search. This DOCUMENT DATE search does not use the time framing
capability. However, the DOCUMENT DATE search can retrieve entire month's or

an entire year's worth of data by entering 00. For example, entering 110078
would result in finding all the documents within the data base in the eleventh
month, November, for the year 1978. Likewise, an entry of 000078 would retrieve
all documents for the year 1978. See Figure 6.2.1.3.
