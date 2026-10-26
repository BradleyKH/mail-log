---
pdfPage: 15
folio: "7"
sectionId: "2.4"
kind: text
source: ocr
confidence: 91
figures: []
---
Options 33 and 44 perform system lookup functions for the user.
Option 33 displays the spool queue for status of any output sent to any

printer on the system. See the following example:

ENTER OPTION > 33
[SPOOL rev 19.2.3]

```text
user prt time name              size opts/# form defer at: PRO
DKH    001 9:45 P00717 -DHI          1 N    1 NOTE    9:45 B
CGH    002 9:46 TWO.1                2          COMP 11:00 A
```

Return to Continue: ** return **

Option 44 displays the ID codes and terminal line numbers for all users

currently logged Into the SPADS computer. See the following example:

ENTER OPTION > 44

```text
User                             No Line Devices
CLI                               6     4 <PRJDEV> <COMDEV>
SMH                               7     5 <PRJDEV> <COMDEV>
CGH                              11    11. <ADMDEV>
DKH                              18    20 <ADMDEV> <OASDEY>
```

Return to Continue: ** return **

Option 55 displays any slow batch jobs or fast phantoms the user
has submitted during the execution of a Cost or Proration report (see sec-

tions 7.4, 7.5 and 7.6 of this document). See the following example:

ENTER OPTION > 55

Currently Executing:

```text
User                             No Line Devices

DPB                               3     1 <ADMDEV> <SPODEV>

DPB                              71 phant <ADMDEV> <COMDEV>

DPB                               73 batch <ADMDEV> <SPODEV> <COMDEV> (0)
```

Slow Batch Jobs:
