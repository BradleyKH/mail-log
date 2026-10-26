---
pdfPage: 527
folio: null
sectionId: "F.PHASE3"
kind: listing
source: ocr
confidence: 50.9
figures: []
listing:
  appendix: "F"
  routines: ["BSHT"]
  listingPage: null
---
```fortran
      REWIND 12
      REWIND B
      READ (12) DRAW sSHTN,FREV,E ON
      IFCEON(1)0EGe*     GOTO 7010
      IF (INEOSEG20) GOTO 7250
       PO 7201 1=1e2
      IF (FEOREFCINEO, 1) eNECEON(II) GOTO 7250
      CONTINUE
        GO TO 7010
      INEO=INEO+1
      FEOREF (INEO,1)=EON(1)
      FEOREF (INEO 92) =EON(2)
      READ(12,END=9000) ORW,FIRST,SECOND,REV »EONN
      DO 7100 I=194                   A
      IF(DRW(I).NE.DRAW(I)) GOTO 7500
       CONTINUE
      IF (SHTNC1).EQ.FIRST.AND.SHTIN(2) CE GeSECOND? GOTO 7700
       WRITE(B8) DRAW,SHTN,FREV, INEO oF EOKEF
       SHTN(2)=SECOND
       FREV=REV
       VO 7030 I=1s4
        DRAW(I)=DRW(T)
7030   CONTINUE
       INEO=0
        DO 7140 1=14910
        PO 7150 J=102
        FEOREF (I,J)=*
7150   CONTINUE                                                      .
7140   CONTINUE
        GO TO 7200
7700  IFCEONN(1) EEGs?      GOTO 7010
      IF (INEO.EQ.0) GOTO 7720
       DO 7703 I=102
      IF (FEOREFCINEO, 1) -NEsEONN(I)) GOTO 7720
7701  CONTINUE
      GO TO 7010
7720  INEO=INEO#1
      IF (INEO.GE.11) GOTO 7010
      FEOREF (INEO,2) =EONN(2)
      GO TO 7010
```
