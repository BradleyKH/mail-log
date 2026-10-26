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
      READ(10,705,ERR=10) ((VEH(I,J),J=1,2),I=1,2)
707   CONTINUE
      REWIND 13
      WRITE(13,750) (BUFF(K),K=1,32)
750   FORMAT(1X,32A1)
      REWIND 13
      READ(13,760,ERR=10) PTIT
760   FORMAT(1X,19A4)
      REWIND 13
      TEN=0
      DO 805 I=1,80
      BUF(I)=' '
805   CONTINUE
      NW=2
      MN=2
      BUF(1)=BUFF(1)
      DO 810 MM=2,31
      IF(MN.LE.80) GOTO 811
      MM=31
      GO TO 810
811   IF(TEN.EQ.0) GOTO 815
      IF(BUFF(MM).EQ.' '.OR.BUFF(MM).EQ.',') TEN=0
      GO TO 810
815   IF(BUFF(MM).EQ.' '.OR.BUFF(MM).EQ.',') GOTO 820
      BUF(MN)=BUFF(MM)
      MN=MN+1
      NW=NW+1
      IF(NW.LE.10) GOTO 810
      NW=1
      MN=MN+1
      TEN=1
      GO TO 810
820   LL=(10-NW)+1
      NN=MN+LL
      MN=NN+1
      NW=1
810   CONTINUE
      REWIND 13
      WRITE(13,840) (BUF(I),I=1,80)
840   FORMAT(1X,80A1)
      REWIND 13
      READ(13,850) TIT
850   FORMAT(7(1X,2A4,A2))
      REWIND 13
      DRW(1)=SYS(1)
      DRW(2)=SYS(2)
      DRW(3)=SYS(3)
      DRW(4)='    '
C102  WRITE(1,500) DRW,SHTN,EON,EOREV,REV,((VEH(I,J),J=1,2),
C     8 I=1,2),PTIT,TIT
C500  FORMAT(1X,4A4,3X,2(I2,1X),3X,1A4,A2,3X,A2,3X,A2,
C    8   BXeZCUNe LBeAL oS elke l9Ad e/a TCUKe2A4 oA2) of al Xe lHO)
200   JUTDJeL.
C       URITECLEIDRWe TIT ePTIT oSHTNoREVeVE He LONG EOREV
      GO TO 10
C 900° CALL SRCHSSCKSCLOSe*NEW *%96909000)
      CALL SRCH$$(KSCLOS» *VV  6009000)
      CALL SRCH$$(KSCELE, *VV    96909090).
         CALL SRCH$$(KSCLOSs*TITLES* 06009000)
       CALL. SRCHSS(KSDELE, *TIILES 96909000)
         CALL SRCH$$(KSCLOSe*FINAL %e6909000)-
      WRITE(1,1000) UD
1000  FORMAT(1XeI4e' RECOROS'/)
      CALL EXIT
      END
