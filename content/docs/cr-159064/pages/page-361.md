---
pdfPage: 361
folio: null
sectionId: "D.SEADW"
kind: listing
source: reviewed
confidence: 45.4
figures: []
listing:
  appendix: "D"
  routines: ["SEADW"]
  listingPage: 34
---
```fortran
(0446)      5'SYSTEM                 SYS',/
(0447)      1'VEHICLE                VEH',/
(0448)      1'SECTION                SECT',/
(0449)      1'VENDOR CODE            CODE',/
(0450)      1'ALL                    ALL',/
(0451)      1'REV ACTION DUE         ACT',/
(0452)      1'E.O. NUMBER            EO',/
(0453)      1'QUIT                   QUIT',/
(0454)      1'  PLEASE SELECT THE DESIRED MODE',//)
(0455)       REWIND 6
(0456) 6     READ(1,3)IDES
(0457) 3     FORMAT(1A2)
(0458)       IF(IDES.EQ.'QU') GOTO 10
(0459) 100   WRITE(1,110)
(0460) 110   FORMAT(1X,'DO YOU DESIRE THE OPTIONAL BRIEF OUTPUT',/,
(0461)      1'   RECOMMENDED FOR ALL AND ACTION DUE SEARCHES',/,
(0462)      1' (YES OR NO)'/)
(0463)       READ(1,3)IOPT
(0464)       IF(IOPT.EQ.'NO') GOTO 111
(0465)       IF(IOPT.NE.'YE') GOTO 100
(0466)       R=1
(0467) 111   IF(IDES.EQ.'TI') CALL TITDW
(0468)       IF(IDES.EQ.'AL') CALL ALDW
(0469)       IF(IDES.EQ.'AC') CALL ACTDUE
(0470)       IF(IDES.EQ.'DR') CALL DRAWN
(0471)       IF(IDES.EQ.'DA') CALL DATOW
(0472)       IF(IDES.EQ.'SY') CALL SYSDW
(0473)       IF(IDES.EQ.'VE') CALL VEHND
(0474)       IF(IDES.EQ.'SE') CALL SECTN
(0475)       IF(IDES.EQ.'CO') CALL CODE
(0476)       IF(IDES.EQ.'EO') CALL EONN
(0477) 99    WRITE(1,98)
(0478) 98     FORMAT(' TO CONTINUE, DEPRESS THE RETURN KEY'/)
(0479)       READ(1,9999)IDES
(0480)       IF(IDES.NE.'  ') GOTO 99
(0481)       CALL CLEAR
(0482)       WRITE(1,1)
(0483)       REWIND 6
```
