---
pdfPage: 495
folio: null
sectionId: "D.SHTADD"
kind: listing
source: reviewed
confidence: 47.2
figures: []
listing:
  appendix: "D"
  routines: ["SHTADD"]
  listingPage: 168
---
```fortran
(2410)       WRITE(14)DRW,SHTN,REV,NEO,EOREF
(2411)       FINISH=1
(2412) 100   READ(12,END=200)DRW,SHTN,REV,NEO,EOREF
(2413)       IF(FINISH.EQ.0) GOTO 16
(2414) 105   WRITE(14)DRW,SHTN,REV,NEO,EOREF
(2415)       GO TO 100
(2416) 200   CALL SRCH$$(K$CLOS,'SHEET ',6,0,0,0)
(2417)       CALL SRCH$$(K$CLOS,'STEMP ',6,0,0,0)
(2418)       CALL SRCH$$(K$DELE,'SHEET ',6,0,0,0)
(2419)       CALL CNAM$$('STEMP ',6,'SHEET ',6,IC)
(2420)       CALL SRCH$$(K$RDWR+K$NDAM,'SHEET ',6,8,1,IC)
(2421)       RETURN
(2422)       END
```
