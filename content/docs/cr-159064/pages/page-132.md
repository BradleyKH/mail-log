---
pdfPage: 132
folio: null
sectionId: "B.INPSC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["INPSC"]
  listingPage: 116
---
```fortran
(1431) C     BEGIN INPUT
(1432) C
(1433) 100   IF(R.EQ.1.AND.IR.NE.1) GO TO 200
(1434) 103   WRITE(1,101)
(1435) 101   FORMAT(
(1436)      1' (1) MAIL STATUS - (VC) VOUGHT CORRESPONDENCE',/,
(1437)      1'                   (IM) INCOMING MAIL',/,
(1438)      1'                   (OM) OUTGOING MAIL',/
(1439)      1'!  !',/)
(1440)       READ(1,104,ERR=103)MS
(1441)       IF(MS.EQ.'VC') GO TO 105
(1442)       IF(MS.EQ.'IM') GO TO 105
(1443)       IF(MS.EQ.'OM') GO TO 105
(1444)       WRITE(1,106)MS
(1445) 106   FORMAT('GGTHE MAIL STATUS CODE YOU HAVE ENTERED ('A2,
(1446)      1') IS NOT VALID - TRY AGAIN'/)
(1447)       GO TO 103
(1448) 104   FORMAT(1X,A2)
(1449) 105   WRITE(1,104)MS
(1450) 200   IF(R.EQ.1.AND.IR.NE.2) GO TO 300
(1451) 201   WRITE(1,202)
(1452) 202   FORMAT(' (2) AUTHOR/SOURCE',/
(1453)      1'!',28X,'!'/)
(1454)       READ(1,203,ERR=201)ATHR
(1455)       WRITE(1,203)ATHR
(1456) 203   FORMAT(1X,7A4)
(1457) 300   IF(R.EQ.1.AND.IR.NE.3) GO TO 400
(1458) 301   WRITE(1,302)
(1459) 302   FORMAT(' (3) DOCUMENT DATE ',/,'!MMDDYY!'/)
(1460)       READ(1,303,ERR=301)DD
(1461) 303   FORMAT(1X,3I2)
(1462)       IF(DD(1).GT.12) GO TO 301
(1463)       IF(DD(2).GT.31) GO TO 301
(1464)       WRITE(1,303)DD
(1465) 400   IF(R.EQ.1.AND.IR.NE.4) GO TO 500
(1466) 401   WRITE(1,402)
(1467) 402   FORMAT(' (4) TO ',/,'!'32X,'!'/)
(1468)       READ(1,403,ERR=401)TO
```
