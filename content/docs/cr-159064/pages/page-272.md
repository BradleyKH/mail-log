---
pdfPage: 272
folio: null
sectionId: "C.SHOWDR"
kind: listing
source: ocr
confidence: 33
figures: []
listing:
  appendix: "C"
  routines: ["SHOWDR"]
  listingPage: 43
---
```fortran
(0522)        SUBROUTINE SHOWDR
(0523)
(0523) C     COMMON BLOCK FOR THE DIR FILE
(0523) C
(0523)       COMMON TIT,FTIT,DI2,RPT,DT,SYS,WAN,CON,I O, VEH,ACTOR
(0523)       COMMON COMP sREV,RDAT GWA
(0523)
(0523) C
(0523) C     DATA DECLARATION 8LOCK FOR THE DIR FILE
(0523) C                                          mo,
(0523)       INTEGER®4 TIT(21) oF TIT(L9) DIR (4) 9RPT(4) oSYS(3) 9CON(S) ID GACT
(0523)       INTEGER *4 COMP(21)
(0523)       INTEGER #2 DT(3) sWAN(4) VEH( 292) 9RoREVORDAT (CZ) PWA(4)
(0523) C
(0524) C
(0525)        CALL CLEAR
(0526)        WRITE(1,10). TIT
(0527) 10     FORMAT(2Xe% le TITLES eS o2Xe TCIXefA49A2))
(0528)         WRITE (1,20)DI R,OT,SYS
(0529)  20    FORMAT(2X9%26  Ma BAGgAZeSXah Se e229  %—9) gl 2G13Xo
(0530)       194. %eB(ILX9A4D)
(0531)         WRITE (L, SOWAN, COVEH( I oJ) oJ=L02) 612192)
(0532) 30     FORMAT(2Xs'Se  Soh A2e11Xe'6o  %o2C1XeT3eA191X))
(0533)        WRITE(1,4C0)REVGRDAT                            .
(0534) 40     FORMAT(2Xe%7e MelASgl7TXe'Be %e2C129%=%) 4 J2)
(0535)         RETURN
(0536)         END
```
