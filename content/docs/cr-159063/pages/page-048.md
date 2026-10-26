---
pdfPage: 48
folio: "34"
sectionId: "4.3.22"
kind: text
source: ocr
confidence: 93.4
figures: []
---
4.3.20 DATDOW

This subroutine is called by the SEARCH MODE to perform the DRAWING
DATE type of search. The DATE search has the capability of retrieving an
entire month's or year's worth of data by entering 00 for the day or month.
For example, entering 110078 would result in finding all the: documents
within the data base in the eleventh month, November, for the- year 1978.
Likewise, an entry of 000078 would retrieve all documents for the year 1978.
Flowchart Figure 5.4.3-20 depicts the flow diagram for this subroutine.

4.3.21 SYSDW

This subroutine is called by the SEARCH MODE to perform a SYSTEM
search. This routine formats drawings found and builds an output file.
When the file has been finished, this routine returns to the SEARCH MODE.
Flowchart Figure 5.4.3-21 depicts the flow diagram for this subroutine.

4.3.22 VEHND

This subroutine is called by the SEARCH MODE to perform a VEHICLE
NUMBER type of search. This procedure has two (2) options: all the Drawings
or all the Engineering Orders related to a vehicle, or set of vehicles. The-
Vehicle search also has a special quality. A group of vehicles may be found
by using the first and last valid vehicle options. For example, if a user
. delcares the first valid vehicle as 198 and is searching for vehicle number
; 200, not only would all documents containing vehicle 200 be found, but also
those with numbers 198S, 199S, and 200S; where S represents all subsequent
vehicles.. Default for the first valid vehicle number is zero (0) whereas,
the last valid vehicle number becomes 999.

Flowchart Figure 5.4.3-22 depicts the flow diagram for this
subroutine.
