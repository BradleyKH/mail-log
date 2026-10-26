---
pdfPage: 204
folio: null
sectionId: "B.UPDATE"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["UPDATE"]
  listingPage: 189
---
```fortran
(2387) 155   CONTINUE
(2388)       GO TO 200
(2389) 160   WRITE(1,165)DDD
(2390) 165   FORMAT(1X,'ACTION DUE DATE:',2X,2(I2,'-'),I2,/,
(2391)      1 1X,'ENTER NEW DUE DATE (IF NONE, REPEAT OLD DATE)'/)
(2392)       READ(1,170,ERR=160)DDD
(2393) 170   FORMAT(3I2)
(2394)       IF(DDD(1).LE.0.OR.DDD(1).GE.13) GOTO 160
(2395)       IF(DDD(2).LE.0.OR.DDD(2).GE.32) GOTO 160
(2396) 200   WRITE(8)DA,DL,DPT,D,KT,DDD,DF,DE
(2397)       GO TO 100
(2398) 300   CALL SRCH$$(K$CLOS,'ACTD  ',6,0,0,0)
(2399)       CALL SRCH$$(K$CLOS,'REVS  ',6,0,0,0)
(2400)       CALL SRCH$$(K$DELE,'ACTD  ',6,0,0,0)
(2401)       CALL CNAM$$('REVS  ',6,'ACTD  ',6,IC)
(2402)       CALL SRCH$$(K$RDWR+K$NDAM,'ACTD  ',6,5,1,IC)
(2403)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(2404)       REWIND 8
(2405)       REWIND 9
(2406)       FINISH=0
(2407) 600   CONTINUE
(2408) 605   READ(9,END=700) DA,DL,DPT,D,KT,DDD,DF,DE
(2409)       GO TO 605
(2410) 700   RETURN
(2411)       END
```
