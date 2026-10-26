# NASA-contractor-report (OCR transcript)

Source: `NASA-contractor-report.pdf`, OCR by tesseract v5.4.0.20240606 at 300 DPI, page segmentation mode 3.

## Page 1

```text
TT) | aaa

,                             159065
NASA Contractor Report                 NASA-CR-159065

\9qxz| OO 23529

MAIL LOG - PROGRAM OPERATING INSTRUCTIONS
Danny K. Harris

VOUGHT CORPORATION
Hampton Technical Center
Hampton, Virginia 23666

PrN rN RN Sone AO™ ty

Biay ao
NASA Contract NAS1-13500         LARC Sf ton ari
May 1979                   Pee
Lo.    .                                        Pei Qay Nin SaNTA

ecause of its significant early commercial potential, this

press limitation that it n      published.
information to other domestic paMies b
be made subject to these limitations

ase of this
€ recipient shall!

Foreign release may be madgonly with prio
proval and appropriate
be marked on any r
or in part.

C                  ASA ap-
ort licenses. This legen    all
duction of this information in whole

éral release _May 1981.

NASA

National Aeronautics and
Space Administration

Date for

- Langley Research Center
Hampten, Virginia 23665
```

## Page 2

```text
```

## Page 3

```text
Nw

MAIL LOG

PROGRAM OPERATING INSTRUCTIONS

NASA CONTRACTOR REPORT

DANNY K. HARRIS
May 1979

N79 - 7 7000#
```

## Page 4

```text
```

## Page 5

```text
1.0

2.0:
2.1
2.2
2.3

3.0
3.1
3.2
3.3

4.0

4.1
4.1.1
4.1.1.1
4.1.1.2

4.1.2
4.1.2.1
4.1.2.2

4.1.3
4.1.3.1
4.1.3.2

4.1.4
4.1.4.1
4.1.4.2

TABLE OF CONTENTS

PREFACE
INTRODUCTION

BASIC OPERATING PROCEDURES
LOGIN

PROGRAM ENTRY

PROGRAM EXIT

DATA BASE

CORRESPONDENCE DATA

DESIGN INFORMATION RELEASE/RELEASE DATA
DRAWING/ENGINEERING ORDER DATA

OPERATING PROCEDURES
CORRESPONDENCE

INPUT MODE

DESCRIPTION OF INPUT MODE
ACTION/RESPONSE DURING INPUT MODE

REVISE MODE
DESCRIPTION OF REVISE MODE
ACTION/RESPONSE DURING REVISE MODE

SEARCH MODE
DESCRIPTION OF SEARCH MODE
ACTION/RESPONSE DURING SEARCH MODE

ARCHIVE MODE

DESCRIPTION OF ARCHIVE MODE
ACTION/RESPONSE DURING ARCHIVE MODE

- iii -

-—"- © 0 OO ®

PAGE

nn SP

Ss a Si |

16
16
16

20
20
23

3]
31
32

```

## Page 6

```text
4.2
4.241

4.2.1.1
4.2.1.2

4.2.2
4.2.2.1
4.2.2.2

4.2.3
4.2.3.1
4.2.3.2

4.2.4
4.2.4.1
4.2.4.2

4.3
4.3.1
4.3.1.1
4.3.1.2

4.3.2
4.3.2.1
4.3.2.2

4.3.3
4.3.3.1
4.3.3.2

4.3.4
4.3.4.1
4.3.4.2

TABLE OF CONTENTS (Continued)

DESIGN INFORMATION RELEASE/REPORT
INPUT MODE

DESCRIPTION OF INPUT MODE
ACTION/RESPONSE DURING INPUT MODE

REVISE MODE
DESCRIPTION OF REVISE MODE
ACTION/RESPONSE DURING REVISE MODE

SEARCH MODE
DESCRIPTION OF SEARCH MODE
ACTION/RESPONSE DURING SEARCH MODE

ARCHIVE MODE
DESCRIPTION OF ARCHIVE MODE
ACTION/RESPONSE DURING ARCHIVE MODE

DRAWING/ENGINEERING ORDER

INPUT MODE

DESCRIPTION OF INPUT MODE |
ACTION/RESPONSE DURING INPUT MODE

REVISE MODE
DESCRIPTION OF REVISE MODE
ACTION/RESPONSE DURING REVISE MODE

SEARCH MODE
DESCRIPTION OF SEARCH MODE
ACTION/RESPONSE DURING SEARCH MODE

ARCHIVE MODE

DESCRIPTION OF ARCHIVE MODE
ACTION/RESPONSE DURING ARCHIVE MODE

-iv-

PAGE

33
33
33
34

38
38
39

40
40
42

47
47
48

49
49
49
52

57
57
58

62
62
67

75
75
76
```

## Page 7

```text
5.0
5.1
5.1.1
5.1.2

5.2
5.2.1]

5.3
5.3.1
5.3.2

6.0

TABLE OF CONTENTS (Continued)

MAIL LOG OUTPUTS

CORRESPONDENCE - OUTPUT FORMATS
INPUT MODE FOR CORRESPONDENCE
SEARCH MODE FOR CORRESPONDENCE

DESIGN INFORMATION RELEASE/REPORT - OUTPUT FORMATS
SEARCH MODE FOR DIR

DRAWING/ ENGINEERING ORDER - OUTPUT FORMATS
INPUT MODE FOR DRAWING/E.O.
SEARCH MODE FOR DRAWING/E.O.

GLOSSARY OF TERMS

PAGE

77
78
78
86

1]
111

113
113
115

134
```

## Page 8

```text
10
1]
12

13
14

15
16

18

19

20

21
22

FIGURES

SPADS MAIL LOG MODES OF OPERATION
SPADS MAIL LOG SUBFILED DATA BASE

CORRESPONDENCE RECORD DESCRIPTION
CORRESPONDENCE SEARCHABLE DATA ITEMS
CORRESPONDENCE SEARCHES

DIR/REPORT RECORD DESCRIPTION
DIR/REPORT SEARCHABLE DATA ITEMS

DRAWING RECORD DESCRIPTION ©
ENGINEERING ORDER RECORD DESCRIPTION
SEARCHABLE DRAWING DATA ITEMS
SEARCHABLE ENGINEERING ORDER DATA ITEMS
DRAWING/ENGINEERING ORDER SEARCHES

CORRESPONDENCE INPUT: COMPLETE OUTPUT
CORRESPONDENCE INPUT: BRIEF OUTPUT

CORRESPONDENCE: PRINT ALL SEARCH: TERMINAL OUTPUT
CORRESPONDENCE: PRINT ALL SEARCH: PRINTER OUTPUT

CORRESPONDENCE: NASA RESPONSIBLE ENGINEER SEARCH:
TERMINAL OUTPUT
CORRESPONDENCE: NASA RESPONSIBLE ENGINEER SEARCH:
PRINTER OUTPUT

CORRESPONDENCE: WHO TO SEARCH: TERMINAL OUTPUT
CORRESPONDENCE: WHO TO SEARCH: PRINTER OUTPUT

CORRESPONDENCE: DOCUMENT DATE SEARCH: TERMINAL OUTPUT
CORRESPONDENCE: DOCUMENT DATE SEARCH: PRINTER OUTPUT

-~VvVi -

PAGE

10
2]
22

34
4]

~ 50

5]
64
65
66

‘79
83

87
88

89

90

9]

92

93
94
```

## Page 9

```text
23
24

25
26

27
28

29

30

31

32

33
34

35
36

37

38

39

40
4]

CORRESPONDENCE:
CORRESPONDENCE:

CORRESPONDENCE:
CORRESPONDENCE:

* CORRESPONDENCE:

CORRESPONDENCE:

CORRESPONDENCE:
TERMINAL OUTPUT
CORRESPONDENCE:
PRINTER OUTPUT

CORRESPONDENCE:
CORRESPONDENCE:

CORRESPONDENCE:
CORRESPONDENCE:

CORRESPONDENCE:
CORRESPONDENCE:

CORRESPONDENCE:
CORRESPONDENCE:

FIGURES (Continued)

CONTRACT NUMBER SEARCH: TERMINAL OUTPUT
CONTRACT NUMBER SEARCH: PRINTER OUTPUT

W.A. NUMBER/ID CODE SEARCH: TERMINAL OUTPUT
W.A. NUMBER/ID CODE SEARCH: PRINTER OUTPUT

AUTHOR/SOURCE SEARCH: TERMINAL OUTPUT
AUTHOR/SOURCE SEARCH: PRINTER OUTPUT

DOCUMENT/LETTER NUMBER SEARCH:
DOCUMENT/LETTER NUMBER SEARCH:
INPUT DATE SEARCH: TERMINAL OUTPUT
INPUT DATE SEARCH: PRINTER OUTPUT |

SUBJECT SEARCH: TERMINAL OUTPUT
SUBJECT SEARCH: PRINTER OUTPUT

MAIL STATUS SEARCH: TERMINAL OUTPUT
MAIL STATUS SEARCH: PRINTER QUTPUT

ACTION DUE DATE SEARCH: TERMINAL OUTPUT
ACTION DUE DATE SEARCH: PRINTER OUTPUT

DESIGN INFORMATION RELEASE/REPORT: TERMINAL AND PRINTER

SEARCH OUTPUTS

DRAWING/ENGINEERING ORDER: £.0. INPUT: TERMINAL OUTPUT
DRAWING/ENGINEERING ORDER: DRAWING TERMINAL OUTPUT: DRAWING
TITLE SEARCH: BRIEF OUTPUT

- vii -

PAGE

96

97
98

99
100

101

102

103

104

105
106

107
108

109
110

112

114
116
```

## Page 10

```text
42

43
44
45

46

47
4g
49
50
51
52
53
54

55

FIGURES (Continued)

DRAWING/ENGINEERING ORDER: DRAWING TERMINAL OUTPUT: DRAWING

TITLE SEARCH: COMPLETE OUTPUT

DRAWING/ENGINEERING ORDER: E.0. TERMINAL OUTPUT:

AND E.0. NUMBER SEARCHES

DRAWING/ENGINEERING ORDER: E.0. TERMINAL OUTPUT:

DRAWING/ENGINEERING ORDER: DRAWING TITLE SEARCH:

BRIEF

DRAWING/ENGINEERING ORDER: DRAWING TITLE SEARCH:

COMPLETE

PRINT ALL

VEHICLE SEARCH

PRINTER OUTPUT

PRINTER QUTPUT

DRAWING/ENGINEERING ORDER: DRAWING PRINT ALL SEARCH: PRINTER

OUTPUT

DRAWING/ENGINEERING ORDER: ACTION DUE SEARCH: PRINTER

OUTPUT           :

DRAWING/ENGINEERING ORDER: DRAWING NUMBER SEARCH: PRINTER

OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING DATE SEARCH: PRINTER

OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING SYSTEM SEARCH:

PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING VEHICLE SEARCH:

PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING SECTION SEARCH:

PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING VENDOR CODE SEARCH:

PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: DRAWING E.0. NUMBER SEARCH:

PRINTER OUTPUT

- viii -

PAGE

17

118
119
120

121

122

123

124
125
126
127
128
129

130
```

## Page 11

```text
56

57

58

FIGURES (Continued)

DRAWING/ENGINEERING ORDER: E.0. PRINT ALL SEARCH:
PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: E.0. NUMBER SEARCH:
PRINTER OUTPUT

DRAWING/ENGINEERING ORDER: E.0. VEHICLE SEARCH:
PRINTER OUTPUT        "

- ix -

PAGE

13]

132

133
```

## Page 12

```text
PREFACE

During the research and development phases of the Scout Project, large
quantities of documentation are generated to describe analytical studies,
assumptions, and results of each step from design through postflight analysis.
These documents take the form of engtneering reports, drawings, analyses,
procedures, specifications, test results, and contractual reports,

Retrieval of these documents is based upon an assigned code number
which denotes a file cabinet and approximate location within that cabinet.
Therefore, knowledge of the filing system code number is necessary for
retrieval.

The Scout Project Automatic Data System was developed as a single entry
multiple cross-reference filing system. It was implemented to improve the
overall management efficiency by:

a) reducing the number of man hours required to retrieve data
from the files

b) providing for full data avatlability with quick retrieval during
vehicle anomaly investigations

c) answering inquiries from NASA Headquarters and outside agencfes
for information on a Scout vehicle

d) helping alleviate a raptdly growing storage problem.
The MAIL LOG portion of this automated data system satisfies the above

criteria. This program, with its multiple cross-reference capability, operates
in conjunction with and amplification of the existing filing system.

```

## Page 13

```text
1.0 INTRODUCTION

This document provides the operating instructions for the
software package, MAIL LOG, developed for the Scout Project Automatic Data
System, SPADS. The program is written in FORTRAN for the PRIME
300 computer system located in Building 1192-E at NASA, Langley Research
Center. The MAIL LOG program has four modes of operation as shown in
Figure 1:

1), INPUT - putting new records into the data base
2) REVISE - changing or modifying existing records in the
data base          |
3) SEARCH - finding spectal records existing in the
data base
4) ARCHIVE - store or put away existing records in the
|         data base.

The output includes special printouts of records in the data base and results
from the INPUT and SEARCH modes,

The MAIL LOG data base consists of three main subfiles: Incoming
and outgoing mail correspondence; Design Information Releases (DIR) and.
Reports; and Drawings and Engineering Orders (E£.0.) as shown in Figure 2.
```

## Page 14

```text
SPADS
MAIL LOG

Modes of Operation

STORAGE

DATA
BASE

FIGURE 1

```

## Page 15

```text
- SPADS
MAIL LOG

Subfiled Data Base

CORRESPONDENCE

DIR/REPORTS

DRAWINGS/E.0.'S

OUTPUT

FIGURE 2

ARCHIVE
```

## Page 16

```text
2.0 BASIC OPERATING PROCEDURES

The purpose of this section is to provide a description of the
terminal actions the user must perform in order to LOGIN to the PRIME
computer system, enter the SPADS MAIL LOG program, and exit the MAIL LOG program.
Note that all user actions are terminated with a carriage return; designated
by the key marked RETURN on the terminal.

2.1       LOGIN

User action is designated within a rectangle. XXX represents the user
initials; N is the terminal location number; HR and MN is the time the user
entered the system in hours and minutes; and MMDDYY is the month, day, and year.

LOGIN XXX
XXX (N) LOGGED IN AT HR'MN  MMDDYY

:

This login allows user XXX to access any of the active programs
on the SPADS system.

```

## Page 17

```text
2.2 PROGRAM ENTRY

After system LOGIN is completed, the user must specify the program
selection MAIL LOG as follows:

THE FOLLOWING IS A LIST OF CURRENT APPLICATIONS
PLEASE INDICATE YOUR APPLICATION/PROJECT BY SELECTING THE APPROPRIATE KEY

APPLICATION/PROJECT     KEY

CHANGE REQUEST          CHG
SCHEDULE 15000 —        150
SCHEDULE 15100    151
ANALYSIS I              ANAL
MAIL LOG -             MATL
ELOPE                   ELOP
PROGRAM  DEVELOPMENT          DEV
SOFTWARE MAINT          SOMA
MISCELLANEOUS       MISC

PLEASE ENTER THE APPROPRIATE KEY

[MAIL _|
MATL

WELCOME TO SPADS
MAIL LOG FILE
DO YOU WISH TO WORK WITH THE DIR/REPORT DATA --- ENTER DIR

OR DRAWING DATA     --- ENTER DRAW
OR DAILY CORRESPONDENCE --- COR
- OR QUIT                  wee QU

In order for the user to select one of the four modes of operation,
one of three main data base subffles must first be designated as follows:

DRAW

PLEASE CHOSE ONE OF THE FOLLOWING
MODE                KEY

INPUT           - INP

REVISE              REV

SEARCH              SEA

ARCHIVE             ARC

QUIT                QUIT
```

## Page 18

```text
2.3     PROGRAM EXIT
To leave the program the user must enter QUIT TWICE as shown below:

PLEASE CHOSE ONE OF THE FOLLOWING

MODE                KEY

INPUT     INP

REVISE              REV

SEARCH              SEA

ARCHIVE             ARC

QUIT                QUIT

’ DO YOU WISH TO WORK WITH THE DIR/REPORT DATA --- ENTER DIR

OR DRAWING DATA     ~-- ENTER DRAW
OR DAILY CORRESPONDENCE --- COR
OR QUIT                 --- QU

[qu

```

## Page 19

```text
(3.0       DATA BASE

The Mail Log Data Base is divided into three sections:
Correspondence; Design Information Releases and other Engineering reports;
and information pertaining to Engineering Drawings used in the Scout Project.

3.1       CORRESPONDENCE DATA

The Mail Correspondence portion of the MAIL LOG data base is
further subdivided into six (6) subfiles representing the six types of
documents:

TRANSMITTALS and SPECIFICATIONS

MEMO's and LETTERS

TWX's, MAGNAFAX's, and RAPIFAX's

ANNOUNCEMENTS

PURCHASE REQUESTS

MISCELLANEOUS DOCUMENTS and REPORTS

3.2.      DESIGN INFORMATION RELEASE AND REPORTS DATA

The Design Information portion of the MAIL LOG data base consists
of Design Information Releases (DIR's) and Reports.

3.3       DRAWINGS AND ENGINEERING ORDERS DATA

The Drawing portion of the Mail Log data base is further subdivided
into two (2) subfiles:

DRAWINGS
ENGINEERING ORDERS (E.0.'s)

```

## Page 20

```text
4.0       OPERATING PROCEDURES

The purpose of this section is to provide a description of the
terminal actions the user must perform in order to use the four modes
of operation: INPUT, REVISE, SEARCH, and ARCHIVE. Outputs resulting from
these modes will be described in section 5.0,

The following conventions are used to define all user actions:

a) All user actions/responses are enclosed within a box.

b) All user actions/responses are terminated with a carriage
return; designated by the key marked RETURN on the terminal.

c) Special comments or notes are underlined.

```

## Page 21

```text
4.1       CORRESPONDENCE
4.1.1     INPUT MODE
4.1.1.1 . DESCRIPTION OF INPUT MODE

The user must have clearance to execute within the INPUT mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE, IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The Correspondence data record for each document consists of up
to sixteen data items as shown in Figure 3. Following each complete document
entry, all items are displayed on the terminal to be checked for errors at
this time. After a document record has been declared correct, the specific
subfile must be designated in which this document is to be stored. If all
documents can not be entered in one input session, the user has a WAIT option
which allows the daily input to be continued at a later time. This
continuation is declared upon re-entering the INPUT mode. If the WAIT option
is taken by mistake and there are no other documents to be entered, recovery
is accomplished by declaring this is NOT a continuation upon re-entry into
the INPUT mode. When this has been done the user now has three (3) options
from which to choose:                                                    |

a) Start a New Entry (NEW)

b) Spool Last Output Again (LAST)

c) Spool New Data Entered (DATA)
Option (c) DATA will spool to the high speed printer a sorted output of all
documents entered for that daily input session.

When a daily input session is complete, thts output fs normally
spooled to the printer in two formats: a complete record output and a brief
or partial record output. If a computer or printer malfunction occurs during
this output, another copy may be obtained by re-entering the INPUT mode as
previously described and selecting option (b) LAST. For a sample of the
comptete and brief outputs see Section 5.1.1.

-9-

```

## Page 22

```text
CORRESPONDENCE
RECORD DESCRIPTION

ITEM

NO.       DATA ITEM              ,                ITEM FORMAT

(1)       MAIL STATUS      ,                      2 characters

(2)       AUTHOR/ SOURCE             _           28 characters

(3)       DOCUMENT DATE                       6 characters - yMDDYY

(4)       TO/ ADDRESSEE                      32 characters

(5)       DOCUMENT LETTER NUMBER  |              18 characters

(6)       SUBJECT                                10 characters/word - 7 words

(7)       ROUTING            )                 _ 3 characters - 6 entries

(8)       INPUT DATE                              6 characters - MMDDYY

(9)       WA NUMBER/ID CODE            oo        8 characters

(10)      CONTRACT NUMBER                    20 characters

(11)      ACTION DUE DATE                         6 characters - MMDDYY

(12)      REFERENCED DOCUMENTS                   18 characters - 6 entries

(13)      FILE SYSTEM CODE               ,       10 characters - 2 entries

(14)      RESPONSIBLE ENGINEER      ,             3 characters - 3 entries

(15)      DAILY COUNTER                           4 characters

(16)      * DESCRIPTION                     ,      10 characters/word - 7 words
- 30 entries

* ONLY USED IN TRANSMITTAL SUBFILE

FIGURE <

mi
ey)

-10-

```

## Page 23

```text
4.1.1.2

Step #1

Step #2

Step #3

Step #4

Step #5

Step #6

Step #7

ACTION/RESPONSE DURING INPUT MODE
IS THIS A CONTINUATION OF INPUT (YES OR NO)

If Yes, go to #4
If No, go to #2

DO YOU WISH TO START A NEW ENTRY (NEW)
OR SPOOL LAST OUTPUT AGAIN (LAST)
OR SPOOL NEW DATA ENTERED (DATA)

If New, go to #3

If Last, output spooled to printer,  Exit input mode
If Data, go to #3

STAND BY. SYSTEM NOW PERFORMING FILE HOUSEKEEPING.
System pauses 10 to 35 seconds. No user response required,

WELCOME TO THE MAIL LOG FILE INPUT ROUTINE.

PLEASE NOTE THAT ALL ENTRIES ARE TO BE PLACED BETWEEN THE
EXCLAMATION MARKS AND SHOULD BE LEFT JUSTIFIED

FIRST - PLEASE ENTER THE CURRENT DATE

'MMDDYY!

Input desired date for daily input - month, day, and year,

Note: User must skip a space to start.

If Data_ option taken in Step #2, go to #31.

If data option not taken, go to #6.

(1) MAIL STATUS - (VC) VOUGHT CORRESPONDENCE
(IM) INCOMING MAIL
(OM) OUTGOING MAIL

Enter mail status as given.

If _legal entry, entry displayed on terminal; go to #8

This is done for all entries to follow.

If not legal, go to #6 .

-ll-

```

## Page 24

