---
pdfPage: 217
folio: null
sectionId: "B.INPTC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["INPTC"]
  listingPage: 202
---
```fortran
(2700)       IF(NRE(1,L).NE.'   ') KRE=KRE+1
(2701) 1301   CONTINUE
(2702)       IF(KRE.EQ.0) GOTO 1050
(2703)       WRITE(7,170) (NRE(1,L),L=1,3)
(2704) 170    FORMAT(5X,3(A3,1X))
(2705)       ILINE=ILINE+1
(2706)       IPAGE=IPAGE+1
(2707) 1050   IF(ILINE.NE.0) GOTO 1065
(2708)       WRITE(7,175)
(2709) 175    FORMAT(5X,'NONE')
(2710)       IPAGE=IPAGE+1
(2711) 1065   ILINE=0
(2712)       DO 1200 M=1,6
(2713)       KTW=0
(2714)       DO 1202 N=1,5
(2715)       IF(TWX(M,N).NE.'   ') KTW=KTW+1
(2716) 1202   CONTINUE
(2717)       IF(KTW.EQ.0) GOTO 1250
(2718)       WRITE(7,1205) (TWX(M,N),N=1,5)
(2719) 1205   FORMAT(5X,4A4,A2)
(2720)       ILINE=ILINE+1
(2721)       IPAGE=IPAGE+1
(2722) 1200   CONTINUE
(2723) 1250   IF(ILINE.NE.0) GOTO 1299
(2724)       WRITE(7,1210)
(2725) 1210   FORMAT(5X,'NONE')
(2726)       IPAGE=IPAGE+1
(2727) 1299   CONTINUE
(2728) 1060   DO 1400 I=1,30
(2729)       KDD=0
(2730)       DO 1401 J=1,21
(2731)       IF(DDT(I,J).NE.'   ') KDD=KDD+1
(2732) 1401   CONTINUE
(2733)       IF(KDD.EQ.0) GOTO 1070
(2734)       WRITE(7,180) (DDT(I,J),J=1,21)
(2735) 180    FORMAT(4X,7(1X,2A4,A2))
(2736)       IPAGE=IPAGE+1
(2737) 1400   CONTINUE
```
