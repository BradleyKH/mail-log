---
pdfPage: 20
folio: "11"
sectionId: "2.6.1"
kind: text
source: ocr
confidence: 91.9
figures: []
---
2.5.2 FORTRAN INPUT FORMS

The following programs use FORTRAN Input forms in their Input
mode of operation: Mail Log file, Change Request file, DIR / Report file
and Mark Up file. All data field entries must be placed between exclamation
points, one line (or one field) at a time. For example,

\#3) AUTHOR

When all the data has been entered for a record, the entire record will be

```text
displayed along with the prompt    RECORD CORRECT (COR OR REV) >. if the
user responds with "COR" the record will be added to the data base.   If the
```

"REV" response Is selected the system will prompt for the number of fields,

and which flelds, that are to be corrected.
2.6 UPDATE CPERAT!ONS

The purpose of this section Is to describe the procedures used to

update or revise a record within the data base.
2.6.1 INFO UPDATE SCREENS

Ail INFO update screens are Identical to their correspond-
Ing Input screens. The user must press the tab key to position the cursor
to the field that is to be updated. A return will enter the new value for
that field and will position the cursor to the next field. When updating Is
completed and either tre tab key is pressed through all the fields present
on the update screen, or the CCMMAND key and ‘A' are pressed simultaneously,
the following message will be displayed ai tte terminal screen:

1S THIS RECORD ACCEPTABLE (Y,N,Q,L or E) > in which Y, N, Q, L, and E
