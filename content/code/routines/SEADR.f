      SUBROUTINE SEADR
C SYSCOM>KEYS.F      MNEMONIC KEYS FOR FILE SYSTEM (FTN)     31 MAY, 1977
      NOLIST
      INTEGER*2 IDES(2),IT,IC
C
C     THIS IS THE SEARCH DRIVER ROUTINE FOR THE DIR FILE
C
       CALL SRCH$$(K$RDWR+K$NSAM,'OUT   ',6,3,0,0)
      J=401                                                                    ! [?]
      WRITE(7,9999)J
9999  FORMAT(1A2)
      WRITE(1,1)
1     FORMAT(' YOU ARE NOW VALIDATED TO SEARCH DATA IN THE ',/
     1' DIR/REPORT FILE - THE FOLLOWING SEARCH MODES ',/
     1' ARE AVAILABLE FOR YOUR USE - ',/
     1'MODE                     KEY',/
     2'TITLE                    TITLE',/
     3'DIR-REPORT NUMBER        DIR',/
     4'DOCUMENT DATE            DATE',/
     5'SYSTEM                   SYS',/
     9'WA NUMBER/ID CODE        WAN',/
     1'CONTRACT NUMBER          CON',/
     1'VEHICLE                  VEH',/
     1'ALL                      ALL',/
     1'QUIT                     QUIT',/
     1' PLEASE SELECT THE DESIRED MODE',//)
      REWIND 6
6     READ(1,3)IDES
3     FORMAT(1A2,A1)
      IF(IDES(1).EQ.'AL') CALL ALDR
      IF(IDES(1).EQ.'TI') CALL TITDR
      IF(IDES(1).EQ.'DI') CALL DIRN
      IF(IDES(1).EQ.'DA') CALL DATDR
      IF(IDES(1).EQ.'WA') CALL WANUM
      IF(IDES(1).EQ.'SY') CALL SYSDR
      IF(IDES(1).EQ.'CO') CALL CONN
      IF(IDES(1).EQ.'VE') CALL VEHN
      IF(IDES(1).EQ.'QU') GO TO 10
      CALL CLEAR
      WRITE(1,1)
      REWIND 6
      GO TO 6
10    WRITE(1,11)
11    FORMAT(' DO YOU WANT A HARD COPY OF THE INFORMATION FOUND',/,
     1' (YES OR NO)')
      CALL SRCH$$(K$CLOS,'OUT   ',6,0,0,0)
      READ(1,3) IDES
      IF(IDES(1).EQ.'YE') GO TO 20
      IF(IDES(1).EQ.'NO') GO TO 15
      GO TO 10
15    CALL SRCH$$(K$DELE,'OUT   ',6,0,0,0)
      RETURN
20     CALL SRCH$$(K$CLOS,'DIR   ',6,0,0,0)
      CALL SRCH$$(K$CLOS,'REVS  ',6,0,0,0)
      CALL SRCH$$(K$CLOS,'TEMP  ',6,0,0,0)
      CALL COMI$$('SOUT  ',6,12,IC)                                     ! [?]
      CALL EXIT
      END
