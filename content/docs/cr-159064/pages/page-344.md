---
pdfPage: 344
folio: null
sectionId: "D.RDCOM"
kind: listing
source: ocr
confidence: 36.3
figures: []
listing:
  appendix: "D"
  routines: ["RDCOM"]
  listingPage: 17
---
```fortran
(0174)       READ ONE LINE FROM CONSOLE OR COMMANO FILE
(0175)
(0176) C
(0177)       SUBROUTINE RDCOM(SUF)
(0178) C                                                                    a
(0179)       COMMON /X/ PEDL     A
(0180) C
(0181)       INTEGER BUF (1) 9PEDL eCHAR sANL PAKILLOAERASE
(0182) C
(0183) C     ANL» AKILLs AELRASE ARE OCTAL 2129 277s 242      oe
(0184)       DATA  ANL GAKILL PAERASE/13891919136/
(0185)                                                                      We
(0186)        PEDL=1                                 :                       A
(0187) 906   N=2
(0188) 100   CALL CTIN(HAR)
(0189)       BUF (N)=CHAR                          7
(0190)       IF(CHARSEG.ANL)  RETURN
(0191)       IF (CHAR e=G,AKILL) “GCTO 90.
(0192)       IF (CHARSEG,AERASE) GOTO 200
(0193) C 0°: N=N+1                                                 i
(0194)       IF(N.GT.77) GOTO 999
(0195)       GOTO 100
(0196) C                                  7
(0197)       IF(N.LE.2)  GOTO 90
(0198)       N=N-1
(0199)       GOTO 100
(0200) C          oo,                            So,             oe
(0201) 999   ILF=:212
(0202)       CALL TIOU(ILF).
(0203)       RETURN
(0204)       END
```
