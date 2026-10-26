---
pdfPage: 187
folio: null
sectionId: "B.SEAC"
kind: listing
source: reviewed
confidence: 95
figures: []
listing:
  appendix: "B"
  routines: ["SEAC"]
  listingPage: 172
---
```fortran
(2150)      1'MODE                    KEY',/
(2151)      1'MAIL STATUS             MS',/,
(2152)      1'AUTHOR/SOURCE           AUTH',/,
(2153)      1'DOCUMENT DATE           DOC',/,
(2154)      1'TO/ADDRESSEE            TO',/,
(2155)      1'DOCUMENT/LETTER NUMBER  DLN',/,
(2156)      1'SUBJECT                 SUB',/,
(2157)      1'INPUT DATA DATE         IDD',/,
(2158)      1'W.A. NUMBER/ID CODE     CWA',/,
(2159)      1'CONTRACT NUMBER         CON',/,
(2160)      1'ACTION ITEM DUE DATE    ADD',/,
(2161)      1'RESPONSIBLE ENGINEER    NRE',/,
(2162)      1'ALL                     ALL',/
(2163)      1'QUIT                    QUIT',/
(2164)      1'  PLEASE SELECT THE DESIRED MODE',//)
(2165) 6     READ(1,3)IDES
(2166) 3     FORMAT(1A2,A1)
(2167)       IF(IDES(1).EQ.'QU') GO TO 10
(2168)       REWIND 10
(2169) C      IS THIS THE FIRST TIME THRU SEARCH ROUTINE
(2170)       IF(IRR.EQ.1) GO TO 2000
(2171) 50    WRITE(1,2001)
(2172) 2001  FORMAT(' PLEASE INPUT THE CURRENT DATE',/,'MMDDYY'/)
(2173)       READ(1,2002,ERR=50)IM,ID,IY
(2174) 2002  FORMAT(3I2)
(2175)       REWIND 10
(2176)       READ(10,2005)COUNTR
(2177) 2005  FORMAT(8X,I3)
(2178) C      STORE THE CURRENT DATE
(2179)       REWIND 10
(2180)       WRITE(10,2003)IM,ID,IY,COUNTR
(2181) 2003  FORMAT(1X,3I2,1X,I3)
(2182)       REWIND 10
(2183) C      CONVERT CURRENT DATE TO JULIAN TIME
(2184)       CALL JTIME(IY,IM,ID,0,0,0,CD)
(2185) C      SET FIRST TIME THRU SEARCH ROUTINE FLAG
(2186)       IRR=1
(2187) C      IS THIS A ROUTINE THAT USES A SPECIFIC TIME FRAME
```
