---
pdfPage: 32
folio: "18"
sectionId: "4.1.22"
kind: text
source: ocr
confidence: 95.4
figures: []
---
Flowchart Figure 5.4.1-19 depicts the flow diagram for this
_ Subroutine.

4.1.20 SUBJ

This subroutine is called by the SEARCH MODE to perform the SUBJECT
TITLE search. This procedure allows up to four (4) of the seven (7) possible
words in the subject to be searched. As each subject is found containing the
desired word, the entire subject is displayed on the terminal. If none are
found, the user may restart this subroutine or return to the SEARCH MODE as
normally done when the file(s) are finished. When the final word has been
searched, document records found will be formatted to an output file with
headers. Flowchart Figure 5.4.1-20 depicts the flow diagram for this routine.

4.1.2] MSTAT

This subroutine is called by the SEARCH MODE to perform a MAIL
STATUS type of search. If the desired mail status is legal, the search is
performed. This routine formats document records found and builds an output
file with headers. When the file(s) are finished, this routine returns to
the SEARCH MODE. Flowchart Figure 5.4.1-21 depicts the flow diagram for this
Subroutine.

4.1.22 ADAT

This subroutine is called by the SEARCH MODE to perform the ACTION
DUE DATE search. This procedure has two options: a complete listing of
document records with an action due or search for document records within
five (5) days or past due using the current date as reference. This routine
formats document records found and builds an output file with headers.
During this search the break key is inhibited. When the ACTION DUE subfile
is finished, this routine automatically spools the output file to the high
speed printer. Flowchart Figure 5.4.1-22 depicts the flow diagram for
this subroutine.
