      SUBROUTINE SYSDR
C
      COMMON BLOCK FOR THE DIR FILE
C
      COMMON TIT,PTIT,DIR sRPT DT eSYS eWAN,CON,ID, VEHSACT OR
      COMMON COMP eREV,RDAT WA              .
C
C
C     DATA DECLARATION BLOCK FOR THE OIR FILE                 ae
C                                                           Coe,
      INTEGER#4 TIT(21) sPTITCLI DIR (4)» RPT(4) (SYS(3) @CON(S) 9 ID9 ACT
      INTEGER*4 COMP(21)
      INTEGER*2 DT (3) eWAN(4S) GVEH (202) eR, REV,RDAT (3) GP WA(4)
C
C
C
C     THIS ROUTINE LOCATES ALL DOCUMENTS WITH A SPCIFIED SYSTEM
C
      INTEGER*4 DS,KNT
      KNT=0
      WRITE (1,1)
1     FORMAT(' WHAT IS THE DESIRED SYSTEM')
      READ(C192,ERR=3)DS                                               I
2     FORMAT(3A4)
100   READ(G,END=200) TIT,PTIT,DIR,OT,SYSoWAN,VEH,REV,RDAT
      00.150 I=1,3
      IF(COS.EQ.SYS(I)) GO TO 175
150   CONTINUE                                                        .
      GO TO 100
175   CONTINUE
      CALL FMAIN
      KNT=KNT41
      GOTO 100
200   WRITE (1250) KNT DS
250   FORMAT(' THERE ARE 'I19' DOCUMENTS WITH A SYSTEM OF ''3A4)
      RETURN                                   .
      END                                   .
