---
pdfPage: 23
folio: "11"
sectionId: "4.1.1.2"
kind: text
source: reviewed
confidence: 100
figures: []
---
4.1.1.2 ACTION/RESPONSE DURING INPUT MODE

Step #1

```text
IS THIS A CONTINUATION OF INPUT (YES OR NO)
```

If Yes, go to #4
If No, go to #2

Step #2

```text
DO YOU WISH TO START A NEW ENTRY (NEW)
OR SPOOL LAST OUTPUT AGAIN (LAST)
OR SPOOL NEW DATA ENTERED (DATA)
```

If New, go to #3
If Last, output spooled to printer. Exit input mode
If Data, go to #3

Step #3

```text
STAND BY.  SYSTEM NOW PERFORMING FILE HOUSEKEEPING.
```

System pauses 10 to 35 seconds. No user response required.

Step #4

```text
WELCOME TO THE MAIL LOG FILE INPUT ROUTINE.
PLEASE NOTE THAT ALL ENTRIES ARE TO BE PLACED BETWEEN THE
EXCLAMATION MARKS AND SHOULD BE LEFT JUSTIFIED
FIRST - PLEASE ENTER THE CURRENT DATE
!MMDDYY!
```

Input desired date for daily input - month, day, and year.
Note: User must skip a space to start.

Step #5 If Data option taken in Step #2, go to #31.
If data option not taken, go to #6.

Step #6

```text
(1) MAIL STATUS - (VC) VOUGHT CORRESPONDENCE
                  (IM) INCOMING MAIL
                  (OM) OUTGOING MAIL
!  !
```

Step #7 Enter mail status as given.
If legal entry, entry displayed on terminal; go to #8
This is done for all entries to follow.
If not legal, go to #6
