---
pdfPage: 81
folio: "73"
sectionId: "7.2.2"
kind: text
source: ocr
confidence: 91.4
figures: []
---
DRAW-NUMBER?> ** return **

7.2.2 UPDATE DRAWING PART

Option 2 allows the user to revise a record in the Parts file data
base. The user must first enter the drawing number of the record that is
to be updated. If no records are found having the specified drawing number,
a message stating so wil! be displayed, and the user must enter another drawing
number or a carriage return, in which case the user will be returned to
the Update menu. Next, the item number of the record to be updated is to be
entered. If the desired record is found, it will be displayed in an update
screen identical to the corresponding input screen illustrated in section
7.1.1 of this document. If more than one record is found having the same
item number, cnly the first one found will be displayed on the input / update
screen. To retrieve subsequent records type an "=""at the prompt 'ITEM-NO?>'.
If no records are found having the specified drewing number and item number,

'1TEM NOT FOUND' will be displayed, and the user must enter either a _ new

item number or a carriage return, in which case the user will be returned
to the Update menu. See the following example which illustrates this exit
path.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2

THIS PROGRAM ALLOWS REVISIONS TO THE PARTS FILE FOR ANY DRAWING
ENTER DRAWING NUMBER OF PART TO BE CHANGED > 817437

ITEM~NG?> 0

ITEM NOT FOUND

({TEM-NO?> ** return **
