---
pdfPage: 525
folio: null
sectionId: "F.PHASE3"
kind: listing
source: ocr
confidence: 52.7
figures: []
listing:
  appendix: "F"
  routines: ["OPEN"]
  listingPage: null
---
```fortran
210   INEO=INEO*1
      IF(INEO.GE.11) GOTO 10
        FEOREF (INEQ92)=E£0N(62)
10     READ (IG69ENO=8000) ORW,ETIT oEPTIT,FIRST, SECOND REV eLOVEH, EONN,K
C      DRW=DRAW    TIT=ETIT    PTIT=EPTIT
C      SHTN= FIRST & SECOND    FREV=REV
C      VEH=EOVEH   EQNSEONN  EOREV= R
C     XXXXXXXXXKXKX BULLO OATA BASE DRAWs -SHEETe £0
       DO 100 I=194
       IF(ORW(I) NE sDRAW(I)) GOTO S000
100    CONTINUE
        IF (FIRST CE GeL .AND.SECOND.EQ.0) GUTO 6000
      IF (SHTNG1).EQ.FIRST.AND.SHTING2) o£ QeSECOND) GOTO 10
         SHTN(1)=FIRST
         GO 10 10
6000  IF(EGQNN(1).EQ.®  *) GOTO 10
      IF(INEO.EQ.0) GOTO 6016
      DO 6001 I=1L92
      IF (FEOREFCINEO,1).NE.EONN(I)) GOTO 6010 |
6001  CONTINUE                                                      .
      GO To 19
6010  INEO=INEO+1                                   AN
      IF (INEO,GE-11) GOTO 10
       FEOREF(INEO 91 )=EONN(L)
       FEOREF(INEO 92) =EONN(2)
       GO TO 10
5000   WRITE(G) DRAW,TIT,PTIT eL DD,SYS,VEH,SECTeDDJ,FREV,INEQ,FEOREF .
       DO 15 I=1421
15     CONTINUE
       DO 20 1=1919
20     CONTINUE
       DO 30 I=104
30     CONTINUE
       DO 40 1=192
       DO 35 J=1e2
       VEH( TeD) =EOVEH (I oJ)
35     CONTINUE
40     CONTINUE
       EOREVE=R
       EON(2)=EONN(2)
       FREV=REV
```
