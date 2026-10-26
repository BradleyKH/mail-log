---
pdfPage: 34
folio: null
sectionId: "B.GETWRD"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["GETWRD"]
  listingPage: 18
---
```fortran
(0249) 250   NAME(I)= RT(NAME(I),8) + LS(CHAR,8)
(0250)       GOTO 200
(0251) C
(0252) 300   CHAR=BUF(PEDL)
(0253)       IF(CHAR.EQ.ANL)  GOTO 400
(0254)       IF(CHAR.NE.ASP.AND.CHAR.NE.ACOMMA.AND.CHAR.NE.ASCOL) RETURN
(0255)       PEDL=PEDL+1
(0256)       GOTO 300
(0257) C
(0258) 400   PEDL=77
(0259)       RETURN
(0260) C
(0261)       END
```
