---
pdfPage: 21
folio: "12"
sectionId: "2.8"
kind: text
source: ocr
confidence: 91.9
figures: []
---
represent the same options that are discussed In section 2.5.1.

2.6.2 FORTRAN UPDATE FORMS

FORTRAN update forms are generated similarly to the FORTRAN
input forms. Data is entered between exclamation points one line (or one
fleld) at a time. For further details refer to section 2.5.2 of this

document.

2.7 ERROR MESSAGES

Some data field values are checked irternally for accuracy. If
an Incorrect value is entered, an error message is displayed at the terminal

screen, and the user Is required to reenter the value.

2.8 SYSTEM EXIT / LOGOUT

System LOGOUT is always accomplished with the ZERO option on every
menu throughout the SPADS system. Note that the user will always be given
an opportunity to LOGOUT prior to returning to the SPADS Master Menu. See

the example below:

(0) LOGOUT

```text
(9) DISPLAY SPOOL QUEUE      (69) SEND MESSAGE TO USER
(19) DISPLAY ALL USERS      (79) ANSWER MESSAGE FROM USER
```

(99) RETURN TO SPADS MAIN MENU
TION: SPADS/ LO> 0
XXX (N) Logged Out MMDDYY HR:MN:SC
Where XXX, N, MM, DD, YY, HR, MN, and SC are the same as in Section 2.1.
The zero (0) option on the SPADS main menu (see page 5) displays
a logout menu rather than performing a system logout. This menu appears as

fol lows:
