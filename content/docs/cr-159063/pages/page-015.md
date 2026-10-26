---
pdfPage: 15
folio: null
sectionId: "1.0"
kind: text
source: ocr
confidence: 94.2
figures: []
---
1.0 INTRODUCTION

This document provides the program theory used to obtain the
software package, MAIL LOG, developed for the Scout Project Automatic Data
System, SPADS. The program is written in FORTRAN for the PRIME 300 computer
system located in Building 1192-E at NASA, Langley Research Center. This 16
bit mini-computer has a 64K word virtual memory and a 256K word physical
memory. To complete the SPO's computer configuration, a 60 mega-byte disk
is used for storage of all software and corresponding data files. Magnetic
tape is used for a daily back-up and for physical archiving.

The MAIL LOG program has four modes of operation as shown in
Figure 1.1:

\1) INPUT - putting new records into the data base

\2) REVISE - changing or modifying existing records in the
data base

\3) SEARCH - finding special records existing in the
data base

\4) ARCHIVE - store or put away existing records in the

data base

The output includes special printouts of records in the data base and results
from the INPUT and SEARCH MODES.

Documentation of the MAIL LOG program consists of two other manuals:

\1) Users Manual - 'MAIL LOG PROGRAM OPERATING INSTRUCTIONS';
CR

\2) Summary Manual - 'MAIL LOG PROGRAM SUMMARY AND SPECIFICATIONS';
CR

The MAIL LOG data base consists of three main subfiles (as shown in
Figure 1.2);

\1) Incoming and Outgoing Mail Correspondence
\2) Design Information Releases (DIR) and Reports

\3) Drawings and Engineering orders (E.0.)
