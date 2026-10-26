---
pdfPage: 197
folio: null
sectionId: "B.ARCC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["ARCC"]
  listingPage: 182
---
```fortran
(2336)       CALL SRCH$$(K$DELE,'MEMO  ',6,0,0,0)
(2337)         CALL CNAM$$('REVS  ',6,'MEMO  ',6,IC)
(2338)       GO TO 500
(2339) 455   IF(IN.NE.12) GOTO 460
(2340)       CALL SRCH$$(K$CLOS,'TWFX  ',6,0,0,0)
(2341)       CALL SRCH$$(K$DELE,'TWFX  ',6,0,0,0)
(2342)         CALL CNAM$$('REVS  ',6,'TWFX  ',6,IC)
(2343)       GO TO 500
(2344) 460   IF(IN.NE.13) GOTO 465
(2345)       CALL SRCH$$(K$CLOS,'ANN   ',6,0,0,0)
(2346)       CALL SRCH$$(K$DELE,'ANN   ',6,0,0,0)
(2347)         CALL CNAM$$('REVS  ',6,'ANN   ',6,IC)
(2348)       GO TO 500
(2349) 465   IF(IN.NE.14) GOTO 470
(2350)       CALL SRCH$$(K$CLOS,'PR    ',6,0,0,0)
(2351)       CALL SRCH$$(K$DELE,'PR    ',6,0,0,0)
(2352)         CALL CNAM$$('REVS  ',6,'PR    ',6,IC)
(2353)       GO TO 500
(2354) 470   IF(IN.NE.15) GO TO 475
(2355)       CALL SRCH$$(K$CLOS,'MIS   ',6,0,0,0)
(2356)       CALL SRCH$$(K$DELE,'MIS   ',6,0,0,0)
(2357)         CALL CNAM$$('REVS  ',6,'MIS   ',6,IC)
(2358)       GO TO 500
(2359) 475   WRITE(1,480)
(2360) 480   FORMAT(' AN ERROR IN FILE MANAGEMENT SYSTEM HAS OCCURRED!',/
(2361)      1,' PLEASE CALL OPERATOR EXT.2621')
(2362) 500   CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(2363)       RETURN
(2364)       END
```
