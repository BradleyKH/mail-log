---
pdfPage: 46
folio: "32"
sectionId: "4.3.16"
kind: text
source: ocr
confidence: 94.8
figures: []
---
4.3.14 MAIND

This subroutine is used by the SEARCH MODE to format and display
on the terminal the appropriate DRAWING data items for each data record which
was found during a REVISION ACTION DUE type of search. This procedure also
formats the data items for the output file to be spooled on the high speed
printer.

If many document records are found during a search and it is
observed that needed information will soon disappear from the screen, the
user may temporarily stop terminal display by depressing the space bar.
Terminal display may be restarted by depressing the 'Q' key. Flowchart
Figure 5.4.3-14 depicts the flow diagram for this subroutine.

4.3.15 DMAIN

This subroutine is used by the SEARCH MODE to format and display
on the terminal the appropriate DRAWING data items for each data record which
was found. This procedure also formats. the data items for the output file
to be spooled on the high speed printer.

If many document records are found during a search and it is
observed that needed information will soon disappear from the screen, the
user may temporarily stop terminal display by depressing the space bar.
Terminal display may be restarted by depressing the 'Q' key. Flowchart
Figure 5.4.3-15 depicts the flow diagram for this subroutine.

4.3.16 TITDW

This subroutine is called by the SEARCH MODE to perform the TITLE
search. This procedure allows up to four (4) of the seven (7) possible words
in the title to be searched. As each title is found containing the desired
word, the entire title is displayed on the terminal. If none are found, the
user may restart this subroutine or return to the SEARCH MODE which is normally
done when the data file is finished.’ When. the final word has been searched,
