---
pdfPage: 437
folio: null
sectionId: "D.REVSDW"
kind: listing
source: ocr
confidence: 49.7
figures: []
listing:
  appendix: "D"
  routines: ["REVSDW"]
  listingPage: 110
---
```fortran
(1685)       FINISH=1
(1686)       GOTO 101
(1687) 121    R=1
(1688)       CALL. INPSE
(1689)         FINISH=1                                             C
(1690) 123     WRITE (1,122)
(1691) 122    FORMAT(LHOs/91X%s'CHECK RECORD: IF CORRECT('
(1692)      1  ENTER C€COd*%g/olE6X9°IF REVISE NEEDEDs ENTER CRE)*)
(1693)            READ(C1950) 10PT
(1694)         IF(IOPT.EQ.*RE®) GOTO 121
(1695) C       IFCICPT.NE.*CO*) GOTO 123
(1696) 126    WRITE (CB) EONSETIT sEPTIT,EOREV,EDT,ERDT sEOVEH
(1697)       GO TO 101
(1698) 201   ENDFILE &
(1699)       CALL SRCH$$(KSCLOSsTE0    96909090)
(1700)       CALL SRCH$$(KSDELE, "£0   %96900090)
(1701)       CALL CNAM$$(*REVS  %s659%EOO  "s6,IC)
(1702)       CALL SRCH$$(KSROWR+KSNDAM, *E0   *sGeL4eLeIC)
(1703) C
(1704) C
(1705) C
(1706)       RETURN
(1707)       END
```
