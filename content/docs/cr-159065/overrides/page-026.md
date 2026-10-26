---
pdfPage: 26
folio: "14"
sectionId: "4.1.1.2"
kind: text
source: reviewed
confidence: 100
figures: []
---
Step #23 Entire record displayed on terminal

```text
CHECK RECORD FOR ERRORS: IF CORRECT, ENTER COR
                         IF REVISION NEEDED, ENTER REV
```

If COR, go to #26
If REV, go to #24

Step #24

```text
HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 14)
XX
```

Enter number XX

Step #25

```text
INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE
NN
```

Enter number NN
Repeat XX number of times
Branches to data item to be revised, then returns to #23

Step #26

```text
WHICH SUB-FILE IS THIS RECORD TO BE STORED (NUMBER)
1.  TRANSMITTAL/SPECIFICATION     2.  MEMO/LETTER
3.  TWX/MAGNAFAX/RAPIFAX          4.  ANNOUNCEMENT
5.  PURCHASE REQUEST              6.  MISCELLANEOUS/REPORT
```

Step #27 If referenced document field is blank, go to #30
If not blank, the following message is displayed

```text
STAND BY.  SYSTEM NOW IN AUTOMATIC UPDATE MODE
```

Step #28 If word delay or delayed is found in the subject, go to #29
If approval, approved, disapproved, disapproval, or disposition of the above, go to #30
