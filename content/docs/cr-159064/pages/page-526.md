---
pdfPage: 526
folio: null
sectionId: "F.PHASE3"
kind: listing
source: reviewed
confidence: 88
figures: []
listing:
  appendix: "F"
  routines: ["OPEN", "BSHT"]
  listingPage: null
---
```fortran
      SHTN(2)=SECOND
      DO 42 I=1,10
      DO 43 J=1,2
      FEOREF(I,J)='    '
43    CONTINUE
42    CONTINUE
      JJ=1
      INEO=0
      GO TO 200
8000  REWIND 16
      WRITE(6)DRAW,TIT,PTIT,IDD,SYS,VEH,SECT,JJ,FREV,INEO,FEOREF
      CALL SRCH$$(K$CLOS,'DRAW  ',6,0,0,0)
      CALL BSHT
      END
      SUBROUTINE OPEN
$INSERT SYSCOM>KEYS.F
      CALL SRCH$$(K$RDWR+K$NDAM,'DRAW  ',6,2,1,IC)
      CALL SRCH$$(K$RDWR+K$NDAM,'FINAL ',6,12,1,IC)
      CALL SRCH$$(K$RDWR+K$NDAM,'DDATE ',6,10,1,IC)
      REWIND 6
      REWIND 16
      REWIND 14
      RETURN
      END
      SUBROUTINE BSHT
$INSERT COMMON
$INSERT SYSCOM>KEYS.F
      INTEGER*4 EONN(2)
      INTEGER*2 IDD(3),JJ
      CALL OPENN
      INEO=0
      JJ=1
      DO 5 I=1,10
      DO 4 J=1,2
      FEOREF(I,J)='    '
4     CONTINUE
5     CONTINUE
      DO 6 I=1,3
      SYS(I)='    '
      SECT(I)='    '
6     CONTINUE
      REWIND 14
      READ(14,50) (IDD(I),I=1,3)
50    FORMAT(1X,3I2)
8510  READ(16,END=7000) DRW,TIT,PTIT,SHTN,FREV,VFH,EON,EOREV
      IF(SHTN(1).EQ.1.AND.SHTN(2).EQ.0) GOTO 8510
      WRITE(12)DRW,SHTN,FREV,EON
      GO TO 8510
7000  INEO=0
      DO 7040 I=1,10
      DO 7050 J=1,2
      FEOREF(I,J)='    '
7050  CONTINUE
7040  CONTINUE
```
