---
pdfPage: 70
folio: null
sectionId: "B.CNUM"
kind: listing
source: ocr
confidence: 42.5
figures: []
listing:
  appendix: "B"
  routines: ["CNUM"]
  listingPage: 54
---
```fortran
(0645)       6B TO 100
(0646) C a90 CONTINUE
(0647)       DO 660 I=1s95
(0648)       IF(OW(L).NE.CONT(I)) GOTO 100
(0649) 666    CONTINUE
(0650) 150   IF(IPAGE.NE.0) GOTO 160
(0651)       ITEM=10
(0652)        TPAGE=L
(0653)       CALL SCRNHD(ITEM)
(0654) 160   CALL SCRNPT(ITEM)
(0655)       IF(IPRINTNE 20) GOTO 170
(0656)       CALL HARDHD(ITEM)                                     .
(0657)       IPRINT=1
(0658) 170   CALL HARDPT(ITEM)                         0
(0659)       IF (KNT/14 EQ eKNT/190) IPRINT=0
(0660)       GO TO 100
(0661) 1990   WRITE (19300)
(0662) 3066   FORMAT(' &/)
(0663)       WRITE(1,250) KNT DW
(0664) 250   FORMAT(' THERE ARE '19' DOCUMENTS WITH A CONTRACT '>o.
(0665)       J1Xe*NUMBER OF *SA4)
(0666)       RETURN
(0667)       END
```
