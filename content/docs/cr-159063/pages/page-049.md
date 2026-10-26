---
pdfPage: 49
folio: "35"
sectionId: "4.3.25"
kind: text
source: ocr
confidence: 95
figures: []
---
4.3.23. SECTN

This subroutine is called by the SEARCH MODE to perform a SECTION
search. This routine formats drawings found and builds an output file. When
the file has been finished, this routine returns to the SEARCH MODE. Flowchart
Figure 5.4.3-23 depicts the flow diagram for this subroutine.

4.3.24 CODE

This subroutine is called by the SEARCH MODE to perform a VENDOR
CODE type of search. This procedure checks the first three (3) numbers of
each drawing number for a designated code. All drawings found with this vendor
code are formatted for the output file and displayed on the terminal. When the
file has been finished, this routine returns to the SEARCH MODE. Flowchart
Figure 5.4.3-24 depicts the flow diagram for this subroutine.

4.3.25 EONN

This subroutine is called by the SEARCH MODE to perform the
ENGINEERING ORDER NUMBER type of search. This procedure has two options:
locating a specific Engineering Order within the E.0. data subfile or search
the DRAWING data subfiles for all sheets referencing a specific Engineering
Order. If the first option is taken and the desired E.0. is not located on
the E.0. subfile, a special Not Found message is displayed on the terminal.
Regardless of the option, the routine formats for the output file and displays
on the terminal the appropriate data items for data records found. When the
search is finished, this routine returns to the SEARCH MODE. Flowchart
Figure 5.4.3-25 depicts the flow diagram for this subroutine.
