---
pdfPage: 395
folio: null
sectionId: "D.ALOW"
kind: listing
source: reviewed
confidence: 100
figures: []
listing:
  appendix: "D"
  routines: ["ALDW"]
  listingPage: 68
---
```fortran
(1048) 300   FORMAT(4X,115('*'),/,45X,'E.O. SEARCH  -  PRINT ALL',/,
(1049)      19X,'E.O. NUMBER',8X,'DATE',6X,'E.O. TITLE',/,4X,115('*'),/,1H0)
(1050)       IPAGE=1
(1051) 302   CONTINUE
(1052) 130   FORMAT(3X,I2,'.  E.O. TITLE',/,3X,19A4)
(1053)       IF(EOREV.EQ.'NC') GOTO 250
(1054)       WRITE(7,230)KNT,EON,EOREV,ERDT,EPTIT
(1055) 230   FORMAT('0',I4,'.  ',2A4,1X,'REV ',A2,3X,2(I2,'-'),I2,
(1056)      13X,19A4)
(1057)       WRITE(1,140) KNT,EON,EOREV,ERDT,((EOVEH(I,J),J=1,2),I=1,2)
(1058) 140   FORMAT(2X,I4,'.',2X,2A4,1X,'REV ',A2,5X,2(I2,'-'),I2,3X,2(2X,
(1059)      1 I3,A1))
(1060)       GO TO 60
(1061) 250   WRITE(7,230)KNT,EON,EOREV,EDT,EPTIT
(1062)       WRITE(1,140) KNT,EON,EOREV,EDT,((EOVEH(I,J),J=1,2),I=1,2)
(1063) 60    IF(KNT/21.EQ.KNT/21.) IPAGE=0
(1064)       CALL PAUS
(1065)       GO TO 260
(1066) 350   WRITE(1,360)KNT
(1067) 360   FORMAT(' THERE ARE ',I9,' E.O.''S IN THE EO SUBFILE',/)
(1068)       GO TO 240
(1069)       END
```
