      SUBROUTINE WANUM
C
C     COMMON BLOCK FOR THE DIR FILE
C
      COMMON TIT,PTIT,DIRoRPT,DTYSYS,WAN,CONGID,VEH,ACTSR
      COMMON COMP sREV,RDAT GWA
C
      DATA DECLARATION BLOCK FOR THE DIR FILE
C
      INTEGER*#4 TIT(21) oP TIT(19) DIR (4) eRPT(4) 9SYS(3) eCON(S) eID,ACT
      INTEGER*4 COMP(21)
      INTEGER *2 DT(3) WAN(C4) oVEH(Z92) eR,REV, RDAT(3) PWA(4)
C
C            mc
C                                                                    o
C     HIS ROUTINE LOCATES ALL DOCUMENTS WITH A SPECIFIED WeAs NUMEER
C                                                         Lo
      INTEGER*2 DWA(4) 9KNT
      KNT=0
3     WRITE(1,1)
1     FORMAT(' WHAT IS THE'DESIRED WA NUMBER %9/)
      READ(IL,2,ERR=3)DWA
2     FORMAT(4A2)
100   READ(G,END=200) TIT,PTIT,DIR,OTYSYS,WANGVEH,REVSRDAT
      IFCOWA(G) .NES*®   GOTO 5
      IFCOWA(3) .NES*    GOTO 40
      DO 30 I1=192
      IF(OWA(ID) SNESWAN(I)) GOTO 100
30    CONTINUE
      6C 70 15
40    DO 50 I=193
      IF (OWA(T) sNEAWAN(T)) GOTO 100
50    CONTINUE                                           A
      GO TO 15
5     DO 10 T=194
      IF(DWA(T) NESWAN(I)) GO TO 100
10    CONTINUE                                   A,
15    CALL FMAIN
C     KNTZKNT 41       me
      GO TO 100
200   WRITEC1 9250 KNToDWA
250   FORMAT(' THERE ARE 'I9' DOCUMENTS WITH A WeAe NUMBER %(9
     1  OF *4A2)
      RETURN
      END
