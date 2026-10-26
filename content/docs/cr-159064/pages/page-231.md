---
pdfPage: 231
folio: null
sectionId: "C.MAIN"
kind: listing
source: ocr
confidence: 43.1
figures: []
listing:
  appendix: "C"
  routines: ["MAIN"]
  listingPage: 2
---
```fortran
(0026)        CALL BREAK$ (oTRUES)
(0027)        CALL SRCH$$(KSRDWR*KSNDAM, *DIR  "e6,2,IT,IC)
(0028)        IF(IC.NE.0) GOTO 1000
(0029)       CALL SRCH$$(KSROWR+KSNDAMSPREVS   MoB e4,ITG IC)
(0030)       CALL SRCH$$(KSROWR+KSNOAMe* TEMP %AS,6,IT, IC)          A
(0031)       WRITEC1(3)
(0032)       CALL BREAK$(.FALSF.)
(0033) 2     READ(C194)10ES.
(0034)       REWIND 8
(0035)       REWIND 10
(0036) 4     FORMAT(AZ)
(0037)       IF(IGES.EQ.*IN*) CALL INPTDR
(0038)       IF CIDES(EGe*SE*) CALL SEADR
(0039)       IF(IDES.EQ.*RE*®) CALL KEVSDR
(0040)       IF(IDES.EQ.*AR*®) CALL ARCDR
(0041)       IF(IDES.EQ.*GU*) GG TO 1001
(0042)       CALL CLEAR
(0043)       WRITE(1,3)
(0044)       FORMAT(' PLEASE CHCSE ONE OF THE FOLLOWING'e/(
(0045)      1  MODE                KEY %9/y
(0046)      1  INPUT               INP 9/9                              a
(0047)      1  REVISE              REVes/y
(0048)      1  SEARCH  .           SEA  /y
(0049)      1  ARCHIVE             ARC o/y
(0050)      1  QUIT                QUIT*s//)
(0051)       GO TO 2
(0052) 1000  WRITE(1,1002)
(0053) 1002  FORMAT('DIR FILE IS IN USE = PLEASE TRY LATER'/////)
(0054) 1001    IPAS(1)="  8
(0055)       IPAS(2)=9
(0056)       IPAS(3)=0  9
(0057)        CALL SRCH$$(KSCLOS«*DIR   *06909050)
(0058)       CALL SRCH$$(KSCLOSe*REVS   6509000)                        Co
(0059)        CALL SRCH$$(KSCLOSe*TEMP  %YG9L 9090)
(0060)       CALL ATCH$$(TF_MAIL 869K SALLD 9 IPAS SKSIMFD+KSSETH,IC)
(0061)         CALL RESU$$((C*BFILE 45).
(0062)       CALL EXIT
(0063)       END                                                              0
```
