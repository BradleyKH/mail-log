---
pdfPage: 506
folio: null
sectionId: "D.NEQADD"
kind: listing
source: reviewed
confidence: 31.5
figures: []
listing:
  appendix: "D"
  routines: ["NEOADD"]
  listingPage: 179
---
```fortran
(2521)       DO 250 J=1,IANS
(2522) 12    WRITE(1,13)
(2523) 13    FORMAT(' WHAT IS THE SHEET NUMBER:  EXAMPLE SHEET# 2.1   !02!!10!'  ! [?]
(2524)      1,/,'!  !!  !'/)  ! [?]
(2525)       READ(1,15,ERR=12)(ISHT(N),N=1,2)
(2526) 15    FORMAT(1X,I2,2X,I2)
(2527)       IF(ISHT(1).LE.0) GOTO 12
(2528)       IF(ISHT(1).EQ.1.AND.ISHT(2).EQ.0) GOTO 255
(2529)       CALL SRCH$$(K$RDWR+K$NDAM,'STEMP ',6,10,1,IC)
(2530)       FINISH=0
(2531)       REWIND 12
(2532) 10    READ(12,END=200)DRW,SHTN,REV,NEO,EOREF
(2533)       IF(FINISH.EQ.1) GOTO 100
(2534)       DO 20 L=1,4
(2535)       IF(IDR(L).NE.DRW(L)) GOTO 100
(2536) 20    CONTINUE
(2537)       DO 25 N=1,2
(2538)       IF(ISHT(N).NE.SHTN(N)) GOTO 100
(2539) 25    CONTINUE
(2540)       NEO=NEO+1
(2541)       IF(NEO.EQ.4) WRITE(1,30) (ISHT(N),N=1,2),DRW
(2542)       IF(NEO.EQ.5) WRITE(1,40) (ISHT(N),N=1,2),DRW
(2543)       IF(NEO.GE.6) WRITE(1,50) (ISHT(N),N=1,2),DRW,NEO
(2544) 30    FORMAT(1X,54('*'),/,' WARNING!!! SHEET# ',I2,'.',I2,' FOR DRAWING
(2545)      1',3A4,A2,/,12X,'NOW HAS FOUR E.O.''S',/,1X,54('*'))
(2546) 40    FORMAT(1X,61('*'),/,' ATTENTION!!! SHEET# ',I2,'.',I2,' FOR DRAWIN
(2547)      1G ',3A4,A2,/,' NOW HAS THE MAXIMUM ALLOWABLE OF FIVE E.O.''S',/,
(2548)      11X,61('*'))
(2549) 50    FORMAT(1X,75('*'),/,' ATTENTION!!!  IMPORTANT!!!  REVISION PAST',
(2550)      1'DUE!!  IMMEDIATE ACTION REQUIRED!!',/,' SHEET#',I2,'.',I2,' FOR D
(2551)      1RAWING ',3A4,A2,' NOW HAS ',I2,' E.O.''S',/,1X,75('*'))
(2552)       DO 150 K=1,2
(2553)       EOREF(NEO,K)=EON(K)
(2554) 150   CONTINUE
(2555)       IF(J.EQ.IANS) FINISH=1
(2556) 100   WRITE(14) DRW,SHTN,REV,NEO,EOREF
(2557)       GO TO 10
(2558) 255   CONTINUE
```
