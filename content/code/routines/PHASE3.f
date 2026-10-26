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
210   INEO=INEO*1
      IF(INEO.GE.11) GOTO 10
        FEOREF (INEQ92)=E£0N(62)
10     READ (IG69ENO=8000) ORW,ETIT oEPTIT,FIRST, SECOND REV eLOVEH, EONN,K
C      DRW=DRAW    TIT=ETIT    PTIT=EPTIT
C      SHTN= FIRST & SECOND    FREV=REV
C      VEH=EOVEH   EQNSEONN  EOREV= R
C     XXXXXXXXXKXKX BULLO OATA BASE DRAWs -SHEETe £0
       DO 100 I=194
       IF(ORW(I) NE sDRAW(I)) GOTO S000
100    CONTINUE
        IF (FIRST CE GeL .AND.SECOND.EQ.0) GUTO 6000
      IF (SHTNG1).EQ.FIRST.AND.SHTING2) o£ QeSECOND) GOTO 10
         SHTN(1)=FIRST
         GO 10 10
6000  IF(EGQNN(1).EQ.®  *) GOTO 10
      IF(INEO.EQ.0) GOTO 6016
      DO 6001 I=1L92
      IF (FEOREFCINEO,1).NE.EONN(I)) GOTO 6010 |
6001  CONTINUE                                                      .
      GO To 19
6010  INEO=INEO+1                                   AN
      IF (INEO,GE-11) GOTO 10
       FEOREF(INEO 91 )=EONN(L)
       FEOREF(INEO 92) =EONN(2)
       GO TO 10
5000   WRITE(G) DRAW,TIT,PTIT eL DD,SYS,VEH,SECTeDDJ,FREV,INEQ,FEOREF .
       DO 15 I=1421
15     CONTINUE
       DO 20 1=1919
20     CONTINUE
       DO 30 I=104
30     CONTINUE
       DO 40 1=192
       DO 35 J=1e2
       VEH( TeD) =EOVEH (I oJ)
35     CONTINUE
40     CONTINUE
       EOREVE=R
       EON(2)=EONN(2)
       FREV=REV
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
