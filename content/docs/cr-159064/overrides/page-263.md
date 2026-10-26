---
pdfPage: 263
folio: null
sectionId: "C.GETWD"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["GETWD"]
  listingPage: 24
---
```fortran
(0414)       SUBROUTINE  GETWD(BUFF,NAME)
(0415) C
(0416)       COMMON /X/ PEDL
(0417) C
(0418)       INTEGER BUFF(1),PEDL,NAME(1),CHAR,
(0419)      +     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0420) C
(0421) C     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0422) C         ARE OCTAL
(0423) C     212,254,273,240,120240
(0424) C
(0425)       DATA ANL,ACOMMA,ASCOL/138,172,187/,
(0426)      +     ASP,ASPSP/160,2H  /
(0427) C
(0428)       DO 100 I=1,19
(0429) 100   NAME(I)=ASPSP
(0430) C
(0431)       N=1
(0432)       IF(BUFF(1).NE.ASP) GO TO 200
(0433)       DO 999 I=2,77
(0434)       II=I-1
(0435)       BUFF(II)=BUFF(I)
(0436) 999   CONTINUE
(0437) 200   CHAR=BUFF(PEDL)
(0438)       PEDL=PEDL+1
(0439)       IF(PEDL.GT.77)  RETURN
(0440)       IF(CHAR.EQ.ANL)  GOTO 400
(0441)       I=(N+1)/2
(0442)       J=N-2*(N/2)
(0443)       N=N+1
(0444)       IF(J.EQ.1) GOTO 250
(0445)       NAME(I)=LT(NAME(I),8) + CHAR
(0446)       GOTO 200
(0447) 250   NAME(I)= RT(NAME(I),8) + LS(CHAR,8)
(0448)       GOTO 200
(0449) C
(0450) C
(0451) 400   PEDL=77
```
