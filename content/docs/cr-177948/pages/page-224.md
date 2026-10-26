---
pdfPage: 224
folio: "215"
sectionId: "16.3.3"
kind: text
source: ocr
confidence: 91.5
figures: []
---
16.3.5 DELETE RECORD FROM PERSONNEL FILE

Option 3 allows the user to delete records from the Personnel Information
file. In order to retrieve the desired record, the user must enter
the appropriate User ID Code. If the desired record is not found, a message
stating so will be displayed and the user must either enter another code
or enter a carrlage return to return to the program main menu. If the destred
record Is found It will displayed with the prompt 'DELETE THIS RECORD ?
(Y OR N) >'. If the user responds with 'Y', the record will be Internally
purged and the user will be given the opportunity to delete another record.
If the user responds with 'N', the record will not be changed and the user
will be given the opportunity to delete another record. Note that the user
must enter a carriage return at the prompt for name code to return to the

program main menu. See the example below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 3

THIS PROGRAM DELETES A RECORD IN THE PERSONNEL / NAME FILE
ENTER NAME CODE TO BE DELETED (RETURN TO EXIT) > DHI

NAME CODE DH1 NOT FOUND I!111!

ENTER NAME CODE TO BE DELETED (RETURN TO EXIT) > TLS

```text
TLS        15
CODE            =TLS
NAME            =Smart, Thomas L.
ADDRESS         =4301 Cedar Lane
ADD~ADDRESS     =
CITY            =Hampton
STATE           =VA
ZIP             =    0
EXTRA=ZIP       =    0
PHONE-AREA      = 0
PHONE           =
PHONE-2         =
EXTENSION       =
TITLE-JOB       =System Administrator / Programmer
FILLER          =
```
