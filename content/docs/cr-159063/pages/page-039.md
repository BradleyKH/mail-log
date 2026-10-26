---
pdfPage: 39
folio: "25"
sectionId: "4.2.15"
kind: text
source: ocr
confidence: 95.3
figures: []
---
4.2.13 CONN

This subroutine is called by the SEARCH MODE to perform a CONTRACT
NUMBER type of search. This procedure uses the CONTRACT TABLE, CTAB, to find
the W.A. Number/ID Code associated with the desired Contract Number. See
Section 6.3.2 for further information concerning the CTAB Table. The routine
now performs a modified W.A. NUMBER/ID CODE type of search. See Section 4.2.1]
for a description of this search. Flowchart Figure 5.4.2-13 depicts the flow
diagram for this subroutine.

4.2.14 VEHN

This subroutine is called by the SEARCH MODE to perform a VEHICLE
NUMBER type of search. The VEHICLE search also has a special quality. A group
of vehicles may be found by using the first and last valid vehicle options.
For example, if a user declares the first valid vehicle as 198 and is searching
for vehicle number 200, not only would all documents containing vehicle 200
be found, but also those with numbers 198S, 199S, and 200S; where S represents
all subsequent vehicles. Default for the first valid vehicle number is zero
(0) whereas, the last valid vehicle number becomes 999.

| When the file has been finished, this routine returns to the SEARCH -
MODE. Flowchart Figure 5.4.2-14 depicts the flow diagram for this subroutine.

4.2.15 FMAIN

This subroutine is used by the SEARCH MODE to format and display on
the terminal the entire data record found during a specific data item search.
This procedure also formats the data record for the output file to be spooled
on the high speed printer. The Contract Number is found in the CONTRACT
TABLE, CTAB, by search for the W.A. Number/ID Code. See Section 6.3.2 for
further information concerning the CTAB Table.

If many document records are found during a search and it is observed
that needed information will soon disappear from the screen, the user may
