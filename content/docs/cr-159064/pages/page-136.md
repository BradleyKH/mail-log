---
pdfPage: 136
folio: null
sectionId: "B.INPSC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["INPSC"]
  listingPage: 121
---
```fortran
(1621)       ARRAY(4)=BLNK
(1622)       CALL GETWRD(BUF,ARRAY,LEN)
(1623)       TIT(I)=ARRAY(1)
(1624)       TIT(I+1)=ARRAY(2)
(1625)       TIT(I+2)=ARRAY(3)
(1626)       TIT(I+3)=ARRAY(4)
(1627)       I=I+2
(1628) 1531  CONTINUE
(1629)       WRITE(1,1506)(TIT(I),I=1,21)
(1630) 1506  FORMAT(7(1X,2A4,A2))
(1631)       I18=21
(1632)       DO 1507 J=1,I18
(1633)       DDT(IJ,J)='    '
(1634)       DDT(IJ,J)=TIT(J)
(1635)       TIT(J)='    '
(1636) 1507  CONTINUE
(1637) 1504  CONTINUE
(1638) 2200  CONTINUE
(1639)       R=1                                                                ! [?]
(1640)       IR=0
(1641) 9999  CONTINUE
(1642)       CALL SHOWC
(1643) 2302  WRITE(1,2303)
(1644) 2303  FORMAT(/,1H0,/,' CHECK RECORD FOR ERRORS: IF CORRECT, ENTER COR',
(1645)      1/,26X,'IF REVISION NEEDED, ENTER REV'/)
(1646)       READ(1,2300)IOPT
(1647) 2300  FORMAT(1A2)
(1648)       IF(IOPT.EQ.'RE') GOTO 2
(1649)       IF(IOPT.NE.'CO') GOTO 2302
(1650) C
(1651) C     END OF INPUT REVISE ITEMS AS OF 8/26/78
(1652) C
(1653)       RETURN
(1654)       END
```
