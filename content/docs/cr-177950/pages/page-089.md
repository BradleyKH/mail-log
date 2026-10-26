---
pdfPage: 89
folio: "81"
sectionId: "7.3.4"
kind: text
source: ocr
confidence: 91
figures: []
---
base. The user must first enter the appropriate drawing number for the part
that Is to be deleted. If no records are found having the desired drawing
number, the user must enter anew drawing number, or type 'QUIT' to exit.
Note that the only means of exiting this delete routine is by typing ‘QUIT!
at the prompt for drawing number. Next, the prompt "DELETE ALL PARTS (Y OR
N)' will be displayed. !f the user responds with 'y', the prompt
‘OK TO DELETE ALL PARTS (Y OR N) >' will then appear. A 'Y' response to this
prompt will cause all records in the SCC file with the desired drawing number
to be internally purged immediately. The following message will appear:
"PLEASE STAND BY .. PARTS BEING DELETED'. The user will then be prompted for
a drawing number and must type 'QUIT' to exit. If a response of 'N' is
entered for either the ‘DELETE ALL PARTS (Y OR N) >' prompt or the
‘OK TO DELETE ALL PARTS (Y OR N) >' prompt, the user must then enter the item
number of the single record that is to be deleted. If no records are found
having the desired item number, the prompt for a drawing number will be displayed,
and the user may start over or type 'QUIT' to exit. When the proper
record has been found, it will be displayed at the terminal screen, along
with a prompt for the user to indicate whether the record is to be deleted.
An 'N' response will return the user to the initial prompt in the program
and the user must type 'QUIT' to exit. A response of 'Y' will internally
purge the record and then return the user to the initial prompt In the

program. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 4
THIS PROGRAM ALLOWS PART(S) TO BE DELETED FROM A DRAWING IN THE SCC FILE
ENTER DRAWING NUMBER (TYPE QUIT TO EXIT) > 10101

DELETE ALL PARTS (Y OR N) > N
