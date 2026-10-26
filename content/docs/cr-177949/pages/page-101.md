---
pdfPage: 101
folio: "935"
sectionId: "8.5.1"
kind: text
source: ocr
confidence: 92.1
figures: []
---
(1) Fee Table ~ Contains fees for each contract task, detailed to the subtask
level.

(2) Rate Table - Contains rates for each contract task, listed by hours and
M/ODC dollars.

(3) Sustaining Table - Contains for each contract task, detailed by subtask,
a list of sustaining Job orders and thelr corresponding fiscal
year percents.

(4) Program number / Job order Tabie - Contains program numbers corresponding
to every job order used by the Scout Project Office since
1972.

(5) Time Table - Contains beginning and ending dates for each contract task
and each task's fixed contract value and base fee.

(6) Security Table - Contains user ID's of all users cleared to use the Contract
Analysis data base along with clearance codes for al!

command options.

The update procedures for each of these tables are described In the following

sections.

8.5.1 FEE TABLE UPDATE

The fee table update routine allows the user to edit the fee table
manually (M) or through the Estimate at Completion automatic update option
(E). If the user response Is 'M', the fee Is manually entered Into the
fee table. If the user response [s 'E', the system prompts the user for
the new EAC value (the total value) for that task, as fol lows:

'ENTER NEW EAC (In thousands NNNNN.NNN) >'. The system then computes a new
value for the fee table from the contract value and the base fee stored In
the time table for that particular task. If the task Is not currently In the
