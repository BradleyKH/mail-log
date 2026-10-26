---
pdfPage: 151
folio: null
sectionId: "B.REVSC"
kind: listing
source: ocr
confidence: 58
figures: []
listing:
  appendix: "B"
  routines: ["REVSC"]
  listingPage: 136
---
```fortran
(1751) 1900  WRITE(1,2100)
(1752) 2100  FORMAT(' IS THIS RECORD 10 BE REVISED OR DELETED o/(
(1753)      1   (REV OR CEL)
(1754)       READ(C1,50) IOPT
(1755)       IF(IOPTSEGs*RE*) GOTO 120
(1756)       IF(IOPT.NE.*DE*) GOTO 1900
(1757)       FINISH=1
(1758)       GOTO 100
(1759) C      SET REVISE FLAG
(1760) 120     R=)
(1761) C      PERFORM REVISE OF RECORD ITEM(S)
(1762)       CALL INPSC  -                                                   A
(1763) C      SET FINISH FLAG TO COMPLETE
(1764)       FINISH=1
(1765) C      BUILO NEW FILE
(1766) 125   WRITE CAIMS SATHR GDD, TO,DLN eSUB,PTIT,ROUTs
(1767)      1 IDDeCOUNTsCWASCONT oADD eg THX FSCoNRE 2 DOT
(1768)       GO TO 160
(1769) 200   ENDFILE &
(1770)       CALL SKCHSSCKSCLOSs* TRAN %e6909000)
(1771)       CALL SRCH$$(KSDELEs* TRAN 6000000)
(1772)          CALL CNAM$$(PREVS  %eGeTTRAN  %eL9IC)
(1773)       CALL SRCH$$(KSROWR*KSNDAMG®REVS  %eBe4,1,IC)
(1774) C
(1775) C      IS THE MEMO/LETTER SUB FILE FLAG SET
(1776) C         YESs SEARCH AND REVISE THE SUB-FILE MEMO
(1777) C
(1778) C
(1779) 1001  IF(FINISH-EG.1) GOTO 3000
(1780)         IF(IMELE*EQ-0) GOTO 1002
(1781)        IN=11
(1782)        GO TO 2000
(1783) 1002   IF(FINISH.EQ.1) GOTO 2000
(1784)        IF(ITWEX.EQ.0) GOTO 1003
(1785)        IN=12
(1786)        GOTO 2000                                                      A
(1787) 1003    IF(FINISH.EQ.1) GOTO 3000
(1788)        IF(IANN.EQ.0) GOTO 1004
```
