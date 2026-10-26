---
pdfPage: 260
folio: null
sectionId: "C.GETWRD"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["GETWRD"]
  listingPage: 31
---
```fortran
(0363) C     FETCH ONE 'WORD' FROM BUFFER FILLED BY RDCOM
(0364) C
(0365) C
(0366)       SUBROUTINE  GETWRD(BUF,NAME,LEN)
(0367) C
(0368)       COMMON /X/ PEDL
(0369) C
(0370)       INTEGER BUF(1),PEDL,NAME(1),CHAR,
(0371)      +     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0372) C
(0373) C     ANL,ACOMMA,ASCOL,ASP,ASPSP
(0374) C         ARE OCTAL
(0375) C     212,254,273,240,120240
(0376) C
(0377)       DATA ANL,ACOMMA,ASCOL/138,172,187/,
(0378)      +     ASP,ASPSP/160,2H  /
(0379) C
(0380)       DO 100 I=1,3
(0381) 100   NAME(I)=ASPSP
(0382) C
(0383)       N=1
(0384)       IF(BUF(1).NE.ASP) GO TO 200
(0385)       DO 999 I=2,77
(0386)       II=I-1
(0387)       BUF(II)=BUF(I)
(0388) 999   CONTINUE
(0389) 200   CHAR=BUF(PEDL)
(0390)       PEDL=PEDL+1
(0391)       IF(PEDL.GT.77)  RETURN
(0392)       IF(CHAR.EQ.ANL)  GOTO 400
(0393)       IF(CHAR.EQ.ASP.OR.CHAR.EQ.ACOMMA.OR.CHAR.EQ.ASCOL)  GOTO 300
(0394)       IF(N.GT.LEN)  GOTO 200
(0395)       I=(N+1)/2
(0396)       J=N-2*(N/2)
(0397)       N=N+1
(0398)       IF(J.EQ.1) GOTO 250
(0399)       NAME(I)=LT(NAME(I),8) + CHAR
(0400)       GOTO 200
```
