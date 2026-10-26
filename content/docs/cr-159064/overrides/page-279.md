---
pdfPage: 279
folio: null
sectionId: "C.TITDR"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["TITDR"]
  listingPage: 50
---
```fortran
(0619)       CALL SRCH$$(K$RDWR+K$NDAM,'T1    ',6,7,ITY,IC)
(0620)       CALL SRCH$$(K$RDWR+K$NDAM,'T2    ',6,8,ITY,IC)
(0621)       IF(T1.EQ.0) IN=6
(0622)       IF(T1.EQ.0) IO=11
(0623)       IF(T1.EQ.1) IN=11
(0624)       IF (T1.EQ.1)IO=12
(0625)       IF(T1.EQ.2) IN=12
(0626)       IF(T1.EQ.2) IO=11
(0627)       IF(T1.EQ.3) IN=11
(0628)       IF(T1.EQ.3) IO=12
(0629)       IF(T1.EQ.4) IN=12
(0630)       IF(T1.EQ.4) IO=11
(0631)       DOC=0
(0632)       REWIND IN
(0633)       REWIND IO
(0634) 5     READ(IN,END=100)TIT,PTIT,DIR,DT,SYS,WAN,VEH,REV,RDAT
(0635)       BLNK='    '
(0636)       DO 3 I=1,21
(0637)       IF(TIT(I).EQ.BLNK) GO TO 3
(0638)       IF(TIT(I).NE.IT(1)) GO TO 3
(0639)       IF(TIT(I+1).EQ.BLNK) GO TO 4
(0640)       IF(IT(2).EQ.BLNK) GO TO 4
(0641)       IF(TIT(I+1).EQ.IT(2)) GO TO 4
(0642) 3     CONTINUE
(0643)       GO TO 5
(0644) 4     DOC=DOC+1
(0645)       WRITE(IO)TIT,PTIT,DIR,DT,SYS,WAN,VEH,REV,RDAT
(0646)       WRITE(1,10)TIT
(0647) 10    FORMAT(1X,7(2A4,A2,1X))
(0648)       GO TO 5
(0649) 100   WRITE(1,1030)DOC,IT
(0650) 1030  FORMAT(' THERE ARE',I5,' DOCUMENTS CONTAINING THE WORD',/
(0651)      17(1X,2A4,A2)//)
(0652)       IF(DOC.EQ.0) GOTO 1020
(0653)       ENDFILE IO
(0654)       CALL SRCH$$(K$CLOS,'T1    ',6,0,0,0)
(0655)       CALL SRCH$$(K$CLOS,'T2    ',6,0,0,0)
(0656)       IF(IO.EQ.11) CALL SRCH$$(K$DELE,'T2    ',6,0,0,0)
```
