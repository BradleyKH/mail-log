---
pdfPage: 280
folio: null
sectionId: "C.TITDR"
kind: listing
source: reviewed
confidence: 96
figures: []
listing:
  appendix: "C"
  routines: ["TITDR"]
  listingPage: 51
---
```fortran
(0657)       IF(IO.EQ.12) CALL SRCH$$(K$DELE,'T1    ',6,0,0,0)
(0658)       T1=T1+1
(0659) 1000  CONTINUE
(0660) 1002  CALL SRCH$$(K$RDWR+K$NDAM,'T1    ',6,7,ITY,IC)
(0661)        CALL SRCH$$(K$RDWR+K$NDAM,'T2    ',6,8,ITY,IC)
(0662)       IF(DOC.LT.1) GO TO 1020
(0663)       DO 9999 I=1,DOC
(0664)       READ(IO,END=1020)TIT,PTIT,DIR,DT,SYS,WAN,VEH,REV,RDAT
(0665)       CALL FMAIN
(0666) 9999  CONTINUE
(0667) 1020  CONTINUE
(0668)       CALL SRCH$$(K$CLOS,'T1    ',6,0,0,0)
(0669)       CALL SRCH$$(K$CLOS,'T2    ',6,0,0,0)
(0670)       CALL SRCH$$(K$DELE,'T1    ',6,0,0,0)
(0671)       CALL SRCH$$(K$DELE,'T2    ',6,0,0,0)
(0672)       T1=0
(0673)       IF(DOC.NE.0) RETURN
(0674) 1999   WRITE(1,2000)
(0675) 2000   FORMAT(' DO YOU WISH TO TRY THE TITLE SEARCH AGAIN (YES OR NO)')
(0676)        READ(1,2001)IOPT
(0677) 2001   FORMAT(1A2)
(0678)       IF(IOPT.EQ.'YE') GOTO 1001
(0679)       IF(IOPT.NE.'NO') GOTO 1999
(0680)       RETURN
(0681)       END
```