```text
Step #8

Step #9

Step #10

Step #11

Step #12

Step #13

Step #14

Step #15

Step #16

(2) AUTHOR/SOURCE    a

(3) DOCUMENT DATE
IMMDDYY!

(4) 70
!              :                 |

(5) DOCUMENT/LETTER NUMBER
!                  !

(6) SUBJECT (7 WORDS - 10 CHAR/WORD)

(7) ROUTING
re se 2 ee 2 ee 2 ee

(8) INPUT DATA DATE
IMMDDYY!

Note: This date will automatically be entered from the current

date earlier and be displayed on terminal

(9) W.A. NUMBER/ID.CODE
!        |

If this W.A. number is found in the contract table, the contract

number will be automatically entered and displayed on the terminal;

go.to #18. If not found in table, go to #16.

IS THERE A CONTRACT NUMBER FOR THIS DOCUMENT (YES OR NO)

If Yes, go to #17

If No, go to #18

-12-

```

## Page 25

```text
Step #17 (10) CONTRACT NUMBER
bo     4

Step #18 (11) ACTION ITEM DUE DATE
'MMDDYY!

Step #19 HOW MANY REFERENCE NUMBERS ARE THERE (MAX OF 6)

Enter number X |

(12) REFERENCED DOCUMENT NUMBER
!                  !

Repeated X number of times

Step #20 (13) FILE SYSTEM CODE (S)
!          MH        !

Step #21  HOW MANY NASA RESPONSIBLE ENGINEER(S) ARE THERE (MAX OF 3)

Enter number X

(14) RESPONSIBLE ENGINEER(S) ©
fo oboY

Step #22 HOW MANY DESCRIPTIONS ARE TO BE ENTERED (MAX OF 30)

x         :

Enter number X

(15) DESCRIPTION OF DOCUMENT TRANSMITTED

7 WORDS ~ 10 CHAR/WORD
!

Repeated X number of times.

- 13 -
```

## Page 26

```text
Step #23 Entire record displayed on terminal

CHECK RECORD FOR ERRORS: IF CORRECT, ENTER COR
IF REVISION NEEDED, ENTER REV

If COR, go to #26
If REV, go to #24

Step #24 HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 14)

Step #25

Step #26

Step #27

Step #28

[xx

Enter number XX

INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE
[NN

Enter number NN

Repeat XX number of times

Branches to data item to be revised, then
returns to #23

WHICH SUB-FILE IS THIS RECORD TO BE STORED (NUMBER)
1. TRANSMITTAL/SPECIFICATION      2. MEMO/LETTER
3. TWX/MAGNAFAX/RAPIFAX           4, ANNOUNCEMENT

5. PURCHASE REQUEST               6. MISCELLANEOUS/REPORT

If referenced document field is blank, go to #30
If not blank, the following message is displayed

‘STAND BY. SYSTEM NOW IN AUTOMATIC UPDATE MODE

If word delay or delayed is found in the subject, go to #29
If approval, approved, disapproved, disapproval, or disposition
of the above, go to #30

-14-

```

## Page 27

```text
Step #29 ACTION DUE DATE MM-DD-YY

MMDDYY represents the old date actual displayed
month, day, and year

ENTER NEW DUE DATE (IF NONE, REPEAT OLD DATE)
MMDDYY

Step #30 FURTHER DATA TO BE INPUT (YES OR NO)

If Yes, go to #6
If No, go to #31

Step #31 DO YOU DESIRE THE DAILY OUTPUT (NOW OR WAIT)

If Now, go to #32
If Wait, exit from input mode

Step #32 WILL YOU WANT A COMPLETE DATA PRINTOUT ALONG WITH THE DAILY
BRIEF OFFICE OUTPUT (YES OR NO)

If Yes, formats and spools both complete and brief outputs
to the high speed printer

If No, formats and spools only the brief output to the high
speed printer

Step #33 Exit from the input mode

-15-
```

## Page 28

```text
4.1.2 REVISE MODE | 7
4.1.2.1 DESCRIPTION OF REVISE MODE

The user must have clearance to execute within the REVISE mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE.
IF IT IS NECESSARY, PLEASE CONTACT SYSTEM OPERATOR
AT EXT. 2621.

This restriction is deemed necessary because the REVISE mode allows a user
to revise any part or all of the document items. In addition, the user also
has the capability of deleting the entire document record from its specific
data base subfile.                          .

To revise or delete a document, the tnput data and daily counter
code is needed as the unique identifier for its location. Additional time
can be saved if the user also knows in which of the six (6) correspondence
data subfiles the document is stored. The REVISE mode also can give the user
manual revise or delete capability for documents in the Action Due file.

- 16 -
```

## Page 29

```text
4.1.2.2   ACTION/ RESPONSE DURING REVISE MODE

— Step #1 PLEASE ENTER THE INPUT DATE AND COUNT CODE OF THE DOCUMENT

TO BE REVISED OR DELETED
!      fy!

Step #2 IS THIS A SPECIAL ACTION DUE SUBFILE REQUEST

If Yes, go to #5
If No, go to #3

Step #3 | SUBFILE SELECTION:

1. TRANSMITTAL/SPECIFICATION SUBFILE
2. MEMO/LETTER SUBFILE

3. TWX/MAGNAFAX/RAPIFAX SUBFILE

4. ANNOUNCEMENT SUBFILE

5. PURCHASE REQUEST SUBFILE

6. MISCELLANEOUS/REPORT SUBFILE

HOW MANY SUBFILES DO YOU WISH TO OPEN

Enter number to be searched
If X=6, go to #5
If X#6, go to #4

Step #4 DO YOU WANT SUBFILE NUMBER N (YES OR NO)

Where N is file number 1 thru 6.
Repeated until X number of files designated

Step #5 Document displayed on terminal when found

IS THIS THE CORRECT RECORD TO BE REVISED OR DELETED (YES OR NO)

If Yes, go to #6                             .
If No, continue search for document. When found repeat Step #5
If not found, exit revise mode.

-17 -
```

## Page 30

```text
Step #12

Step #13

Step. #14

Step #15

Step #16

ENTER AUTHOR        |        ,
!                          4

Exit from REVISE mode after brief pause

to update file

ENTER DOC./LETTER NUMBER
               |

Exit from REVISE mode after brief pause

to update file

ENTER ACTION DUE DATE
!MMDDYY!

Exit from REVISE mode after brief pause

to update file

ENTER FILE SYSTEM CODE
!          I          !

Exit from REVISE mode after brief pause

to update file

ENTER RESPONSIBLE ENGINEER
for our J

Exit from REVISE mode after brief pause

to update file

- 18 -
```

## Page 31

```text
| Step #6 IS THIS RECORD TO BE REVISED OR DELETED (REV. OR DEL)

If Rev, go to #7
If Del, record deleted; exit revise mode

Step #7 If action due file previously selected in Step #2, qo to #11.

Step #8 HOW MANY ITEMS DO YO WISH TO REVISE (MAX OF 14)

x

Enter number XX

Step #9 INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE.
yo

Enter number NN. Repeat XX number of times, Branch to data
item NN to be revised. See input mode (4.1.1.2 Steps #6

thru_#22).

Step #10 Entire record displayed on terminal. Check record for errors:

If correct, enter COR; If revision needed, enter REV; If COR,

exit from REVISE MODE; If REV, go to #8.

Step #11 REVISE OPTIONS:
1. AUTHOR           |
2. DOCUMENT/LETTER NUMBER
3. ACTION DUE DATE
4, FILE SYSTEM CODE
5, RESPONSIBLE ENGINEER
ENTER NUMBER ONLY
iX

Enter number X

If X=1, go to #12
If X=2, go to #13
If X=3, go to #14
If X=4, go to #15
If X=5, go to #16

- 19 -

```

## Page 32

```text
4.1.3    SEARCH MODE
4.1.3.1 DESCRIPTION OF SEARCH MODE |

Of the sixteen (16) possible data items within a document record,
eleven (11) are searchable. The resulting outputs. from these searches vary
from five (5) to eight (8) data items. See Figure 4. All searches except
for the Action Due Date search have a multiple subfile selection capability
in which any single or combination of the six subfiles may be used, The
Action Due Date search automatically searches all six subfiles. There is a
specialized All search which outputs all documents in a specified subfile or
combination of subfiles. However, it is not recommended that the general -
user call for the search ALL option.

The searches may also be assigned for a particular time frame. If
no time frame is selected, the first valid date becomes the earliest date in
the data base and the last valid date defaults to 12-31-99. Of course, the Action
Due Date, Document date, and Input Date searches do not use the time framing
capability. However, the Document and Input Date searches can retrieve entire
month's or an entire year's worth of data by entering 00. For example, entering
110078 would result in finding all the documents within the data base in the
eleventh month, November, for the year 1978, Likewise, an entry of 000078 would
retrieve all documents for the year 1978. See Figure 5.

If many documents are found during a search and it is observed that
needed information will soon disappear from the screen, the user may temporarily
stop terminal display by depressing the space bar. Terminal display may be
restarted by depressing the 'Q' key.

_ 20 -

```

## Page 33

```text
kk

kkk

kkKkEK

CORRESPONDENCE
SEARCHABLE DATA ITEMS

SEARCHABLE
MAIL STATUS                  *
AUTHOR/ SOURCE                *
DOCUMENT DATE                *
TO /ADDRESSEE                *
DOCUMENT LETTER NUMBER       *
SUBJECT                      *
ROUTING
INPUT DATE                   *
W.A. NUMBER/ID CODE          *
CONTRACT NUMBER              *
ACTION DUE DATE              *
REFERENCED DOCUMENTS
FILE SYSTEM CODE
RESPONSIBLE ENGINEER         *

DAILY COUNTER
**** DESCRIPTION

OUTPUT IN ALL SEARCHES

ONLY OUTPUT DURING AN ACTION DUE SEARCH
OUTPUT IN ALL BUT AN ACTION DUE OR ALL SEARCH
ONLY USED IN TRANSMITTAL SUBFILE

FIGURE 4
- 21 -

QUTPUT
```

## Page 34

```text
CORRESPONDENCE

SEARCHES
PARAMETER                             SUBFILE SELECTION       TIME FRAME
MAIL STATUS                           ANY 6                   ANY
AUTHOR                ANY 6                      ANY
_ DOCUMENT DATE                         ANY 6                   DAY/MONTH/ YEAR
T0                                    ANY 6                   ANY
DOCUMENT LETTER NUMBER            , ANY 6                   ANY
SUBJECT        .                      ANY 6                   ANY
INPUT DATE                            ANY 6                   DAY/MONTH/ YEAR
W.A. NUMBER/ID CODE                   ANY 6                   ANY
CONTRACT NUMBER                       ANY 6                   ANY
ACTION DUE                            ALL 6                   NONE
RESPONSIBLE ENGINEER                  ANY 6                   ANY
ALL                                   ANY 6                   ANY
FIGURE 5

-~ 22 -
```

## Page 35

```text
4.1.3.2 ACTION/RESPONSE DURING SEARCH MODE

Step #1 YOU ARE NOW VALIDATED TO SEARCH DATA IN THE MAIL LOG FILE -
THE FOLLOWING SEARCH MODES ARE AVAILABLE FOR YOUR USE -

MODE      ]                             KEY
MAIL STATUS                             MS
AUTHOR/ SOURCE        |                  AUTH
DOCUMENT DATE                           Doc
TO/ADDRESSEE          |     ,           TO
DOCUMENT/LETTER NUMBER                  DLN
SUBJECT         |      |                SUB
INPUT DATA DATE                         IDD
W.A. NUMBER/ID CODE ©              CWN
CONTRACT NUMBER                         CON
ACTION ITEM DUE DATE                    ADD
RESPONSIBLE ENGINEER             |      NRE
ALL                                     ALL
. “Quit                             "quit

PLEASE SELECT THE DESIRED MODE

Enter key for desired mode

Step #2 If Quit, go to #50
No user response

Step #3 PLEASE INPUT THE CURRENT DATE
MMDDYY

If DOC, IDD, ADD, or ALL selected for key, go to #7

Step #4 WHAT IS THE FIRST VALID DATE
MMDDYY

Enter month, day, year

Step #5 WHAT IS THE LAST VALID DATE
-MMDDYY

Enter month, day, year

- 23 -
```

## Page 36

```text
Step #6 If legal dates entered, go to #7.

If not legal, the following message is displayed:
ERROR IN DATES ~ PLEASE TRY AGAIN
Go to #4

Step #7 If ADD selected for KEY, go to #11
No user response. Continue to #8

Step #8 . SUBFILE SELECTION:                  |
TRANSMITTAL/SPECIFICATION SUBFILE
MEMO/LETTER SUBFILE
TWX/MAGNAFAX/RAPIFAX SUBFILE
ANNOUNCEMENT SUBFILE
. PURCHASE REQUEST SUBFILE
. MISCELLANEOUS/REPORT SUBFILE

HOW MANY SUBFILES DO YOU WISH TO OPEN
i X

i

nn Fw DH -
oo @  @ @

Enter number X to be searched
If X=6, go to #10
If X#6, go to #9

Step #9 DO YOU WANT SUBFILE NUMBER N (YES OR NO)

Where N is file number 7 thru 6.
Repeated until X number of files designated

Step #10 If key selected is ALL, go to #13
If key selected is NRE, go to #15
If key selected is TO, go to #18
If key selected is DOC, go to #21
If key selected is CON, go to #24
If key selected is CWN, go to #27
If key selected is AUTH, go to #30
If key selected is DLN, go to #33

If. key selected is IDD, go to #36

- 24 -
```

## Page 37

```text
If key selected is SUB, go to #3S
If key selected is MS, go to #46

Step #11 THIS IS THE ACTION ITEM DUE DATE ROUTINE
NOTE - BREAK KEY HAS BEEN DISABLED FOR THIS RUN
THERE ARE TWO (2) OPTIONS FOR THE ACTION DUE SEARCH
1. A COMPLETE LISTING OF ALL ACTION DUE (1)
2. A NORMAL WITHIN 5 DAYS OR PAST DUE (2)

Enter number X

Step #12 If none found, the following message is displayed:

THERE ARE NO DOCUMENTS AWAITING ACTION
IF YOU WISH TO CONTINUE, DEPRESS THE RETURN

When return key is used, go to #1

If documents are found, ‘a header is displayed.

Document data then follows. See Figure 37. After the last
document is found and displayed, the following message is written
on the terminal:

THERE ARE XXX DOCUMENTS AWAITING ACTION

Where XXX represents the number found, the output is
spooled, exit search mode. See Fiqure 38.

Step #13. THIS IS THE PRINT ALL ROUTINE
ALL DOCUMENTS IN THE MAIL LOG FILE WILL BE PRINTED

Step #14 A header followed by document data is displayed. See Figure 15.
The output file is spooled. See Figure 16. Exit search mode.

Step #15 RESPONSIBLE ENGINEER SEARCH         ,
WHO IS THE NASA RESPONSIBLE ENGINEER
(INITIALS ONLY)
AAR

ee ee

Enter initials AAA

- 25 -
```

## Page 38

```text
Step #16 A header followed by document data is displayed. See Figure 17.
Terminal message is displayed after last found.         .

THERE ARE XXX DOCUMENTS WITH A RESPONSIBLE ENGINEER OF AAA

Where XXX represents the number of documents found and AAA are
is initials entered for search

Step #17 IF YOU WISH TO CONTINUE, DEPRESS THE RETURN KEY

When return key is used, go to #1

Step #18 THIS IS THE WHO TO/ADDRESSEE SEARCH
WHAT IS THE DESIRED ADDRESSEE
vt) ae                 oO

Enter name AAAA up to 32 characters. Last name, comma, space,
first initial, period, space, middle initial, period.

Step #19 A header followed by document data is displayed. See Fiqure 19.
Terminal message is displayed after last found

THERE ARE XXX DOCUMENTS WITH AN ADDRESSEE OF AAAA

Where XXX represents the number of documents found and AAAA the
addressee entered for search

Step #20 Go to #17
Step #21 DOCUMENT DATA SEARCH ROUTINE
WHAT IS THE DATE THAT YOU WANT
~ MMDDYY

Enter Date: month, day, year

| Step #22 A header followed by document data is displayed,  See Figure 21.
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH A DOCUMENT DATE OF MM-DD-YY

- 26 -
```

## Page 39

```text
. Where XXX represents the number of documents found and MMDDYY
is the document date entered “for,search.  .      ee

4h
_ oF
gf

Step #23 Go to #17

Step #24 CONTRACT NUMBER SEARCH
WHAT IS THE DESIRED CONTRACT

Enter contract number AAAA up to 20 characters

Step #25 A header followed by document data is displayed. See Figure 23.
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH A CONTRACT NUMBER OF AAAA

Where XXX represents the number of documents found and AAAA is the
contract number entered for search.

Step #26 Go to #17
Step #27 W.A. NUMBER/ID CODE SEARCH
_ WHAT IS THE DESIRED CODE
NNNNITIT

Enter W.A. No. NNNN and ID Code IIIT

‘Step #28 A header followed by document data is displayed. See Figure 25.
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH A W.A. NUMBER/ID CODE OF NNNNITIT.

Where XXX represents the number of documents found and NNNNITIT
is the W.A. number/ID code entered for search.

Step #29 Go to #17.

-~27 -
```

## Page 40

```text
Step #30 THIS IS THE DOCUMENT AUTHOR/SOURCE: SEARCH

Step #31

Step #32

Step #33

‘Step #34

Step #35

Step #36

WHAT IS THE DESIRED AUTHOR/SOURCE
[AAAA

Enter Author/Source AAAA up to 28 characters. Note: Author - last
name, space, first initial, period, space middle initial, period.

A header followed by document data is displayed. See Figure 27.
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH AN AUTHOR/SOURCE OF AAAA

Where XXX represents the number of documents found and AAAA is the
author/source entered for search

Go to #17

DOCUMENT/LETTER NUMBER SEARCH
WHAT IS THE DESIRED DOCUMENT NUMBER

LAAAA

Enter document number AAAA up to 18 characters

A header followed by document data is displayed. See Figure 29,
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH DOCUMENT/LETTER NUMBER OF AAAA

Where XXX represents the number of documents found and AAAA jis the
document number entered for search.

Go to #17

INPUT DATA DATE SEARCH ROUTINE
WHAT IS THE DATE THAT YOU WANT
MMDDYY

Enter date: month, day, year

- 28 -
```

## Page 41

```text
Step #37

Step #38

Step #39

Step #40

Step #41

Step #42

Step #43

Sten #44

A header followed by document data is displayed. See Figure 31.
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH A DATE OF MM-DD-YY

Where XXX represents the number of documents found and MMDDYY js
the input date entered for search.

Go to #17

HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)

nein eet A eae Ae lt

X

Enter number X

WHAT IS THE DESIRED WORD

[AAAA _;

Enter word AAAA
If word is QUIT, go to #45

As each subject is found containing the desired word, the subject

is displayed on the terminal. Following the last subject is
displayed a message.

THERE ARE XXX DOCUMENTS CONTAINING THE WORD AAAA

Where XXX represents the number of documents found and AAAA is
the desired word entered.

Steps #40 and #41 are repeated X number of times from Step #39,
unless zero (0) documents are found. If no:-documents are found,

go to #45.

A header followed by document data is displayed after the last
word is searched. See Figure 33.

Go tc #17.

- 29 -
```

## Page 42

```text
Step #45 DO YOU WISH TO TRY THE SUBJECT SEARCH AGAIN (YES OR NO)

If Yes, go to #39
If No, ao to #17

Step #46 THIS IS THE MAIL STATUS SEARCH ROUTINE
PLEASE INPUT THE DESIRED MAIL STATUS
(VC, IM, OM)                        .

[AA

Enter mail status AA: Vought Correspondence, Incoming Mail,
or Outgoing Mail

Step #47 If AA is a legal entry, go to #48.
If AA not legal, message displayed:

ERROR IN MAIL STATUS AA NOT ALLOWABLE.
TRY AGAIN

Where AA is the mail status entered, go to #46,

Step #48 A header followed by document data is displayed. See Fiqure 35,
Terminal message is displayed after last found.

THERE ARE XXX DOCUMENTS WITH A MAIL STATUS OF AA

Where XXX represents the number of documents found and AA is the
mail status entered for search

Step #49 Go to #17
Step #50 DO YOU WANT A HARD COPY OF THE INFORMATION FOUND

If Yes, output spooled to printer. See Section 5.1.2 for outputs

Step #51 Exit search mode

- 30 -

```

## Page 43

```text
4.1.4 ARCHIVE MODE
4.1.4.1 DESCRIPTION OF ARCHIVE MODE

The user must be validated to execute in the ARCHIVE  mode,
If not properly logged in, an invalid user message will be displayed
on the terminal as follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE.
IF IT IS NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

To archive a document not only is the input date and daily counter code
needed, but also the specific data subfile in which it is located. After
these requirements have been satisfied a pause of 15 to 50 seconds occurs
for the system to update all files involved. When the document has been
archived, the user is automatically returned to the program entry, section
2.2.

WELCOME TO SPADS
MAIL LOG FILE
DO YOU WISH TO WORK WITH THE DIR/REPORT DATA --- ENTER DIR

OR DRAWING DATA     --- ENTER DRAW
OR DAILY CORRESPONDENCE --- COR
OR QUIT        .          wo- QU

- 3) -
```

## Page 44

```text
4.1.4.2 ACTION/RESPCNSE DURING ARCHIVE MODE

Step #1 PLEASE ENTER THE INPUT DATE AND COUNT CODE OF THE DOCUMENT.
TO BE ARCHIVED
!     —h of

Step #2 WHICH SUBFILE IS THIS DOCUMENT LOCATED:

1. TRANSMITTAL/ SPECIFICATION         _ 2, MEMO/LETTER
3. TWX/MAGNAFAX/RAPIFAX                4, ANNOUNCEMENT

5. PURCHASE REQUEST                    6. MISCELLANEOUS/REPORT
co

Enter number X of subfile 1 thru 6 ©

Step #3 Pause for system housekeeping to be completed
Exit ARCHIVE mode when done

= 32 -

```

## Page 45

