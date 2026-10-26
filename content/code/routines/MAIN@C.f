C     DIR-REPORT FILE FOR NASA/SPO
C
C     WRITTEN BY. DANNY Ke. HARRIS - VOUGHT CORP.
C     FOR THE NASA/SPC/PRIME 300 MINI. COMPUTER
C
C
C
C     COMMON BLOCK FOR THE OIR FILE

      COMMON 'TIT,PTIT,DIR,RPT eDTYSYS,WAN,CON, ID,VEHSACTOR
      COMMON COMP sREV,RDAToWA
C     DATA DECLARATION BLOCK FOR THE DIR FILE
C                                          oo                          a
      INTEGER #4 TIT(21) ePTIT(619) @DIR (4) (RPTC4) eSYS(3) 9CON (S) oSIDSACT
      INTEGER *4 COMP(21)
      INTEGER *2 DT(3) WAN (4) GVEH( 292) oRoREVoRDAT(3) PWA(4)
C                          a
C SYSCOM>KEYS.F      MNENONIC KEYS FOR FILE SYSTEM (FTN)     31 MAYs 1977
      NOLIST
       INTEGER*2 IC,IPAS(3)Q1T
      CALL CLEAR
C                                                 oe
C    FILES USED                                                '
C    FILE   UNIT FUNIT  DESCRIPTION
C
C    TTY    1    1      TERMINAL
C     DIR   6    2      DIR DATA STORAGE FILE
C     ouT   7    3,     OUTPUT FILE FOR THE SPOOLER
C     REVS  8    4      TEMP FILE FOR USE IN THE REVISE RUN
C     INACT 9    5       INACTIVE DOCUMENT STORAGE FILE. - ARCHIVE RUN
C    TEMP   8610 6.     GENERIAL PURPOSE TEMP FILE
C                    a        oe
C
        CALL COMI(*TTY    %s6012,IC)
      CALL IDENT
       CALL BREAK$ (oTRUES)
       CALL SRCH$$(KSRDWR*KSNDAM, *DIR  "e6,2,IT,IC)
       IF(IC.NE.0) GOTO 1000
      CALL SRCH$$(KSROWR+KSNDAMSPREVS   MoB e4,ITG IC)
      CALL SRCH$$(KSROWR+KSNOAMe* TEMP %AS,6,IT, IC)          A
      WRITEC1(3)
      CALL BREAK$(.FALSF.)
2     READ(C194)10ES.
      REWIND 8
      REWIND 10
4     FORMAT(AZ)
      IF(IGES.EQ.*IN*) CALL INPTDR
      IF CIDES(EGe*SE*) CALL SEADR
      IF(IDES.EQ.*RE*®) CALL KEVSDR
      IF(IDES.EQ.*AR*®) CALL ARCDR
      IF(IDES.EQ.*GU*) GG TO 1001
      CALL CLEAR
      WRITE(1,3)
      FORMAT(' PLEASE CHCSE ONE OF THE FOLLOWING'e/(
     1  MODE                KEY %9/y
     1  INPUT               INP 9/9                              a
     1  REVISE              REVes/y
     1  SEARCH  .           SEA  /y
     1  ARCHIVE             ARC o/y
     1  QUIT                QUIT*s//)
      GO TO 2
1000  WRITE(1,1002)
1002  FORMAT('DIR FILE IS IN USE = PLEASE TRY LATER'/////)
1001    IPAS(1)="  8
      IPAS(2)=9
      IPAS(3)=0  9
       CALL SRCH$$(KSCLOS«*DIR   *06909050)
      CALL SRCH$$(KSCLOSe*REVS   6509000)                        Co
       CALL SRCH$$(KSCLOSe*TEMP  %YG9L 9090)
      CALL ATCH$$(TF_MAIL 869K SALLD 9 IPAS SKSIMFD+KSSETH,IC)
        CALL RESU$$((C*BFILE 45).
      CALL EXIT
      END                                                              0
