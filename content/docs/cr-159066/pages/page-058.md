---
pdfPage: 58
folio: "46"
sectionId: "6.4"
kind: mixed
source: reviewed
confidence: 100
figures: ["6.4.2"]
---
SEARCH MODE FOR DRAWING INFORMATION RELEASE/REPORT

Flowchart labels, in flow order:

- SEARCH (start); connector 1
- DISPLAY SEARCH OPTIONS
- SWITCH ON SEARCH OPTION, with branches:
  - ALL: SEARCH ALL DIR-REPORT DATA FILE; connector 2
  - TITLE: SEARCH TITLE DATA ITEM; connector 1
  - DIR: SEARCH DIR/REPORT NUMBER DATA ITEM; connector 1
  - DATE: SEARCH DIR/REPORT DATE DATA ITEM; connector 1
  - WAN: SEARCH W.A. NUMBER ID. CODE DATA ITEM; connector 1
  - SYS: SEARCH SYSTEM DATA ITEM; connector 1
  - continues to connector A
- Connector A, with branches:
  - CON: SEARCH CONTRACT NUMBER THRU TABLE; connector 1
  - VEH: SEARCH VEHICLE(S) DATA ITEM; connector 1
  - QUIT: HARD COPY decision
    - Y: connector 2; SPOOL OUTPUT FILE TO PRINTER; RETURN
    - N: RETURN

FIGURE 6.4.2

Page (1 of 1)
