---
pdfPage: 153
folio: null
sectionId: "B.REVSC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["REVSC"]
  listingPage: 138
---
```fortran
(1827) 121     R=1
(1828) C      PERFORM REVISE OF RECORD ITEM(S)
(1829)       CALL INPSC
(1830) C      SET FINISH FLAG TO COMPLETE
(1831)       FINISH=1
(1832) C      BUILD NEW FILE
(1833) 126   WRITE(8)MS,ATHR,DD,TO,DLN,SUB,PTIT,ROUT,
(1834)      1 IDD,COUNT,CWA,CONT,ADD,TWX,FSC,NRE
(1835)       GO TO 101
(1836) 201   ENDFILE 8
(1837)       IF(IN.EQ.11) GOTO 2001
(1838)       IF(IN.EQ.12) GOTO 2002
(1839)       IF(IN.EQ.13) GOTO 2003
(1840)       IF(IN.EQ.14) GOTO 2004
(1841)       IF(IN.EQ.15) GOTO 2005
(1842) 2001  CALL SRCH$$(K$CLOS,'MEMO  ',6,0,0,0)
(1843)       CALL SRCH$$(K$DELE,'MEMO  ',6,0,0,0)
(1844)         CALL CNAM$$('REVS  ',6,'MEMO  ',6,IC)
(1845)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(1846)       GO TO 1002
(1847) 2002  CALL SRCH$$(K$CLOS,'TWFX  ',6,0,0,0)
(1848)       CALL SRCH$$(K$DELE,'TWFX  ',6,0,0,0)
(1849)         CALL CNAM$$('REVS  ',6,'TWFX  ',6,IC)
(1850)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(1851)       GO TO 1003
(1852) 2003  CALL SRCH$$(K$CLOS,'ANN   ',6,0,0,0)
(1853)       CALL SRCH$$(K$DELE,'ANN   ',6,0,0,0)
(1854)         CALL CNAM$$('REVS  ',6,'ANN   ',6,IC)
(1855)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(1856)       GO TO 1004
(1857) 2004  CALL SRCH$$(K$CLOS,'PR    ',6,0,0,0)
(1858)       CALL SRCH$$(K$DELE,'PR    ',6,0,0,0)
(1859)         CALL CNAM$$('REVS  ',6,'PR    ',6,IC)
(1860)       CALL SRCH$$(K$RDWR+K$NDAM,'REVS  ',6,4,1,IC)
(1861)       GO TO 1005
(1862) 2005  CALL SRCH$$(K$CLOS,'MIS   ',6,0,0,0)
(1863)       CALL SRCH$$(K$DELE,'MIS   ',6,0,0,0)
(1864)         CALL CNAM$$('REVS  ',6,'MIS   ',6,IC)
```