```text
4.2 - DESIGN INFORMATIGN RELEASE/ REPORT
4.2.7     INPUT MODE
4.2.1.1 DESCRIPTION OF INPUT MODE

The user must have clearance to execute within the INPUT mode;
otherwise, an invalid user message will be displayed at the terminal.

Example
SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS

NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The DIR/REPORT data record for each document consists of up to nine data
items. See Figure 6. The first item entered is the DIR/REPORT Number.
The file is then checked for a previous entry containing this number. If
the number is found, the user has the option to enter the REVISE mode.
Normally changes are required only to two data items: (8) Revision and
(9) Revision Date. Following each completed document entry, all items are
displayed on the terminal.  |

~ 33 -
```

## Page 46

```text
DIR/REPORT

RECORD DESCRIPTION

ITEM
NO        DATA ITEM

(1)     TITLE

(2)       DIR/REPORT NUMBER
(3)       DATE

(4)       SYSTEM

(5)       VEHICLE

(6)       W.A. NUMBER/ID CODE
(7)       * CONTRACT NUMBER
(8)       REVISION

(9)       REVISION DATE

* NOT STORED IN DATA BASE SUBFILE
CONTAINED IN WA/CONTRACT TABLE

ITEM FORMAT

10
14

FIGURE 6

- 34 -

characters/word -7 words

characters
characters
characters
characters
characters
characters
characters

characters

- MMDDYY -
-3 entries

-2 entries

-MMDDYY
```

## Page 47

```text
4.2.1.2

Step #1

/ Step #2

Step #3

ACTION/RESPONSE DURING INPUT MODE

WELCOME TO THE DIR-REPORT FILE INPUT ROUTINE. PLEASE INPUT
INFORMATION BETWEEN EXCLAMATION MARKS AND LEFT JUSTIFY ALL
ENTRIES.                 |               :

ENTER THE DIR OR REPORT NUMBER

XXX

Enter number XXX up to 14 characters

If number not found in file, go to #6
If number found, display message and entire record on terminal

THIS DIR/REPORT IS ALREADY IN THE DATA FILE
DO YOU WISH TO REVISE (YES OR NO)

If Yes, go to #4
If No, go to #16

Step #4 HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 8)

Step #5

Step #6

7

Enter number X

INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE

Enter number N

Repeat X number of times. Branch to data item N to be revised

as Shown in Steps #6 thru #15.

(1) TITLE (7 WORDS - 10 CHAR.)
!                    ;                                      !

Enter title. If legal entry, the entry is displayed on terminal.

If not legal, step is repeated. This is done for all entries to

foilow. NOTE: User must skip a space before entering data.

- 35 -
```

## Page 48

```text
Step #7

Step #8

Step #9

Step #10

Step #lla

Step #11b

Step #12

If input mode, go to #8

(2) DIR OR REPORT NUMBER
!         !

(3) DOCUMENT DATE
'MMDDYY!

Enter month, day, year

(4) SYSTEM (ELEC,GSE,GUID,MECH,PROP,RF,SOP,MGS,EGS, PERF)
! H Ho

(5) W.A. NUMBER/ID CODE
!        !

If W.A. number/ID code is found in the contract table, the contract

number will be displayed on the terminal as follows:

CONTRACT NUMBER XXXXX

Where XXXXX represents the number up to 20 characters.

If W.A. number/ID code is not found in the contract table, a spectal

message will be displayed:
CONTRACT NUMBER WA NOT FOUND SEE. RUK

(6) VEHICLE
!    !!    |

Enter vehicle number XXXA up to two numbers where XXX represents

the numbers. The 'A' represents the letter 'S' which stands for

all subsequent vehicle numbers after XXX.

- 36 -
```

## Page 49

```text
Step #13

Step #14

Step #15

Step #16

(7) REVISION
1}       :

If none, no user entry.

(8) REVISION DATE
!MMDDYY!

If none, no user entry.

Entire record displayed on terminal

IS THERE FURTHER INFORMATION TO BE INPUT (YES OR NO)

If Yes, go to #1

If No, exit INPUT/REVISE mode

- 37 -
```

## Page 50

```text
4.2.2 REVISE MODE . |
4.2.2.1 DESCRIPTION OF REVISE MODE

The user must have clearance to execute within the REVISE modes;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IT NECESSARY,
PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.         .

This restriction is deemed necessary because the REVISE mode allows a user
to not only revise any part or all of the document items, but also to delete
the entire document record from the DIR/REPORT data base subfile. The only
information needed in order to revise or delete a DIR or Report is the DIR
number,

= 38 -
```

## Page 51

```text
4.2.2.2  ACTION/RESPONSE DURING REVISE MODE

Step #1 PLEASE INPUT THE SPO DIR-REPORT NUMBER OF THE DOCUMENT TO BE
REVISED

If not found, exit REVISE mode
If found, go to #2

Step #2 Entire record displayed on terminal

IS THIS THE CORRECT RECORD TO BE REVISED OR DELETED (YES OR NO)

If Yes, go to #3
If no, continue search for document. When found, repeat Step #2
If not found, exit REVISE mode.

Step #3 IS THIS RECORD TO BE REVISED OR DELETED (REV OR DEL)

 If REV, go to #4
If DEL, record Deleted; exit REVISE mode

Step #4 Perform steps #4 thru #15 in input mode section 4.2.1.2

Step #5 Exit REVISE mode

- 39 -
```

## Page 52

```text
4.2.3 SEARCH MODE
4.2.3.1 DESCRIPTION OF SEARCH MODE

Of the nine (9) possible data items within a DIR/REPORT record,
all but one, REVISION, are searchable. It should also be noted that the
Revision Date is searched during a Date search. This allows the Date
search to check only the most recent date associated with a document.

See Figure 7. The Date search has the capability of retrieving an entire
month's or year's worth of data by entering 00 for the day or month. For
example, entering 110078 would result in finding all the documents within
the data base in the eleventh month, November, for the year 1978. Likewise,
an entry of 000078 would retrieve all documents for the year 1978,

There is a specialized ALL search which outputs al] documents in
the DIR/REPORT subfile. This ALL search has an optional output along with
the normal output consisting of the entire nine item record. This optional
output only displays the number of documents found on the terminal and
automatically spools to the high speed printer the DIR number and Revision.

.           The Vehicle search also has a special quality. A group of vehicles
may be found by using the first and last valid vehicle options. For example,
if a user declares the first valid vehicle as 198 and is searching for vehicle

number 200, not only would all documents containing vehicle 200 be found, but
also those with numbers 198S, 199S, and 200S; where S represents all subsequent
vehicles. Default for the first valid vehicle number is zero (0) whereas, the
last valid vehicle number becomes 999,

If many documents are found during a seach and it is observed that
needed information will soon disappear from the screen, the user may temporarily
stop terminal display by depressing the space bar. Terminal display may be
restarted by depressing the 'Q' key.

- 40 -
```

## Page 53

```text
DIR/REPORT
SEARCHABLE DATA ITEMS

SEARCHABLE          OUTPUT

TITLE                                  *             +
DIR/REPORT NUMBER       7            *                   ‘
DATE           ne      *        ns
SYSTEM                            an               *
VEHICLE      |                     ok         :       +
W.A. NUMBER/ID CODE                    *                   *

+ CONTRACT NUMBER       HO           ‘
REVISION.                       ,      *

“REVISION DATE      ,                   te

%* INCLUDED WITHIN THE DATE SEARCH

*%* NOT STORED IN DATA BASE SUBFILE
CONTAINED IN W.A./CONTRACT TABLE

FIGURE 7

-Al-
```

## Page 54

```text
4.2.3.2   ACTION/ RESPONSE DURING SEARCH MODE

Step #1 YOU ARE NOW VALIDATED T0 SEARCH DATA IN THE DIR/REPORT FILE -—
|           THE FOLLOWING SEARCH MODES ARE AVAILABLE FOR YOUR USE -

MODE           |                    KEY
TITLE      TITLE
DIR-REPORT NUMBER                   DIR
DOCUMENT DATE                       DATE
SYSTEM                  .           SYS
W.A. NUMBER/ID CODE                 WAN
CONTRACT NUMBER                  CON
VEHICLE                           VEH
ALL      =    ALL
QUIT    .                         QUIT

PLEASE SELECT THE DESIRED MODE

Enter key for desired mode

Step #2 If key selected is ALL, go to #3
If key selected is TITLE, go to #8
If key selected is DIR, go to #15
If key selected is DATE, go to #17
If key selected is WAN, go to #19
If key selected is SYS, go to #21
If key selected is CON, go to #23
If key selected in VEH, go to #25
If key selected is QUIT, to go #29

Step #3 THIS IS THE PRINT ALL ROUTINE

ALL DOCUMENTS STORED IN THE DIR FILE WILL BE SPOOLED AND A
TOTAL COUNT OF THE DOCUMENTS WILL BE GIVEN. YOU HAVE A
CHOICE OF TWO (2) OPTIONS OF OUTPUT
(1) FULL LISTING OF ALL FIELDS FOR EACH DIR RECORD

(2) BRIEF LISTING OF DIR NUMBER AND REVISION —

ENTER OPTION (1 OR 2)

X

If X=1, go to #4 ©
_ If X=2, go to #5

~ 42 -
```

## Page 55

```text
Step #4   Entire record is displayed on the terminal for each document;
See Figure 39. Go to #6

Step #5 A _number indicating how many records read will be displayed on
the terminal.        ,

Step #6 THERE ARE XXX DOCUMENTS IN THE DIR FILE

Where XXX represents the number of documents found.

Step #7 Output file is automatically spooled to the high speed printer;
Exit the SEARCH mode.

Step #8 HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)

[XO

Enter number X

Step #9 WHAT IS THE DESIRED WORD
LAAAA

Enter word AAAA. If word is Quit, go to #14.

Step #10 As each title is found containing the desired word, the title is
displayed on the terminal. Following the last title is displayed

“a_message:

THERE ARE XXX DOCUMENTS CONTAINING THE WORD AAAA

Where XXX represents the number of documents found and AAAA is the
desired word entered.

Step #11 Steps #9 and #10 are repeated X number of times from Step #8 unless
zero (0) documents are found. If no documents are found, to to #14.

Step #12 For all documents found, document data is displayed after the last
word is searched. See Figure 39.

- 43 -
```

## Page 56

```text
Step #13

Step #14

Step #15

Step #16a
Step #16b

Step #17

Step #18

Step #19

Go to #1
DO YOU WISH TO TRY THE TITLE SEARCH AGAIN (YES OR NO)

If Yes, go to #8
If No, go to #1

WHAT IS THE DESIRED DIR-REPORT NUMBER

Enter number up to 14 characters

If found, the entire record is displayed on the terminal. See

Figure 39. Go to #1.

If not found, go to #1.

WHAT IS THE DATE THAT YOU WANT
'MMDDYY!

Enter month, day, and year after skipping one space.

Entire document record is displayed on the terminal for each found.

See Figure 39.

THERE ARE XXX DOCUMENTS WITH A DATE OF MM-DD-YY

Where XXX represents the number of documents found and MMDDYY is

the date entered fo the search. Go to #1.

WHAT IS THE DESIRED W.A. NUMBER

(NNNNITI

Enter W.A. No. NNNN and ID Code IIII

Step #20

Entire document record ts displayed on the terminal for each found.
See Figure 39.              )

- 44 -
```

## Page 57

```text
THERE ARE XXX DOCUMENTS WITH A W.A. NUMBER OF NNNNITIT

Where XXX represents the number of documents found and NNNITI js
the W.A. number entered for the search. Go to #1.

Step #21 WHAT IS THE DESIRED SYSTEM (ELEC,GSE,GUID,MECH,DROP,RF,SOP,MGS,EGS, PERF)

[AAAA

Enter system AAAA

Step #22 Entire document record is displayed on the terminal for each
found. See Figure 39.

THERE ARE XXX DOCUMENTS WITH A SYSTEM OF AAA

Where XXX represents the number of documents found and AAAA is the
system entered for the search. Go to #1. .

Step. #23 WHAT IS THE DESIRED CONTRACT NUMBER

{

Enter contract number up to 20 characters.

Step #24 Entire document record is displayed on the terminal for each found.
See Figure 39,

THERE ARE XXX DOCUMENTS WITH A CONTRACT NUMBER OF AAA

Where XXX represents the number of documents found and AAAA is the
contract number entered for the search, Go to #1.

Step #25 WHAT IS THE DESIRED VEHICLE NUMBER
INNN !
Enter. number NNN after skipping one space.

Step #26 WHAT IS THE FIRST VALID VEHICLE NUMBER

Enter number; no spacing. If information on a specific vehicle is
desired, enter the same vehicle as in Step #25.

- 45 -
```

## Page 58

```text
Step # #27

Step #28

Step #29

Step #30

WHAT IS THE LAST VALID VEHICLE NUMBER
NOTE - THE DEFAULT IS VEHICLE 999°

Enter number; no spacing. If information on a specific vehicle is

enter the same number as in Step #25,

Entire document record is displayed on the terminal for each

found. See Figure 39.

THERE ARE XXX DIR/REPORTS RELATING TO VEHICLE NNN

Where XXX represents the number of documents found and NNN is the

vehicle number entered for the search. Go to #1.

DO YOU WANT A HARD COPY OF THE INFORMATION FOUND

If Yes, output spooled to printer. See Section 5.2.1 for outputs.

Exit SEARCH mode

- 46 -
```

## Page 59

```text
4.2.4 ARCHIVE MODE
4.2.4.1 DESCRIPTION OF ARCHIVE MODE

The user must be validated to execute in the ARCHIVE mode.

If not properly logged, an invalid user message will be displayed

on the terminal as follows:                                               *
SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS NECESSARY,
PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The necessary information needed in order to archive a DIR or Report is the

DIR number. The user may also designate how many documents to be archived

at one session. When the document has been archived, the user is automatically
returned to the program mode selection level as shown below. For more detail
see section 2.2 or 2.3.

PLEASE CHOSE ONE OF THE FOLLOWING

MODE                KEY
INPUT               INP
REVISE              REV
SEARCH              SEA
ARCHIVE             ARC
QUIT                QUIT

- 47 -
```

## Page 60

```text
4.2.4.2 | ACTION/RESPONSE DURING ARCHIVE MODE —

Step #1 WELCOME TO THE DIR-REPORT FILE ARCHIVE ROUTINE
HOW MANY DOCUMENTS DO YOU WISH TO ARCHIVE

Enter number XX

Step #2 WHAT IS THE DIR-REPORT NUMBER OF THE DOCUMENT YOU WISH TO ARCHIVE
[AAAA
L

te eed

Enter number AAAA up to 14 characters

Step #3 Pause for system housekeeping to be completed.  Repeat Steps #2
and #3 XX number of times,

Step #4 Exit ARCHIVE mode when done, .

- 48 -
```

## Page 61

```text
4.3       DRAWING/ ENGINEERING ORDER»
4.3.1     INPUT MODE .
4.3.1.1 DESCRIPTION OF INPUT MODE

The user must have clearance to execute within the INPUT mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The DRAWING subfile data record consists of twelve data items.
See Figure 8. The Engineering Order subfile data record consists of six
data items. See Figure 9. The main body of data for these two subfiles are
sent from Dallas rather than manually input.  Unfortunately, vehicle system
and section and engineering order titles are not available in the original
Dallas Data Base. However, these fields may be entered in manually input
drawings and E.0.'s.

The Input mode has two optional operations:
(1) E.0. - input of new engineering orders
(2) Drawings and £.0.'s - input of new drawings along with their

referenced £.0.'s.

During option number 2, entry of referenced £.0.'s, option number 1
is automatically performed if the £.0.'s are new to the data base.

Entry of new engineering orders may result in one of three

terminal messages if the drawing sheet already has three, four, or more E.0.'s
referenced. See section 5.3.1 for more information concerning this output.

- 49 -
```

## Page 62

```text
DRAWING RECORD DESCRIPTION

ITEM

NO.       DATA ITEM

(1)       TITLE

(2)       DRAWING NUMBER
* VENDOR CODE

(3)      DATE

(4)       **SYSTEM

(5)       VEHICLE

(6)       **SECTION

(7)       NUMBER OF SHEETS

(8)       SHEET NUMBER

(8)       SHEET REVISION

(9)       NUMBER OF £.0.'s

(9)       E.0.'s REFERENCED

* CONTAINED WITHIN DRAWING NUMBER
**NOT CONTAINED IN DALLAS DATA

FIGURE 8

- AN _

ITEM FORMAT

10 characters/word - 7 words

14

yo FP FSF DD Ww

Oo mo ~re TY LY

characters

characters

characters - NMDDYY
characters - 3 entries
characters - 2 entries
characters

characters

characters

characters

characters

characters - 10 entries
```

## Page 63

```text
ITEM
NO.

(1)
(2)
(3)
(4)
(5)
(6)

ENGINEERING ORDER RECORD DESCRIPTION

DATA ITEM

* £.0. TITLE

E.0. NUMBER

E.0. REVISION

E.0. DATE

E.0. REVISION DATE
VEHICLE

* NOT PRESENT IN DALLAS DATA

FIGURE 9

-51-

ITEM FORMAT

10 characters/word - 7 words
8 characters

2 characters

6 characters - MMDDYY

6 characters - MMDDYY

4 characters - 2 entries
```

## Page 64

```text
4.3.1.2 | ACTION/RESPONSE DURING INPUT MODE

Step #1 WELCOME TO THE DRAW-EO FILE INPUT ROUTINE
PLEASE INPUT INFORMATION BETWEEN EXCLAMATION MARKS AND LEFT
JUSTIFY ALL ENTRIES
IS THIS A DRAWING OR AN E.0. (DRAW OR EO)

If Draw, go to #2
If £0, go to #20

Step #2 (1) TITLE (7 WORDS ~ 10 CHAR.)
!

Enter Title

If legal entry, the entry is displayed on terminal.

If not legal, step is repeated. This is done for all entries
to follow. NOTE: User must skip a space before entering data.

Step #3 (2) DRAWING NUMBER
!              !

Enter number up to 14 characters

Step #4 (3) DRAWING DATE
!MMDDYY!

Enter month, day, and year.

Step #5 (4) SYSTEM (ELEC,GSE,GUID MECH, PROP, RF ,SOP,MGS,EGS, PERF)
|    I]    Y!    !

Step #6 (5) VEHICLE
!    !!    !
AXXA
Enter vehicle number XXXA up to two numbers, where XXX represents
the numbers. The 'A' represents the letter 'S' which stands for .
all subsequent vehicie numbers after XXX.

- 52 -
```

## Page 65

```text
~

_ Step #7

Step #8

Step #9

Step #10

Step #11

Step #12

Step #13

(6) SECTION

E SECT      UPPER B      LOWER B      ALCYONE IA
~G SECT      UPPER C      LOWER C     ALGOL ITA

EG SECT     UPPER D   LOWER D     _ANTARES ITA
BASE A      UPPER F      LOWER F      ALTAIR ITIA

H/S 34/-24  H/S 34/-40  H/S 42/-45
!           !

(7) NUMBER OF SHEETS
!             .

Enter number X

(8) ENTER THE FOLLOWING DATA:
SHEET #1

REVISION: IF NONE, NC
1!         |     oO

NUMBER OF E.0.'S
! |

ALCYONE ITA
ALGOL IIIA

_ ANTARES ITIA

CASTOR ITA

Enter number XX E.0.'s against sheet #1; up to maximum of 1C

E.O. numbers may be referenced.

If XX=0, go to #13. If XX#0, go to #11.

(9) REFERENCED E.0.'S
!        |

Enter E.0. number

ENTER ANY FURTHER AVAILABLE DATA FOR EACH E.0.

See Steps #20 thru #25. Repeat Steps #11 and #12 XX number of

times. Go to #13.

If X number of sheets = 1, qo ta #19

If X number of sheet is more than 1, go to #14 |

- 53 -
```

## Page 66

```text
Step #14 (8) ENTER THE FOLLOWING DATA:
EXAMPLE SHEET ENTRY:         )
SHEET #2.1 !02!!10!
1!

Step #15 REVISION: IF NONE; NC
! ]

Step #16 NUMBER OF E.0.'S
! of

Enter number XX E.0.'s against sheet entered in Step #14; up
to maximum of 10 E.0. numbers may be referenced.
If XX=0, go to #19. If XX#0, go to #17.

Step #17 REFERENCED E.0.'S
!        !

Enter E.0. number

Step #18 ENTER ANY FURTHER AVAILABLE DATA FOR EACH E.0.

See Steps #20 thru #25
Repeat Steps #17 and #18 XX number of times.
Go to #19

Step #19 Entire drawing record along with referenced E.0.'s are displayed

on the terminal. Go to #34,

Step #20 (1) TITLE (7 WORDS - 10 CHAR.)
!                                                           !

Enter title

If legal entry, the entry is displayed on terminal.

If not legal, step is repeated. This is done for all entries
to follow. NOTE: User must skip a space before entering data.

- 54 -
```

## Page 67

```text
Step #21
Step #22

Step #23

Step #24

Step #25

Step #26

Step #27

Step #28

Step #29

(2) £.0. NUMBER
!      !

-(3) REVISION: IF NONE, ENTER NC

! 4]

(4) E.0. DATE
IMMDDYY!

Enter month, day, year

(5) £.0. REVISION DATE
'MMDDYY!

(6) VEHICLE
ft]    !

[XXXA ~

Enter vehicle number XXXA up to two numbers where XXX represents
the numbers. The 'A' represents the letter 'S' which stands for
all_ subsequent vehicle numbers after XXX.

HOW MANY DRAWINGS DOES THIS £.0, REFERENCE

[xX

Enter number XX; up to maximum of 99,

WHAT IS THE DRAWING NUMBER
!              !

HOW MANY SHEETS OF THIS DRAWING ARE REFERENCED BY THIS E.O.

Enter number of sheets NN (Maximum of 99)

WHAT IS THE SHEET NUMBER: —

EXAMPLE SHEET #2.1 !02!!10!
foot

- 55 -
```

## Page 68

