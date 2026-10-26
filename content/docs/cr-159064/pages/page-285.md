---
pdfPage: 285
folio: null
sectionId: "C.ALDR"
kind: listing
source: ocr
confidence: 46.2
figures: []
listing:
  appendix: "C"
  routines: ["ALDR"]
  listingPage: 56
---
```fortran
(0707)        IF(IOPT.EQ.2) GOTO 25
(0708)       CALL FMAIN
(0709)        GO TO 20
(0710)  25    IFCREV.EQ.*    GOTO 50
(0711)       WRITE(7,35) KNT,DIR REV
(0712)  35   FORMAT(2X oI Ag Mee 2% 4 35A4 gA2g5Xs REV Pe lA2)
(0713)       GO TO 40
(0714)  50   WRITE(7,55) KNTSOIR
(0715)  55   FORMAT(2Xe18 9% 0% 92K o3A49A2)
(0716)  60    IF (KNT/50.EQ.KNT/50.) WRITE(1970) KNT
(0717)  70   FORMAT(2Xe1A)
(0718) C      GO TO 20
(0719)  100   WRITE(1,200) KNT
(0720)  200   FORMAT(' THERE ARE 19'  DOCUMENTS IN THE DIR FILE'#/)
(0721)        CALL SRCH$$(KSCLOS» OUT   66909000)
(0722)        CALL SRCH$$(KSCLOS,*DIR   %oS900090)
(0723)        CALL SRCH$$(KSCLOSe*REVS  %06009090)
(0724)        CALL SRCH$$(KSCLOSs*TEMP  96009000)
(0725) C    ALL    COMISSC*SOUT  %969129IC)
(0726)       CALL  EXIT
(0727)        END
```
