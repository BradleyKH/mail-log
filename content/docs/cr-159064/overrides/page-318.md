---
pdfPage: 318
folio: null
sectionId: "C.CMAIN"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "C"
  routines: ["CMAIN"]
  listingPage: 89
---
```fortran
(1024)       WRITE(1,402)DT,RDAT
(1025) 402   FORMAT(' (3) DOCUMENT DATE',6X,'(9) REVISION DATE',/,1X,2(I2,'-'),
(1026)      1 I2,15X,2(I2,'-'),I2/)
(1027) 501   WRITE(1,502)SYS
(1028)       WRITE(7,502)SYS
(1029) 502   FORMAT(' (4) SYSTEM',/,3(1X,A4)/)
(1030) 601   WRITE(1,602)WAN
(1031)       WRITE(7,602)WAN
(1032) 602   FORMAT(' (5) W.A. NUMBER/ID CODE',/,1X,4A2/)
(1033) 701   WRITE(1,702)CON
(1034)       WRITE(7,702)CON
(1035) 702   FORMAT(' (6) CONTRACT NUMBER',/,1X,5A4/)
(1036) 901   WRITE(1,902)((VEH(I,J),J=1,2),I=1,2)
(1037)       WRITE(7,902)((VEH(I,J),J=1,2),I=1,2)
(1038) 902   FORMAT(' (7) VEHICLE',/,1X,I3,A1,1X,I3,A1/)
(1039)       CALL RECYCL
(1040)       CALL PAUS
(1041)       RETURN
(1042)       END
```
