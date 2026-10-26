---
pdfPage: 37
folio: "23"
sectionId: "4.2.8"
kind: text
source: ocr
confidence: 94.4
figures: []
---
4.2.5 SHOWDR

This subroutine is used to display an entire data record on the
terminal for the INPUT or REVISE MODES. Each data item is numbered in order —
to verify the data record as either correctly input or the correct record to be
revised or deleted. Flowchart Figure 5.4.2-5 depicts the flow diagram for
this subroutine.

4.2.6 INPSDR

This subroutine is used by the INPUT or REVISE MODES to input or
change specific data items within a data record. Flowchart Figure 5.4.2-6
depicts the flow diagram for this subroutine.

4.2.7 ALDR

This subroutine is called by the SEARCH MODE to perform a PRINT ALL
type of search. This routine has two (2) options: | a complete listing of
DIR/REPORT records containing the entire data record or a partial listing
only containing the DIR/REPORT Number and REVISION. When the entire data
record option is used, all nine (9) data items are displayed on the terminal ©
and formatted for output. During the partial search only multiples of 50
are displayed on the terminal. During this search the break key is inhibited.

When the DIR/REPORT data file is finished, this routine automatically
spools the output file to the high speed printer. Flowchart Figure 5.4.2-7
depicts the flow diagram for this subroutine.

4.2.8 TITDR

This subroutine is called by the SEARCH MODE to perform the TITLE
search. This procedure allows up to four (4) of the seven (7) possible words
in the title to be searched. As each title is found containing the desired word,
the entire title is displayed on the terminal. If none are found, the user
may restart this subroutine or return to the SEARCH MODE which is normally
done when the data file is finished. When the final word has heen searched,
the entire data record of document records found will be formatted to an
