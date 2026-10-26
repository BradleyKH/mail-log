---
pdfPage: 31
folio: null
sectionId: "B.RDCOM"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["RDCOM"]
  listingPage: 15
---
```fortran
(0177) C     READ ONE LINE FROM CONSOLE OR COMMAND FILE
(0178) C
(0179) C
(0180)       SUBROUTINE RDCOM(BUF)
(0181) C
(0182)       COMMON /X/ PEDL
(0183) C
(0184)       INTEGER BUF(1),PEDL,CHAR,ANL,AKILL,AERASE
(0185) C
(0186) C     ANL, AKILL, AERASE ARE OCTAL 212, 277, 242
(0187)       DATA  ANL,AKILL,AERASE/138,191,136/
(0188) C
(0189)       PEDL=1
(0190) 90    N=1
(0191) 100   CALL C1IN(CHAR)
(0192)       BUF(N)=CHAR
(0193)       IF(CHAR.EQ.ANL)  RETURN
(0194)       IF(CHAR.EQ.AKILL)  GOTO 90
(0195)       IF(CHAR.EQ.AERASE)  GOTO 200
(0196)       N=N+1
(0197)       IF(N.GT.77)  GOTO999
(0198)       GOTO 100
(0199) C
(0200) 200   IF(N.LE.2)  GOTO 90
(0201)       N=N-1
(0202)       GOTO 100
(0203) C
(0204) C
(0205) C     LINE LONGER THAN 77 CHAR
(0206) C
(0207) 999   ILF=:212
(0208)       CALL T1OU(ILF)
(0209)       RETURN
(0210)       END
```
