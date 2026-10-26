---
pdfPage: 255
folio: null
sectionId: "C.TINPUT"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["TINPUT"]
  listingPage: 26
---
```fortran
(0320)       TIL(I+2)=ARRAY(3)
(0321)       TIL(I+3)=ARRAY(4)
(0322)          I=I+2
(0323) 12    CONTINUE
(0324) 11    CONTINUE
(0325)       PEDL=1
(0326)       DO 200 I=1,19
(0327) 200   PTIT(I)=BLNK
(0328)       CALL GETWD(BUFF,PTIT)
(0329) 211    CONTINUE
(0330)       RETURN
(0331)       END
```
