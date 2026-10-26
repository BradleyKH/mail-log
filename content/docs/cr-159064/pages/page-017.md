---
pdfPage: 17
folio: null
sectionId: "B.MAIN"
kind: listing
source: ocr
confidence: 76.3
figures: []
listing:
  appendix: "B"
  routines: ["MAIN"]
  listingPage: 1
---
```fortran
(0001) C
(0002) C      MAYL LOG FILE
(0003) C     WRITTEN FOR NASA/LRC/SPO  BY DeKeHARRIS
(0004) C                                 HAMPTON SCOUT OFFICE
(0005) C                                 VOUGHT CORP.
(0006) C
(0007)        COMMON /COAT/CO
(0008) C      FILES FOR READING AND WRITING
(0009) C
(0010) C      FILE     FUNIT     FUNIT    DESCRIPTION
(0011) C      ITY      1         1        USERS TERMINAL.
(0012) C      TRAN     6         2        DATA  SUBFILE FOR TRANSMITTAL AND SPECFICATION
(0013) C      OUT      7         3        TEMPORARY  OUTPUT FILE
(0014) C      REVS     6         4        TEMPORARY  REVISION PATA FILE
(0015) C      INACTL   9         5         INACTIVE FILE FOR ARCHIVE RUN OF TRAN
(0016) C      INACTS   9         5         INACTIVE FILE FOR ARCHIVE RUN
(0017) C       AcTO    9           5         ACTION DUE FILE
(0018) C      DATE   10         6         TLMPORARY  DATE FILE
(0019) C      MEMO   11         7         DATA  SUBFILE FOR MEMOS AND LETTERS
(0020) C      TWEX   12         g         DATA SUBFILE  FOR TWXSeMAGNAFAXs& RAPIFAX
(0021) C      ANN    13         3          DATA SUBFILE FOR ANNOUNCEMENTS
(0022) C      PR     14        10         DATA  SUSFILE FOR PURCHASE REQUESTS
(0023) C      MIS    15        11          DATA SUBFILE FOR MISCELLANEOUS AND REPORTS
(0024) C
(0025) C      NOTE ONLY FILES TTYoREVSs AND DATE CFUNITS 198910) ARE OPENED HERE
(0026) C
(0027)        DOUBLE PRECISION CD
(0028)        INTEGER*2 DRFA,IPAS(3),IC
(0029)
(0030) C
(0031) C  SYSCOM>KEYS.F      MNEMONIC KEYS FOR FILE SYSTEM (FTN)     31 MAY, 1977
(0031)        NOLIST
(0032)        CALL BREAK$ (FALSE o?          :
(0033)        CALL CLEAR
(0034)        CALL COMI(ETTY® e3,129IC)
(0035)        WRITE (1,100)
(0036)  100   FORMAT((C' WELCOME TO SPADS'/////,
(0037)      1   MAIL LOG FILE  ‘'%9/)
```