```text
Step #30

Step #31

Step #32

Step #33

Step #34

Repeat this step NN number of times.  Repeat steps #27 thru #29
XX number of times.

If number of £.0.'s on a sheet js:
Less than four, go to #34
Five, go to #32

More than five, go to #33

A_warning message is displayed on the terminal prior to displaying

the entire engineering order record. See output section 5.3.1.

Go to #34

An_ attention message is displayed on the terminal prior to displaying

the entire engineering order record. See output section 5.3.1.

Go to #34

An important revision action due message is displayed on the terminal

prior to displaying the entire engineering order record. See output

section 5.3.1. Go to #34 -

IS THERE FURTHER INFORMATION TO BE INPUT (YES OR NO)

If Yes, go to #1
If No, exit INPUT mode.

- 56 -

```

## Page 69

```text
4.3.2 REVISE MODE.      |
4.3.2.1 DESCRIPTION OF REVISE MODE

The user must have clearance to execute within the REVISE mode;
otherwise, an invalid user message will be displayed at the terminal as
follows:                         .

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE.
IF IT IS NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

This restriction is deemed necessary because the REVISE mode allows a user to
revise not only any part or all of a drawing or engineering order, but also
to delete the entire record from the subfile in which it is located. The
only necessary information needed in order to revise or delete a drawing or
engineering order are the Drawing number or E.0. number, respectively.    |

The REVISE mode may change the revision of a sheet. During this

modification, all engineering orders referenced by that drawing sheet are
automatically deleted. The REVISE mode may also add new sheets to a drawing.

-57-
```

## Page 70

```text
4.3.2.2

Step #1

Step #2

Step #3

Step #4

Step #5

Step #6

Step #7

Step #8

ACTION/RESPONSE DURING REVISE MODE
DO YOU WISH THE E.0. OR THE DRAWING FILE (EO OR DRAW)

If E0, go to #2

If DRAW, go to #3

PLEASE INPUT THE SPO EO NUMBER OF THE RECORD TO BE REVISED

Enter number; go to #4

PLEASE INPUT THE SPO DRAWING NUMBER OF THE RECORD TO BE REVISED

Enter number after skipping one space; go to #4

Entire record displayed on terminal when found.

IS THIS THE CORRECT RECORD TO BE REVISED OR DELETED (YES OR NO)

If Yes, go to #6

If No, continue search for number. When found repeat Step #4

If not found, exit REVISE mode.
IS THIS RECORD TO BE REVISED OR DELETED (REV OR DEL)

If Rev and EO previously selected, go to #7

If Rev and DRAW previously selected, go to #10

If DEL, record DELETED; exit REVISE mode

HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 6)

'X

Enter number X

INPUT THE ITEM NUMBER THAT YOU WISH TO REVISE

Enter number N

~ 58 -
```

## Page 71

```text
‘Step #9 Repeat X number of times         .
_        Branch to data item N to be revised as shown in Input mode
(4.3.1.2 Steps #20 thru #25). Go to #24

Step #10 HOW MANY ITEMS DO YOU WISH TO REVISE (MAX OF 9)

Enter number X

Step #11 INPUT ITEM NUMBER THAT YOU WISH TO REVISE

[N_

Enter item number N
If N=7, go to #12
If N=8, go to #13
Otherwise, go to #14

Step #12 IS THIS A CORRECTION OF SHEET ITEM: ENTER YES
OR IS THIS A NEW SHEET ENTRY FOR A DRAWING: ENTER NEW

Enter response; go to #14

Step #13 IS THIS A REVISION ENTRY FOR A NEW DRAWING SHEET (YES OR NO)

Note: A No answer indicates a revision item correction.
A Yes answer will delete all E.0.'s for this sheet.
Enter response; go to #14

Step #14 Repeat Step #11 X number of times.
Branch to data item N to be revised.
See INPUT mode (4.3.1.2 Step #2 thru #8).
If N=7, go to #15
If N=8, go to #17
If N=9, go to #19
Otherwise, go to #24

- 59 -
```

## Page 72

```text
Step #15 SAME AS INPUT MODE (4.3.1.2 STEP #8)

If Yes option selected in Step #12, go to #24
If New option selected in Step #12, go to #16

‘Step #16 ENTER SHEET NUMBER: EXAMPLE SHEET #2.1 !02!!10!
foil

Enter sheet number; go to #24

Step #17 WHAT SHEET IS TO BE REVISED.

EXAMPLE: SHEET #2.1 !02!1!10!
Poo}

Enter sheet numbers
If first sheet of drawing, go to #24
If not first sheet, go to #18

Step #18 SHEET REVISION: IF NONE, ENTER NC
t

Enter Revision; go to #24

Step #19 WHAT SHEET NUMBER DO YOU WISH TO REVISE A REFERENCED £.0.

EXAMPLE: SHEET #2.1 !02!!10!
ot! of

Enter sheet numbers

Step #20 All _E.0.'s will be displayed with a counter to number each up to 10.

HOW MANY DO YOU WISH TO REVISE
' XX

Enter number XX

- 60 -
```

## Page 73

```text
~ Step #21

Step #22

Step #23

Step #24

Step #25

ENTER THE REFERENCED E.0.. NUMBER TO BE REVISED
NOTE: MUST BE FROM 1 TO 10,-

[RN

Enter number NN

ENTER REVISED REFERENCED £.0.
|        !

Enter EO number
This number will replace the NNth EO listed in Step #20.

Repeat steps #21 and #22 XX number of times as indicated in
Step #20. Go to #24,

Entire record displayed on terminal.

CHECK RECORD: IF CORRECT, ENTER (co)
IF REVISE NEEDED, ENTER (RE)

If CO, exit REVISE mode.
If RE and EO previously selected; go to #7.
If RE and DRAW previously selected, to go #10.

- 61 -
```

## Page 74

```text
4.3.3 SEARCH MODES              ,
4.3.3.1 DESCRIPTION OF SEARCH MODE.

Of the twelve (12) data items within the Drawing subfile, nine
(9) are searchable. The resulting outputs from these searches always
consists of six (6) data items. See Figure 10, The Engineering Order
subfile consists of six (6) item records, of which only two are searchable.
. The resulting outputs from these two searches consists of up to all six (6)
data items. It should be noted that Revision Date jis output in place of the
E.0. Date when an E.0. has a revision. This allows only the most recent _
date to be displayed. See Figure 11.

Due to the data base source for drawings coming from Dallas and
manual input, three searches have limited capability:  System, Section,
and Date. The System and Section searches are only usable for those drawings
which are manually input. However, some Dallas drawing data will contain thts
information within the title. Therefore, a title search can be used if
either the system or section searches are found unsuccessful. The Date
search is also limited in that all Dallas drawing data will have the same date.
This date represents the latest information update received from Dallas.
Nevertheless, the Date search has the capability of retrieving an entire
month's or year's worth of data by entering 00 for the day or month. For
example, entering 110078 would result in finding all drawings within
the data base in the eleventh month, November, for the year 1978, Likewise,
an entry of 000078 would retrieve all documents for the year 1978,

There are two specialized searches: Revision Action Due and Print
All. Revision Action Due search finds all drawings containing sheets which
reference five or more engineering orders. The Print All search has two
options: (1) Output al! drawings and their referenced £.0.'s or  (2) Output
all engineering orders in the data base,

The Vehicle search also has some spectal qualities.  First, the user
may search for all drawings related to a certain vehicle, or search for all
engineering orders related to a certain vehicle.  Secondly, a group of vehicles
may be found by using the first and last valid vehicle options. For example,
if a user declares the first valid vehicle as 198 and is searching for vehicle
number 200, Not only would all records containing vehicle 200 be found, but

- 62 -
```

## Page 75

```text
also those with number 198S, 199S, and 200S; where S represents all subsequent
vehicles. Default for the first valid vehicle number is zero (0); whereas,
the last valid vehicle number becomes 999,

‘Another search also has the drawing and engineering order options.
This is the £E.0. number search. The user may search the Engineering Order
subfile for a specific E.0. number or search the Drawing subfile for all
drawings referencing a specific E.0. number. See Figure 12 for an outline
of search capabilities.

If many documents are found during a search and it is observed
that needed information will soon disappear from the screen, the user may
temporarily stop terminal display by depressing the space bar. Terminal

display be restarted by depressing the 'Q' key.

- 63 -
```

## Page 76

```text
SEARCHABLE DRAWING DATA ITEMS

DRAWING SUBFILE           ,            SEARCHABLE               OUTPUT.
DRAWING NUMBER                             *                    *
VENDOR CODE                               *

TITLE                                        *                       ‘
DATE                       *
SYSTEM                                    *

VEHICLE                                   *

SECTION                                    *

NUMBER OF SHEETS

SHEET NUMBER                                                    *
SHEET REVISION                                                    r
NUMBER OF £.0.'s                          ee                    ,
E.0.'s REFERENCED                          ‘         rn

** NUMBER OF E.0.'s CHECKED WHEN PERFORMING A REVISION ACTION DUE SEARCH

FIGURE 10

- 64 -
```

## Page 77

```text
SEARCHABLE ENGINEERING ORDER DATA ITEMS

SEARCHABLE          OUTPUT
E.0. NUMBER                                 *
E.0. TITLE                                                  rs
E.0. REVISION               ee
E.0. DATE                                                   ‘
£.0. REVISION DATE                                            .
VEHICLE                                  *

** NOT OUTPUT DURING A VEHICLE SEARCH

FIGURE 1]

- 65 -
```

## Page 78

```text
DRAWING/ENGINEERING ORDER SEARCHES

PARAMETER                               SPECTAL NOTATION

DRAWING NUMBER

DATE                                    DALLAS DATA ALL ONE DATE

SYSTEM                                  NOT APPLICABLE WITH DALLAS
SECTION                                 NOT APPLICABLE WITH DALLAS
VEHICLE                                 TWO OPTIONS: £.0.'s OR DRAWINGS

VENDOR CODE

TITLE                                   **

REVISION ACTION DUE                     FIVE (5) OR MORE E.0.'s

ALL                        )            TWO OPTIONS: E.0.'s OR DRAWINGS
E.0. NUMBER                             TWO OPTIONS: E.0.'s OR DRAWINGS

** DALLAS DATA TITLES SOMETIMES
CONTAIN SYSTEM AND/OR SECTION

FIGURE 12

- 66 -
```

## Page 79

```text
4.3.3.2

Step #1

Step #2

Step #3

Step #4

ACTION/RESPONSE DURING SEARCH MODE

YOU ARE VALIDATED TO SEARCH DATA IN THE DRAWING FILE.
FOLLOWING SEARCH MODES ARE AVAILABLE FOR YOUR USE

MODE
TITLE

DRAWING NUMBER
DRAWING DATE
SYSTEM

VEHICLE
SECTION
VENDOR CODE
ALL

REV ACTION DUE
E.0. NUMBER
QUIT

KEY
TITLE
DRAW
DATE
Sys

_ YEH
SECT
CODE
ALL
ACT
EO
QUIT

PLEASE SELECT THE DESIRED MODE

Enter key for desired mode

If Quit, go to #60

No user reponse

DO YOU DESIRE THE OPTIONAL BRIEF OUTPUT.
RECOMMENDED FOR ALL AND ACTION DUE SEARCHES (YES OR NO)

Enter Option: Brief gives faster search response.

See sample outputs Figures 41 and 42.

If key selected is

TITLE, go to #5

If key selected is

ALL, go to #12

If key selected is

ACT, go to #20

If key selected is

DRAW, go to #25

If key selected is

DATE, go to #28

If_key selected is

SYS, go to #32

If key selected is

VEH, go to #36

If key selected is

SECT, go to #46

if key selected is

Ludi, yo to #59

I7 key selected is

r0, go to #54

- 67 -

THE
```

## Page 80

```text
Step #5 | HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)

Enter Number X

Step #6 WHAT IS THE DESIRED WORD

Enter word AAAA; up to 10 characters
If word is Quit, go to #11, -

Step #7 As each title is found containing the desired word, the title
is displayed on the terminal. Following the last title is
displayed a message:

THERE ARE XXX DRAWINGS CONTAINING THE WORD AAAA

Where XXX represents the number of drawings found and AAAA is the
desired word entered.

Step #8 Steps #6 and #7 are repeated X number of times from Step #5
unless zero (0) drawings are founc. If no drawings are found,

go to #11.

Step #9 For all drawings found, drawing data is displayed after the last
word is searched. See figure 14,

Step #10 IF YOU WISH TO CONTINUE, DEPRESS THE RETURN KEY

When Return key is used, go to #1.

Step #1] DC YOU WISH TO TRY THE TITLE SEARCH AGAIN (YES OR NO)

If Yes, go to #5
If No, same as #10

- 68 -
```

## Page 81

```text
“Step #12

Step #13

‘Step #14

Step #15

Step #16

Step #17

Step #18

Step #19

Step #20

Step #21

WHICH PRINT ALL OPTION DO YOU WISH:
DRAWING AND E.0.s (DE)
E.0.'s ONLY (EO)

If DE, go to #13

If £0, go to #16

THIS IS THE PRINT ALL ROUTINE
ALL DRAWINGS STORED IN THE DRAW FILE WILL BE SPOOLED AND A TOTAL
COUNT OF THE DRAWINGS WILL BE GIVEN

Drawing data is displayed on the terminal for each drawing found
along with referenced E.0.'s, —See Figure 41.

THERE ARE XXX DRAWINGS IN THE DRAW FILE

Where XXX represents the number of drawings found. Go to #19.

THIS IS THE PRINT ALL ROUTINE
ALL ENGINEERING ORDERS STORED IN THE EO FILE WILL BE SPOOLED AND
A TOTAL COUNT OF THE DRAWINGS WILL BE GIVEN

Engineering order data is displayed on the terminal for each
EO found. See Figure 42,

THERE ARE XXX E.0.'s IN THE EO SUBFILE

Where XXX represents the number of engineering orders found.

Go to #18.

Output file is automatically spooled to the hich speed printer;

exit the SEARCH mode.

THIS IS THE REVISION ACTION DUE SEARCH ROUTINE
ALL DRAWINGS WITH FIVE (5) OR MORE E.0.'s ARE FOUND AND SPOOLED

Drawing data is displayed on the terminal for each drawing sheet

found Sea Figure 41.

-- 69 -
```

## Page 82

```text
Step #22 THERE ARE XXX DRAWINGS WITH A TOTAL OF NNN SHEET(S) IN THE
DRAWING SUBFILE WHICH MUST BE REVISED

Where XXX represents the number of drawings found and NNN
represents the number sheets found.

Step #23 If no drawings are found, go to #24. If drawings are found,
output file is automatically spooled to the high speed printer;
exit the SEARCH mode.

Step #24 Go to #10

Step #25  WHAT IS THE DESIRED DRAWING NUMBER

Enter number NNNN; 14 characters.

Step #26a Drawing data_is displayed on the terminal along with referenced

£.0.'s. See Figure 41.

Step #26b If not found, the following message is displayed:

THERE IS NO DRAWING WITH NUMBER NNNN IN THE DRAWING FILE

Where NNNN represents the drawing number entered for the search.

Step #27 Go to #10

Step #28 WHAT IS THE DATE THAT YOU WANT
!MMDDYY!

Enter date; month, day, and year after skipping one space.

Step #29 Drawing data is displayed on the terminal for each drawing found
along with referenced E.0.'s. See Figure 41.

```

## Page 83

```text
Step #30

Step #31

Step #32

Step #33

Step #34

Step #35

Step #36

Step #37

Step #38

THERE ARE XXX DRAWINGS WITH A DATE OF MM-DD-YY

Where XXX represents the number of drawings found and MMDDYY
represents the date entered for the search.

Go to #10

WHAT IS THE DESIRED SYSTEM
(ELEC, GSE ,GUID,MECH, PROP RF, SOP,MGS, EGS, PERF)

[AMAA

Enter system AAAA; up to 12 characters

Drawing data is displayed on the terminal for each drawing found along

with referenced £.0.'s. See Figure 41.

THERE ARE XXX DRAWINGS WITH A SYSTEM OF AAAA,

Where XXX represents the number of drawings found and AAAA
represents the system entered for the search.

Go to #10

WHAT IS THE DESIRED VEHICLE NUMBER
NNN

Enter vehicle number NNN

WHAT IS THE FIRST VALID VEHICLE NUMBER

‘Enter number. If information on a specific vehicle is desired,

enter the same vehicle as in Step #36,

WHAT IS THE LAST VALID VEHICLE NUMBER
NOTE: THE DEFAULT IS VEHICLE 999.

Enter number. If information on a specific vehicle is desired,
enter the same vahicle as in Step #36.

-71-
```

## Page 84

```text
Step #39

Step #40

Step #41

Step #42

Step #43

Step #44

Step #45

Step #46

DO YOU WISH A LIST OF ALL E.0.'S FORA SPECIFIC VEHICLE:

ENTER EO

OR A LIST OF DRAWINGS RELATED TO SPECIFIC VEHICLE:

ENTER DR

If E0, go to #43

If DR, go to #40

Drawing data_is displayed on the terminal for each drawing found

along with referenced E.0.'s. See Figure 41.

THERE ARE XXX DRAWINGS RELATING TO VEHICLE NNN

Where XXX represents the number of drawings found and NNN

represents the vehicle number entered for the search.

Go to #10

Engineering order data is displayed on the terminal for each

EO found. See Figure 43.

THERE ARE XXX E£.0.'S RELATED TO VEHICLE NNN

Where XXX represents the number of engineering orders found and

NNN represents the vehicle number entered for the search.

Go to #10

WHAT IS THE DESIRED SECTION

E SECT     UPPER B     LOWER B     ALCYONE IA    ALCYONE ITA

G SECT     UPPER C     LOWER C     ALGOL IIA      ALGOL IIIA

EG SECT    UPPER D     LOWER D     ANTARES IIA    ANTARES IIIA

BASE A     UPPER F     LOWER F     ALTAIR IIIA    CASTOR IIA
H/S 34/-24 H/S 34/-40 H/S 42/-45

[AAAA                                    :

Enter section AAAA; up to 12 characters.

-72-
```

## Page 85

```text
Step #47 Drawing data is displayed on the terminal for each drawing found
along with referenced £.0.'s. See Figure 41.

Step #48 “THERE ARE XXX DRAWINGS RELATED TO SECTION AAAA

Where XXX represents the number of drawings found and AAA
represents the section entered for the search.

Step #49 Go to #10

Step #50 WHAT IS THE DESIRED VENDOR CODE
[AAA

Enter vendor code AAA.

Step #51 Drawing data is displayed on the terminal for each drawing
found along with referenced £.0.'s. See Figure 41.

Step #52 THERE ARE XXX DRAWINGS WITH THE SPECIFIED VENDOR CODE AAA

Where XXX represents the number of drawings found and AAA
represents the vendor code entered for the search.

Step #53 Go to #10

Step #54 WHAT IS THE DESIRED E.0. NUMBER

[NNNNNN

Enter number NNNNNN

Step #55 DO YOU DESIRE THE E.0. FILE SEARCH (E0)
OR ALL DRAWINGS USING THIS E.0. (DR)

If £0, go to #56.
If DR, go to #58.

Step #56a Engineering order data is displayed on the terminal when EO number

is found. See figure 42.

-73-
```

## Page 86

```text
Step #56b If not found, the following message is displayed:

Step #57

Step #58

Step #59

Step #60

“Step #61

THERE IS NO E.0. NNNNNN IN THE EO SUBFILE

Where NNNNNN represents the engineering order number entered for

the search.

Go to #10

THERE ARE XXX DRAWINGS WITH A TOTAL OF NNN SHEET(S) IN THE DRAWING
SUBFILE WHICH REFERENCES E.0.

NNNNNN

Where XXX represents the number of drawings found, NNN represents

the number of sheets found, and NNNNNN represents the engineering

order number entered for the search.

Go to #10
DO YOU WANT A HARD COPY OF THE INFORMATION FOUND

If Yes, output spooled to printer.

See section 5.3.2 for outputs.

Exit SEARCH mode.

~74-
```

## Page 87

```text
4.3.4    ARCHIVE MODE      |
4.3.4.1 DESCRIPTION OF ARCHIVE MODE

The user must be validated to execute in the ARCHIVE mode,
If not properly logged, an invalid user message will be displayed on
the terminal as follows:                                   ,

SORRY, YOU ARE NOT VALIDATED TO USE THIS MODE. IF IT IS
NECESSARY, PLEASE CONTACT SYSTEM OPERATOR AT EXT. 2621.

The only necessary information needed in order to archive a drawing is the
Drawing number. The user may also designate how many drawings are to be
archived at one session. Engineering orders which are unreferenced by any
drawings are automatically archived. When the Drawing or £.0. has been
archived, the user is automatically returned to the program mode selection
level as shown below. For more details see sections 2.2 or 2.3.

PLEASE CHOSE ONE OF THE FOLLOWING

MODE                 KEY
INPUT               INP
REVISE        .     REV
- SEARCH              SEA
ARCHIVE             ARC
QUIT                QUIT

- 75 -
```

## Page 88

```text
4.3.4.2

Step #1

Step #2

Step #3

Step #4

‘Step #5

Step #6

Step #7

ACTION/RESPONSE DURING ARCHIVE MODE
DO YOU WISH TO ARCHIVE DRAWINGS OR E.0.'s (DR OR EO)

If DR, go to #2
If EO, go to #5

WELCOME TO THE DRAWING FILE ARCHIVE ROUTINE,
HOW MANY DRAWINGS DO YOU WISH TO ARCHIVE

Lx

Enter number XX

WHAT IS THE DRAWING NUMBER OF THE DRAWING YOU WISH TO ARCHIVE

Enter number; 14 characters.

Pause for system housekeeping to be completed. Repeat Step #3
XX number of times. Go to #7.

PLEASE STAND BY. SYSTEM IS NOW ARCHIVING UNREFERENCED E.0.'S

No user response required.

As each E.0.'s is archived the following message is displayed on
the terminal:

E.0. NNNNNN HAS BEEN ARCHIVED.

Where NNNNNN represents the engineering order number.

Exit ARCHIVE mode when done.

- 76 -
```

## Page 89

```text
5.0       MAIL LOG OUTPUTS

Qutputs produced during operation in the MAIL LOG program can be
placed into two categories: Terminal and Printer, Terminal and printer
outputs may consist of special printed listings of data records found during
the SEARCH modes. Terminal outputs may also consist of important status
messages to the user during the INPUT mode, Other printer outputs consist of
special printed listings of data records entered during the INPUT mode.
Figures 13 thru 56 show all basic forms of MAIL LOG outputs.

-77-
```

