---
pdfPage: 47
folio: "35"
sectionId: "4.2.1.2"
kind: text
source: reviewed
confidence: 100
figures: []
---
4.2.1.2 ACTION/RESPONSE DURING INPUT MODE

Step #1

```text
WELCOME TO THE DIR-REPORT FILE INPUT ROUTINE.  PLEASE INPUT
INFORMATION BETWEEN EXCLAMATION MARKS AND LEFT JUSTIFY ALL
ENTRIES.
ENTER THE DIR OR REPORT NUMBER
XXX
```

Enter number XXX up to 14 characters

Step #2 If number not found in file, go to #6
If number found, display message and entire record on terminal

```text
THIS DIR/REPORT IS ALREADY IN THE DATA FILE
```

Step #3

```text
DO YOU WISH TO REVISE (YES OR NO)
```

If Yes, go to #4
If No, go to #16

Step #4

```text
HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 8)
X
```

Enter number X

Step #5

```text
INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE
N
```

Enter number N
Repeat X number of times. Branch to data item N to be revised as shown in Steps #6 thru #15.

Step #6

```text
(1) TITLE (7 WORDS - 10 CHAR.)
!                                    !
```

Enter title. If legal entry, the entry is displayed on terminal. If not legal, step is repeated. This is done for all entries to follow. NOTE: User must skip a space before entering data.
