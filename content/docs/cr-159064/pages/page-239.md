---
pdfPage: 239
folio: null
sectionId: "C.IDUSER"
kind: listing
source: ocr
confidence: 66
figures: []
listing:
  appendix: "C"
  routines: ["IDUSER"]
  listingPage: 10
---
```fortran
(0107)       SUBROUTINE IDUSER(IAI)
(0108)   7   INTEGER*2 IFASS(4),IA(15)
(0109)
(0110) C     THIS ROUTINE CHECKS TO MAKE SURE THAT THE
(0111) C     INCOMMING USER IS VALID
(0112) C
(0113)       CALL BREAK$( TRUE.)
(0114)       CALL TIMDAT(IA,15)
(0115)       CALL CLEAR
(0116) 102   IF(IA(13).NE.*SY*) GO TO 101         I
(0117)       IF(IA(L4).NE.*ST?) GO TC 101
(0118)       IF(IA(L5).NE.TEM") GO TO 101
(0119)       GO TO 103
(0120)       CALL COMI(*LOUSER® 96512,IC)
(0121)       CALL EXIT
(0122)       CALL BREAK$(.FALSE 6).
(0123)       IAI=1A(13)
(0124)       RETURN
(0125)       END
```
