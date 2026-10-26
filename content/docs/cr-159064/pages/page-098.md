---
pdfPage: 98
folio: null
sectionId: "B.SUBJ"
kind: listing
source: ocr
confidence: 49.6
figures: []
listing:
  appendix: "B"
  routines: ["SUBJ"]
  listingPage: 82
---
```fortran
(0938) 1001  WRITE (L,2)
(0939) 2     FORMAT(' HOW MANY WORDS DO YOU WISH TO MATCH CHAX OF 4)&9/
(0940)       1/)
(0941)       READ (19 A, ERR=1001)1CON
(0942) 8     FORMAT(I2)
(0943) C      MAKE VALIDITY CHECKS ON NUMBER OF WORDS TO SEARCH
(0944)       IF(ICON.LT.1) GO TC 1001
(0945)       IFCI(ONSGT,4) GO TO 1001
(0946)       DO 1000 LOOP=1,.ICONK
(0947)       WRITE (1,1)
(0948) 1     FORMAT(' WHAT IS THE DESIRED WORD% 9//)
(0949) C      FETCH THE WORD TO BE SEARCHED
(0950)       LEN=10                 Mo
(0951)       CALL TINPUT(IT,LEN)
(0952) C      TS THE WORD QUITs YES RETURN
(0953)       IF(IT(1),EQ6*QUIT®) GO TO 1002
(0954) C       SAVE SEARCH WORD -
(0955)       DO 8003 I=1Le3
(0956)       TEXC(LOOP,II=ITCI)
(0957) 8003   CONTINUE
(0958) C
(0959) C      OPEN TEMORARY FILES FOR SEARCH
(0960) C
(0961)       CALL SRCH$$(KSRDWR*KSNDAM, *T1%e2,15eLeIC)
(0962)       CALL SKCHSSCKSROUR+KSNDAMe *T2% e291 GoLeIC)
(0963) C      REWIND ALL NEEDED SUBFILES
(0964)       IF(ITRSP.EQ.1) REWIND
(0965)       IF(IMELESEG,1) REWIND 12
(0966)       IF(ITWEX.EQ.1) REWIND 12°
(0967)       IF(IANN 260.1) REWIND 13
(0968)       IF(IPR .EQ.L) REWIND 14
(0969)       IF(IMIS e£G,1) REWIND 15
(0970) C                                                 .             .
(0971)       DETERMINE TEMORARY FILE FOR INPUT AND OUTPUT
(0972)
(0973)       IF(T1.EQG.0) IN=20                            AA
(0974)       IF(TI.EQ.0) 10=15
(0975)       IF(T1e£001) IN=19
```
