---
pdfPage: 379
folio: null
sectionId: "D.TITDW"
kind: listing
source: ocr
confidence: 52.5
figures: []
listing:
  appendix: "D"
  routines: ["TITDW"]
  listingPage: 52
---
```fortran
(0812)       CALL SRCH$$(KSDELE, *T1   96009090)
(0813)       CALL SRCH$$(KSDELE, *T2   66909000)
(0814)       TI=0
(0815)         IF (DOC.NE.0) RETURN
(0816) 1999  WRITE(1,2000)
(0817) 2000  FORMAT(' DO YOU WISH TO TRY THE TITLE SEARCH AGAIN (YES OR NO)')
(0818)       READ (192001 (ERR=1999)10PT
(0819) 2001  FORMAT(1A2)
(0820)       IF(IOPT,EA.*YE*) GOTO 99.
(0821)       IF(IOPT.NE.*NO*) GCTO 1999
(0822)       RETURN
(0823)       END
```
