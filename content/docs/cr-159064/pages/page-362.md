---
pdfPage: 362
folio: null
sectionId: "D.SEADW"
kind: listing
source: reviewed
confidence: 56.5
figures: []
listing:
  appendix: "D"
  routines: ["SEADW"]
  listingPage: 35
---
```fortran
(0484)         REWIND 12
(0485)         REWIND 18
(0486)       GO TO 6
(0487) 10    WRITE(1,11)
(0488) 11    FORMAT(' DO YOU WANT A HARD COPY OF THE INFORMATION FOUND',/,
(0489)      1' (YES OR NO)')
(0490)       READ(1,3) IDES
(0491)       IF(IDES.EQ.'YE') GO TO 20
(0492)       IF(IDES.EQ.'NO') GO TO 15
(0493)       GO TO 10
(0494) 15    CALL SRCH$$(K$CLOS,'OUT   ',6,0,0,0)
(0495)       CALL SRCH$$(K$DELE,'OUT   ',6,0,0,0)
(0496)       RETURN
(0497) 20    CALL SRCH$$(K$CLOS,'OUT   ',6,0,0,0)
(0498)       CALL SRCH$$(K$CLOS,'DRAW  ',6,0,0,0)
(0499)       CALL SRCH$$(K$CLOS,'EO    ',6,0,0,0)
(0500)       CALL SRCH$$(K$CLOS,'SHEET ',6,0,0,0)
(0501)       CALL COMI$$('SOUT',4,12,IC)
(0502)       CALL EXIT
(0503)       END
```
