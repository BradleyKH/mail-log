---
pdfPage: 51
folio: "42"
sectionId: "6.1.3"
kind: text
source: ocr
confidence: 91.7
figures: []
---
Input with the current Input record (up to six are allowed). If Referenced
Document numbers are found, the system assumes thet the current entry could
possibly be the Action Response to an existing Action Due record in the data
base. If this should happen the following message will be displayed at the
terminal screen: 'STAND BY. SYSTEM NOW IN AUTOMATIC UPDATE MODE.' The system
automatically searches the temporary Action Due file for a match between the
Action Due record's Document / Letter Number and the Referenced Document
Number [n the current input record. If amatch is found, one of two operations
will be performed: (1) If the subject of the current input record begins
with 'APPROV.. .' or 'DISAPPROV . ..' or 'DISPOSITION', then the
Action Due record is deleted from the temporary Action Due file; (2) If the

sub ject of the current Input record begIns with 'DELAY. . .' then the current

Action Due date of the document In the temporary Action Due file will be
displayed and the user will be prompted for a new Action Due date as fo! lows:
ACTION DUE DATE: 4- 2-84 ** terminal will beep here **

Enter New Due Date: If None, Repeat Old Date > 060584
The new due date must be entered in the format MMDDYY.
6.1.3 INPUT DIR'S / REPORTS

After the user has responded with 'COR' to indicate that the current
input record is correct the system will perform an Internal check on the
current input subject to see if it begins with '23DIR' or 'REPORT: '. If the
desired phrase is found In the subject, that record must also be input Into
the DIR / Report file. Additional information must be Input for that record
to be queued for Input into the DIR // Report file. The title for the DIR/
Report record Is taken from the Mail Log record subject and must follow one
