---
pdfPage: 349
folio: null
sectionId: "D.GETWD"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "D"
  routines: ["GETWD"]
  listingPage: 22
---
```fortran
(0256)       SUBROUTINE  GETWD(BUFF,NAME)
(0257) C
(0258)       COMMON /X/ PEDL
(0259) C
(0260)       INTEGER BUFF(1),PEDL,NAME(1),CHAR,
(0261)      +     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0262) C
(0263) C     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0264) C         ARE OCTAL
(0265) C     212,254,273,240,120240
(0266) C
(0267)       DATA ANL,ACOMMA,ASCOL/138,172,187/,
(0268)      +     ASP,ASPSP/160,2H  /
(0269) C
(0270)       DO 100 I=1,19
(0271) 100   NAME(I)=ASPSP
(0272) C
(0273)       N=1
(0274)       IF(BUFF(1).NE.ASP) GO TO 200
(0275)       DO 999 I=2,77
(0276)       II=I-1
(0277)       BUFF(II)=BUFF(I)
(0278) 999   CONTINUE
(0279) 200   CHAR=BUFF(PEDL)
(0280)       PEDL=PEDL+1
(0281)       IF(PEDL.GT.77)  RETURN
(0282)       IF(CHAR.EQ.ANL)  GOTO 400
(0283)       I=(N+1)/2
(0284)       J=N-2*(N/2)
(0285)       N=N+1
(0286)       IF(J.EQ.1) GOTO 250
(0287)       NAME(I)=LT(NAME(I),8) + CHAR
(0288)       GOTO 200
(0289) 250   NAME(I)= RT(NAME(I),8) + LS(CHAR,8)
(0290)       GOTO 200
(0291) C
(0292) C
(0293) 400   PEDL=77
```
