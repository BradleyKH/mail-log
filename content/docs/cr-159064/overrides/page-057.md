---
pdfPage: 57
folio: null
sectionId: "B.BRAKET"
kind: listing
source: reviewed
confidence: 69.2
figures: []
listing:
  appendix: "B"
  routines: ["BRAKET"]
  listingPage: 41
---
```fortran
(0480) C      CHECK FOR VALID ENTRY
(0481)       IF(LVD(1).GT.12.OR.LVD(2).GT.31) GOTO 885
(0482) C      IF NO LAST ENTRY SPECIFIED, SET TO MAXIMUM DATE
(0483) C       DEC. 31, 1999
(0484)       IF(LVD(1).EQ.0) LVD(1)=12
(0485)       IF(LVD(2).EQ.0) LVD(2)=31
(0486)       IF(LVD(3).EQ.0) LVD(3)=99
(0487) C      STORE LAST DATE BY MONTH, DAY, YEAR
(0488)        IM=LVD(1)
(0489)        ID=LVD(2)
(0490)        IY=LVD(3)
(0491) C      CONVERT THE LAST DATE TO JULIAN TIME
(0492)       CALL JTIME(IY,IM,ID,0,0,0,TJ)
(0493) C      STORE JULIAN (LAST) TIME
(0494)        TLVD=TJ
(0495) C       ARE THE DATES ENTERED COMPATIBLE, YES RETURN
(0496) C          ELSE DISPLAY ERROR MESSAGE
(0497)       IF(TLVD.GE.TFVD) GO TO 886
(0498)       WRITE(1,887)
(0499) 887   FORMAT(' GGERROR IN DATES - PLEASE TRY AGAIN'/)                    ! [?]
(0500)       GO TO 880
(0501) 886   CONTINUE
(0502)       RETURN
(0503)       END
```
