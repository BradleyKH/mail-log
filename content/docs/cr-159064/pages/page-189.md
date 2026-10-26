---
pdfPage: 189
folio: null
sectionId: "B.SEAC"
kind: listing
source: ocr
confidence: 48.3
figures: []
listing:
  appendix: "B"
  routines: ["SEAC"]
  listingPage: 174
---
```fortran
(2226)       READ (195) IOPT
(2227) 3     FORMAT(1A2)
(2228)       IF(IGPT.EQ.*YE*) GO TO 20
(2229)       IF(IOPT.EQ.*NO*) GO TO 15
(2230)       GO TO 10
(2231) 15    CALL SRCH$$(KSDELE, OUT   *96900050)
(2232)       RETURN
(2233) 20    CALL SRCH$$(KSCLOS, "DATE %e6909000)
(2234)       CALL SRCH$$(KSCLOSs*REVS  %o69C,090)
(2235)       CALL COMI(*SCUT’ s4,128IC)
(2236)       CALL EXIT
(2237)       ENO
```
