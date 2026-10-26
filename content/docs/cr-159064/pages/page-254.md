---
pdfPage: 254
folio: null
sectionId: "C.TINPUT"
kind: listing
source: ocr
confidence: 45.2
figures: []
listing:
  appendix: "C"
  routines: ["TINPUT"]
  listingPage: 25
---
```fortran
(0294)       SUBROUTINE TINPUT(TIL,LEN)
(0295) C
(0296) C     TITLE PACK ROUTINE
(0297) C
(0298) C     THIS ROUTINE PACKS THE TITLF(S) IN A UNIFORM MANNER
(0299) C     FOR LATER STORAGE ANO RCCALL
(0300) C
(0301) C
(0301) C     COMMON BLOCK FOR THE DIR FILE
(0301) C
(0301)       COMMON TIT,PTIT,DIR,RPT,OToSYS     eWANSCONSID,VEH GACT oR
(0301)       COMMON COMP eREV,RDATQWA
(0301) C
(0301) C
(0301) C     DATA DECLARATION BLOCK FOR THE DIR FILE
(0301) C
(0301)       INTEGER*4 TIT(21) sPTIT(19) eDIR (4) @RPT(4) oSYSC(3) oCON(5S) GS IDS ACT
(0301)       INTEGER*4 COMP(21)
(0301)       INTEGER #2 DT(3) oWAN(4) PVEH( 292) 9R,REV,RDAT(3) oWA(4)
(0301) C
(0302)         COMMON /X/ PEDL
(0303)       INTEGER*4 ARRAY(4) 9 BLNK,TIL(21)-
(0304)       INTEGER *2 BUF (76) sBUFF (76) sPEOL
(0305)       CALL RDCOM(BUF)
(0306)        DO 5 I=1576
(0307)       BUFF (I) =BUF (I)
(0308) 5     CONTINUE
(0309)       BLNK=T
(0310)       DO 1 I=1921                                                   A,
(0311)  1    TILCII=BLNG
(0312)       DO 11 T=1420
(0313)       ARRAY (1)=BLNK
(0314)       ARRAY (2)=BLNK                               .             .
(0315)       ARRAY(3)=5LNK
(0316)       ARRAY (4 )=BLNK   OO
(0317)       CALL GETWRD (SUF eARRAYSLEN)
(0318)       TIL(I)=ARRAY(1)
(0319)       TIL CI +1 =ARRAY(2)
```
