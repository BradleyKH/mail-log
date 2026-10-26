---
pdfPage: 50
folio: "36"
sectionId: "4.4.4"
kind: text
source: ocr
confidence: 94.7
figures: []
---
4.4 GENERAL SUBROUTINES
4.4.] IDENT

This subroutine is used by the three (3) main subfile entrance
.routines to record the user identification, time and date of entry, and the
terminal used. The file used to store this information is called USER in
each of the three (3) program UFD's. Flowchart Figure 5.4.4-1 depicts the
flow diagram for this subroutine.

4.4.2 TINPUT

This subroutine is used to perform the basic Title Input for all
three (3) subfiles. This procedure is used in the INPUT MODE to build a
seven (7) word, ten (10) characters per word searchable title. It is also
called during the REVISE MODE to change an existing title. The routine is
also used to build a compatible word for which to perform the TITLE search.
Flowchart Figure 5.4.4-2 depicts the flow diagram for this subroutine.

4.4.3. RDCOM

This subroutine is used by the Title Input routine, 4.4.2, to
construct the title one (1) character at a time. Editor checks are made for
eraser, kill, and new line characters. Flowchart Figure 5.4.4-3 depicts
the flow diagram for this subroutine.

4.4.4 GETWRD
This subroutine is used by the Title Input routine, 4.4.2, to build

the searchable title in seven (7) words, ten (10) characters per word.
Flowchart Figure 5.4.4-4 depicts the flow diagram for this subroutine.
