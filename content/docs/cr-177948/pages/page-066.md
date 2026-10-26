---
pdfPage: 66
folio: "57"
sectionId: "6.8"
kind: text
source: ocr
confidence: 91.1
figures: []
---
In which Subfife is the document located:

```text
1. TRANSMITTAL/SPECIF ICATION     2. MEMO/LETTER
3. TWX/MAGNAFAX/RAP I FAX          4. ANNOUNCEMENT
5. PURCHASE REQUEST              6. MISCFLLANEOQUS/REPORT
```

Enter Option # >

This cycle of prompts will occur the same number of times as the number of
documents to be archived entered initially by the user. After an option number
has been entered, the message: ' STAND BY. SEARCH NOW IN PROGRESS.' will
be displayed. If the desired document Is not found, the message:
"DOCUMENT NOT FOUND IN SPECIFIED SUBFILE.' will be displayed, and the system
will prompt the user for the next record to be archived, or if no more documents
ere to be archivec the user will be returned to the program main menu.
If the desired document is found, the following message will be displayed:
Is this the correct document (YES or NO) >

lf the user responds with 'YES', the document will be archived and the system
will prompt the user for the next record to be archived. If the user
responds with 'NO', the system will search further for a record having the
desired input date and count code. If no other record Is found having the
same date and count code, the system will prompt the user for the next
record to be archived. When no more documents are to be archived, the user
will be returned to the program main menu.

If the user responds with 'DELE', a routine will be Invoked which
performs the Internal purging of those records that have been marked for
deletion by the Mall Log delete routine, and which performs general file
maintenance for the Mali! Log data files' associated pointer files. These
pointer files enhance the organization and utilization of the Mail Log data
and should be of no concern to the user. However, it Is Important that
