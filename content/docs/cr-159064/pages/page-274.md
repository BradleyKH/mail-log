---
pdfPage: 274
folio: null
sectionId: "C.SEADR"
kind: listing
source: reviewed
confidence: 94
figures: []
listing:
  appendix: "C"
  routines: ["SEADR"]
  listingPage: 45
---
```fortran
(0537)       SUBROUTINE SEADR
(0538) C SYSCOM>KEYS.F      MNEMONIC KEYS FOR FILE SYSTEM (FTN)     31 MAY, 1977
(0538)       NOLIST
(0539)       INTEGER*2 IDES(2),IT,IC
(0540) C
(0541) C     THIS IS THE SEARCH DRIVER ROUTINE FOR THE DIR FILE
(0542) C
(0543)        CALL SRCH$$(K$RDWR+K$NSAM,'OUT   ',6,3,0,0)
(0544)       J=401                                                                    ! [?]
(0545)       WRITE(7,9999)J
(0546) 9999  FORMAT(1A2)
(0547)       WRITE(1,1)
(0548) 1     FORMAT(' YOU ARE NOW VALIDATED TO SEARCH DATA IN THE ',/
(0549)      1' DIR/REPORT FILE - THE FOLLOWING SEARCH MODES ',/
(0550)      1' ARE AVAILABLE FOR YOUR USE - ',/
(0551)      1'MODE                     KEY',/
(0552)      2'TITLE                    TITLE',/
(0553)      3'DIR-REPORT NUMBER        DIR',/
(0554)      4'DOCUMENT DATE            DATE',/
(0555)      5'SYSTEM                   SYS',/
(0556)      9'WA NUMBER/ID CODE        WAN',/
(0557)      1'CONTRACT NUMBER          CON',/
(0558)      1'VEHICLE                  VEH',/
(0559)      1'ALL                      ALL',/
(0560)      1'QUIT                     QUIT',/
(0561)      1' PLEASE SELECT THE DESIRED MODE',//)
(0562)       REWIND 6
(0563) 6     READ(1,3)IDES
(0564) 3     FORMAT(1A2,A1)
(0565)       IF(IDES(1).EQ.'AL') CALL ALDR
(0566)       IF(IDES(1).EQ.'TI') CALL TITDR
(0567)       IF(IDES(1).EQ.'DI') CALL DIRN
(0568)       IF(IDES(1).EQ.'DA') CALL DATDR
(0569)       IF(IDES(1).EQ.'WA') CALL WANUM
(0570)       IF(IDES(1).EQ.'SY') CALL SYSDR
(0571)       IF(IDES(1).EQ.'CO') CALL CONN
(0572)       IF(IDES(1).EQ.'VE') CALL VEHN
(0573)       IF(IDES(1).EQ.'QU') GO TO 10
```
