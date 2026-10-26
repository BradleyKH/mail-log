---
pdfPage: 483
folio: null
sectionId: "D.INPSS"
kind: listing
source: ocr
confidence: 50.3
figures: []
listing:
  appendix: "D"
  routines: ["INPSS"]
  listingPage: 156
---
```fortran
(2282)        SUBROUTINE INPSS
(2283)
(2283) C     COMMON BLOCK FOR THE ORAW-EO FILE
(2283) C
(2283)       COMMON DRAW,TIT,PTIT,DT,SYS,VEH,SECT oNSHT,FREV oF NEO oF EOREF 9
(2283)      1       ORWe SHTNeREVe NEOs EOREF 4
(2283)      1       EONsETIToEPTIT sEOREVeEDTSEROTSEOVEHS
(2283)      1       Re lORs INEQeKNToFIRSTsSECONDeTTIT
(2283) C                                                                  Lo
(2283)       DATA DECLARATION BLOCK FOR THE DRAW-EO FILE
(2283) C
(2283)       INTEGER*4 DRAW(4) eTIT(21) oPTIT(19) oSYS(3) (SECTC3) sFEOREF(1002)(
(2283)      1          DRU(4) sEOREF (C1002) 9EPTITC19) s9ETITC21)9 es EON( 2) 9
(2283)      1          IDRO4S) ¢KNTsTTIT(19)
(2283)       INTEGER*2 DT(3) sVEH (C262) sNSHT eSHTN(2) @FREV,FNEQGREVANEO
(2283)      1           FOREVsEDT(C3) eERDT(3) sEOVEH( 292) eRe INEOs
(2283)      1           FIRST»SECOND
(2283) C
(2283) C                                      os
(2284) 1000  WRITE(1,1001)
(2285) 1001  FORMAT(' ENTER THE FOLLOWING DATA: '%o/o' SHEETH 1%9/5' REVISIONS,
(2286)      1    IF NONE» NC%o/ett  fs)
(2287)       READC1,1003(ERR=1000)FREV
(2288) 1003  FORMAT(IXsA2)                       .
(2289) 1005  WRITE(151006)
(2290) 1006  FORMAT(' NUMBER DOF EoOe''Sto/q%! !8/)
(2291)       READ (1,1008,ERR=1005)FNEO
(2292) 1008  FORMAT(1X912)
(2293)        DO 1009 I=1910
(2294) C      DO 1010 Joil,s2-
(2295)        FEOREF(I9J)=°
(2296) 1010   CONTINUE
(2297) 1009   CONTINUE
(2298)       IF(FNEO.EQ.0) GOTO 1200
(2299)       WRITE(142502)
(2300)       DO 1200 K=19FNEO
(2301) 1201  WRITE(152510)                          L,           A
(2302)       READ (1925209 ERR=1201) (FEOREF (K,L) oH =192)
```
