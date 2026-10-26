---
pdfPage: 516
folio: null
sectionId: "E.JUL"
kind: listing
source: reviewed
confidence: 92
figures: []
listing:
  appendix: "E"
  routines: ["JTIME"]
  listingPage: null
---
```fortran
      SUBROUTINE JTIME(IYR,MON,IDA,IHR,MIN,SEC,TJUL)                     ! [?] smudged first print
      SUBROUTINE JTIME(IYR,MON,IDA,IHR,MIN,SEC,TJUL)
      DOUBLE PRECISION TJUL
      SDAY=0
      DO 1 LTB=1,MON
      IF(LTB.EQ.MON) GO TO 2
      SDAY=SDAY+30
      IF(LTB.EQ.1.OR.LTB.EQ.3) SDAY=SDAY+1.0
      IF(LTB.EQ.5.OR.LTB.EQ.7) SDAY=SDAY+1.0
      IF(LTB.EQ.8.OR.LTB.EQ.10)SDAY=SDAY+1.0
      IF(LTB.EQ.12)            SDAY=SDAY+1.0
      IF(LTB.NE.2) GO TO 3
      IYC=IABS(IRY-1904)
      AYC=IYC
      AKT=AMOD(AYC,4.0)
      IF(AKT.LT.0.1) SDAY=SDAY-1.0
      IF(AKT.GE.0.1) SDAY=SDAY-2.0
3     CONTINUE
1     CONTINUE
2     CONTINUE
      DAY=IDA
      IYC=(IABS(IYR-1901))/4
      AYC=IYC
      SDAY=SDAY+DAY+AYC
      HR=IHR
      AMIN=MIN
      DJJX=SDAY+(HR/24.)+(AMIN/1440.0)+(SEC/86400.0)
      TJUL=365.0*(IYR-1900.0)+DJJX+2415019.5
      RETURN
      END
```
