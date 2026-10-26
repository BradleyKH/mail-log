---
pdfPage: 94
folio: "86"
sectionId: "8.2"
kind: text
source: ocr
confidence: 92.7
figures: []
---
7.9 of this document). After corrections have been made to any discrepancies
the Balance Sheet update routine must be run (see section 8.2 of this doc-

ument).

8.2 BALANCE SHEET UPDATE

The balance sheet update routine may be run only on those contracts
which has EAC Balance sheet records within the data base file. If an attempt
Is made to run a balance sheet update on a contract that does not have EAC
Balance sheet records within the data base file, the following will be displayed:

"BALANCE SHEET UPDATE CANNOT BE DONE FOR THIS
CONTRACT ****** THERE ARE NO BALANCE SHEETS II!!!

In the balance sheet update routine the user must first enter the
desired status date (month and year) to be updated. Next the desired task
must be entered, or a carriage return entered to indicate that all tasks are
to be updated, and then the record numbers of those records updated will be
displayed at the terminal screen. if no errors are encountered, a message
stating so will be displayed. If errors are encountered, a message stating
so will be displayed, and a report containing those errors will be automatically
spooled to the system printer. The user may wish to have a complete
balance sheet report showing a detailed outline of all hours and dollars
for every task of a particular contract. This report is run from the
Contract Analysis report generator which is option four (4) on the main menu.

The following example illustrates the balance sheet update option.

ENTER UPDATE DESIRED: (RETURN IF FINISHED)

(1) DALLAS TAPE
(2) BALANCE SHEET
(3) ETC EAC-BUDGET
