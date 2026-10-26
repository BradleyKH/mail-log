---
pdfPage: 278
folio: null
sectionId: "C.TITDR"
kind: listing
source: ocr
confidence: 53.8
figures: []
listing:
  appendix: "C"
  routines: ["TITDR"]
  listingPage: 49
---
```fortran
(0594)       SUBROUTINE TITDR
(0595) C
(0595)       COMMON BLOCK FOR THE DIR FILE
(0595) C
(0595)       COMMON TIT,PTIT,DIR,RPT,DT,SYSGWAN,CON, ID, VEHSACT OR
(0595)       COMMON COMP sREV,RDATSWA
(0595) C
(0595) C                                            :
(0595) C     DATA DECLARATION SLOCK FOR THE DIR FILE                    .
(0595) C
(0595)       INTEGER*4 TIT(21) PTIT(19) CIR (4) oRPT (4) 9SYS(3) 9CON(5) o IDS ACT
(0595)       INTEGER*4 COMP(21)
(0595)       INTEGER *2 DT(3) AWAN(4) PVEH( 252) @R,REV,RDAT(3) PWA(S)
(0595) C
(0596) C SYSCOMDKEYS.F      MNEMONIC KEYS FOR FILE SYSTEM CFTN)     31 MAYs 1677
(0596)       NOLIST
(0597) C
(0598) C        oS
(0599) C     THIS IS THE TITLE SEARCH ROUTINE FOR THE DIR/REPORT FILE
(0600) C
(0601)       INTEGER *4 I7(21)
(0602)       INTEGER*2 CONT sDOCoTLoIN,ICON,IO,IOPT,ITY,IC
(0603)       INTEGER *4 BLNK
(0604)       T1=0
(0605)       CALL CLEAR
(0606) 1001  WRITE(1,2)
(0607) 2     FORMAT(' HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)'9/
(0608)       1/)
(0609)       READ (108, £RR=1001 ICON
(0610) 8     FORMAT(I2)
(0611)       IF(ICON.LT.L1) GO TO 1001
(0612)       IF(ICON.GT.4) GO TO 1001
(0613) C     00 1000 LOOP=1y1CON                         .             .
(0614)       WRITE (1,1)
(0615) 1     FORMAT((' WHAT IS THE DESIRED WORD'%s//)
(0616)       LEN=10
(0617)       CALL TINPUT(IT,LEN)
(0618)       IF(IT(L)SEGe*QUIT*) GO TO 1002                                  A
```
