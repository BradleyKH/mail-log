---
pdfPage: 329
folio: null
sectionId: "D.MAIN"
kind: listing
source: ocr
confidence: 56.6
figures: []
listing:
  appendix: "D"
  routines: ["MAIN"]
  listingPage: 2
---
```fortran
(0021) C    TD      9    5      INACTIVE DRAWING STORAGE FILE - ARCHIVE RUN
(0022) C    TEMP   10    6     GENERAL PURPOSE TEMP FILE FOR DRAWINGS
(0023) C    INACTS 11    7     INACTIVE SHEET STORAGE FILE   ARCHIVE RUN
(0024) C     SHEET 12    8     SHEET DATA STORAGE SUBFILE  |.
(0025) C     ETEMP 13    9     GENERAL PURPOSE TEMP FILE FOR EO*S
(0026) C    STEMP  14   10    GENERAL PURPOSE TEMP FILE FOR SHEET DATA
(0027) C     INACTE 17  13     INACTIVE EO STORAGE FILE - ARCHIVE. RUN
(0028) C  ° £0     1814        FeO. DATA STORAGE SUSFILE.
(0029) C
(0030)
(0031)       CALL COMI(*TTY   6012510)
(0032)       CALL IDENT
(0033)       CALL BREAK$(.TRUE«)
(0034)       CALL SRCH$$(KSROWR+KSNDAM, "DRAW %06,2,19IC)
(0035)       IF(IC.NE.0) GOTO 1000
(0036)       CALL SRCH$$(KSROWR+KSNDAM, FEO   *s6914eLsIC)
(0037)       IF(IC.NE.0) GOTO 1000
(0038)       CALL SRCH$$(KSROWR+KSNDAMe*SHEET "sG98,1,IC)          OO
(0039)       IF(IC.NE.0) GOTG 1000
(0040)       WRITE(1,3)
(0041)       CALL BREAK$(.FALSE.)
(0042) 2     READ(1,4) IDES .
(0043)       REWIND 6
(0044)       REWIND 12
(0045)       REWIND 18
(0046)       FORMAT(A2)
(0047)       IF(IDES.EQ.*IN®) CALL INPTOW
(0048)       IF(IDES SEQ. *SE*) CALL SEADW
(0049)       IF(IDES.EQ.*RE®) CALL REVSDW
(0050)       IF(IOES.EQ.*AR®) CALL ARCDY                                     A
(0051)       IFCIDES(EQ.*QU") GOTO  1001
(0052)       CALL CLEAR
(0053)       WRITE(1,3)
(0054)       FORMAT(' PLEASE CHOSE ONE'OF THE FOLLOWING 's/(
(0055)      1  MODE                KEY%e/o
(0056)      1  INPUT              INP  9/9
(0057)      1 REVISE               REV o/s
(0058)      1  SEARCH              SEA% oy
```
