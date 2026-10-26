---
pdfPage: 275
folio: null
sectionId: "C.SEADR"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["SEADR"]
  listingPage: 46
---
```fortran
(0574)       CALL CLEAR
(0575)       WRITE(1,1)
(0576)       REWIND 6
(0577)       GO TO 6
(0578) 10    WRITE(1,11)
(0579) 11    FORMAT(' DO YOU WANT A HARD COPY OF THE INFORMATION FOUND',/,
(0580)      1' (YES OR NO)')
(0581)       CALL SRCH$$(K$CLOS,'OUT   ',6,0,0,0)
(0582)       READ(1,3) IDES
(0583)       IF(IDES(1).EQ.'YE') GO TO 20
(0584)       IF(IDES(1).EQ.'NO') GO TO 15
(0585)       GO TO 10
(0586) 15    CALL SRCH$$(K$DELE,'OUT   ',6,0,0,0)
(0587)       RETURN
(0588) 20     CALL SRCH$$(K$CLOS,'DIR   ',6,0,0,0)
(0589)       CALL SRCH$$(K$CLOS,'REVS  ',6,0,0,0)
(0590)       CALL SRCH$$(K$CLOS,'TEMP  ',6,0,0,0)
(0591)       CALL COMI$$('SOUT  ',6,12,IC)                                     ! [?]
(0592)       CALL EXIT
(0593)       END
```