## Page 90

```text
5.1       CORRESPONDENCE - OUTPUT FORMATS.

Outputs produced while operating within the daily correspondence
subfile may result during two modes: INPUT and SEARCH.

5.1.1     INPUT MODE FOR CORRESPONDENCE

Output resulting from the INPUT mode fs a special listing of new
document records entered during the daily input session. The high speed
printer output documents are stored according to mail status. This output

can be given in two optional forms:

(1) A complete data record listing
See Figure 13.

(2) A brief or partial data record listing
See Figure 14.

- 78 -
```

## Page 91

```text
- 61 -

2e

36

CORRESPONDENCE INPUT                                       COMPLETE OUTPUT

eee eee eee ee eee ee eee eT CSS CTS T SSeS CSS CSSS SS CCCCCO SISOS TESTS TSS TST TEST STOTT LECT COCCI TO LCCC TC Creer ereTe

VOUGHT/DALLAS CORRESPONDENCE             °  INPUT DATE 12- 6-78               .   7
SUBGECT        .                                     DOCUMENT DATE   FILE SYSTEM CODE
AUTHOR / SOURCE                  TO                           !      ROUTING                .   TYPE/LETTER NUMBER
‘ACTION DUE DATE                WA NUMBER/ID CODE   CONTRACT NUMBER

NASA RESPONSIBLE ENGINEERCS)
REFERENCE DOCUMENT NUMBER(S)
DESCRIPTION OF TRANSMITTAL OR SPECIFICATION

Wa Ree te it a RN ERE ERE RE ERIK TENET KAKA AE ERA ARES

AGENDA CCB MEETING 12/7/78                                                       12- 6-78               /

BEANs Je                       DEARINGs Je De                     JOD/   /   /   /   /        MFX O-1
O- 9- 0
JON
NONE
REVIEW SAI DOCUMENTATION                         + 9 L2- 5-78     650-5     /
HACHALA, Ceo Feo                 GUTHRIEs De Eo                     SJA/DEG/UVC/   /   /        MFX D-4
O- 0- 0
OLG
NONE
T&SK-R-105 SPECIAL INSTRUMENTATION KITS ANTARES III                              12- 5-78     6B82/K -    /
YOUNG, He Ga                   OWENS» Ae Ao                       CSL/SJA/JBT/DMF/AAO/   .    MF X       ,
O- U- 0                       3526 °                              NAS1-15100
CSL                                    .
NONE
REQUEST CHANGE PACKAGE APPROVAL                                                  12- 5-78     40961     /
URASHs Re Ge                   FOSTERs Le Res WINTERS» Co We      CWW/UOO/ROS/   /   /        2~94000/8T-203
12-20-78                       352568                       .   :  NAS1-15000
JO0                                                                 ‘

2-94000/8T-192                                             \

APPROVAL MINUTES SSTH-SCOUT RELIABILITY REVIEW MEETING                           12- 6-78     407-1     /
EVERHARTs? Pe Eo                VCy NAVPRO» REMOg WTR» WFC         PEE/AAO/UVC/SJA/RPP/        S-4465/PLE
O- J- O     3525FR                   ,          NAS1-15000

PEE                                                            :

2-94000/8L-4299

FIGURE 13
```

## Page 92

```text
- uy -

CORRESPONDENCE INPUT                                |      COMPLETE OUTPUT

SKHAARARARHHA ERRARAHRARERAR TETHER RARER EKER EKER RHEE EE ERA KRAEMER HERE EARTH AREER

INCOMING MAIL                         INPUT DATE 12- 6-78
SUBJECT                        ,                                             DOCUMENT DATE   FILE SYSTEM COYNE
AUTHOR /SOURCE                  TO    ROUTING                    TYPE/LETTER NUMBER
ACTION DUE DATE                WA NUMBER/ID CODE                   CONTRACT NUMBER

NASA RESPONSIBLE ENGINEER(S)
REFERENCE DOCUMENT NUMBER(S).
DESCRIPTION OF TRANSMITTAL OR SPECIFICATION

RHREEARRARARKARAHAEHERAEER AKER ER AKER RRR RRA REAR RHE RK RRR ARERR AERA EERE EKER HEHEHE HEE

SCOUT/WFC FIELD OPERATIONS DAILY WORK SCHEOULE 12/6/78                           12- 6-78 . 405.210    /
DAWSON» Co Heo                  WINTERS» Ceo We} DUNCANs DOEARING    ALL/   /   / oT   /        MFX
O- G-"0                        3525FR                       .       NAS1-15000
cwWw
NONE
VC/VAFB-OPERATIONS DAILY WORK SCHEDULE 12/6/78 -                                  12- 6-78     403.9     /
HALEy Ceo Fe                    WINTERS» Co We$ DEARINGs Je De     CWW/UOD/UBT/S Oo /   /        MF X
Q- J- 0            3525FR                               NAS1-15000
JOD
NONE
VC/WFG DAILY STATUS VEHICLE S$-202C                                     .         12— 6-78     131-202   /
DAWSON, Ce Me                  AILORs Se Je            :          ALL/   /   /   /   /        MFX 820/FO0C
0~ D- 0                       3525FR             NAS1-15000
JA
NONE
RESEARCH & TECHNOLOGY ANNUAL REPORT                                              ll- 7-78     40561     /
KRIEGER» Re Le   WFC           NASA-HDOQTS.3 SPO                   LRF/   /   /   /   /        LETTER
O- d- 0
LRF
NONE               7
LIST JOB-ORDERS CLOSED EFFECTIVE PAY-PERIOD ENDING 12/2/78                   . 12= 1-78     50964601   /
WILSGNs Je Ha                  SPO                                NHT/AY /DEF/   /   /        MEMO
O- 0- O
LRF
NONE

FIGURE 13
```

## Page 93

```text
L8 -

Ge

CORRESPONDENCE INPUT                                   COMPLETE OUTPUT

SARRREHARESERERSASSENSENESSATAASR AE SEES AREER EEE REE ANTS EERE ENE RAER TEES EERE SEERA EERE THERE EE EEAE EERE ETE E EEE EE AER OED

;             INCOMING MAIL ©                       INPUT DATE 12- 6-78
SUBJECT                                         OOCUMENT DATE   FILE SYSTEM COOE
AUTHOR /SOURCE                  TO     ROUTING                    TYPE/LETTER NUMBER
ACTION DUE DATE                WA NUMBER/IO CODE                   CONTRACT NUMBER

NASA RESPONSIBLE ENGINEERCS)

“REFERENCE OOCUMENT NUMBER(S)

DESCRIPTION OF TRANSMITTAL OR SPECIFICATION

iii hhh hid hhh heheh he hhh PEE CAE SECTS SECC TOCLTCLLCLCTSSLCCLCCCTOCLCTCCTOCT OCLC CCCI TTL TTT TTT ET eT eT

NAS1-11859 REQUEST MOOIFICATION ESTIMATED COST $10692                            11-17-78     65263     /
OCHS» Fe Ie   THIOKOL CORP.    SPO                                AAO/JUVC/BEQ/ =   /        CA-FO-1312-1410CCN
O- 0O- 0                 NAS1-11859

RAO

Te

NONE

CSG PROPOSAL 78-8078 ENVIRONMENTAL CONTROL ALGOL-JII ROCKET-MTS                  11-30-78     652660128 /

- ROBERTS» Eo   CSD           ;  _ SPO                                AAO/JUVC/BEQ/   /   /.        ER271-78

8.

Se

O- O- 0               NAS1-14619
AA
S-8439/PEE

SCCUT PROJECT MANAGEMENT REPORT                                                  11-30-78     576      7

OVERMAN» Be Le              SPO                                ALL/ = /   /   /   /        REPORT

O- O- 0                                            7      ,                      :
LRF
NONE

AUTHORIZATION SHIPMENT REMOVAL BONDEO STORES GOVERNMENT PROPERTY   12- 1-78     514.261   /
YAMUAMOTOs Ao    REMO           NAVPRO»s SPO            .           SYA/DCM/JDD/.   /   /       ‘MENO

0- 0- 0                                      .             .   :  NAS1-15000

SJA

NONE          {

SHIPMENT   BOLT       CUTTERS    SQUIBS                 ,

FIGURE 13
```

## Page 94

```text
- 2 - |

le

;

CORRESPONDENCE INPUT                                .      COMPLETE OUTPUT

RR He RRR ARERR ETRE ERE RARER REET TREE RETREAT EEREEAAER EERE Ree RE

.              OUTGOING MAIL.                     INPUT DATE 12- 6-78 .
SUBJECT        ;                   .                                         DOCUMENT DATE   FILE SYSTEM CODE
AUTHOR /SOURCE                  TO                                ROUTING                ;   TYPE/LETTER NUMBER
ACTION DUE DATE            _ , WA NUMBER/ID CODE                    CONTRACT NUMBER          .
NASA RESPONSIBLE ENGINEERCS)                                                             f

REFERENCE DOCUMENT NUMBER(S)
DESCRIPTION OF TRANSMITTAL OR SPECIFICATION

DESCRIPTION OF TRANSMITTAL OR SPECIE ECR ON cunuusauseuataneneness

<

DATA PRINTER RIBBONS MODIFICATION PR 8300.0853                                   12- 5-78     115.2     /

KEYNTON» Re Je                 CANNONs Le   PROC.                 RJK/   /   /   /   /        MEMO
O- J- 0

RJK

PR8300 20833

FIGURE 13
```

## Page 95

```text
CORRESPONDENCE INPUT |   ;     BRIEF OUTPUT

eee Pe eee ee eee eC eee ee eee ee cee ee eee eee Cee SS CCC CSS CCLSESCSSCCLCSSCCCSCCCLESLCSCOSCCSSCCSSS SST SSE SS ITCTOTCTOSCT CCT SE
VOUGHT/DALLAS CORRESPONDENCE                INPUT DATE 12- 6-78               .

SUBJECT        .                                                              DOCUMENT DATE   FILE SYSTEM CODE

AUTHOR /SOURCE                  TO.                                 ROUTING                    TYPE/LETTER NUMBER

RI EE III III III IIIS TODO UII TREE ER RR RA RED

- €8-

le

Se

4-

Se

AGENDA CCB MEETING 12/7/78                                                       12~ 6-78               /
BEANe Je                       QEARINGs Je Deo                     JO0/   /   /   /   /        MFX G-1

REVIEW SAI DOCUMENTATION                                                         12- 5-78     650.5     /
MACHALAs Ce Fe                 GUTHRIE? De Eo                     SJA/DFG/UVC/   /   /        MFX O-4
TASK-R-105 SPECIAL INSTRUMENTATION KITS ANTARES III                              12- 5-78     632/R     /
YOUNGe He Ge            .      OWENS» Ae Ao                       CSL/SJA/JUBT/OMF/AAO/        MFX

REAVEST CHANGE PACKAGE APPROVAL                                                  12- 5-78     409.1     /
URASHs Re Ge   ,               FOSTERs Le Re$ WINTERSs Co We      CWW/IDD/ROS/   /   /.       2-94000/8T-203
APFROVAL MINUTES SSTH=SCOUT RELIABILITY REVIEW MEETING                  :        l12- 6-78     407.1     /
EVERHARTs Pe Eo      ,         VCo NAVPROs REMOs WTRe WFC         PEE/SAAQ/UVC/SJA/RPP/        S~4465/PEE

FIGURE 14
```

## Page 96

```text
- 98.-

1.

3e

4e

Se

be

Te

Be

Fe

CORRESPONDENCE INPUT        ;                              BRIEF OUTPUT

Pee eee Cee ee eee eee eee eee SSP CPPS SSCS SS CSOT CCL SS STS CSCC SSAC SLOSS CLSLSLS SCT SCSSS ESTOS SCC CTCL CTC TTT Te
INCOMING MAIL                         INPUT DATE 12- 6-78                         ‘

SUBJECT                  .                                                   DOCUNENT DATE   FILE SYSTEM COUE

AUTHOR /SOURCE        :         TO                                  ROUTING                    TYPF/LETTER NUMBER

AAAAREAHRA RH eh i a HRT TR RR RHR EEA ETHER RAEN RE REREE

SCOUT/WFC FIELD OPERATIONS DAILY WORK SCHEDULE 12/6/78                           12- 6-78     405.10    /
DAWSONs Ceo Me                  WINTERSs Ceo Weis DUNCANs DEARING    ALL/   /   /   /   /        MF X

VC/VYAFB OPERATIONS DAILY WORK SCHEDULE 12/6/78     ,        °                    12- 6~78     403.9     /
HALEs Ceo Fe                    WINTERSs Ceo Wes DEARINGs Je De     CWW/JUDD/JUBT/   / ft        MF X

VC/WFC DAILY STATUS VEHICLE S-202C                                               12- 6-78     131-202   /
DAWSON» Ceo Me                  AILORe Se Je             ALL/   /   /   /   /        MFX 820/F0C
RESEARCH & TECHNOLOGY ANNUAL REPORT                                            / 11- 7-78     405-1     /
KRIEGERs Re Le   WFC.     NASA-HOQGTS-«$ SPO                   LRF/   a A   /   /        LETTER

LIST JOB-ORDERS CLOSED EFFECTIVE PAY=PERIOD ENDING 12/2/78 |      .               l2- 1-78     509-4.1   /
WILSON» Je He                  SPO                               “NHT/AY /DEF/   /   /        MEMO

NAS1-11859 REQUEST MODIFICATION ESTIMATED COST $10692           11-17-78     65268     /   :
OCHSe Fe Ie   THIOKOL CORP.    SPQ.                               AAO/JSVC/BEQ/   /   /        CA~FO0-1312-141 0CCN
CSD PROPOSAL 78-8078 ENVIRONMENTAL CONTROL ALGOL-III ROCKET-MTS                  11-30-78 652660108 /
ROBERTS» E-   CSD           * SPO                              -* AAO/SJVC/BEQ/   /   /        ER271-78

SCOUT PROJECT MANAGEMENT REPORT                                                  11-30-78 |  576       /
QVERMANs»s Be Le                 SPO                           ‘    ALL/   /   /   /   /        REPORT
AUTHORIZATION SHIPMENT REMOVAL BONDED STORES GOVERNMENT PROPERTY                 12=- 1-78     514-201   /
YAMAMOTOs Aw    REMO ©         NAVPROs SPO             .          SJA/DCM/JDD/   /   /        MEMO

FIGURE 14
```

## Page 97

```text
- S38 -

le

CORRESPONDENCE INPUT                                       BRIEF OUTPUT

RAAT RARE AAAE ARETE E TERRA RARE ee ee i EER EET ERRATA REAR ee

OUTGOING MAIL                         INPUT DATE 12- 6-78
             DOCUMENT DATE   FILE SYSTEM CODE

SUBJECT. -
AUTHOR /SOURCE             TO                         ROUTING               TYPE/LETTER NUMBER

RARER EAR ht tt te te te aT IR TR RETR RRR EAE REAR ERE REE EERE REE EEE

OATA PRINTER RIBBONS. MODIFICATION PR 830020833                                   12- 5-78     115.2     /
KEYNTONe Re Je                 CANNON, L.   PROC.                 RJK/   /   /   /   /        MEMO

FIGURE 14
```

## Page 98

```text
5.1.2 SEARCH MODE FOR CORRESPONDENCE

Outputs resulting from the SEARCH mode are a special listing of
document records found containing a desired data item. These outputs are
. printed on the user terminal and on the high speed printer. All outputs
contain a header indicating the data item being searched and a description
of the other data items to be displayed.

The Print All search displays data items common to all search
outputs: subject, document/letter number, file system code, input date,
and the daily counter code. See Figures 15 and 16.

The Action Due search displays two additional data items in its
outputs: responsible engineer and action due date. See Figures 37 and 38.

The remaining search outputs display one additional data item; the

referenced documents. If there are no referenced documents, NONE is printed.
See Figures 17 thru 36.

- 86 -
```

## Page 99

```text
CORRESPONDENCE

PRINT ALL SEARCH
TERMINAL OUTPUT

t=

PRINT ALL                             x
x SUBJECT                                                                  x
Kk TYPE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-CODE             x

OO GORGOR COR CORO OOR OO IOI IIE C ICI AAAI A AAT ATA AAT AIR I IA IITA ITAA

ESTABLISHM LAMINR FLOW-CONTR  AIRFOIL EXPERIMENT OFFICE

ANNOUNCE #29-78        545.2     /                8-21-78 20
FEIERAL WAGE SYSTEM REVISED REGULAR WAGE-RATE SCHEDULE
ANNOUNCE #27-78        545.2     /                8-24-78 26
GATE TRAFFIC CHANGE
ANNOUNCE 30-78         545.2   7,                8-25-78 18
NEW-FOSTAL SERVICE MAIL-SIZE STANDARDS
ANNOUNCE #31-78    «545.2     /         |      9- 1-78 19
PETESTRIANCS RIGHT OF-WAY MARKED CROSSWALKS                 7
ANNOUNCE 32-78         545.2     /                9- 6-78 10
CHANGE FERSONNEL ASSIGNMENT SPACE SYSTEMS [NIVISION      |
ANNOUNCE #34-78        545.2     /              9-20-78 19
STATE CENTER ALIIRESS
ANNOUNCE #33-78        545.2     /                9-20-78 22
NASA-WIDE PROGRAM STANDARDIZE FAPER SIZE
ANNOUNCE #35-78        545.2     /                9-22-78 11
ANNUAL HONOR AWARDS CEREMONY 11/9/78
ANNOUNCE #36-78        545.2     /                9-28-78    5
CHANGES FERSONNEL ASSIGNMENTS PROJECTS [ITRECTORATE
ANNOUNCE #38-78        545.2     /               10- 3-78 19
PLANS CLOSING CENTER FACILITIES LURING THANKSGIVING CHRISTMAS
ANNOUNCE #37-78        545.2     /               10- 3-78 20
CHANGE FERSONNEL ASSIGNMENT OFFICE DIRECTOR      |
ANNOUNCE #40-78        545.2     /               10-31-78 16
GATE TRAFFIC CHANGE.
ANNOUNCE #41-78        545.2     /               1i- 2-78 24
REPORTING FOREIGN GIFTS IIECORATIONS INCLUIING TRAVEL NMI1030.18
ANNOUNCE #42-78        545.2     /             - 41- 8-78 17
CHANGES ORGANIZATION PERSONNEL ASSIGNMENTS WITHIN PROCUREMENT [ITVISION
ANNOUNCE # 44-78       545.2     /       a   11-16-78    8
FIGURE 15

- 87 -
```

## Page 100

```text
~ 88 -

CORRESPONDENCE: PRINT ALL SEARCH: PRINTER OUTPUT

113 50    11/30/78

Ce ETRE REET C OER EA EERE HERESAAOHO SE SESSESHESED HEED OE OHODESEEDEH ERODE EARS EE EESEREEE SHOE OOHE EEE REED etee teteeenenes

PRINT ALL
SUBJECT                                                                     TYPE/LETTER NUMBER FILE SYSTEM CODE      DATE-COOE
ER EERE R REE E RAEN E OSCR EATERS SEAN DEER EERE EH ASHEED DES EOREEEHEEH EROS EHEEE ED EDED EEE H DEES ERE EEED SHH AHE ER OeED SORE Ehetenonees
LeESTABLISHM LAMINR FLOW-CONTR AIRFOIL EXPERIMENT  OFFICE                  ANNOUNCE 829-78    545.2     /            a2178 20
2eFEDERAL WAGE SYSTEM REVISED REGULAR WAGE-RATE SCHEDULE                    ANNOUNCE 827-78    54522     /            82478 26
SeCATE TRAFFIC CHANGE                               ;                        ANNOUNCE 30-78     54562     /            62578 18
“MH eNEWHPOSTAL «SERVICE MAIL-SIZE STANDARDS                                     ANNOUNCE 831-78    545.2     4            9 178 19
SePCDESTRIANCS RIGHT OF-WAY MARKED CROSSWALKS                                 ANNOUNCE 32-78     54502     /            9 678 10
GeCNANGE PERSONNFL ASSIGNMENT SPACE SYSTEMS DIVISION                          ANNOUNCE #34-78    545-2     /            92076 19
TeSTATE CENTER ADDRESS                                                        ANNOUNCE 833-78    545e2     /            92078 22
BaNASA-WIDE PROGRAM STANDARDIZE PAPER SIZE                                    ANNOUNCE #35-78    545.2     (            92276 11
JeANNUAL HONOR AWARDS CEREMONY 11/9/78                                        ANNOUNCE 836-78    54562     /            92878  9
10.CHANGES PERSONNEL ASSIGNMENTS PROJECTS OIRECTORATE                          ANNOUNCE 838-78  | 54522     /           10 576 19
LTiePLANS CLOSING CENTER FACILITIES OURING THANKSGIVING CHRISTMAS               ANNOUNCE 837-78    5452     /           16 378 26
. 12eCKANGE PERSONNEL ASSIGNMENT OFFICE DIRECTOR                                 ANNOUNCE #40-78    3453.2     f           103178 16
T3eSATE TRAFFIC CHANGE                                                         ANNOUNCE 841-78    54522     4           11 278 24
LSeREPORTING FOREIGN GIFTS DECORATIONS INCLUDING TRAVEL NMI1030.18             ANNOUNCE #42-78    54502     4           211 878 17
15eCHANGES ORGANIZATION PERSONNEL ASSIGNMENTS WITHIN PROCUREMENT OIVISION      ANNOUNCE # 44-78   345.2     /           111678 8

FIGURE 16                              4
```

## Page 101

