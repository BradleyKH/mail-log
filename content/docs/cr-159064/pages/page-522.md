---
pdfPage: 522
folio: null
sectionId: "F.PHASE2"
kind: listing
source: reviewed
confidence: 85
figures: []
listing:
  appendix: "F"
  routines: ["OPEN"]
  listingPage: null
---
```fortran
      READ(10,705,ERR=10) ((VEH(I,J),J=1,2),I=1,2)
707   CONTINUE
      REWIND 13
      WRITE(13,750) (BUFF(K),K=1,32)
750   FORMAT(1X,32A1)
      REWIND 13
      READ(13,760,ERR=10) PTIT
760   FORMAT(1X,19A4)
      REWIND 13
      TEN=0
      DO 805 I=1,80
      BUF(I)=' '
805   CONTINUE
      NW=2
      MN=2
      BUF(1)=BUFF(1)
      DO 810 MM=2,31
      IF(MN.LE.80) GOTO 811
      MM=31
      GO TO 810
811   IF(TEN.EQ.0) GOTO 815
      IF(BUFF(MM).EQ.' '.OR.BUFF(MM).EQ.',') TEN=0
      GO TO 810
815   IF(BUFF(MM).EQ.' '.OR.BUFF(MM).EQ.',') GOTO 820
      BUF(MN)=BUFF(MM)
      MN=MN+1
      NW=NW+1
      IF(NW.LE.10) GOTO 810
      NW=1
      MN=MN+1
      TEN=1
      GO TO 810
820   LL=(10-NW)+1
      NN=MN+LL
      MN=NN+1
      NW=1
810   CONTINUE
      REWIND 13
      WRITE(13,840) (BUF(I),I=1,80)
840   FORMAT(1X,80A1)
      REWIND 13
      READ(13,850) TIT
850   FORMAT(7(1X,2A4,A2))
      REWIND 13
      DRW(1)=SYS(1)
      DRW(2)=SYS(2)
      DRW(3)=SYS(3)
      DRW(4)='    '
C102  WRITE(1,500) DRW,SHTN,EON,EOREV,REV,((VEH(I,J),J=1,2),
C     8 I=1,2),PTIT,TIT
C500  FORMAT(1X,4A4,3X,2(I2,1X),3X,1A4,A2,3X,A2,3X,A2,
```
