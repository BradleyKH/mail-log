---
pdfPage: 29
folio: "15"
sectionId: "4.1.13"
kind: text
source: ocr
confidence: 95
figures: []
---
4.1.9 WHERE

This subroutine is used by the REVISE or SEARCH MODES to determine
how many and which data subfiles are to be opened for searching purposes.
These selected subfiles are then opened for the SEARCH MODE of operation. -
Flowchart Figure 5.4.1-9 depicts the flow diagram for this subroutine.

4.1.10 BRAKET

This subroutine is used by the SEARCH MODE to determine a first and
last valid date for atime framed type of search. Defaults are 0-0-0 and
12-31-99 for the first and last valid dates, respectively. Flowchart
Figure 5.4.1-10 depicts the flow diagram for this subroutine.

4.1.11 ALC

This subroutine is called by the SEARCH MODE to perform a PRINT ALL
type of search. This routine may search any one or combination of subfiles.
The break key is inhibited during this search. When the file(s) have been
finished, this routine automatically spools the formatted output file to the
high speed printer. Flowchart Figure 5.4.1-11 depicts the flow diagram for
this subroutine.

4.1.12 RESEA

This subroutine is called by the SEARCH MODE to perform a RESPONSIBLE
ENGINEER type of search. This routine formats document records found and
builds an output file with headers. When the file(s) have been finished, this
routine returns to the SEARCH MODE. Flowchart Figure 5.4.1-12 depicts the
flow diagram for this subroutine.

4.1.13 WHO

. This subroutine is called by the SEARCH MODE to perform a WHO TO/
ADDRESSEE type of search. This routine formats document records found and