```text
CORRESPONDENCE

NASA RESPONSIBLE ENGINEER SEARCH
TERMINAL OUTPUT

JOGOS OOOO OI IIS I ACEH ACH RR HOR ORR A AOR RK AEE RRR KR RRR RRR HRA I RR

x                      NASA RESPONSIBLE ENGINEER: RJK                       x
* SUBJECT                              .     a                           x
* TYPE/LETTER NUMBER:    FILE SYSTEM COLE        INFUT DATE-CODE             *
* REFERENCED DOQCUMENTS                                                       *

YOGIC OS GOI CEIGIRIOO SIGE RCICARIGIGISISIOIOISIIOIOSICICI GIGS CIC IEICE IACACK AA

FREPARE OPERATING INSTRUCTIO FROGRAMMER MANUAL “ANALYSIS II

8300.0805       115.2     /                S- 3-78   3i
NONE

MOINTENANCE SERVICE COMPUTER EQUIPMENT ONE-YEAR CONTRACT
8300.0815              115.2     /                F-18-783   a2
NONE

TERMINAL RIBBONS SFAIIS FRINTER

B300.0816              115.2     /          9-13-78   33
NONE
PURCHASE SPACE MASTER MICROFICHE READER FRINTER 102610
$300.0825              S23-3.1- 7    ,          10-10-73   34
NONE                                                     ,
PROVIDE ADDITIONAL FUNDS HTC
8300,.0824              115.2     /               10-12-78 17
“NONE                        ,
REPAIR DATAGRAPHIX TERMINAL                 ;
B300.0822              115.2     /               10-13-78   24
NONE
LINE PRINTER RIBBON DATA FRINTER
8300.0853              115.2     /  16-30-78   20
NONE

THERE ARE         7 TIOCUMENTS WITH A RESPONSIBLE ENGINEER OF RJK

FIGURE 17

- 89 -
```

## Page 102

```text
- 06 -

CORRESPONDENCE: NASA RESPONSIBLE ENGINEER SEARCH: PRINTER OUTPUT

12: 23    11/30/78

RASTA OREO REET TAA EAAREAAREEEAEORAHASES ADAG REED EEESESS ESSER ENEEEOEEOE HORA ERASER SARE EERE EE EARS ESD ROLES ESHER EHEEetOneteeteete

NASA RESPONSIBLE ENGINEERS    RJUK

SUBUSCT                                                                     TYPE/LETTER NUMBER FILE SYSTEM CODE      DATE=COOE
REFERENCEL DOCUMENTS

BORER AR ER AES HEAA ES EH ESSE ENEESERETEREEHRERAEEEE REDE SEE HOLA DES EH SESH OEA HEHEHE RSET EEHE ERE ERR EE ERAN E HORE EEHE EEE Steeenaneeeeseee

TePREFARE OPERATING INSTRUCTIO PROGRAMMER MANUAL ANALYSIS II              8300.0805          11562     /            8 3578 33
NONE

2eMAINTENANCE SERVICE COMPUTER EQUIPMENT ONE-YEAR CONTRACT                    830020615          115.2     /         :  91878 52
NONE                                                                      .

SeTERAINAL RIBBONS SPADS PRINTER                            ;                 8300.0816          11522     /            91678 33
NONE                                                             .

4ePURCHASE SPACE MASTER MICROFICHE READER PRINTER 102610 —                    8300-0825          5230301   /           101078 34
NONE                                                                      ‘

SePROZIDE ADDITIONAL FUNOS HTC                               :                830020826          11522     /           101278 17
NOY                                                                                                                               :

GeREPAIR DATAGRAPHIX TERMINAL                                                 8300.0829          115.2     /           201378 24
NONE                  .

TeLINE PRINTER RIBBON DATA PRINTER                                     ,      8300.0833         °115.2     4   .       163078 20
NONE |

FIGURE 18
```

## Page 103

```text
| CORRESPONDENCE

WHO TO SEARCH |
TERMINAL OUTPUT

ROR RNS AOE SE RK HOI AIS IOI ORIG gor Boia Igloo rar rok go SIS RGR AOI fom kav alok yoo kk xk
WHO TO? REWs W. E.

SUBJECT           ;

TYFE/LETTER NUMBER     FILE SYSTEM CODE        INFUT NATE-CONE

REFERENCED DOCUMENTS                                                       ;

SOO OIC JG IOIGIO OR GIG GIO GOI ICI GIO OCR IOI GIGI OR OOO IO IOOK ROG CK ROK ACIOIOK ROK OK ROK a

4 36% 3

3

Me Ww tO

FROPOSED MODIFICATI 2 ADDITIONAL TECHNICAL SUPFORT
MEMO #4354               652+6+1-8 7                8-30-78    7
CE FRO 78-8062

FROPOSETL MOUTFICATION MANUFACTURING NOZZLE INSERT RILLETS

MEMO #455               621.6     /                - 8-78   30
NONE

TASK-ASSGN #5 ALTITIGNAL EFFORT FERIQI FERFORMANCE EXTENSION
MEMO #454       648.541   f                9-12-78   16
NONE

~ | ~2g2030 HAAFP STORAGE    CILITIES ROCKET MOTORS REQ-EXTEN-

MEMO #457              “Tes      f                9-19-78   i?
NONE

REVISED PROPOSAL CASTOR-IITA ROCKET MOTORS ASSOCIATEL SFFORT
MEMQ #4568              683.6.1.8 /    P-i9-7S   15

YV1FQ0G/ENAS—-S2

PROCUREMENT ALTITIQNAL ALTAIR-III ROCKET MOTOR

MEMO #40°              68S-6.1.5 7                G-20-78   24
ViSdOd/ANAS-S2?7   ,
SCGUT SUTUNACE SYSTEM
MEMO F450              661.-6.1.8 /                §-20-78   25
2-GRO00"SL-113
THERE ARE     7 TOCUMENTS WITH AN ALTIRESSEE OF
REW»   W +   E ¢

FIGURE 19
- 9] -
```

## Page 104

```text
- 26 -

CORRESPONDENCE: WHO TO SEARCH: PRINTER OUTPUT

13: 9    11/30/78

ROTHER HARRAH ER HE TEHHE RAH HEEHHESADSEREEERHAEEEAAAERHEREHAREHAHAEEHHEAHHHERHEHHHEHTHTAREEHREEHERARHRREKEHREHAEREKEERERERAELOREEEE
WHO TO = RF We We Eo

SUbUFCT   .                                                                TYPE/LETTER NUMBER FILE SYSTEM CODE    - OATE-CODE
SEFFRENCEO UOCUMEPNTS                                                     .

EEARARH EAA EHAER HARA AERRAAHHESHAHHAASEAAHERHAHHH ARETE TER HHHAAERHARREHEAEEAEEAEEHRERHRTERERERAEHERAEEHHHAEEHHRE KE HO RKRARHREEREO REESE

LePROPOSED MOOIFICATI 2 ADDITIONAL TECHNICAL SUPPORT       ;               MEMO 8454          65260108 /          . 83078 7
CSD FRU 7H-8062

ZePKGPOSED MODIFICATION MANUFACTURING NOZZLE INSERT BILLETS ~~                 MEMO #455          62166     /            9 878 30
NONE

SeTASK-ASSGN 85 ADDITIONAL EFFORT PERIOD PERFORMANCE EXTENSION                MEMO 8456         648 e5el   /            91278 16
NONE

Ssi~-tB203A HAAP STORAGE FACILITI£S ROCKET MOTORS REQ-FEXTEN                    MEMO 8457          1630      4            91378 17
NONE

SeREVISED PROPOSAL CASTOR-IIA ROCKET MOTORS ASSOCIATED EFFORT     ,       MEMO 8458          683260168 /            91978 18

¥19000/ANAS-328

GeFROCUREMENT ADDITIONAL ALTAIR-III ROCKET MOTOR                              MEMO #459          6835-60168 /            92078 24
¥19O000/RNAS-32T7

7eSCOUT GUIDNACE SYSTEM                           :                           MEMO #460          681.60148 /            92078 25
2-65000/8L-113                                        ;                               ;                          .

FIGURE 20
```

## Page 105

```text
i

|
' CORRESPONDENCE
DOCUMENT DATE SEARCH |
TERMINAL OUTPUT

SOOO OOOO OOOO UIOCOOOOOO  OOOOOQOOR OOO fom om kok gk
x.                             NOCUMENT DATE: ii- 0-78                      %
* SUBJECT                                                                  +
* TYFE/LETTER NUMBER     FILE SYSTEM CODE        INFUT -DATE-CODE             %
* REFERENCED DGCUMENTS                                           :     bi
ORK OR KR ORR OREO AOE GE AAR

COICO CIO OR IO OOO CORI IC IO IOK 2 KK

SCOUT FROJECT MANAGENERT REPORT

REF ORT                 o7S       /               li- 7-78   13

NONE

FLIGHT FROJECTS DIRECT MANFOWER      ;

REPORT                 540.1  oF               11-21-78   18

NONE                     ,

RESOURCES AUTHORITY WARRANT LRC-MSO PERSONNEL VAFE FY-1979

Re. A. W. FORMSOSA      09.2     /               11-29~78   19

NONE

THERE ARE         S TOCUMNENTS WITH & DNGCUMENT DATE OF Li~- 0-78

FIGURE 21

- 93 -
```

## Page 106

```text
- v6 ~

CORRESPONDENCE: DOCUMENT DATE SEARCH: PRINTER OUTPUT

12: 53    11/30/78

RATARHAARAARARH AAA EARS ER AR RAR EAREARAERRARAARAEATRARERAAAEEAAREKAEAAAHEATREREHHEHASEAHEHSRAEHAREKAEAESHRERAAATAARATHAEKERAEEKREREERERAREREHRACE YEE

OOCUMENT OATES    li- 0-78

SUNUECT                                                                     TYPE/LETTER NUMBER FILE SYSTEM CODE      DATE=CODE

REFERENCE C DOCUMENTS
PARA ATATAERE RAE RARERE ERATE HELE HE EARARA TRAE AREA RATER EEEESH ERA AERERARETEAAEAARE TERRA RRARATHALEHEETH AAA EKER EseReteneeneRre

1.SCOUT PROJECT MANAGEMENT REPORT                     :             REPORT          576     /        11 778 13
NONE     ,

2eFLIGHT PROJECTS DIRECT MANPOWER                                             REPORT             540.1     4         112178 18
NONE

SeRESOURCES AUTHORITY WARRANT LRC~MSO PERSONNEL VAFB FY~1979                  Re Ae We FORMS5S06A 50942     /           112978 19
NONE

FIGURE 22
```

## Page 107

```text
"CORRESPONDENCE

CONTRACT NUMBER SEARCH
TERMINAL OUTPUT

JOGO GOGO GOS ASSO AAR ICICI OK A ICA IK ACI IIIA I RA ARR RIE HR AR RA

*                         CONTRACT NUMBER? NAS1-15100        .              x
* SUBJECT                                                                  x
* TYPE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-CODE             x
* REFERENCED DOCUMENTS                                                       x

JOO OOOO SOROS SSS SOK SSO GAGA OIRO CCCI CICK AR ACK KK AIK ACR ARICA EA RK

TRANSMITTAL E0-51158 (EGSE) REL-SFEC 305-45? AFFROVAL

2-94000/8L-4190        682,4.2   /               li- 2-78   14
NONE

FINANCIAL MANAGEMENT REFORT REFLECTING EXPENDITURES THROUGH 10/1/78
2-65000/8L-150          82,11.5 /¢               11- 2-78   19

NONE

TASK-R-120 ALGOL-IIC MOTOR. SHELF-LIFE EXTENSION FLIGHT WORTHINESS
S$L-34640/AA0            682/R     /               1i- 2-78    u

NONE

TASK-R-18 AFFROVAL SEI-4278 STORAGE RASE-10 FCM-SIGNAL CONDITIONING
$-4422/CSL             302.7     /               1i- 2-78    7
2-34000/8L-4117

90 AFFROVAL TASK SUMMARY BURST COUFON TEST
/TEG             682.561   /               1i- 2-78    8
SL-4140

TASK-R-44 APPROVAL THIOKOL ANTARES III DOCUMENT TEST-FLAN
S-4426/TDEG.            682.15.35 7               Li- 2-78    9
2-94000/8L-4139

TASK-R-90 AFFPROVAL 23DIR2071 RESULTS BURST COUFON TESTS
$-4427/TRE6             302.2     /               1i- 2-78   10
2-94000/8L-4155

THERE ARE         7 DOCUMENTS WITH A CONTRACT NUMBER OF NAS1-15100

FIGURE 23
- 95 -
```

## Page 108

```text
- 96 -

CORRESPONDENCE: CONTRACT NUMBER SEARCH:

PRINTER QUTPUT

12: 27

Ce ORE AER E HONE SEEN A CE EREASESESEESEDTE SES ERE ESE DS ESSE SESH ESSER HORSE SE EEE OOO RE ONES EE REE ERE LOE OEEOEReeeenEneaeneetens

CONTRACT NUMBER?
SUBJECT
REFERENCED DOCUPENTS

NAS1-15100
TYPE/LETTER NUMBER

FILE SYSTEM CODE

DATE-COOE

ORR RR RRR RACECAR EEE A EASE HEE ERD EEO EE EEE EEESSER SSAA ESEE ONES SHES SESH ETHER EH EOE EEE E EEE EO REED OE ODE SEEE ADEE nE aE eneeesenene

TeTRANSMITTAL FO-51158 (EGSE) REL-SPFC 305-459 APPROVAL
NONE

2eFINANCIAL MANAGEMENT REPORT REFLECTING EXPENDITURES THROUGH 10/1/78
NONE

SeTASK@R-120 ALGOL=I1IC MOTOR SHELF-LIFE EXTENSION FLIGHT WORTHINESS
NONE

_ Me TASK=R-14 APPROVAL SEI-4278  STORAGE BASE~10 PCM-SIGNAL CONDITIONING

2-94000/8L-4117

SeTASK-R-90 APPROVAL TASK SUMMARY BURST COUPON TEST
2-54000/8L-4140

GeTASK=-R-44 APPROVAL THIOKOL ANTARES III DOCUMENT TEST=PLAN
2-54000/8L~4139

TeTASK@R-90 APPROVAL 230I1R2071 RESULTS BURST COUPON TESTS
* 2©98000/8L-4136

FIGURE 24

2~-94000/8L-4190

2-65000/8L-150

SL=-3660/AA0

S-4422/CSL

$-4425/0£6

S~4426/DEG

S-4427/DEG

682 04%e2

682e1145

682/R

30267

6826501

68201543

30262

/

11 278 18
11 276 19
11 278 3
11276 7
11 278 8
11 276

11 276 208
```

## Page 109

```text
CORRESPONDENCE

W.A. NUMBER/ID CODE SEARCH
TERMINAL OUTPUT

SOOO ICIS OE OO GO CGO OOOO OO IORI IK XC I ACK ACK KOK OK

*                         WA. NUMBER/ID COLE: 3525                         k
* SUBJECT                                      |       .               Xk
* TYPE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-COLE             x
xk REFERENCEL DOCUMENTS            x

OOOO GOGO OOO GOO OG OGIO a CI OK 3 RCI RK 2K KOC RC EK A OK

TRANSMITTAL SOF-INTERIM CHANGES ICN#-i-202

2-94000/8L-4214                  /          -  di- 8-782
NONE
GIDEF ALERT STATUS WORK SHEETS REVISE FAGES ONLY
2-94000/S8L-4215                  /               ii- 8-78 3
NONE          :           Z
230IR2001 PRE-FLIGHT SEQUENCE EVENTS GUIDANCE FROGRAM S-202C
2-94000/8L-4216        30242     /               11- 8-78 4
NONE    |
CHANGE REQUEST MONTHLY STATUS REFORT ENDING 10/31/78
2-94000/8L-4218           :      /        |      11- 9-78 4
NONE                               a
TRANSMITTAL MEO-50733 (ELEC) AGNST-LWG 23-002085 REV-Y
2-94000/8L-4219        681.22 /          .    11- 9-787
NONE
SEI-4127 25-SERIES E-SECTION PRE-SHIFPING SFECIAL INSFECTION 10/27/78
2-94000/8L-4220        302.7               11- 9-78 8
NONE
2-94000 SR-26 SEMI-MONTHLY NARRATIVE STATUS FRESENTATION
2-94000/8L-4145        681i-11.1 /               11- 9-78 13
NONE                      :

THERE ARE         7 NOCUMENTS WITH A W.A. NUMBER/ID. CONE OF 3525

FIGURE 25

- 97 -
```

## Page 110

```text
- 86 -

CORRESPONDENCE: W.A. NUMBER/ID CODE SEARCH: PRINTER OUTPUT

12: 49    11/30/78

BAERTRARER RAR EER AESESESH ERA SRAA AREER HEE ERHEEHOR EEE R AS AAR REAR ESE AE EET HTEERER EAE E HAE EERE THREE REE HERE RODREReREEEtCE
WeAse NUMBER/IO CODES    3525                 .

SUBJECT                                                                     TYPE/LETTER NUMBER FILE SYSTEM CODE      OATE-CODE
REFERENCEL UOCUMNENTS                                          ;

BARRE HERS COENEN EREERESN SHARES ERASE HARA EERE THEN TRAE ARENAS EHH HEHE RE EAE RATT T RE ERARATRAERRE ES SHHEHELERREHER ORE EERE ERODEEEECRe

L.TRANSMITTAL SOP*INTERIM CHANGES ICN#-1-202                                  2-94000/8L-4214              /           11 8678 2
NONE

2eGIUiP ALEKT STATUS WORK SHLETS REVISED PAGES ONLY                           2-94000/8L-4215              /           11 878 #3
NONE                                                                                                             :

Se23GiR2001 PRE-FLIGHT SEQUENCE EVENTS GUIDANCE PROGRAM S-202C                2-94000/8L-4216    30202     /           11 878 4
NOWE

4eCHANGE REGUEST MONTHLY STATUS REPORT ENDING 10/31/78                        2-94000/8L-4218              /           11 978 6
NONE

SeTRANSMITTAL DEU-SO733 (ELEC) AGNST-OWG 23-002085 REV~Y     2-94000/8L-4219    681.22    4           11 976 7
NOWE

6eSEI-4127 25-SERIES E-SECTION PRE-SHIPPING SPECIAL INSPECTION 10/27/78       2-394000/8L-4220    302-7     /           11 978 8
NONE

7%e2—94000 ABR-26 SEMI-MONTHLY NARRATIVE STATUS PRESENTATION                    2-94000/8L-4165    68lell1-1 /           11 978 13
NOWE

FIGURE 26
```

## Page 111

```text
YOO ROR ORO OR OR RRO K OK KEK

*
¥.
x
*
x

: CORRESPONDENCE .

AUTHOR/SOURCE SEARCH
TERMINAL OUTPUT

AUTHOR/SOURCE!: KEYNTON: Re. Je
SUBJECT

TYFE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-CODE

REFERENCED DOCUMENTS

JOD ESRI SOOO OOO ASSO IDG OR COKE CIR I I AR ACAI I AAR ACR RATE

PURCHASE ORIIER-SCOU ANALYSIS  TI-FINAN REPORTING PROGRAM WYLE-LAR

MEMO           115.2     /                g- 3-78
NONE
SELECTION MICROFICHE READER PRINTER SFO
MEMO                   53567     /               10-10-78
NONE

FLIGHT SCOUT S-201C HCMM
MEMO                   131-201   /   10-17-78
AWARE FLAN 71277                            :

TASK-I LATE SUBMISSION S-201 FINAL FLIGHT REFORT
S-4238/RJIK      131-201   /                8-30-78

2-F4000/8T-152

TASK-I) APPROVAL S-201 FINAL FLIGHT REF ORT
S-4356/7RIK             131-201   /               10-16-78
2-94000/8L-4024                             .   ,

THERE ARE    5 DOCUMENTS WITH A AUTHOR/SOURCE OF

~ FIGURE 27
- 99 .

YOO GO OOOO Oa OKO IO IOI IR I RK IKE

11

il

10

x

OKOKER K ROK
```

## Page 112

```text
- OOL -

CORRESPONDENCE: AUTHOR/SOURCE SEARCH: PRINTER OUTPUT

12: 20    11/30/78

PERE REHAAKAARA RAH HAHEAARARHEHAAHHAARHRERRERERHAAEAH AHR HAAR HRA K HEHEHE HAKRSKRARHKRAETHAHAHAKRHEKRARETESEERHEREREA KEKE RReNSeERSAKeAHEtAhes
AUTHOR /SOURCE    KE YNTONs Re Je

SUBJECT                                     ;                               TYPE/LETTER NUMBER’ FILE SYSTEM CODE      OATE=CODE

PEFERENCED UCCUMENTS                                                                                                 .

SSRAAREH ERE ARERR A RARE AAAAAERERERARHR SKATER ARHAEAEERAEARARARARARAREHRARHEEAHEERAHARAKRAATHEARHEEHREREEAERERESSHRHKAREHREKERAREKREEKEHREHEAHARARER

LePFURCHASE ORLER-SCOU ANALYSIS II-FINAN REPORTING PROGRAM WYLE-LAB      MEMO     :      11522    /         & 378 11

NONE
QeSELECTICN MICROFICHE READER PRINTER SPO             MEMO               53507     /           201078 29
HONE                                       .
| 3eFLIGHT SCOUT S-201C HCHM                                                    MEMO               131-201. /         101778 11
AWARD FLAN 71277
f
MeTASK=-G LATE SUBMISSION S-201 FINAL FLIGHT REPORT                        S-4238/RJK         131-201 /            83078. 10
2-99000/8T-152
S.TASK-D APPROVAL S=201 FINAL FLIGHT REPORT                                   S-4356/RJK         131-201 /           101678 3
2-94000/8L-4024

FIGURE 28
```

## Page 113

```text
CORRESPONDENCE :
DOCUMENT/LETTER NUMBER SEARCH
TERMINAL OUTPUT

OOOO OGIO GO OR iO KOO GO OKO COCO AR CK KCK

x                    DOCUMENT/LETTER NUMBRER$ 2-94000/8L-4270                x
*x SUBJECT                                                                  x
* TYFE/LETTER NUMBER     FILE SYSTEM COTE        INFUT DATE-CODE             x
% REFERENCED DOCUMENTS                                                       x

YOO OOOO GOGO OO ORC ROO OR COOK ICI KR AIR ICO KR RICK KHOR IK

TASK SUMMARY SAGE SPACECRAFT RELATED EFFORT 11/21/78

2-94000/8L-4270        682.51   /               11-27-78   13
. NONE.        .
THERE ARE         1 DOCUMENTS WITH DOCUMENT / LETTER NUMBER OF 2-94000/8L-4270
FIGURE 29

- 101 -
```

## Page 114

