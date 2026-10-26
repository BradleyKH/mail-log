---
pdfPage: 431
folio: null
sectionId: "D.DRAWN"
kind: listing
source: ocr
confidence: 69.1
figures: []
listing:
  appendix: "D"
  routines: ["DRAWN"]
  listingPage: 104
---
```fortran
(1574) 150    CALL DMAIN
(1575) C      INCREMENT LINE COUNTER FOR DRAWING RECORD PRINTED FOR OUTPUT
(1576)        ILINE=ILINE*+INEO
(1577) C      IS THE PRINTER AT BOTTOM OF PAGE
(1578)       IF(ILINE.LE.45) GOTO 360
(1579) C      SET TO TOP’ OF PRINTER PAGE FLAG
(1580)       IPAGE=0
(1581) C      RESET  THE LINE COUNTER To 0°
(1582)       ILINE=C
(1583)       GO TO 300
(1584) 200   WRITE(1,250) IORAW
(1585) 250   FORMAT(' THERE IS NO DRAWING WITH NUMBER '3A4eA2(/(
(1586)      1 * IN THE DRAWING FILE*/)
(1587) 300   RETURN
(1588)       ENS
```
