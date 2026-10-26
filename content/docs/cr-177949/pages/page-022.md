---
pdfPage: 22
folio: "14"
sectionId: "2.8"
kind: text
source: ocr
confidence: 89
figures: []
---
```text
23) ACTBOM    : - ¥¥*R** FIELD 1S NO LONGER IN USE **®¥#*

24) TABLE     : JOB ORDER TABLE "SUST" FOR SUSTAINING "MANL" FOR MANUAL
25) TOTHRS    : TOTAL AUTHORIZED HOURS
26) TOTDOL    : TOTAL AUTHORIZED DOLLARS
```

It should be noted that most users will find the following fleld

searches to result In the most productive retrievals:

```text
6) TITLE      7) MOD         9) REMARKS      10) NR         11) CR
12) RBK       15) TASK       16) TASKAS       17) TASKSB     18) WAN
19) WACODE    20) COMPLETE 24) TABLE
```

2.6 INPUT OPERATIONS

The Contract Analysis file uses FORTRAN input forms In its Input

mode of operation. Al! data field entries must be placed between exclamation

points, one iine (or one field) at a time. For example,

\#3) AUTHOR
!

When all the data has been entered for a record header, the job orders and

the hours and dollars data must then be built. The input option is discussed

in further detalii In section 5.0 of this document.

2.7 UPDATE OPERATIONS

The FORTRAN update forms are generated simitarly to the FORTRAN

input forms. Data Is entered between exclamation points, one’ line (or one

field) at atime. For further detalls, see sections 4.1 and 8.0 of this

document.

2.8 SYSTEM EXIT / LOGOUT

System logout Is always accomplished with the zero option on every

menu throughout the SPADS system as demonstrated In the Contract Analysis