```text
- Z20l -

CORRESPONDENCE: DOCUMENT/LETTER NUMBER SEARCH: PRINTER OUTPUT

eantean                                                                                          13: 48    11/30/78
the  TERRE ROAR TA EAA AS SSEASUSCEEEEEMESASSNASASS OLS A ESLER OSES ASEROR EES OET SEED ENCES SEEDER ONG GENESEE NEES EH ObOEOtEDeneonoees
unaect                                      DOCUMENT/LETTER NUMBER?    2-94000/8L-4270
SUUGE                                                                       TYPE/LETY   NUM   .                           -
KFFORENCEL GUCUFENTS                                                                 ER NUMBER’ FILE SYSTEM CODE      DATE=CODE
SORTER RRR TREN SEER E NERS R SENSE SESSSENSSESSSSEEESTOSRSSERSSEEOSESSCEOHSESAS SORTER SOSH DEES OE EE EONS SEENON ES OES anEeSeresceenece
1.TALK SUMMAKY SAGF SPACECRAFT RELATED EFFORT 11/21/78                        2-94000/8L=4270    6826501 0s           112778 13

NONE

FIGURE 30
```

## Page 115

```text
a
*
*
we
vr
sy
oT

JOO ORK OO OR OK ROR OK ROR RO KK

CORRESPONDENCE

INPUT DATE SEARCH
TERMINAL OUTPUT

ORS ISO SE GDS OS OSS OOOO OOO ORO CS ROO IR OE IOI IA II AAAI RR EI

INFUT DATE: 10-31-78
SUBJECT
TYFE/LETTER NUMBER     FILE SYSTEM CONE        INFUT DATE-COUE
REFERENCED DOCUMENTS

NASA-DEFENSE FURCHASE REQUEST 1i-BRISTOL SEVEN-DAY TEMPERATURE RECORDING

L-468203A               800.1     /               10-31-78   17
NONE          ;
NASA-TEFENSE PURCHASE REQUEST RANGE SERVICE FY-1979
L-864924               800.1     /               10-31-78   18
NONE                                        ,
NASA-IIEFENSE FURCHASE REQUEST MAGSAT RANGE SERVICE FY-1979
L-844934               $900.1     /               10-31-78   19
NONE
NAGA-DTIEFENSE PURCHASE REQUEST FUNTING FY-1¢7° UTILITY REQUIREMENTS
L-B46494A 800.1     /               16-31-78   20
NONE                                             .

THERE ARE         4 TOCUMENTS WITH A DATE OF 10-31-78

FIGURE 31

- 103 -

BOGS SIGS Oa OOOO IO ROR 2K AOR ROK A OE AE

x
*
*¥
x
```

## Page 116

```text
- pOl -

CORRESPONDENCE: INPUT DATE SEARCH: PRINTER OUTPUT

123 51    11/30/78

BRAMMER AOEER ARH RRESEREMA SERA ERH RETREAT A ERR HAE SR EHK ATTRA EAHA AE EEE EERE HERA E HERES E HARARE EKER TASER ERE EE SARE eee eneneeeseres
INPUT DATE?    10-31-78                :

LULJECT                                                         ‘     ;     TYPE/LETTER NUMBER FILE SYSTEM CODE      DATE-CODE

REFORENCLE DOCUMENTS

AAU ARRETAEAES RRA ER ERA ERE REAR A EER H EERE REE HER ER HERE AERA EH AHR EREEERE TRE REE AREEREEERHEEEAETAE OHO REE EE ERROR EE EHEREeTENDE

LeNALAULFENSE PURCHASE REQUEST 11-BRISTOL SEVEN-DAY TEMPERATURE RECORDING    L-68203A           80001     /           103178 17
"NONE

2eNRSA~DEFENSE PURCHASE REQUEST RANGFE SERVICE FY~1979                         L-86492A           80001     ,          103178 18
NONE                                                                                                                          ,

“3eNASA~DEFENSE PURCHASE REQUEST MAGSAT RANGE SERVICE FY-1979                  L-B6493A           800.1     /           103176 19
NONE

4eNASA-DEFENSE PURCHASE REQUEST FUNDING FY-1979 UTILITY REQUIREMENTS          L-B64S94A           80061     /           103178 20
NONE

FIGURE 32
```

## Page 117

```text
OSGI OEIC EIS CESS GIA GIGI I I ACR IK ACK I IRA ACK A RACE KA HK A RAH EH

x

x
x
x
*

CORRESPONDENCE

SUBJECT SEARCH

TERMINAL OUTPUT

SUBJECT:

SUBJECT   ;

TYFE/LETTER NUMEER

REFERENCED IGQCUMENTS

SOOO OOO ROK ACK KKK ROK KK KK
WEC INCORFORATION EO0-S1is80 S-2
TWX #2088        ,131-202
NONE

WEC INCORPORATION SEI&E0 S-202
TWX #2087              131-202
NONE                        ,
WFC INCORFORATION EO0-S0655 S-2
TWX #2096              131-202
NGNE

WRC INCORFORATION E0-S50200 502
21062                  131-202 -
NONE

WFC

INCORFORAT

FILE SYSTEM CODE

INFUT DATE-CODE

*
*

x

X
x

FOSS ORK SACK KK KK KOK KK KK KK KK

02

02

51498

OL

FIGURE 33
- 105 -

ON-S-20:

11-22-78

11-22-78

ba

ie)
```

## Page 118

```text
- 901 -

CORRESPONDENCT: SUBJECT SEARCH: PRINTER OUTPUT

13:3 54    11/30/78
KHER ERAARAAA RASA HA RAAAAAERA AREA AAT ARAHAAEAHAAAREAEADAR HERR HHHRAREHRAHETERAHAAAARAREAAHRAARKEHARAAHHHRERAKREKRESHRAHREKREKEEKRGALEHAEHRAASEEE
:                                         SUBJECTS    WFC        INCORPORAT
TYPE/LETTER NUMBER FILE SYSTEM CODE      OATE-CODE

DUBJECT
REFY RENCE DOCUMENTS

RHE TAARAAAARERAAARHEEAAAAHRATHARAREEERHHSRAEARASHAAHEREHAHAPARAAHHEHERERHARHERHAAAEHERHSEHHETHALEHRAHERKREKRHEAEEHHKEE SHAKER EREeHRAEOEREAES

leWFE INCORPORATION £0-51380 S-202                                            TWX #2088          131-262   /           112276 2
NONE
2eWFC INCORPORATION SFI&EO S-202                                              TWX #2087   .      131-202   4        «122278 8
NONE
3eWFC INCORPORATION E0-50655 S~202                                            TWX #2096        - 131-202   /           l1L227e 64
NONE                                                 oO
2102               131-202   a        112778 32

4oWFC INCORPORATION £0-50200 50201 51498 ON=S-202
NONE

FIGURE 34
```

## Page 119

```text
CORRESPONDENCE

MAIL STATUS SEARCH
TERMINAL OUTPUT

{III IOI TIA EIA IIE IAAI A RII ET

X        MAIL STATUS: VC                            x
* SURJECT                                                        ;         x
* TYPE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-COLE            x
* REFERENCED DOCUMENTS  :                                          .         x

JESUS BOO ORE DOK CSOSSSIOMICAORIG CER ICE I IO OR IO ACK OR AE 1 AOR IA AR IR A ARI A I

TASK-R-121 ALTAIR IIIA EXIT CONE INVESTIGATION

TWX                    582/R     /              “41- 1-78    i
NONE

MAGSAT HEATSHIELI CLEARANCE

S-4367/LRT          243.3     /               ii- 1-78    2
NONE

L-S8203A SHIFMENT ALGOL-II ROCKET MOTORS

S-4423/FEE             1830      /               1i- 1-78    3

NONE                        .

TASK-R-45 ANTARES III-CASE STRUCTURAL TEST’

§~-4424/TEH             6B2//7R    /      _      1i- 1-793    4
2-51100/8R-23063                                        .

TRANSMITTAL VOUGHT WORK AUTHORIZATIONS

2-94000/8L-4185                  /               ii- 1-78    ie)
NONE
TASK-R-18E FCM TELEMETRY PACKAGE DEVELOF MENT
SL-3654/AA0            682        é               1i- 1-78   ii
SL-371é6/AA0         3-94000/8T-181      2-94000/8T-171
VC/VAFER OPERATIONS DAILY WORK SCHEDULE 11/1/78
TWX                    403.9     /               1i- 1-78   14
NONE

THERE ARE         7 DOCUMENTS WITH A MAIL STATUS OF VC

FIGURE 35

ant
```

## Page 120

```text
- SUL ~

CORRESPONDENCE: MAIL STATUS SEARCH: PRINTER OUTPUT

123 41    11/30/78

PARAEME AHA RAH EERE A EHH AAR EHEAAHEEARHEHES ERED RAEN SHH EE HEHAHEREHRHEHEHEHEAEHRERAHEREAATEREEHAKELETEHREH HERE RREREERAEREEEREOEOE

                                                   MAIL STATUS?    vc

LUBE CT                                                                    TYPE/LETTER NUMBER FILE SYSTEM CODE      DATE*CODE-
REFERENCED GOCUMENTS

SAMEERA REAR AE RHEAHEREEHARE RO HEARERS EHRERAEAERHAHERTAHSEEEERE REE AAEERAAEREEH HELE ERERERERHETAHOERAHREREAE HE HORE EHHEREHERREEOOE

LeTALKehaw121 ALTAIR TIIA EXIT CONE INVESTIGATION                     Tux                6B82/R     /           11,°178 #1
NONE                       :                                                             .

2oMAGSAT HEATSHIELD CLEARANCE                                   .          ,  S-4367/LRT         243-5     /           11:°178 2
NONE                                   :

SeL-hbh203A SHIPMENT ALGOL-II ROCKET MOTORS                                    S~4423/PEE         1830      4           11:°$178 $3
NONE                                                                                              .

MeTASK=RK-45 ANTARES IITISCASE STRUCTURAL TEST                           ;      $-4424/EEH         6B82//R    4           11:178 4
2-53100/78k-23063

SeTRANSMITTAL VOUGHT WORK AUTHORIZATIONS                                      2-94000/8L-4185              4           11-178 #5
NONE

GeTASK-R-14F PCM TELEMETRY PACKAGt DEVELOPMENT                         SL-3654/AA0 —     6B82/KR    ;    41,178 21
SL-3716/AA0         2-94000/8T-181      2-94000/AT-171    ‘                     ,

TeVC/VAFK OPERATIONS DAILY WORK SCHEDULE 11/1/78     .           TWX                403.9     ;      31°178 16
NONE                                                                                                             °

FIGURE 36
```

## Page 121

```text
CORRESPONDENCE

ACTION DUE DATE SEARCH
TERMINAL OUTPUT

JAE IORI CISC IOI ICIS IO COCO CIO ACCC AR IR KR AA A AE A A TR IA AIS

x                                ACTION NUE DATE                             *
* SUBJECT                                                                    x
* TYPE/LETTER NUMBER     FILE SYSTEM CODE        INFUT DATE-CODE             *
* AUTHOR »” SOURCE       -RESFONSIBLE ENGINEER    DUE DATE                .   x
Se OO GO JS ob ob ial iat nioi ak a aa rz ia OO IG GK ROR aOR RK aK OK aK a ACK

TRANSMITTAL VOUGHT-SOF MARK-UPS #M81i8-15 FROCELIURE #6-3-13

3-94000/8L-4217        409.1 = /               t1i- 9-78    5

HORNEs Re Ce                  TLO                12- 4-78               \-

PSDIRLIO94 PRE-FLIGHT WEIGHT REFORT S~-202 FAYLOAL SAGE

2-94000/8L-4227        302.2     /               11-15-78    2

URASH: FR. Ge                  RIK                12-11-78

DSLIR2079 PRE-FLIGHT WINIt RESTRICTIONS S-202-SAGE MISSION 11/6/78

2-94000/8L-4228        302.2     /               11-15-78    3            —

URASH: RK. Ge |                RUK                12-11-78 —

“ 9sNIR2090 FRE-FLIGHT

CONTROL SYSTEM SETTINGS HYIIROGEN FEROXITDE

2-5 4000/EL-4229        302.2     foo--            11-15-78    4
URASH: R. G.                   ROK                12-11-78
TRANSMITTAL EQ-5Siié6$ (GUID) REL-SFECS AFFROVAL
3-94000/“8SL-4233       681.4     /               11-15-78    5
HORNE? Re. Ce                  TMF                12-11-78
SCOUT SYSTEMS F&0 TECHNICAL MANAGEMENT
2-65000/8T-3           682/R-120 /               11-16-78    5
URASH: F. G.                  JVC                11-30-78
EO-Si157 CROCS) REL-SFEC 304-400A AMEND#2 FOR APPROVAL
2-F4000 8L-4243        681.4.1   /               11-21-78    é
HORNE» KR. C.                  TLO                12-11-78
2-15000/5R 240 CONFIGURATION MANAGEMENT FLAN 11/1/78
2-$4000/8L-4245        681.22    /          .    11-21-78  _ 2
URASH: RR. G.                  CWW                12-12-78 .-
Fo-Sis77 ¢(FROF) AGNST-DWGS FOR AFFROVAL                   .
2-S4000/8L-4247        681,22    7               11-21-78    9
HORNE: FR. C.                  RFF                12+12-78
TOeSK—-FLAN MAGSAT SFECECRAFT RELATED EFFORT
oF -¢4S £00075. ADEs        682,.5.1   7               11-22-79   i5
TRANSMITTAL EFEQ’S-AGNST DRAWING FOR APPROVAL
2P-GHOOO/SL-42746        682,22    /               11-27-78  ' 8
HORNE? FR. C.                  IMF —             ©12-20-78  oa
FIGURE 37

- 1nag .
```

## Page 122

```text
- ULL ~

CORRESPONDENCE :

ACTION DUE DATE SEARCH:

PRINTER OUTPUT

“123 23

ARHSSHANSHARAHAHRASHSHHASHHAHARAEKHHAESSHSHRAEHRAAHSHHAHASHRATHHAHEHAHRHARHEAHREEHERAAHEHHAHAEAATHRAEKRHEHEKAHAAAERAEHRARERAHAREKAREERAE RHE RE RAE EKRE EAE

SUBJELT

AUTHOR / SOURCE

ACTION DUE DATE

TYPE/LETTER NUMBER
RESPONSIBLE ENGINEER

FILE SYSTEM CODE

OORAAAHATERAAEREOHAEETAE TES AREEAAEERERERHERETONEARESETEREREREEEHERTEHEEHEHEHE RH HRAEREREERHARRERER eaetereteecenehesaareasneneeneneare

LeTRANSMITTAL VOUGHT-SOP MARK-UPS #M818-15 PROCEDURE #6-3-13

HORHEe Re Co

@e2S01R1996 PRE-FLIGHT WEIGHT REPORT S-202 PAYLOAD SAGE

URASHe Re Go

3e23SDIRZ079 PRE-FLIGHT WIND RESTRICTIONS 8=202-SAGE MISSION 11/6/78

URASHe Re Ge

@eRSDIRZOBO PRE-FLIGHT CONTROL SYSTEM SETTINGS HYDROGEN PEROXIDE

URASHe Re Co

BoTRANSMITTAL £0-51169 (GUID) REL“SPECS APPROVAL

"HORRZs Re Co

URABHe Re Ge

~FelO-82257 (RCS) REL@-SPEC 304-GO0A AMENDS2 FOR APPROVAL

HORNE» Re Co

-@ySCCUT SYSTEMS RED TECHNICAL WANAGERENT

@p3-15000/5R 240 CONFIGURATION MANAGEMENT PLAN 11/1/78

UBAZHe Re Co

B_pC0-31377 (PROP) AGNST-DUES FOR APPROVAL

HORNE e Re Co

AG eTASK=PLAN MAGSAT SPPCECRAFT RELATED EFFORT

HORNE « Re «

LIeTRANSMITTAL EO*S@AGNST DRAWING FOR APPROVAL

HORNE® Re Co

FIGURE 38

2-94000/8L-4217
TLO

2-94000/8L-4227
RJK

2-94000/78L-4228
RUK

2-94000/8L-4229
RJK-

2-94000 /6L-4233
OMF

2-65000/8T-3
Jvc

2-94000/8L-4243
TLO

2-94000 /8L-4245
Cu

2-94000/8L-4247
RPP

2-94000/8L-4256
TLO

2-94000 /8L-4260
OMF

409.1
302.2
302¢2
30262
681.4
6e27R<120
6812401
681.22
681022
682e5el

682022

/

DATE-CODE
DATE-OUE
11 978-5
12 478
111578 2
121178
111578 3
121178
111578
122178
111578 5
121178
111678 §

. 113078
1iai7e 6
121178 .
a12178 7
121278
112178 9.
121278
112278 15.
121578.
112778 8
122078
```

## Page 123

```text
5.2       DESIGN INFORMATION RELEASE/REPCRT - OUTPUT FORMATS

Outputs produced while operating within the Mail Log DIR/Report
subfile can only result during the SEARCH mode.

5.2.1 SEARCH MODE FOR. DIR

Outputs resulting from the SEARCH mode are a special listing of
document records found containing a desired data item. These outputs are
printed on the user terminal and on the high speed printer. All outputs
are identical regardless of where the records are displayed. All outputs
display the entire nine items within the DIR/Report document record.  See
Figure 39,

- 111 -
```

## Page 124

```text
DESIGN INFORMATION RELEASE/REPORT
TERMINAL AND PRINTER SEARCH ‘OUTPUTS

(1) TITLE
SCOUT TRAJECTORY DATA ILLUSTRATI QUATERNION GUIDANCE
(2) DIR/REPORT NUMBER (8) REVISION

2350IR1992              REV A

(3) DOCUMENT DATE      C9) REVISION DATE
1-19-78                1-19-78

(4) SYSTEM

GUID TRAJ PERF
(5) WeAe NUMBER/IC CODE
SSZERGAE
(6) CONTRACT NUMBER
NAS1-15100
(7) VEHICLE

G    0

(1) TITLE
PRELIMINAR WEIGHT DATA ADVANCED SCOUT CONFIGURAT
°€2) DIR/REPGRT NUMBER (8) REVISION
230TR1099

(3) DOCUMENT DATE      (9) REVISION DATE

8-19-76                C- O- 0

(4) SYSTEM
MECH

(5) WeAe NUMBER/ID CODE

32&2E AAC

(6) CONTRACT NUMBER
NAS1-7256

(7) VEHICLE

0    0

FIGURE 39

aA

EFFECTS
```

## Page 125

```text
5.3   DRAWING/ENGINEERING ORDER - OUTPUT FORMATS

Outputs produced while operating within the drawing or engineering
order subfile may result during two modes: INPUT and SEARCH.

§.3.]     INPUT MODE FOR DRAWING/E.O.

Output resulting from the INPUT mode is a special message displayed
on the user terminal regarding the status of a partaicular drawing sheet.
This occurs while inputting a new engineering order on a drawing sheet. If
the sheet has three or more E.0.'s already assigned, one of three possible
messages will be displayed to the user. See Figure 40.

- 113 -
```

## Page 126

```text
DRAWING/ENGINEERING ORDER
E.0. INPUT
TERMINAL OUTPUT

MESSAGE #1

MEL CSECTETTC ETRE CT CCTECTTCCTECCTCT TTC CCT CTE C TTT TTT
WARNING!!! SHEET# .2. 0 FOR DRAWING 23 000087      ;

NOW HAS FOUR £€.0.’S
CGC ORI O IO KKK OK KKK

MESSAGE #2                      _

FEI COICO ICCC CCC COCO CCC GOR GC AC GO OR IOKIOKK
ATTENTION!!! SHEET# 2, 0 FOR DRAWING 23 000087

NOW HAS THE MAXIMUM ALLOWABLE OF FIVE E£.Q.°S

FCCC CGO OCC CGO GOGO IGOK COR ICI RI IOI IOK

MESSAGE #3

FAOCIOO CCCI O RICO ACC GE COCOA OGIO. IC COICO SOOO IOC CIOCII OO III IAA kok
ATTENTION!!! IMPORTANT! !!, REVISION PASTLUE!!  IMMEDIATE ACTION REQUIRED! !

SHEET? 1. 0 FOR DRAWING 23 000469      NOW HAS 7 £.0.°S
AEC OIC GIOIA AIO GIORICIO COC ICICI OC IOO CODER O GO IOI GIO OR IOC IOI

FIGURE 40
```

## Page 127

```text
5.2.2 SEARCH MODE FOR DRAWING/E.0.

_ Outputs resulting from the SEARCH mode are a special listing
of drawing or drawing related records found containing a desired data
item. These outputs are printed on the user terminal and on the high speed
printer.  All printer outputs contain a header indicating the data item being
searched and a description of the other data items to be displayed. 11
drawing terminal outputs are displayed the same way with no headers using
two options: Brief and Complete. The brief output only lists the E.0.'s for
a drawing sheet whereas the complete output also gives additional information about
each E.0. See Figure 41 for brief sample. See Figure 42 for complete sample.
Terminal outputs for engineering order searches vary in the display of one fiteld,
VEHICLE NUMBER(S). The print all and E.0. number searches do display the        |
vehicle number. See Figure 43. The E.0. vehicle search does not display the
vehicle number because it does not need to be repeated. See Figure 44,

The high speed printer drawing output also has the same two
options: Brief and Complete. Figure 45 exhibits a drawing title search
with the brief option and Figure 46 shows the same search with the complete
option. Figures 47 through 55 show all other printer outputs using the brief
option.

The high speed printer E.0. outputs all display the same data items.
See Figure 56 through 58.

- 115 -
```

## Page 128

```text
DRAWING/ENGINEERING ORDER
DRAWING TERMINAL OUTPUT
DRAWING TITLE SEARCH
BRIEF OUTPUT

1. DRAWING TITLE
ALAFT RING TRANS SECT &

DRAWING NUMBER 23 000039 |      DATE 10-27-78
SHEET# 1        REV Dr.
1. V24818

2+ DRAWING TITLE
RUSHING HOIST RING TRAN SECT &

DRAWING NUMBER 23 000119        DATE 10-27-78
SHEET# 1        REV I
1. V31123

3. DRAWING TITLE
STUD HOIST RING TRANS SECT R
IIRAWING NUMBER 23 000121        NATE 10-27-78
SHEET# 1        REV C             7.

4. DRAWING TITLE   ;
RING AFT ATTACH TRANS SECT B                ;
DRAWING NUMBER 23 000122        DATE 10-27-78

SHEET# 1        REV C
1. V40081

FIGURE 41
```

