---
pdfPage: 340
folio: null
sectionId: "D.TINPUT"
kind: listing
source: ocr
confidence: 31.3
figures: []
listing:
  appendix: "D"
  routines: ["TINPUT"]
  listingPage: 13
---
```fortran
(0136)       SUBROUTINE TINPUT(TIL,LEN)
(0137) C
(0138) C     TITLE PACK ROUTINE          co
(0139) C
(0140) C |.” THIS.ROUTINE PACXS THE TITLE(S) IN A UNIFORM MANNER
(0141) C     FOR LATER STORAGE AND RECALL
(0142) C
(0143) C                                                                    a
(0143) C     COMMON BLOCK FOR THE DRAW-£0 FILE    .
(0143)
(0143)       COMMON DRAW,TIT,PTIT,DT sSYS,VOH,SECT ANSHT,FREV,FNEOSFEOREF es
(0143)      1       DRW eSHTNeREV gNEGGEOREF o.                         .
(0143)      1       FONVETIT gEPTITeFOREVsEOTsERDT sEOVEHS ,
(0143)      1       Re IOReINEOoKNToFIRSTsSECONDSTTIT..
(0143) C                                           mo                   od
(0143) C     DATA DECLARATION BLOCK FOR THE. ORAW“EO FILE
(0143) C                                                                ae
(0143)       INTEGER*4 DRAW(4) oTIT(21) oPTIT (19) oSY¥S(3) GSECT (3) sFEOREF(1092)5
(0143)      1          DRWC4DSEOREF CIO S2oEPTITCIIISETITC219¢E0NC2)5
(0143)      1          IDRC4 DS KNTe TTIT C19)
(0143)       INTEGER*2- DT(3) PVEH( 2 2) ANSHT »SHTN(2) sFREV,FNEO@REV#NEOs
(0143)      1           EOREVSECT(S)sERDT(S) SEOVEH(2 92) eRe INEO
(0143)      1           FIRSTsSECOND
(0143) C                       oe                BY                         a,
(0143) C     ae                                  ot                rr
(0144)        COMMON /X/ PEQL
(0145)       INTEGER*4 ARRAY (4) sBLNK, STIL(21)-
(0146)       INTEGER*2 BUF(76) @GUFF (76) sPEOL
(0147)       CALL RDCOM(BUF)
(0148)        DO 5 I=1s76.-
(0149)       BUFF (I) =BUF (I)
(0150)       CONTINUE
(0151)       BLNK=*.
(0152)       DO 1.1=%921
(0153) C1    TILQTISBLNK                 rr                   ec
(0154) C     DOLL  [219200  0°            ne             a
(0155)       ARRAY(L)=BLNK*
(0156)       ARRAY (2 )=8LNK -
```
