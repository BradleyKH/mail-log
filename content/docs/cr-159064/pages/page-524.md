---
pdfPage: 524
folio: null
sectionId: "F.PHASE3"
kind: listing
source: reviewed
confidence: 85
figures: []
listing:
  appendix: "F"
  routines: ["OPEN"]
  listingPage: null
---
```fortran
C     **********************************************************************
C     **********************************************************************
C     **                                                                    **
C     **                                                                    **
C     **    WWWW  W   W W   W                                               **
C     **    W   W W  W  W   W                                               **
C     **    W   W W W   WWWWW                                               **
C     **    W   W W W   W   W                                               **
C     **    W   W W  W  W   W                                               **
C     **    WWWW  W   W W   W                                               **
C     **                                                                    **
C     **                                                                    **
C     **    WWWW  W   W  WWW   WWW  WWWWW  WWW                              **
C     **    W   W W   W W   W W   W W     W   W                             **
C     **    W   W WWWWW W   W  WWW  WWWW      W                             **
C     **    WWWW  W   W WWWWW     W W       WW                              **
C     **    W     W   W W   W W   W W         W                             **
C     **    W     W   W W   W  WWW  WWWWW W   W                             **
C     **                                                                    **
C     **********************************************************************
C     **********************************************************************
$INSERT COMMON
$INSERT SYSCOM>KEYS.F
      INTEGER*4 EONN(2)
      INTEGER*2 IDD(3),JJ
      CALL OPEN
      CALL COMINP(6HTTY   ,1)
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
      READ(16) DRAW,TIT,PTIT,SHTN,FREV,VFH,EON,EOREV
200   IF(EON(1).EQ.'    ') GOTO 10
      IF(INEO.EQ.0) GOTO 210
      DO 201 I=1,2
      IF(FEOREF(INEO,I).NE.EON(I)) GOTO 210
201   CONTINUE
      GO TO 10
```