## Page 129

```text
DRAWING/ENGINEERING ORDER
DRAWING TERMINAL OUTPUT
DRAWING TITLE SEARCH
COMPLETE OUTPUT

1. DRAWING TITLE
ADAPT RING TRANS SECT RB

DRAWING NUMBER 23 000039        DATE
SHEET# 1        REV It
1. V24818   REV NC     10-27-78

2. DRAWING TITLE
BUSHING HOIST RING TRAN SECT RB

DRAWING NUMBER 23 000119        DATE
SHEET# 1        REV Il
1. V31123   REV A      10-27-78

4. DRAWING TITLE
STUD HOIST RING TRANS SECT

DRAWING NUMBER 23 000121        DATE
SHEET# 1        REV C

4, EPRAWING TITLE
RING AFT ATTACH TRANS SECT &

QNRAWING NUMBER 23 000122        DATE
SHEET# 1        REV C
1. V40081   REV NC     10-27-78

FIGURE 42

-~ V7 _

10-27-78

10-27-78

10-27-78

10-27-76
```

## Page 130

```text
DRAWING/ENGINEERING ORDER
E.0. TERMINAL OUTPUT
PRINT ALL AND E.0. NUMBER SEARCHES

1. V40081   REV NC    10-27-78    1938S    0

FIGURE 43

110

```

## Page 131

```text
DRAWING/ENGINEERING ORDER
-E.0. TERMINAL OUTPUT
VEHICLE SEARCH

1. E.O. NUMBER? V40044    EO. REV NC     NATE 10-27-78

2+ E.QO. NUMBER? V39092       E-O. REV NC     DATE 10-27-78

3. &.0. NUMBER: VS0OS0S    . E-O. REV NC     DATE 10-27-78

4. E.0. NUMBER: V39091       E.O., REV NC -— DATE 10-27-78

5. E.O. NUMBER? VS1i3il       E.O. REV NC     DATE 10-27-78
THERE ARE       5 £.0.’°S RELATED TO VEHICLE 201

FIGURE 44

ain
```

## Page 132

```text
DRAWING/ENGINEERING ORDER: DRAWING TITLE SEARCH: PRINTER OUTPUT BRIEF

14: 15    11/30/78

eet ECE LeSEOEeSCUSISOSISOSIOSSSSSOSLSIVIOTOLISTICSIST ES ICOLO TOT ISOLEST TOSI LET SET T PETE Tee ee eeereererer eee err e Teer eee
DRAWING TITLE SEARCH 3   SECT       B         RING

OPAWING TITLE                                                       “          DRAWING NUMBER          DATE
SHEET NUMBER                                                       7

[ede NUMBER
REARAAREAEA TEARS AEHHHETA EERE EHAEARSEHERAERHEREREREERAAARRARARAEEHEREAARAETERAAERERSHHEAAEKHE AS OEREREHAERHRERSER AREA ETE

1. ADAPT RING TRANS SECT B                                                        23 000039             10-27-78

SHEETA 1        REV D
le V24818
t                                                                                                                                                                                                                                                               .
-           2. BUSHING HOIST RING TRAN SECT B                                                 23 000119             10-27-78
PS              SHEET# 1        REV D
°                 le V31123
i]
$3. STUD HOIST RING TRANS SECT B                                                   23 000121 ~           10-27-78
SHEET# 1        REV C
4. RING AFT ATTACH TRANS SECT B         23 000122 ©          1027-78
SHEETS 1        REV C
le V40081                                    :

FIGURE 45
```

## Page 133

```text
DRAWING/ENGINEERING ORDER: DRAWING TITLE SEARCH:  PRINTER OUTPUT COMPLETE

153 7    11/30/78

SESR ETA HARAAAAARARRARSSAARARAARAAAERAARAARARAEARAAAARARREAHHAARARAARERHEEKRARARARERDHARERAREREHEHKREERALTeERAREReELHKAAAEARAARHK ARERR AREES

DRAWING TITLE SEARCH °&    RING        SECT      8B
ORFAWING TITLE                                                                      DRAWING NUMBER          “OATE
SHFLT NUMBER                                                                                                ;
beQe NUMBER             DATE       Eee TITLE

POPPE TET eTETETETITITECTTTRITTUTTITE PETITE TITTLE LILI Liisi ii ctiteiit iii ii

le AOAPT RING TRANS SECT B                                                  23 000039             10-27-78
SHEETS 1       REV D   ;
le V24818 REV NC 10-27-78

'                2e CUSHING HOIST RING TRAN SECT B                                                 23 000119             10-27-78
ShHEtTH 1        REV D
~              le V31123  REV A   10-27-78
od
i]
3. STUD HOIST RING TRANS SECT B                                                   23. 0001221             10-27-78
SHEET# 1        REV C
4e RING AFT ATTACH TRANS SECT B                    23 000122             10-27-78
SHEET# 1        REV C

1. V40081 -REV NC 10-27-78

FIGURE 46
```

## Page 134

```text
- 2el ~

DRAWING/ENGINEERING ORDER: DRAWING PRINT ALL SEARCH: PRINTER OUTPUT

13: 16    12/01/78

SORA H RAHA A RADE eee AH RR RADA RARER EATER HER HRA RAT AERA RAH RKER TAHT EHH HS SHARETAERER TARA HHH EREL EEA EHTE TERE TEREERENEOS
PRINT ALL - DRAWINGS
LEARIEC TITLE                                                                  ORAWING NUMBER          DATE
SHEET NUMEER
beQe MUMBER
il hh hh Pe PPR PREP CCPC L ECE SSCS IOCSCOOCLOSCLOSICEL ILLS TS Te ET Sy

le FIN *#LSY BASE SECT A                                  ,                        23 000021             10-27-78
SHEET& 1        kV Ss
le V34%35

2e H372KR

be V34621

Ge VE03513

te V59265

be VE1001
SHEETP 2        REV
1. V34535

22 V50313
SHEET# 3        REV
le. V34535

ee VE0313
SHEET#® 4        REV S
le V44535

ce V50313
SHER T# 5        REV &
le V34535

?@e V50313

u“

uo

26 STRUCT ASSY TKANS LURK bs                                                        23 000026             10-27-78
SHEtT& 1        REV U
le V36559
Ze V34519
SHEFT# 2        REV U
1. V56559
SHEETA 3        REV U
1. V36559
ShFETR 4        REV U
le V36559

FIGURE 47
```

## Page 135

```text
- €2l -

DRAWING/ENGINEERING ORDER: ACTION DUE SEARCH: PRINTER OUTPUT

ll: 28    11/30/78
HARAHEKSHAARTHRERERAEHERHAHEEKRHAAARAARHEAHARERARERSFORAARAEHRAR ARH AKER HE HAHR AH AKEAKRAHAHRERARHReRHeEKRERE RE KReEeEReRSERERARR eH eKekesenete
REVISION ACTION QOUE SEARCH
ORAWING TITLE                                                                  DRAWING NUMBER          OATE
SHCLT NUNEFER

SRARRHAAAASARA THERE AA HARES SAHA AAHESHREHHAARESHAHHAEHASEREHAHARAHRHEARHHAHHARAAERSEHARARAAHRARERARALHESAHATARARKRAHEHAEHHREHREERGEREEEE

1. FIN ASSY RASE SECT A                                                ;  .       23 000021             10-27-78 ©

SHEET# 1        REV §

1. V34535

2e C3T28&

Se V3962)

4. V50313.

Se V51265

6» V51001

22 COMPONENTS INST TLM BASE SECT A                                                23 000097             10-27-78
SHEET# 1        REV J                       ,
le V272249
2e V24391
3. V37T87
4. 020245
Se 024285
60 V51354

3.e SYS INST 2ND ST RCS TRAN B UPPR                                                23 000469             10-27-78

SHEET# 1        REV AA
le V40048

2e 040041

3. 040038

4. N50311

3- 040010

6. 039482

Te 037800

& 24141

9. V50415

10. 050429

FIGURE 48
```

## Page 136

```text
- vel -

DRAWING/ENGINEERING ORDER: DRAWING NUMBER SEARCH: PRINTER OUTPUT

143 58     11/30/78
TERRE ETA RE NACE SUASE SSA AUEOESAGASCUG OLGA GEG ASAE ASSES AOE EaE EOE SENEN CEOS AESEN SEE ODE EE DEAS ES Ener bretEbee eee
DRAWING NUMBER SEARCH : 23 000472                           ;
ORAGING TELS                                                                  DRAWING NUMBER          OATE
SHEET BUMEER
f eNe NUMEER
PEER ENOTES ES SGUSGONSESASS ASSUAGE ECE SA SAAC ONESEA SESE SEOONUEDEENE ASSN ONS eaten sasenegeshenseusetseseteenecacs

1. INSTRUMENTATION INST 3RD ST RCS      ,                                         23 000472             10-27-78
SHEET# 1        REV V                                                                                    .
le. V40048
2. 024391
SHEET#H 1.1     REV V
Te V4004F
SHEET# 2        RFV V
le V40044
SHEET# 2. 1     REV V
le V4004h
SHEET# 3. 2     REV Vv
1. V40048
SHEE Ts 7        REV V
1. V40048
SHEET# 10        REV Vv
1. V40044           :

FIGURE 49
```

## Page 137

```text
- G2l ~

DRAWING/ENGINEERING ORDER: DRAWING DATE SEARCH: PRINTER OUTPUT

93 25   _ 12/14/78

RERARAHHRARARAAAAATHAARAEATAAAERAAHEKRETHEAHRAREE ERE TRARG AH HARERERRAER REESE HAE

ORAWING DATE SEARCH 3 12= 1-78

PECAAHTKRARAKRAAHKATAAASARARAHAERR SRE Aa ERAT EEE

DRAWING TITLE                                                                  DRAWING NUMBER          DATE

SHEET NUMBER
Ee0. NUMBER

ARAERAAHEARACEEAAAARERERRERAHRERAE HHH AAERAERHKER AEE AA AAA HERE eReeReeeA HAA AH AS AA HA eee eaAe RAAT AAAS eee Rea seneere

le SAMPLE DRAWING USING SECTION AND SYSTEM                                       401 00001             12- 1-78
SHEET# 1        REV
2e SAMPLE DRAWING USING SYSTEM $MANUEL INPUT                                      401 000002 |         L2= 1-78
SHEET# 1        REV B
1. VO00001

FIGURE 50
```

## Page 138

```text
- 921 -

DRAWING/ENGINEERING ORDER: DRAWING SYSTEM SEARCH: PRINTER OUTPUT

133 47    12/01/78
i i i a PTE ETS P PTC EATAS ESTOS ESSLSLESOLEL ATT TTT et
SYSTEM SfARCH 3 ELEC                                z       :
Ut aAwifvw TLIbLe                                                                  DRAWING NUMBER          DATE
SHEET NUMbER
Fels NUMBER

| alee hh hi hh PEELS SS COESSCLESSSOCLOSSOCCLASSLIE SSL AL ae LS ST eT es

1. S+MPLE UGRAWING USING SECTION AND SYSTEM                                        401 00001             12- 1-78

SHFETR 2        RLV
2e SAMPLE DKAWING USING SYSTEM SMANUEL INPUT                                      401 000002            l2- 1-78
Sour eTa 1    .   REV B                                                                                      :
1. VO00001

FIGURE 51
```

## Page 139

```text
DRAWING/ENGINEERING ORDER: DRAWING VEHICLE SEARCH: PRINTER OUTPUT

14: 46    12/30/78
AREER AERA RAHA A AER THAH EEE TENE RARE ER HAHAHA SHARE TEKERHER HA HAKARH AAT RERETAE HAAR AHKHEHEHRARERAERESHEAHATERER EERE NED
VEHICLE SEARCH & 202
DKAKING TETLE                                                                  DRAWING NUMBER          DATE
SHEET NUALE I                                                                                   ;          :
teO5e NUMBER
toe ee ee eRe PPP PRP PER PRE RM ECRRSEE REE CESCSCOLCRLESCE ICE ECLIOLCLE SIS ESSE PSL EL et ey

1. SECT ASSY P/L INTERFACE                                                ;   :   23 003082         ,   10-27-78
Shee Ta 3        REV A
1. V5136%
SHEE TH ¢        REV A
1. V51563
'              ce MOD INSTL 25 SERIES SAGE P/L                               ;         23 004523             10-27-78
-                SHEET# 1 |      REV NC
Tr                  1. V50591
~l
t
Se UM CABLE ASSY-HCMM/SAGE SC                                                    331 39724             10-27-78
SHEETA# 1       REV A                                                              .
le V51457
4. SAGE P/L TEST CABLES                                                           331 39734             10-27-78
SHEET# 1        REV NC
le V51477

FIGURE 52
```

## Page 140

```text
DRAWING/ENGINEERING ORDER: DRAWING SECTION SEARCH: PRINTER OUTPUT

133 12     12/01/78

RAAARANAARADE AA RARA RRA EAEAREREAA AAAS HEEHRERHERAHAARARAHASHATAAKRETEEKSKE SAHA

SECTION SEAKCH &: CASTOR IIA                  .
CRAWIEC TIILE                                                                                     ORAWING NUMBER             DATE
SHEET NUBREER                                                                                     :
tO. NUMEER

AAT AA ARAAEKRERAHKASERR ATER eH ARHERAE

RERTATHE ATA ketenes natr ee ekiaetaaeeeeiss

POPTeTT TCT TTTEPTTTTTTETELITITITTT ETc e eee TTT

le SAMPLE GRKAWING USING SECTION AND SYSTEM                              401 00001    .      12- 1-78
SHEET# 1      Rey                                                          .

- 82L -

FIGURE 53
```

## Page 141

```text
DRAWING/ENGINEERING ORDER: DRAWING VENDOR CODE SEARCH: PRINTER OUTPUT

9: 30    12/14/78

IPPC PRPC P PSP ee Pe eee Pere rere PEP PET ereeree eres cc etic es USTs eVrereeeTirererrevrrrrrerrerrrrTTrTT Te
VENDOR CODE SEARCH = 401           :

ORAWING TITLE                                                                  DRAWING NUMSER   7     DATE
SHEET NUMBER                                                                                         .  ;
EeO. NUMBER

HERAHAHTAAEHARESHHAEHE SHH EE HA ARERAHAEKERERHAEDREREREHEHARAREHAHHETHATEAHEATHEREAHEERATHRETHREHEHRAKERERRA ERA EKER RE RA OEE

1. RADAR BEAC ASSY S RADAR B KIT                          |                       401 00011           10-27-78
SHEET® 1        REV NC
20 BEAC RADAR CVRT 680618 061C                   401 01331             10-27-78
SHEET# 1        REV A                                                        |
                                  |
_             3. COMP ASSY TLM PKG INSTR                                               401 01500             10-27-78
Re                SHEET# 1        REV G
rs                  1. V27964
'                                                                                                                                                                                                                                                               .
4. SCHEH COMP ASSY TLM PKG                                                        401 01502             10-27-78
SHEET# 1      REV B
SHEETR 2        REV C
SHEETS 3        REV B
le ¥19033
Se RADAR BEACON ASSY                                                .      .      401 01861             10-27-78
SHEET® 1        REV A
6» BATT CASE RADAR BEAC KIT                                                       401 01862             10-27-78
SHEET# 1       REV A.
Te RACK SCO ATG REWORK                                                            401 03354          10-27-78
SHEET® 1        REV B                            |
1. VO7150

FIGURE 54
```

## Page 142

```text
- Oe -

DRAWING/ENGINEERING ORDER: DRAWING E.0. NUMBER SEARCH: PRINTER OUTPUT

15: 9    11/30/76

AARRARTARKHEARAARA A HERRAARRA AAS H AAA HARARE RE ARHAREKARAKAAAREERASEHRARAARERSHAREHRRAEKHHEATHARAAREKEARERHRAERERAEKEREHERESHES AREA EES
DRAWING = E20. NUMBER SEARCH V¥39049
GhAWING TITLE                             .
SEF ET NUMBER
fee NUMEER                                                    ~           .
RAARAAHREAARTAARAARAARE HAHAH ATERAEERAAHARAHHARA RATHER EAHAEAAAAEHREATAAREREESKERERETEAHEREHTEHRHH ARH TARAAKREERRERAESESATEAEAS

DRAWING NUMBER          DATE

le BETTERY SIMULATOR C SECT                                                       321 00076             10-27-78
SHEET# 1        REV C
1. V39099
ee V39049
SHEETH# 2        REV bB
le V39049

Ze TEST HATTERIES TRANS 0                                                         321 00077             10-27-78
SHFETH 1        REV FE       .
le V39U99
2. V39049
SHFETH 2        REV E
1. V39099
2. V39049
SHEETS 3        REV E
1. V39099
20 V39049

FIGURE 55
```

## Page 143

```text
LEL ~

DRAWING/ENGINEERING ORDER:  E.0, PRINT ALL SEARCH: PRINTER OUTPUT

13: 57    12/01/78

lalallala eee eee a TTT TPIT SST T ISLA EVEL ETELTTTE TTT TTT TTT TTT
beOe SEARCH = PRINT ALL
1 eUe MUP AER        UATE      feOe TITLE
iit eh hh hh ee Tee LAPTOP eres eI eT TTT It ri rere rere rerirere Tere Tere reser eee eee eee es

le V34ES¢ hEV NC 10-27-78
Ye O3726e REV NC 10-27-76
3e V396F1 KEV AC 10-27-78
4. V50313 KEV NC 10-77-76
Se V5l2u5 KEV NC 10-27-78
6e VS5S10L1 REV NC 10-27-78
Te V36559 KEV NC 10-27-78
Be V34519 REV NC 10-27-78
Se V24R15 KEV NC 10-27-78

306 V26G1H KEV NC 10-27-78

ile VA0080 KEV NC 10-27-78

12. V322U6 REV NC ° 10-27-78

YS. V37467 REV NC 10-27-78

14. V50363 REV NC 10-27-78

B5e V50419 REV NC 10-27-78

1@s V51362 REV NC 10-27-78

L7e VS97E4 KEV NC 10-27-78

4B. V309H4 REV A    10-27-78                       FIGURE 56
```

## Page 144

```text
- d€L ~

DRAWING/ENGINEERING ORDER: £.0. NUMBER SEARCH: PRINTER QUTPUT

143 17    11/30/78

HHTRERETER AAT AAA AAAEARAER EAT EARS AHHH ERAREAAARAAAA RAE KTERRHARKRERAESERELE HAT HARKRARR ER eERALARARHEHEAESKERHARERE REREAD
EeOe SEARCH
EO. TITLE

EeOe NUNBEX        DATE
RARRTRAARA AAA AREER ERATE RATHER EERE R EERE ERERAR ER EAAEAAAHERAHAEREHRHARAEARHEEEREHRAHETAERHRHHETHRERERERHAEREEREeRES

1. V400A1   REV NC   10-27-78

FIGURE 57
```

## Page 145

```text
DRAWING/ENGINEERING ORDER: E.0. VEHICLE SEARCH:  PRINTER OUTPUT

143 23    11/30/78

TEESTEURIOSTOSOSESOSTOSICLSSSUIOSCO CC IVEC SOS OOISOL TOSS OCSIVICSOUSI ISOS OTe es ei ree tite tei rie ites iri it tet iti
.              FeOo VEHICLE SEARCH 201
beQe NUMBER          NATE       FeOe TITLE
RARER AA AR EERE EATER AA EAHA TREAT EA KERE RTH EER AEA TERAER EAA EHERERHRESHERAAAAAEATAHE HERA HHA EE HHERA TERE DERE HERE EE EE OE
1. VaN044    REV NC   10-27-78
Qe VGO9e    REV NC   10-27-78
3e V>o0505    REV NC   10-27-78
4 V250921    REV NC   10-27-78

Se VALS11    REV NC   10-27-78

- €€L -

FIGURE 58
```

## Page 146

```text
6.0 GLOSSARY OF TERMS”

The following fs a glossary of terms, abbreviations, and acronyms
used tn the Operating Instruction Manual.     |

ARCHIVE             To save or put away data no longer needed or used
DATA BASE           A collection or set of data files; records.
DATA ITEM    - A subdivision of a data record; for example; author and

contract number are data items or fields of a memo record.

DIR                 Design Information Release

EGS                 Electrical ground support equipment

ELEC       .    Electrical

E.0.                Enaineering Order

FIELDS              See Data Item

FILE                Storage area to place and keep data for later use

FORTRAN             Special language used to give instructions to the computer
GSE                 Ground support equipment

GUID                Guidance

- 134 -
```

## Page 147

```text
HOUSEKEEPING   Process by which the computer performs program fnstructtons
in order to permit smooth operation - for example, opening,
closing, and deleting files. __

H/S         * Heatshield

ID                  Identification

INPUT               To place data into a file

LOGIN               User process of being identified to the computer for

further operation

MECH                Mechanical

MESSAGE       A special note displayed on the terminal to the user by
the computer program _

MGS       .         Mechanical ground: support equipment

MODE                A type of task for a specific job.

OUTPUT              To show or display data

PERF      ;        Performance

PRINTOUT            A special listing of data provided to the user by the

computer for later reference or use.

PROP                Propulsion

- 135 -
```

## Page 148

```text
RECORD

REVISE

RF

SEARCH

SOFTWARE

SOP
SPADS
SPO

SPOOLED

SUBFILE

TERMINAL

USER

W.A.

A subdivision of a file consisting of a set of data ©
items from a document.

To change or modify data,

Radio frequency for telemetry system

To find or locate a spectfic set of data; records.

A group or set of fixed computer instructions designed
to perform special tasks

Standard operating procedure
Scout Project Automatic Data System
Scout Project Office

Process by which the computer transfers a special output
file to the printer for a printout.

A part or subdivision of a file

A device with typewriter keys used to communicate
with the computer.

Any person initiating interaction with the computer

Work authorization.

- 136 -
```

## Page 149

```text
```

## Page 150

```text
```
