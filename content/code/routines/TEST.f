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
C     **    WWWWW WWWWW  WWW  WWWWW                                         **
C     **      W   W     W   W   W                                           **
C     **      W   WWWW   WWW    W                                           **
C     **      W   W         W   W                                           **
C     **      W   W     W   W   W                                           **
C     **      W   WWWWW  WWW    W                                           **
C     **                                                                    **
C     **********************************************************************
C     **********************************************************************
C
$INSERT COMMON
      KNT=0
      CALL OPEN
20    READ(6,END=1000) DRAW,TIT,PTIT,DT,SYS,VEH,SECT,NSHT,FREV,FNEO,
     1 FEOREF
      WRITE(7,100)DRAW,PTIT,DT,((VEH(I,J),J=1,2),I=1,2),NSHT,FREV,FNEO
100   FORMAT(1X,3A4,A2,3X,19A4,/,1X,3I2,5X,2(I3,A1,1X),4X,I2,5X,A2,5X,
     1 I2)
      WRITE(7,200) ((FEOREF(I,J),J=1,2),I=1,10)
200   FORMAT(10(1X,2A4),/,1X,'  '/)
      KNT=KNT+1
      GO TO 20
1000  WRITE(1,101) KNT
101   FORMAT(1X,'THERE ARE ',I4,' DRAWINGS'/)
      CALL CLOSE
      END
