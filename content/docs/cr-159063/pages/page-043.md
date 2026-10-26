---
pdfPage: 43
folio: "29"
sectionId: "4.3.4"
kind: text
source: ocr
confidence: 92.3
figures: []
---
eleventh month, November, for the year 1978. Likewise an entry of 000078
would retrieve all documents for the year 1978.

. There are two (2) specialized searches: REVISION ACTION DUE and
PRINT ALL. REVISION ACTION DUE search finds all drawings containing sheets
which reference five (5) or more engineering orders. The PRINT ALL search
has two (2) options: (1) Output all drawings and their referenced E.0.'s or
(2) Output all engineering orders in the data base.

The VEHICLE search also has some special qualities. First, the user
may search for all drawings related to a certain vehicle, or search for all
engineering orders related to a certain vehicle. Second, a group of vehicles
may be found by using the first and last valid vehicle options. For example,
if a user declares the first valid vehicle as 198 and is searching for vehicle
number 200, not only would all records containing vehicle 200 be found, but
also those with numbers 1985, 1995, and 200S; where S represents al] subsequent
vehicles. Default for the first valid vehicle number is zero (0);
whereas, the last valid vehicle number becomes 999.

Another search also has the drawing and engineering order options.
This is the E.0. NUMBER search. The user may search the ENGINEERING ORDER
subfile for a specific E.0. Number or search the DRAWING subfile for al]
drawings referencing a specific E.0. Number. For an outline of all search
capabilities see Figure 6.2.3.5.

Flowchart Figure 5.4.3-3 depicts the SEARCH MODE of the DRAWING/E.O.
subfile.

4.3.4 ARCDW.

This subroutine is the archive routine for the SPADS MAIL LOG
DRAWING/E.O. subfile. The only information needed in order to archive a
_drawing is the Drawing Number. The user may designate how many drawings are
to be archived at one (1) session. Actual drawing data archived is placed in
a file called INACTD. If the drawing contains more than one (1) sheet, the
SHEET subfile is automatically updated. Sheet drawing data is stored in a
file called INACTS. ,
