---
pdfPage: 64
folio: "52"
sectionId: "4.3.1.2"
kind: text
source: reviewed
confidence: 100
figures: []
---
4.3.1.2 ACTION/RESPONSE DURING INPUT MODE

Step #1 WELCOME TO THE DRAW-EO FILE INPUT ROUTINE
PLEASE INPUT INFORMATION BETWEEN EXCLAMATION MARKS AND LEFT JUSTIFY ALL ENTRIES
IS THIS A DRAWING OR AN E.O. (DRAW OR EO)

If Draw, go to #2
If EO, go to #20

Step #2 (1) TITLE (7 WORDS - 10 CHAR.)

```text
!                                                       !
```

Enter Title
If legal entry, the entry is displayed on terminal.
If not legal, step is repeated. This is done for all entries to follow. NOTE: User must skip a space before entering data.

Step #3 (2) DRAWING NUMBER

```text
!         !
```

Enter number up to 14 characters

Step #4 (3) DRAWING DATE

```text
!MMDDYY!
```

Enter month, day, and year.

Step #5 (4) SYSTEM (ELEC,GSE,GUID,MECH,PROP,RF,SOP,MGS,EGS,PERF)

```text
!  !!  !!  !
```

Step #6 (5) VEHICLE

```text
!  !!   !
XXXA
```

Enter vehicle number XXXA up to two numbers, where XXX represents the numbers. The 'A' represents the letter 'S' which stands for all subsequent vehicle numbers after XXX.
