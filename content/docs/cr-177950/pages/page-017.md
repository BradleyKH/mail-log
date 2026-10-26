---
pdfPage: 17
folio: "9"
sectionId: "2.8"
kind: text
source: ocr
confidence: 90.6
figures: []
---
ENTER OPTION >

Option 0 performs a system logout. An example of logout follows:

XXX (N) LOGGED OUT MMDDYY ~~ HR:MN:SC
Where XXX, N, MM, DD, YY, HR, MN, and SC are the same as in Section 2.1.

Option 9 provides a list of printouts in the spool queue:

ENTER OPTION > 9
[SPOOL rev 19.1.0]

```text
user prt time name              size opts/# form defer at: PRO
CGH    001* 8:39 BASIC                3
CGH    002* 8:39 HIST                 6 F    2 COMP
DKH    003 8:42 BOOK                27 «=F
```

\* means file being printed.

Option 19 provides a list of users currentiy on the system:

ENTER OPTION > 19

```text
User                               No Line Devices
SYSTEM                            1   asr <COMDE V>
CGH                               2     Q <SPODEV>
CL1                               6     4 <PRJDEV> <OASDEV>
CH1                               9     7 <PRJDEV> <OASDEV>
PMK                              10    10 <SPODEV> <QASDEV>
DKH                              12    12 <USRDEV>
GMG                              17    17 <SPODEV> <OASDEV>
FS2                              28    32 <SPODEV> <OASDEV>
```

Option 69 allows the user to send a multiple line message to another
user currently logged into the system. This option may also be Invoked
by option 11 on the OAS main menu (see section 4.0 of this document).
A list of currently available users will be displayed on the terminal
screen along with a list of available commands. The appropriate user ID
must then be entered. The system will then 'call' the desired user, who
must answer the call before the message may be sent. If the user does not
answer his 'ring', an opportunity will be given to call again or exit the
