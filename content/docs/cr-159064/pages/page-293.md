---
pdfPage: 293
folio: null
sectionId: "C.WANUM"
kind: listing
source: ocr
confidence: 50.2
figures: []
listing:
  appendix: "C"
  routines: ["WANUM"]
  listingPage: 64
---
```fortran
(0767)       SUBROUTINE WANUM
(0768) C
(0768) C     COMMON BLOCK FOR THE DIR FILE
(0768) C
(0768)       COMMON TIT,PTIT,DIRoRPT,DTYSYS,WAN,CONGID,VEH,ACTSR
(0768)       COMMON COMP sREV,RDAT GWA
(0768) C
(0768)       DATA DECLARATION BLOCK FOR THE DIR FILE
(0768) C
(0768)       INTEGER*#4 TIT(21) oP TIT(19) DIR (4) eRPT(4) 9SYS(3) eCON(S) eID,ACT
(0768)       INTEGER*4 COMP(21)
(0768)       INTEGER *2 DT(3) WAN(C4) oVEH(Z92) eR,REV, RDAT(3) PWA(4)
(0768) C
(0769) C            mc
(0770) C                                                                    o
(0771) C     HIS ROUTINE LOCATES ALL DOCUMENTS WITH A SPECIFIED WeAs NUMEER
(0772) C                                                         Lo
(0773)       INTEGER*2 DWA(4) 9KNT
(0774)       KNT=0
(0775) 3     WRITE(1,1)
(0776) 1     FORMAT(' WHAT IS THE'DESIRED WA NUMBER %9/)
(0777)       READ(IL,2,ERR=3)DWA
(0778) 2     FORMAT(4A2)
(0779) 100   READ(G,END=200) TIT,PTIT,DIR,OTYSYS,WANGVEH,REVSRDAT
(0780)       IFCOWA(G) .NES*®   GOTO 5
(0781)       IFCOWA(3) .NES*    GOTO 40
(0782)       DO 30 I1=192
(0783)       IF(OWA(ID) SNESWAN(I)) GOTO 100
(0784) 30    CONTINUE
(0785)       6C 70 15
(0786) 40    DO 50 I=193
(0787)       IF (OWA(T) sNEAWAN(T)) GOTO 100
(0788) 50    CONTINUE                                           A
(0789)       GO TO 15
(0790) 5     DO 10 T=194
(0791)       IF(DWA(T) NESWAN(I)) GO TO 100
(0792) 10    CONTINUE                                   A,
```
