---
pdfPage: 36
folio: null
sectionId: "B.GETWD"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["GETWD"]
  listingPage: 20
---
```fortran
(0262)       SUBROUTINE  GETWD(BUFF,NAME)
(0263) C
(0264)       COMMON /X/ PEDL
(0265) C
(0266)       INTEGER BUFF(1),PEDL,NAME(1),CHAR,
(0267)      +     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0268) C
(0269) C     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0270) C         ARE OCTAL
(0271) C     212,254,273,240,120240
(0272) C
(0273)       DATA ANL,ACOMMA,ASCOL/138,172,187/,
(0274)      +     ASP,ASPSP/160,2H  /
(0275) C
(0276)       DO 100 I=1,19
(0277) 100   NAME(I)=ASPSP
(0278) C
(0279)       N=1
(0280)       IF(BUFF(1).NE.ASP) GO TO 200
(0281)       DO 999 I=2,77
(0282)       II=I-1
(0283)       BUFF(II)=BUFF(I)
(0284) 999   CONTINUE
(0285) 200   CHAR=BUFF(PEDL)
(0286)       PEDL=PEDL+1
(0287)       IF(PEDL.GT.77)  RETURN
(0288)       IF(CHAR.EQ.ANL)  GOTO 400
(0289)       I=(N+1)/2
(0290)       J=N-2*(N/2)
(0291)       N=N+1
(0292)       IF(J.EQ.1) GOTO 250
(0293)       NAME(I)=LT(NAME(I),8) + CHAR
(0294)       GOTO 200
(0295) 250   NAME(I)= RT(NAME(I),8) + LS(CHAR,8)
(0296)       GOTO 200
(0297) C
(0298) C
(0299) 400   PEDL=77
```
