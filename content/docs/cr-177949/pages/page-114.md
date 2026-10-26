---
pdfPage: 114
folio: "106"
sectionId: "8.8.1"
kind: text
source: ocr
confidence: 92.2
figures: []
---
Contract Analysis data base. The following menu displays the two update

options:

ENTER UPDATE DESIRED: (RETURN IF FINISHED)

(1) DALLAS TAPE
(2) BALANCE SHEET
(3) ETC EAC-BUDGET
(4) QUICKIE HEADER
(5) EDIT TABLES
(6) RE-SORT DATA BASE
(7) BOOK ALL OUTPUTS
(8) JOB ORDERS

ENTER OPTION # > 8

*** UPDATE JOBORDER OPTIONS ¥***

(1) REBUILD JOB ORDERS FROM SUSTAINING TABLE
(2) UPDATE PROGRAM NUMBERS FOR EACH JOB ORDER

ENTER OPTION NUMBER > ** return **
Each of these options is discussed in detail in the following sections.
8.8.1 REBUILD JOB ORDERS FROM SUSTAINING TABLE

This option rebuilds the job orders for all records in the data base
which have the value 'SUST' for the header field called 'TABLE'. The routine
rebullds all the job orders based upon the sustaining job order table previousty
discussed in section 8.5.53. The user may select to update a
specific task or the entire data base simultaneously. This is the point at
which the user enters when exiting the sustaining table update (section
8.5.3). Selection of the task (or all) will then update the financial data
base with the new sustaining job orders and / or percents. It should be

noted that each job order is verified In the program number table during the
update of the first record only. The 'FOUND' message indicates that the job
