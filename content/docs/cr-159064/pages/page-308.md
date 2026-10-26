---
pdfPage: 308
folio: null
sectionId: "C.GETCON"
kind: listing
source: ocr
confidence: 42.1
figures: []
listing:
  appendix: "C"
  routines: ["GETCON"]
  listingPage: 79
---
```fortran
(0921)        SUBROUTINE GETCON
(0922) C                                         mc      .
(0922) C     COMMON BLOCK FOR THE DIR FILE
(0922) C                                                                 7
(0922)       COMMON TIT,PTIT,DIR,RPT,DT,SYS eWAN sCON, I D, VEHSACT eR
(0922)       COMMON COMP 4REV,RDAT GWA
(0922) C
(0922) C
(0922) C     DATA DECLARATION BLOCK FOR THE DIR FILE
(0922)                                            oe
(0922)       INTEGER*4 TIT(21) oPTIT(19) sOIR(4) oRPT(4) oSYS(3) 9CON (5) GIDGACT
(0922)       INTEGER*4 COMP(21)
(0922)       INTEGER *®2 DT(3) WAN (4) @VEH(2 92) @R,REV,RDAT(3) @WA(4)
(0922)
(0923) C SYSCOMDKEYS oF      MNEMONIC KEYS FOR FILE SYSTEN CFTN)    31 MAYs 1977
(0923)       NOLIST
(0924)        INTEGER*2 IF, IC
(0925)       CALL SRCH$$(KSROWR+KSNDAMS*CTAB  %e9GeIS,ITesIC)
(0926)       REWIND 18
(0927) 650   READ (18 9555 eEND= 830) UA,CON
(0928) 655   FORMAT(SX 94A292Xe5A4)
(0929)        IF (WAN (L) CE Ge" 33%. AND eWAN(2) £02°02%) GOTO 670
(0930)       IF (WAN(L) 2EG eT ZB* LAND OWAN (2) CE D, 9048 SOR SWAN(2) 0EG2909%) GOTO 660
(0931)       IF(WAN(1) ANESWA(1))? GOTO 450
(0932)       IF (WAN(2) NES WA(2)) GOTO 650
(0933)       GO TO 800
(0934) 660   DO 665 I=144
(0935)       IF (WAN(I) NEoWA(I)) GOTO 650
(0936) 665    CONTINUE
(0937)       GO TO 800
(0938) 670   IF(WAN(1) -NESWA(L)) GOTO 650
(0939)       IF(WAN(2) NE,WA(2)) GOTO 650
(0940)       IF (WAN(3).NE.F ABY CANDOWAN( 3) ONE SPBAY) GO TO 800
(0941)       IF (WAN(3) -EQ, PAS CANDoWA( 3) 6E00%A *) GOTO 800
(0942)       IF (WAN(3).EQ.*BAY.AND.WA(3) oEG0°B *) GOTO 800
(0943)       GO TO 650
(0944) 690   CON(L)=9WA NP
(0945)       CON(2)=°0T FT                                          :
```
