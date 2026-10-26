---
pdfPage: 163
folio: "154"
sectionId: "12.3.2"
kind: text
source: ocr
confidence: 91.1
figures: []
---
displayed and the user must either enter another procedure number or type
'QUIT' to return to the program main menu. If records are found containing

the desired procedure number, a message stating how many records were

retrieved will be displayed, and certain flelds of the records found will
then be displayed along with the prompt 'DELETE RECORD(S) (Y or N) >!, if
the user responds with 'Y', all the records will be marked for deletion and

a message reminding the user that the housekeeping routine must be run in
order to Internally purge the records will be displayed. The user will then
be returned to the program main menu. If the user responds with 'N', no
change wil! be made to the records, and the user will be returned to the

program main menu. See the example below.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2

THIS PROGRAM WILL DELETE ALL RECORDS FROM THE DATA BASE THAT
ARE RELATED TO A SELECTED PROCEDURE NUMBER,

TYPE QUIT TO RETURN TO THE MAIN MENU
ENTER PROCEDURE NO. > 9-9-0

SEARCH NOW IN PROGRESS
*** PLEASE STAND BY *#*

NO SUCH PROCEDURE NUMBER AS 9-9-0 IN THE CURRENT DATA FILE
¥*¥* TRY AGAIN

ENTER PROCEDURE NO. > 4-4-1

SEARCH NOW IN PROGRESS
*** PLEASE STAND BY ***

8 RECORDS WERE FOUND :: PROCEDURE = 4-4-1

```text
401A               ANALYZER, SERVO, LING ELECTRONICS            ER
33 1-63092          BATTERY ADAPTER, BASE A                       ER

BLEED LINE, POLYETHYLENE                     ER
401-30101-1        CABLE, HYDRAULIC POWER                      ER
401-30075-2        CABLE, VALVE TEST                           ER
331-00017          CHART, TORQUE VALVES FLUID FTTNGS            ER
23-002901-1        FILTER PATCH KIT                            ER
```
