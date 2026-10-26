---
pdfPage: 18
folio: null
sectionId: "B.MAIN"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["MAIN"]
  listingPage: 2
---
```fortran
(0038) 200   WRITE(1,250)
(0039) 250   FORMAT(2X,' ',/,' DO YOU WISH TO WORK WITH THE DIR/REPORT DATA ',
(0040)      1 '--- ENTER DIR',/,26X,'OR DRAWING DATA',5X,'--- ENTER DRAW',/,26X
(0041)      1 ,'OR DAILY CORRESPONDENCE  --- COR',/,26X,'OR QUIT',
(0042)      118X,'--- QU')
(0043)       READ(1,11)IOPT
(0044)       IF(IOPT.EQ.'QU') GOTO 1200
(0045)       IF(IOPT.EQ.'CO') GOTO 800
(0046)       IPAS(1)='  '
(0047)       IPAS(2)='  '
(0048)       IPAS(3)='  '
(0049)       IF(IOPT.EQ.'DR') GOTO 700
(0050)       IF(IOPT.NE.'DI') GOTO 200
(0051)       CALL ATCH$$('F_DIR',5,K$ALLD,IPAS,K$IMFD+K$SETH,IC)
(0052)       CALL RESU$$('*DIR',4)
(0053)       CALL EXIT
(0054) 700   CALL ATCH$$('F_DRAW',6,K$ALLD,IPAS,K$IMFD+K$SETH,IC)
(0055)       CALL RESU$$('*DRAW',5)
(0056)       CALL EXIT
(0057) 800    CONTINUE
(0058)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(0059)       IF(IC.NE.0) GOTO 1000
(0060)       CALL SRCH$$(K$RDWR+K$NDAM,'DATE  ',6,6,1,IC)
(0061)       IF(IC.NE.0) GOTO 1000
(0062) C
(0063) C      1000 IS THE ERROR HANDLER
(0064) C
(0065) C      IF THE PROGRAM REACHES THIS FAR THE FILES ARE OPEN AND USABLE
(0066) C
(0067) 889   CALL CLEAR
(0068)       CALL IDENT
(0069) 10    WRITE(1,2)
(0070) 2     FORMAT(' PLEASE CHOSE ONE OF THE FOLLOWING ',/,
(0071)      1' MODE               KEY',/,
(0072)      1' INPUT              INP',/,
(0073)      1' REVISE             REV',/,
(0074)      1' SEARCH             SEA',/,
(0075)      1' ARCHIVE            ARC',/,
```
