---
pdfPage: 19
folio: null
sectionId: "B.MAIN"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["MAIN"]
  listingPage: 3
---
```fortran
(0076)      1' QUIT               QUIT',//)
(0077)       REWIND 6
(0078)       REWIND 10
(0079)       READ(1,11)IOPT
(0080) 11    FORMAT(1A2)
(0081)       IF(IOPT.EQ.'IN') CALL INPTC
(0082)       IF(IOPT.EQ.'RE') CALL REVSC
(0083)       IF(IOPT.EQ.'SE') CALL SEAC
(0084)       IF(IOPT.EQ.'AR') CALL ARCC
(0085)       IF(IOPT.EQ.'QU') GO TO 1100
(0086)       GO TO 10
(0087) 1000  WRITE(1,1001)
(0088) 1001  FORMAT(' SORRY - THE MAIL LOG FILE IS CURRENTLY IN USE',/,
(0089)      1' PLEASE TRY AGAIN LATER',///)
(0090) 1100  CALL SRCH$$(K$CLOS,'REVS  ',6,0,0,0)
(0091)       CALL SRCH$$(K$CLOS,'DATE  ',6,0,0,0)
(0092)       GO TO 200
(0093) 1200  CALL EXIT
(0094)       END
```
