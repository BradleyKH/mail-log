---
pdfPage: 338
folio: null
sectionId: "D.IDENT"
kind: listing
source: ocr
confidence: 49.8
figures: []
listing:
  appendix: "D"
  routines: ["IDUSER"]
  listingPage: 11
---
```fortran
(0117)       SUBROUTINE IDUSER(IAI)
(0118)       INTEGER*®2 IPASS(4)—(IAC15)
(0119) C
(0120) C     THIS ROUTINE CHECKS TO MAKE SURE THAT THE
(0121) C     INCOMMING USER IS VALID                o
(0122) C                                            Do
(0123)       CALL BREAK$( TRUE)
(0124)       CALL TIMDAT(IA,15)
(0125)       CALL CLEAR
(0126) 102   IF (IA(13) NEo*SY*) GO TO 101
(0127)       IF (IA(14) ANES*ST®) GO TO 101
(0128)       IF(IA(15).NE.*EN*) GO TO 101
(0129)       GO TO 103
(0130) C 101° CALL COMINPC6HLOUSERe10)                                     eo
(0131)       CALL EXIT
(0132) 103   CALL BREAK$(.FALSE.)
(0133)       TAI=IA(13)
(0134)       RETURN
(0135)       END                                             A        SO
```
