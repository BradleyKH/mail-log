---
pdfPage: 41
folio: "33"
sectionId: "4.1.3"
kind: text
source: ocr
confidence: 91.5
figures: []
---
4.1.3 HOURS AND DOLLARS DATA CHANGES

When the user enters a carriage return at the prompt:

"(1) HEADER (2) JOBORDER (RETURN) >', the following will be displayed:
"DATA CHANGE DESIRED (Y OR N) >°. lf the user enters a 'Y', four options
will be available for changing the hours and dollars data: RATETABLE, SPREAD,
MANUAL, or DELETE.

The RATETABLE option does a spread of hours and dollars computed from
the total engineering hours and the M/ODC dollars (Material charges and Other
Direct Charges) for the task of the retrieved record. The user must enter
the total engineering hours, the M/ODC dollars, and the appropriate fiscal
year. The total dollars and hours to be spread will be computed from the
Internal ratetable and will then be displayed at the terminal screen. The
user must then enter the beginning month, beginning hours, and the beginning
dollars for the spread. The user will be prompted for the last month and
then the total dollars and hours computed by the system will be spread over
the interval of months entered by the user. The user will then choose the
type of spread that Is to be performed, which Is discussed in the fol lowing
paragraph. It should be noted that If the task of the retrieved record is
J, M, or R, running a ratetable spread on that record will automatically
Invoke the SPREAD option, as no computation will be performed.

In the SPREAD option, the user Is prompted for the beginning month,
hours, and dollars, and then for the last month, hours, and dollars. These
hours and dollars may be spread normally, which is an even percentage distribution
for ali values over the Interval of months, or abnormally, which
allows the user to have a weighted distribution as desired for the first
or second half of the Interval of months. Note that the spread rounds off
the given values for the most efficient proportioning of hours and dollars.
