---
pdfPage: 426
folio: null
sectionId: "D.SYSDW"
kind: listing
source: ocr
confidence: 73.3
figures: []
listing:
  appendix: "D"
  routines: ["SYSDW"]
  listingPage: 99
---
```fortran
(1501) 190    CALL DMAIN
(1502) C      INCREMENT LINE COUNTER FOR DRAWING RECORD PRINTED FOR OUTPUT
(1503)        ILINE=ILINE*INEO
(1504) C      IS THE PRINTER AT BOTTOM OF PAGE
(1505)       IF(ILINE,L E, 45) GOTO 100
(1506) C i    SET TO TOP OF PRINTER PAGE FLAG
(1507)       IPAGE=0
(1508) C      RESET  THE LINE COUNTER TO 0                     i.
(1509)       ILINE=0
(1510)       GO TO 100
(1511) C 200 WRITE C1Le«250) KNTsDS
(1512) 250   FORMAT('. THERE ARE 'I9' ORAWINGS WITH A-SYSTEM OF '3A4)
(1513)       RETURN
(1514)       END
```
