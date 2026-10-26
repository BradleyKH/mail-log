---
pdfPage: 302
folio: null
sectionId: "C.CONN"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["CONN"]
  listingPage: 73
---
```fortran
(0885) 660   DO 665 I=1,4
(0886)       IF(WAN(I).NE.WA(I)) GOTO 100
(0887) 665    CONTINUE
(0888) 701   CALL CMAIN
(0889)       KNT=KNT+1
(0890)       GO TO 100
(0891) 90    REWIND 6
(0892)       GO TO 30
(0893) 200   WRITE(1,250)KNT,DC
(0894) 250   FORMAT(' THERE ARE'I9' DOCUMENTS WITH A CONTRACT',
(0895)      1' NUMBER OF '5A4)
(0896)        CALL SRCH$$(K$CLOS,'CTAB  ',6,0,0,0)
(0897)       RETURN
(0898)       END
```
