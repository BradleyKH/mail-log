---
pdfPage: 243
folio: null
sectionId: "C.INPTDR"
kind: listing
source: ocr
confidence: 53.9
figures: []
listing:
  appendix: "C"
  routines: ["INPTDR"]
  listingPage: 14
---
```fortran
(0189)       CALL INPSDR
(0190)       WRITE(60)TIT,PTIT,DIRRoDT oS YS eWANSVEH OREVARDAT
(0191) 1005  CALL SRCH$$(KSCLOSs*TEMP   6909090)
(0192)       CALL SRCH$$(KSDELEs*TEMP  %e6409000)
(0193)       CALL SRCH$$(KEROWR+KENDAMe*® TEMS 8 %eGGG,IT IC)
(0194) 900   WRITEC1(1001)
(0195) 1001  FORMAT(' IS THERE FURTHER INFCRMATICN TO GE INPUT'%,
(0196)      1  CYES OR NO)*/)
(0197)       READ(141002) TANS
(0198)       REWIND 6
(0199) C     IF CTANScsEGe*N*) RETURN
(0200)       IF(TANS.NE.*Y*) GOTO 900
(0201) 1002  FORMAT(1A1)
(0202)       GOTO 500°
(0203)       END         .
```
