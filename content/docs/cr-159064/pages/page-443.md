---
pdfPage: 443
folio: null
sectionId: "D.SHOWDW"
kind: listing
source: ocr
confidence: 48.9
figures: []
listing:
  appendix: "D"
  routines: ["SHOWDW"]
  listingPage: 6116
---
```fortran
(1729)       IF (NSHT.EQ.1) GOTO 300
(1730)       REWIND 12
(1731)       DO 100 L=2—NSHT
(1732) 40    READ(12,END=150) DRW,SHTNoREV,NEO,EOREF
(1733)       DO 50 I=194
(1734)       IF (ORAW(I).NE.DRWOI)) GOTO 40
(1735) 50    CONTINUE                   .
(1736)        IF(SHTN(2)6EQ,0) GOTO 55
(1737)       WRITE (1952) CSHTN(K) (K=192) REV
(1738)       FORMAT(2Xo'8e  SHEETH Fol 2e% oto I293Xe'REV %e AD)
(1739)       60 TO 65
(1740)       WRITE(C1,660) SHTN(1) «REV
(1741) 60    FORMAT(2X9'Ge  SHEETH 'eI296Xs'REV %eA2)
(1742) 65    WRITE(IL 570)
(1743)       FORMAT(2X9%9.  REFERENCED £.0.''S?)
(1744)       IF(NEQ.NE.0) GOTO 75
(1745)       WRITE(IL 972)
(1746)       FORMAT(EX» ' NONE
(1747)       GO TO 100
(1748) 79    DO 80 J=LeNEO
(1749)       WRITE(1,85) CEOREF (U,K) @K=192)
(1750) 85    FORMAT(6X91A491A2)
(1751)       CONTINUE
(1752) 190   CONTINUE
(1753)       GO TO 200
(1754) 150   WRITE(1,160) ORW
(1755) 160   FORMAT(' THERE IS AN ERROR IN THE NUMBER OF SHEETS FOR'% o/9
(1756)      1  DRAWING %3A49A2)                          .
(1757) 200   READ(12,END=300) DRW,SHTNGREV GNEQ,EOREF
(1758)       GO TO 200
(1759) 300   CONTINUE
(1760)         RETURN
(1761)         END
```
