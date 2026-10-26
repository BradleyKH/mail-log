---
pdfPage: 114
folio: "106"
sectionId: "8.3.1"
kind: text
source: ocr
confidence: 92.5
figures: []
---
cal Drawing file Delete menu appears as follows:

UARS ELECTRICAL DRAWING FILE DELETION MENU FCR THE PROJECTS' DIRECTORATE

AVAILABLE OPTIONS ARE AS FOLLOWS

\1. Delete a Part
\2. Delete a Drawing
\3. Delete a Category in Lookup Table

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) >

8.3.1 DELETE A PART

Option 1 allows the user to delete a record from the Parts File data
base. The user must enter the appropriate drawing number and then the
desired item number for the part that is to be deleted. If no records are

found having the desired drawing number, the following message is displayed:

¥**¥*¥ ERROR **** NO SUCH DRAWING NUMBER AS 288098 IN THE FILE
The user will then be returned to the Delete menu. If the desired record 1s
retrieved, it will be displayed at the termina! screen along with a prompt

for the user to indicate whether that record is to be deleted. A response
of 'N' will cause the record to remain unchanged, and the user will be returned
to the Delete menu. A response of 'Y' will generate a delete message,
the record will then be deleted, and the user will be returned to the

Delete menu. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 1
THIS PROGRAM ALLOWS A PART TO BE DELETED FROM A SPECIFIED DRAWING
ENTER DRAWING NUMBER > D424103-1

ENTER ITEM NUMBER > 2
