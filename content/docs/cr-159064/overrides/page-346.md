---
pdfPage: 346
folio: null
sectionId: "D.GETWRD"
kind: listing
source: reviewed
confidence: 47.8
figures: []
listing:
  appendix: "D"
  routines: ["GETWROCBUFYNAME"]
  listingPage: 19
---
```fortran
(0205) C     FETCH ONE 'WORD' FROM BUFFER FILLED BY RDCOM
(0206) C
(0207) C
(0208)       SUBROUTINE  GETWRD(BUF,NAME,LEN)
(0209) C
(0210)       COMMON /X/ PEDL
(0211) C
(0212)       INTEGER BUF(1),PEDL,NAME(1),CHAR,
(0213)      +     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0214) C
(0215) C     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0216) C         ARE OCTAL
(0217) C     212,254,273,240,120240
(0218) C
(0219)       DATA ANL,ACOMMA,ASCOL/138,172,187/,
(0220)      +     ASP,ASPSP/160,2H  /
(0221) C
(0222)       DO 100 I=1,3
(0223) 100   NAME(I)=ASPSP
(0224) C
(0225)       N=1
(0226)       IF(BUF(1).NE.ASP) GO TO 200
(0227)       DO 999 I=2,77
(0228)       II=I-1
(0229)       BUF(II)=BUF(I)
(0230) 999   CONTINUE
(0231) 200   CHAR=BUF(PEDL)
(0232)       PEDL=PEDL+1
(0233)       IF(PEDL.GT.77)  RETURN
(0234)       IF(CHAR.EQ.ANL)  GOTO 400
(0235)       IF(CHAR.EQ.ASP.OR.CHAR.EQ.ACOMMA.OR.CHAR.EQ.ASCOL)  GOTO 300
(0236)       IF(N.GT.LEN)  GOTO 200
(0237)       I=(N+1)/2
(0238)       J=N-2*(N/2)
(0239)       N=N+1
(0240)       IF(J.EQ.1) GOTO 250
(0241)       NAME(I)=LT(NAME(I),8) + CHAR
(0242)       GOTO 200
```
