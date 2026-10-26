---
pdfPage: 258
folio: null
sectionId: "C.RDCOM"
kind: listing
source: ocr
confidence: 49.9
figures: []
listing:
  appendix: "C"
  routines: ["RDCOM"]
  listingPage: 29
---
```fortran
(0332) C     READ ONE LINE FROM CONSOLE OR COMMAND FILE                     a
(0333) C                                                              oo,
(0334)
(0335)       SUBROUTINE RDCOM( BUF)
(0336) C
(0337)       COMMON /X/ PEDL
(0338) C
(0339)       INTEGER BUF (1) ePEOL s CHAR oANL PAKILL»AERASE
(0340) C
(0341) C     ANLs AKILL» AERASE ARE OCTAL 2129 2779 242
(0342)       DATA  ANLsAKILLesAERASE/13941919136/
(0343) C
(0344)       PEOL=1
(0345) C 0.   N=1
(0346) 100   CALL CTIN(CHAR)
(0347)       BUF (N) =CHAR
(0348)       IF(CHARSEQ,ANL)  RETURN
(0349)       IF (CHAR.EQ.AKILL) GOTO 90
(0350)       IF(CHAR.EQ.AERASE)  GOTO 200
(0351)       N=N41
(0352)       IF(N.GT.77) GCTO 399
(0353)       GOTO 100
(0354) C
(0355) 200   IF(N.LE.2)  GOTO 90
(0356)       N=N-1
(0357)       GOTO 100
(0358) C
(0359) 999   ILF=:212
(0360)       CALL TIOU(ILF)
(0361)       RETURN
(0362)       END
```
