---
pdfPage: 26
folio: "17"
sectionId: "3.2"
kind: text
source: ocr
confidence: 87.9
figures: []
---
```text
user prt time name              size opts/# form defer at: PRO

CGH    001* 8:39 BASIC                3
CGH    002* 6:39 HIST                 6 F    2 COMP
DKH    003 8:42 BOOK                27 6*F
```

\* means file being printed.

Cption 19 provides a list of users currently on the system:

ENTER OPTION > 19

```text
User                               No Line Devices
SYSTEM                            1   asr <COMDE Y>
CGH                               2     0 <SPODE V>
CL1                               6     4 <PRJDEV> <OASDEV>
CH1                               9     7 <PRJDEV> <OASDEV>
PMK                              10    10 <SPODEV> <OASDEV>
DKH                              12    12 <USRDEV>
GMG                              17    17 <SPODEV> <OASDEV>
FS2                              28    32 <SPOCDEV> <QASDEV>
```

Option 69 allows the user to send a multiple line message to another
user currently logged Into the system. This option may also be invoked
by option 11 on the OAS main menu (see section 4.0 of this document).
A list of currently available users will be displayed on the terminal
screen along with a list of available commands. The appropriate user ID
must then be entered. The system will then 'call' the desired user, who
must answer the cel! before the message may be sent. If the user does not
answer his 'ring', an opportunity will be given to call again or exit the
routine. At the prompt 'SEND>', type the message. Multiple lines may be
entered. To end the message, press ts the 'CMND' or 'CONTROL' key and the
'E' key simultaneously, and then enter a carriage return. This must
be the first character entered at the ‘'SEND>' prompt. To exit the
routine, press the 'CMND' key or the 'CONTROL' key and the 'P' key) simul-

taneously, and enter option 4 on the menu. See the following example.
