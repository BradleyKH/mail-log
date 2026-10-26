---
pdfPage: 446
folio: null
sectionId: "D.SHOWEO"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "D"
  routines: ["SHOWEO"]
  listingPage: 119
---
```fortran
(1762)       SUBROUTINE SHOWEO
(1763) C
(1763) C     COMMON BLOCK FOR THE DRAW-EO FILE
(1763) C
(1763)       COMMON DRAW,TIT,PTIT,DT,SYS,VEH,SECT,NSHT,FREV,FNEO,FEOREF,
(1763)      1       DRW,SHTN,REV,NEO,EOREF,
(1763)      1       EON,ETIT,EPTIT,EOREV,EDT,ERDT,EOVEH,
(1763)      1       R,IDR,INEO,KNT,FIRST,SECOND,TTIT
(1763) C
(1763) C     DATA DECLARATION BLOCK FOR THE DRAW-EO FILE
(1763) C
(1763)       INTEGER*4 DRAW(4),TIT(21),PTIT(19),SYS(3),SECT(3),FEOREF(10,2),
(1763)      1          DRW(4),EOREF(10,2),EPTIT(19),ETIT(21),EON(2),
(1763)      1          IDR(4),KNT,TTIT(19)
(1763)       INTEGER*2 DT(3),VEH(2,2),NSHT,SHTN(2),FREV,FNEO,REV,NEO,
(1763)      1           EOREV,EDT(3),ERDT(3),EOVEH(2,2),R,INEO,
(1763)      1           FIRST,SECOND
(1763) C
(1763) C
(1764) C
(1765)       CALL CLEAR
(1766)       WRITE(1,10) EPTIT
(1767) 10    FORMAT(2X,'1.  TITLE:',/,3X,19A4)
(1768)       WRITE(1,20)EON,EOREV,EDT
(1769) 20    FORMAT(2X,'2.  ',2A4,5X,'3.  ',A2,5X,'4.  ',2(I2,'-'),I2)
(1770)       WRITE(1,30)ERDT,((EOVEH(I,J),J=1,2),I=1,2)
(1771) 30    FORMAT(2X,'5.  ',2(I2,'-'),I2,5X,'6.  ',2(I3,A1,1X))
(1772)       RETURN
(1773)       END
```
