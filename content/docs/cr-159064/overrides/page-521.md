---
pdfPage: 521
folio: null
sectionId: "F.PHASE2"
kind: listing
source: reviewed
confidence: 90
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
C     **    W   W WWWWW W   W  WWW  WWWW     W                              **
C     **    WWWW  W   W WWWWW     W W       W                               **
C     **    W     W   W W   W W   W W      W                                **
C     **    W     W   W W   W  WWW  WWWWW WWWWW                             **
C     **                                                                    **
C     **********************************************************************
C     **********************************************************************
C
$INSERT COMMON
$INSERT SYSCOM>KEYS.F<
      INTEGER BUFF(38),BUF(80)
      INTEGER*4 JJ,MM,NN,LL,KK,NW,MN,TEN
      CALL OPEN
      JJ=0
      CALL COMINP(6HTTY   ,1)
10    READ(7,100,END=900) SYS,SHTN,(BUFF(I),I=1,31),EON,FOREV,REV,
     1     (BUFF(K),K=33,38)
100   FORMAT(2A4,A2,2I2,1X,31A1,1A4,A2,A2,A2,2X,3A1,1X,3A1)
      BUFF(32)=' '
      IF(BUFF(36).EQ.'S') GOTO 800
      REWIND 10
      WRITE(10,700) (BUFF(K),K=33,38)
700   FORMAT(2(1X,3A1,' '))
      REWIND 10
      READ(10,705,ERR=10) ((VEH(I,J),J=1,2),I=1,2)
705   FORMAT(2(1X,I3,A1))
      GO TO 707
800   CONTINUE
      REWIND 10
      WRITE(10,710) (BUFF(K),K=33,35)
710   FORMAT(1X,3A1,'S',1X,'000 ')
      REWIND 10
```
