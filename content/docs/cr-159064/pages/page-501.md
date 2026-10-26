---
pdfPage: 501
folio: null
sectionId: "D.INPSE"
kind: listing
source: ocr
confidence: 41.2
figures: []
listing:
  appendix: "D"
  routines: ["INPSE"]
  listingPage: 174
---
```fortran
(2482)       READ((159903,ERR=1001)ERDT
(2483)       WRITE (1,903)EROT
(2484) 1200  IF(R.EQ.1.AND.IR.NE.6) GOTO 2200
(2485) 1201   WRITE(1,1202)
(2486) 1202   FORMAT(' (6) VEHICLE ',/2(8!  rs)
(2487)       READ( LoL 2Z03,ERR=1201) CCEQVEHC I oJ) eDA1,2),TALe2)
(2488) 1203   FORMAT(201Xe13sA191X))
(2489)       WRITE (1,1203) (CCEOVEHCI oJ) PJZL52) 91=1 92)
(2490) 2200  CONTINUE
(2491) 3800  CONTINUE
(2492) C
(2493) C      IF EeO. IS A NEW ENTRY» UPDATE SHEET DATA SUBFILE
(2494) C      AND CHECK FOR WARNING MESSAGES
(2495) C
(2496)       IF (R.EQ.00.AND.FIRST.EQ.1) RETURN
(2497)       IF(R.EQ.0) CALL NEOAOD                                   A
(2498)       CALL SHOWEO
(2499)       RETURN
(2500)       END
```
