---
pdfPage: 376
folio: null
sectionId: "D.TITDW"
kind: listing
source: ocr
confidence: 51.3
figures: []
listing:
  appendix: "D"
  routines: ["TITDW"]
  listingPage: 49
---
```fortran
(0698)       CALL CLEAR
(0699) 1001  WRITE(1,2)
(0700) 2     FORMAT(' HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)'%9/
(0701)       WV)
(0702)       READ(C1,8,ERR=IL001)ICON
(0703) 8     FORMAT(I2)
(0704)       IF(ICON.LT.1) GO TO 1001
(0705)       IF(ICON.GT.4) GO TO 1001
(0706)       DO 1000 LOOP=1,ICON
(0707)       WRITE (191)
(0708) C 1   FORMATC® WHAT IS THE DESIRED WORD*s//)
(0709)       LEN=10
(0710)       CALL TINPUT(IT,LEN)
(0711)       IF(IT(1).EQ.*QUIT*®) GO TO 1002
(0712)       CALL SRCH$$(KSROWR*KSNDAM TL     *e609,19,IC)
(0713)       CALL SRCH$$(KSROWR*KENDAMS P72   %06,10,1,IC)
(0714) C       SAVE WORD OF TITLE SEARCH
(0715) C      DO 8006 K=ie3
(0716)        TEX (LOOP 9K) =IT(K)
(0717) 8006   CONTINUE
(0718)       IF(T1,E000) IN=6               A
(0719)       IF (T1L.EQ.0) YO=13
(0720)       IF(T1.EQ.1) IN=13
(0721)       IF (T1,E901310=14
(0722)       IF(T1.EQ.2) IN=14
(0723)       IF(T1.EQ.2) I0=13
(0724) C     IF (T10£Q03) IN=13
(0725)       IF(T1L,EQ03) I0=14
(0726)       IF(T10EQ04) IN=14
(0727)       IF (T1,EQ04) 102213
(0728)       DOC=0
(0729)       REWIND IN
(0730)       REWIND 10
(0731)       READCIN,ENO=100 ORAW, TIT oPTIT,DToSYS,VEH,SECT A NSHT oFREV,FNEOs
(0732)      1                   FEOREF
(0733)       BLNK=*
(0734)       DO 3 T=1921
(0735)       IF(TIT(I).EQ.BLNK) GO TO 3
```
