---
pdfPage: 37
folio: "29"
sectionId: "4.1.2"
kind: text
source: ocr
confidence: 93.1
figures: []
---
4.1.2 SAMPLE MOD / ADD OPTION WITH JOB ORDER CHANGES

When the AUTO option for changing job order data is Invoked, the
system refers to the sustaining table for the job orders and fiscal year
percents correspcnding to the task and subtask (if applicable) of the
retrieved record. The system then refers to the program number tabie and
searches for the job orders found in the sustaining table to retrieve the
corresponding program numbers. As each job order and its program number Is
found in the program number table a message stating so will be displayed at
the terminal screen. If a job order from the sustaining teble Is not located
In the program number ‘table, the system will prompt the user for the program
number corresponding to that job order. The job order and the manually Input
program number will then be automatically entered into the program number
table.

When the ADD option Is invoked, the user may enter job orders one
at atime. As each job order and job order subcode (if desired) is entered,
the system refers to the program number iable to retrieve the corresponding
program number. If the job order is not found In the program number table,
the user must enter the program number manually. It should be noted that
If the user has entered an Incorrect job order, no error messages will be
displayed, since the system will create a new job order and enter It and
the manually input program number into the program number table. If needed,
the user may delete the job order from the record by using the DELETE cption.
The Incorrect job order may be deleted from the program number table by
using the edit table option under the update option, which is discussed In
section 8.0. Refer to the following example for an illustration cf the MOD
/ ADD option with changes to the job order data using the DELETE, AUTO, and
ADD options.
