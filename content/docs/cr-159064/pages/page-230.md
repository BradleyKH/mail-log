---
pdfPage: 230
folio: null
sectionId: "C.MAIN"
kind: listing
source: ocr
confidence: 63.5
figures: []
listing:
  appendix: "C"
  routines: ["MAIN"]
  listingPage: 1
---
```fortran
(0002) C     DIR-REPORT FILE FOR NASA/SPO
(0003) C
(0004) C     WRITTEN BY. DANNY Ke. HARRIS - VOUGHT CORP.
(0005) C     FOR THE NASA/SPC/PRIME 300 MINI. COMPUTER
(0006) C
(0007) C
(0008) C
(0008) C     COMMON BLOCK FOR THE OIR FILE
(0008)
(0008)       COMMON 'TIT,PTIT,DIR,RPT eDTYSYS,WAN,CON, ID,VEHSACTOR
(0008)       COMMON COMP sREV,RDAToWA
(0008) C     DATA DECLARATION BLOCK FOR THE DIR FILE
(0008) C                                          oo                          a
(0008)       INTEGER #4 TIT(21) ePTIT(619) @DIR (4) (RPTC4) eSYS(3) 9CON (S) oSIDSACT
(0008)       INTEGER *4 COMP(21)
(0008)       INTEGER *2 DT(3) WAN (4) GVEH( 292) oRoREVoRDAT(3) PWA(4)
(0008) C                          a
(0009) C SYSCOM>KEYS.F      MNENONIC KEYS FOR FILE SYSTEM (FTN)     31 MAYs 1977
(0009)       NOLIST
(0010)        INTEGER*2 IC,IPAS(3)Q1T
(0011)       CALL CLEAR
(0012) C                                                 oe
(0013) C    FILES USED                                                '
(0014) C    FILE   UNIT FUNIT  DESCRIPTION
(0015) C
(0016) C    TTY    1    1      TERMINAL
(0017) C     DIR   6    2      DIR DATA STORAGE FILE
(0018) C     ouT   7    3,     OUTPUT FILE FOR THE SPOOLER
(0019) C     REVS  8    4      TEMP FILE FOR USE IN THE REVISE RUN
(0020) C     INACT 9    5       INACTIVE DOCUMENT STORAGE FILE. - ARCHIVE RUN
(0021) C    TEMP   8610 6.     GENERIAL PURPOSE TEMP FILE
(0022) C                    a        oe
(0023) C
(0024)         CALL COMI(*TTY    %s6012,IC)
(0025)       CALL IDENT
```
