---
pdfPage: 410
folio: null
sectionId: "D.SECTN"
kind: listing
source: ocr
confidence: 52.1
figures: []
listing:
  appendix: "D"
  routines: ["SECTN"]
  listingPage: 83
---
```fortran
(1268) 150    CALL DMAIN
(1269) C      INCREMENT LINE COUNTER FOR DRAWING RECORD PRINTED FOR OUTPUT
(1270)        ILINE=ILINE+INEO
(1271) C      IS THE PRINTER AT SOTTOM OF PAGE
(1272)       IF (ILINE.LE.45) GOTO 100
(1273) C      SET TO TOP OF PRINTER PAGE FLAG
(1274)       IPAGE=0
(1275) C     “RESET  THE LINE COUNTER-TO 0         a
(1276)       ILINE=0
(1277)       GO TO 100
(1278) 200   WRITEC1,(250)KNT,ISECT                                      Ss
(1279) 250   FORMAT(' THERE ARE 'sI99' ORAWINGS RELATED TO SECTION's/(9
(1280)       11X935A4)
(1281) C     RETURN
(1282)       END.
```
