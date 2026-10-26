       SUBROUTINE GETCON
C                                         mc      .
C     COMMON BLOCK FOR THE DIR FILE
C                                                                 7
      COMMON TIT,PTIT,DIR,RPT,DT,SYS eWAN sCON, I D, VEHSACT eR
      COMMON COMP 4REV,RDAT GWA
C
C
C     DATA DECLARATION BLOCK FOR THE DIR FILE
                                           oe
      INTEGER*4 TIT(21) oPTIT(19) sOIR(4) oRPT(4) oSYS(3) 9CON (5) GIDGACT
      INTEGER*4 COMP(21)
      INTEGER *®2 DT(3) WAN (4) @VEH(2 92) @R,REV,RDAT(3) @WA(4)

C SYSCOMDKEYS oF      MNEMONIC KEYS FOR FILE SYSTEN CFTN)    31 MAYs 1977
      NOLIST
       INTEGER*2 IF, IC
      CALL SRCH$$(KSROWR+KSNDAMS*CTAB  %e9GeIS,ITesIC)
      REWIND 18
650   READ (18 9555 eEND= 830) UA,CON
655   FORMAT(SX 94A292Xe5A4)
       IF (WAN (L) CE Ge" 33%. AND eWAN(2) £02°02%) GOTO 670
      IF (WAN(L) 2EG eT ZB* LAND OWAN (2) CE D, 9048 SOR SWAN(2) 0EG2909%) GOTO 660
      IF(WAN(1) ANESWA(1))? GOTO 450
      IF (WAN(2) NES WA(2)) GOTO 650
      GO TO 800
660   DO 665 I=144
      IF (WAN(I) NEoWA(I)) GOTO 650
665    CONTINUE
      GO TO 800
670   IF(WAN(1) -NESWA(L)) GOTO 650
      IF(WAN(2) NE,WA(2)) GOTO 650
      IF (WAN(3).NE.F ABY CANDOWAN( 3) ONE SPBAY) GO TO 800
      IF (WAN(3) -EQ, PAS CANDoWA( 3) 6E00%A *) GOTO 800
      IF (WAN(3).EQ.*BAY.AND.WA(3) oEG0°B *) GOTO 800
      GO TO 650
690   CON(L)=9WA NP
      CON(2)=°0T FT                                          :
      CON(3)="OUNDE
C   ONC   4)=¢ SEES
      CON(5)=* RUKe
800   CALL SRCH$$(KSCLOS, "CTAB %e6909090)
        RETURN
       ND
