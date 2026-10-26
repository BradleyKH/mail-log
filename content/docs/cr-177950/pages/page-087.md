---
pdfPage: 87
folio: "79"
sectionId: "7.3.2"
kind: text
source: ocr
confidence: 90.9
figures: []
---
7.3.2 DELETE A DRAWING

Option 2 allows the user to delete a record from the Drawing file
data base. In order to retrieve the desired record the user must enter the
appropriate drawing number. If no records are found having the desired
drawing number, an error message stating so will be displayed at the term-
Inal screen and the user will be returned to the Delete menu. When the
desired record has been found, it will be displayed at the terminal screen
along with a prompt for the user to Indicate whether the record is to be
deleted. A response of 'N' will automatically return the user to the
Delete menu. If the user responds with 'Y', the record will be internally
purged, and the associated parts and specifications for that drawing number
will also be deleted automatically. The user will then be returned to the

Delete menu. See the following example.

SELECT OPTION BY ENTERING NUMBER (RETURN TO QUIT) > 2

THIS PROGRAM ALLOWS FOR THE DELETION OF A RECORD FROM THE
DRAWING FILE BY ENTERING THE NUMBER FOR THE DESIRED RECORD

ENTER DRAWING NUMBER > 817340

5

```text
DRAW-NUMBER     =817340
REVISION        =
TITLE           =BEARING, BALL DUPLEX - HALOE
```

REFER-DRAWING =C425324

```text
FILLER1         =
SIZE            =LA
FILLER2         =
UPDATE          =
FILLERS         =
```

NEXT-ASSEMBLIES =425328

1S THIS THE CORRECT RECORD TO BE DELETED (Y OR N) > Y
