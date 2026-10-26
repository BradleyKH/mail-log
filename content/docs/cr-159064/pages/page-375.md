---
pdfPage: 375
folio: null
sectionId: "D.TITDW"
kind: listing
source: ocr
confidence: 50
figures: []
listing:
  appendix: "D"
  routines: ["TITDW"]
  listingPage: 48
---
```fortran
(0677)       SUBROUTINE TITDW
(0678) C
(0679) C     COMMON BLOCK FOR THE DRAW~EO FILE
(0679) C
(0679)       COMMON DRAW sTIT,PTIT,OT,SYS,VEH,SECT,NSHT, FREV,FNEO, FEOREF 4
(0679)      1       ORWsSHTN»REVsNEQsEOREF »
(0679)      1       EONSETITsEPTITsEOREVeEDT eERDT 9EOVEHS
(0679)      1       Re IDRe INEQsKNToFIRSToSECONDsTTIT
(0679) C
(0679) C     DATA DECLARATION BLOCK FOR THE ORAW-EO FILE            a
(0679) C                                                                      oo
(0679)       INTEGER #4 DRAW(4) oTIT(21) ePTIT(19) PSYS(3) GSECT(3) sFEOREF (102)»
(0679)      1          DRWC4 dD SEOREF CIN e2) oEPTITCI9O) SETITC21)sEONC2) 9
(0679)      1          IORC4)9KNTeTTIT(19)
(0679)       INTEGER*2 DT(3) sVEH (292) oNSHT SHIN (2) sFREV,FNEQ,REV,NEOs
(0679)      1           EOREVsEDT(3) sERDTC3) sEQVEH (292) Ro INEOs
(0679)      1           FIRST»SECOND
(0679) C                                                          .
(0679) C
(0679) C SYSCOMD>KEYS«F     MNEMONIC KEYS FOR FILE SYSTEM CFTN)     31 MAY, 1977
(0680)       NOLIST                                     A
(0681) C            oo
(0682) C                           o
(0683) C     THIS 1S THE TITLE SEARCH ROUTINE FOR. THE DRAWING FILE
(0684) C
(0685)       INTEGER*4. 17(21)9JEX(493) 9 BLNK
(0686)       INTEGER*2 DOC, TLe IN,ICON, LOG1OPTYILINEGIPAGE,IC,ITY,ARRAY (15)
(0687)       T1I=0
(0688) C   .  INITIALIZE THE TOP OF PRINTER PAGE. FLAG
(0689)        IPAGE=0
(0690) C       INTIALIZE THE LINE COUNTER FOR PRINTER OUTPUT          ae
(0691)        ILINE=0                  I                .
(0692) C       FILL EXTRA TITLE WITH BLANKS          St               ee
(0693)  99     DO  6003 T=104                            oo
(0694)         DO 8604 J=193
(0695)         TEX(I GJ)=%   8                                              A
(0696) 8004   CONTINUE
(0697) 8003   CONTINUE
```
