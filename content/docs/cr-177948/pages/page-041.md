---
pdfPage: 41
folio: "32"
sectionId: "5.4"
kind: text
source: ocr
confidence: 90.6
figures: []
---
The user will then type 'Q' for QUIT, and will then be returned to PRIMOS
level. The message ‘Exiting dlalout program ...' will be displayed. Next,
the PRIMOS prompt 'OPTION: OAS/SPADS/LO' will be displayed. If the user
enters 'OAS', the OAS menu will be displayed. If 'SPADS' Is entered, the
SPADS main menu will be displayed, and if 'LO' Is entered, a system logout

will be performed.
5.3 CLEANUP OF PRIMCS FILES

This procedure Is performed at the PRIMOS level which can be reached
by one of two methods: entry from the OAS Menu as described itn section 5.1
of this document, or entry by exiting from a Telemall session as described in
section 5.2 of this document. At the PRIMOS prompt "OPTION: OAS/SPADS/LO!
the user will enter 'CLEANUP'. The PRIMOS system will then display each file
withir the user's Girectory area as a prompt. A 'Y' response will Indicate
that the file is to be deleted, whereas a response of 'N' will Indicate that
the file is not to be deleted. Note that any files beginning with a 'T$!
should be deleted. In order to verify those files that have been selected
for deletion, the user responds with a 'Y' or an 'N' for each file again. A
message will then be displayed for each file as it is deleted, such as:
'T$0C01' deleted.
'J00066.EXPORT!' deleted.

5.4 SENDING A DOCUMENT

The document to be transported must first be created within OAS.
Note that Telemail requires that the last |Ine be blank with a '.' in the
first column. This Indicates that the text portion of the Telemail document
has been completed. Use the OAS Word Processing menu export option to transport
the OAS document to PRIMCS level. Then exit OAS and enter the Telemail
