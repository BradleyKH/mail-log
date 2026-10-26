      SUBROUTINE TINPUT(TIL,LEN)
C
C     TITLE PACK ROUTINE          co
C
C |.” THIS.ROUTINE PACXS THE TITLE(S) IN A UNIFORM MANNER
C     FOR LATER STORAGE AND RECALL
C
C                                                                    a
C     COMMON BLOCK FOR THE DRAW-£0 FILE    .

      COMMON DRAW,TIT,PTIT,DT sSYS,VOH,SECT ANSHT,FREV,FNEOSFEOREF es
     1       DRW eSHTNeREV gNEGGEOREF o.                         .
     1       FONVETIT gEPTITeFOREVsEOTsERDT sEOVEHS ,
     1       Re IOReINEOoKNToFIRSTsSECONDSTTIT..
C                                           mo                   od
C     DATA DECLARATION BLOCK FOR THE. ORAW“EO FILE
C                                                                ae
      INTEGER*4 DRAW(4) oTIT(21) oPTIT (19) oSY¥S(3) GSECT (3) sFEOREF(1092)5
     1          DRWC4DSEOREF CIO S2oEPTITCIIISETITC219¢E0NC2)5
     1          IDRC4 DS KNTe TTIT C19)
      INTEGER*2- DT(3) PVEH( 2 2) ANSHT »SHTN(2) sFREV,FNEO@REV#NEOs
     1           EOREVSECT(S)sERDT(S) SEOVEH(2 92) eRe INEO
     1           FIRSTsSECOND
C                       oe                BY                         a,
C     ae                                  ot                rr
       COMMON /X/ PEQL
      INTEGER*4 ARRAY (4) sBLNK, STIL(21)-
      INTEGER*2 BUF(76) @GUFF (76) sPEOL
      CALL RDCOM(BUF)
       DO 5 I=1s76.-
      BUFF (I) =BUF (I)
      CONTINUE
      BLNK=*.
      DO 1.1=%921
C1    TILQTISBLNK                 rr                   ec
C     DOLL  [219200  0°            ne             a
      ARRAY(L)=BLNK*
      ARRAY (2 )=8LNK -
      ARRAY (3)=BLNK
      ARRAY(S)=BLNK -
      CALL GETWRD(BUF sARRKAY,LEN)
      TILCID=SARRAY(1)
      TIL(I*1)SARRAY(2)
      TIL CI#222ARRAY(3)
      TIL (I +3) =ARRAY (4)
         L=1+2
12    CONTINUE
42    CONTINUE
      PEOL=1
      DO 200 I=14519'
C 200 PTITC(I)=BLNK                                             CO
      CALL GETWD(RUFF,PTIT)
221    CONTINUE    A
C     RETURN                                          a
      END                                         AN
