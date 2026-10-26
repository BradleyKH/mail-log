import type { DocId } from "@/content/types";

export interface Cite {
  docId: DocId;
  pdfPage: number;
  sectionId?: string;
}

export interface Fact {
  text: string;
  cite: Cite;
}

export const VOLUME_LABEL: Partial<Record<DocId, string>> = {
  "cr-177948": "Vol. I",
  "cr-177949": "Vol. II",
  "cr-177950": "Vol. III",
  "cr-159065": "1979 CR-159065",
};

export const citeLabel = (cite: Cite): string => `${VOLUME_LABEL[cite.docId] ?? cite.docId} p. ${cite.pdfPage}`;

const v1 = (pdfPage: number, sectionId?: string): Cite => ({ docId: "cr-177948", pdfPage, sectionId });
const v2 = (pdfPage: number, sectionId?: string): Cite => ({ docId: "cr-177949", pdfPage, sectionId });
const v3 = (pdfPage: number, sectionId?: string): Cite => ({ docId: "cr-177950", pdfPage, sectionId });
const y79 = (pdfPage: number, sectionId?: string): Cite => ({ docId: "cr-159065", pdfPage, sectionId });

export const overviewFacts: Fact[] = [
  {
    text: "SPADS was built as a single entry, multiple cross-reference filing system, to cut the hours spent retrieving data from files, to give quick retrieval during vehicle anomaly investigations, to answer inquiries about a Scout vehicle from NASA Headquarters and outside agencies, and to relieve a growing storage problem.",
    cite: v1(10, "1.0"),
  },
  {
    text: "In 1981 SPADS grew to support the Projects Directorate: programs that store drawings, parts inventories, mail correspondence, processing documents, and conference registration data, with secretarial support through PRIME's Office Automation System.",
    cite: v3(9, "1.0"),
  },
  {
    text: "Users logged in to the PRIME 750 and then picked a program from the SPADS Main Menu, which lists 17 programs and a Logout option.",
    cite: v1(16, "2.2"),
  },
  {
    text: "The manuals are written for a PT65, a PRIME terminal specialized for word processing, though other terminals could be used; the Scout office used seven other terminal types.",
    cite: v1(11, "1.1"),
  },
  {
    text: "Input, update, and delete are privileged. Some programs asked for a password; the Mail Log, Analysis, Change Requests, DIR / Reports, and Mark Up programs checked internally for clearance on a specific user ID.",
    cite: v1(11, "1.1"),
  },
  {
    text: "Each program allowed only one user at a time within a data file area; a second user saw a FILE IN USE message.",
    cite: v1(31, "3.3.2"),
  },
  {
    text: "Cost and Proration reports could run as slow batch jobs or fast phantoms, and the Contracts Analysis menu could display them, along with the spool queue, the users on the system, and messages between users.",
    cite: v2(15, "2.4"),
  },
  {
    text: "Printouts were spooled to printers: the system printer in the Scout Project Computer Room, letter quality printers, and a Printronix line printer at Vought Corporation in Dallas, Texas.",
    cite: v1(23, "3.1"),
  },
  {
    text: "Office Automation (option 4) opened PRIME's OAS menus, including downline loading of the PT65.",
    cite: v1(34, "4.0"),
  },
  {
    text: "The Telemail Network (option 17) covered entry and exit and sending and receiving documents.",
    cite: v1(39, "5.0"),
  },
  {
    text: "Volume II documents the Contracts Analysis program, with analysis data bases for twelve financial contracts from NAS1-9258 through NAS1-18200.",
    cite: v2(12, "1.1"),
  },
  {
    text: "Volume III documents the Projects Directorate programs, run from a PT65 or a Datagraphix-132 terminal, whose 132 character screen takes wider reports.",
    cite: v3(9, "1.0"),
  },
];

export const partsTransferIntro: Fact = {
  text: "The Motor information file kept vehicle, spare, and test expended parts, and its Update option could transfer components between them along five paths.",
  cite: v1(79, "7.2.4"),
};

export const partsTransfers: { label: string; sectionId: string; pdfPage: number }[] = [
  { label: "Vehicle to vehicle", sectionId: "7.2.4.1", pdfPage: 81 },
  { label: "Vehicle to spare", sectionId: "7.2.4.2", pdfPage: 82 },
  { label: "Spare to vehicle", sectionId: "7.2.4.3", pdfPage: 83 },
  { label: "Spare to spare", sectionId: "7.2.4.4", pdfPage: 84 },
  { label: "Spare to test expended", sectionId: "7.2.4.5", pdfPage: 85 },
];

export interface MenuDoc {
  docId: DocId;
  sectionId: string;
  pdfPage: number;
}

/** Options 6 and 16 have no section in the three manuals. */
export const menuDocs: Record<number, MenuDoc | undefined> = {
  0: { docId: "cr-177948", sectionId: "2.8", pdfPage: 21 },
  1: { docId: "cr-177948", sectionId: "9.0", pdfPage: 110 },
  2: { docId: "cr-177948", sectionId: "10.0", pdfPage: 124 },
  3: { docId: "cr-177948", sectionId: "7.0", pdfPage: 68 },
  4: { docId: "cr-177948", sectionId: "4.0", pdfPage: 34 },
  5: { docId: "cr-177948", sectionId: "14.0", pdfPage: 185 },
  7: { docId: "cr-177948", sectionId: "16.0", pdfPage: 211 },
  8: { docId: "cr-177949", sectionId: "2.4", pdfPage: 14 },
  9: { docId: "cr-177948", sectionId: "6.0", pdfPage: 44 },
  10: { docId: "cr-177948", sectionId: "11.0", pdfPage: 134 },
  11: { docId: "cr-177948", sectionId: "8.0", pdfPage: 97 },
  12: { docId: "cr-177948", sectionId: "12.0", pdfPage: 155 },
  13: { docId: "cr-177948", sectionId: "13.0", pdfPage: 168 },
  14: { docId: "cr-177948", sectionId: "15.0", pdfPage: 199 },
  15: { docId: "cr-177948", sectionId: "17.0", pdfPage: 231 },
  17: { docId: "cr-177948", sectionId: "5.0", pdfPage: 39 },
};

export const highlightedOptions: Record<number, string> = {
  8: "Contract Analysis",
  9: "MAIL LOG",
};

export interface MenuOption {
  n: number;
  label: string;
}

/** Reads "( 8)  Contracts Analysis" style entries out of the printed menu lines, sorted by option number. */
export function parseMainMenu(lines: string[]): MenuOption[] {
  const out: MenuOption[] = [];
  for (const line of lines) {
    for (const m of line.matchAll(/\(\s*(\d+)\)\s+(.+?)(?=\s{2,}\(|\s*$)/g)) {
      out.push({ n: Number(m[1]), label: m[2].trim() });
    }
  }
  return out.sort((a, b) => a.n - b.n);
}

export const mailLogIntro1985: Fact[] = [
  {
    text: "Volume I describes the Mail Log Correspondence file: all correspondence entering or leaving the Scout Project Office, each document marked IM (Incoming Mail), OM (Outgoing Mail), or VC (Vought Correspondence), and filed in one of six subfiles.",
    cite: v1(44, "6.0"),
  },
  {
    text: "Volume III describes a different Mail Log program for the Projects Directorate. It tracks Configuration Change Requests (CCRs) and correspondence in two files, plus a project lookup table. CCR features appear only in Volume III.",
    cite: v3(37, "6.0"),
  },
];

export interface CompareRow {
  topic: string;
  y1979: Fact[];
  vol1: Fact[];
  vol3: Fact[];
}

export const compareRows: CompareRow[] = [
  {
    topic: "Machine and entry",
    y1979: [
      {
        text: "A FORTRAN program for the PRIME 300 at NASA Langley Research Center, chosen from a list of current applications after login.",
        cite: y79(13, "1.0"),
      },
    ],
    vol1: [{ text: "Option 9, Mail Log Correspondence, on the PRIME 750 SPADS Main Menu.", cite: v1(16, "2.2") }],
    vol3: [{ text: "A PT65 must be downline loaded before entering the Mail Log program.", cite: v3(9, "1.0") }],
  },
  {
    topic: "What it kept",
    y1979: [
      {
        text: "Three subfiles: incoming and outgoing correspondence; Design Information Releases and reports; drawings and engineering orders.",
        cite: y79(13, "1.0"),
      },
    ],
    vol1: [
      { text: "Correspondence only. Design reports have their own Dir / Report section.", cite: v1(124, "10.0") },
      { text: "Drawings have their own Alpha Numeric Drawing section.", cite: v1(168, "13.0") },
    ],
    vol3: [{ text: "A CCR file, a Correspondence file keyed by project code, and a Projects lookup table.", cite: v3(37, "6.0") }],
  },
  {
    topic: "Correspondence subfiles",
    y1979: [
      {
        text: "Transmittals and specifications; memos and letters; TWXs, Magnafaxes, and Rapifaxes; announcements; purchase requests; miscellaneous documents and reports.",
        cite: y79(19, "3.1"),
      },
    ],
    vol1: [{ text: "The same six subfiles, with a mail status of IM, OM, or VC on each record.", cite: v1(44, "6.0") }],
    vol3: [],
  },
  {
    topic: "Operations",
    y1979: [{ text: "Four modes: input, revise, search, and archive.", cite: y79(13, "1.0") }],
    vol1: [
      {
        text: "Exit, Input, Update (revise or delete), Search, and Archive. Input, Update, and Archive need a security clearance; Search is open.",
        cite: v1(45, "6.1.1"),
      },
    ],
    vol3: [{ text: "Five menus: Input, Update, Delete, Search, and Report.", cite: v3(38, "6.1") }],
  },
  {
    topic: "Searching",
    y1979: [{ text: "A search mode for correspondence, and others for the other two subfiles.", cite: y79(32, "4.1.3") }],
    vol1: [
      {
        text: "Twelve of a record's fourteen data items are searchable, across any combination of the six subfiles, with an optional time frame. A word search over subjects is also described.",
        cite: v1(60, "6.5"),
      },
    ],
    vol3: [
      { text: "Five CCR searches: CCR number, date issued, initiator, document affected, current status.", cite: v3(48, "6.4.1") },
      { text: "Ten correspondence searches, for one project or all projects.", cite: v3(54, "6.4.2") },
    ],
  },
  {
    topic: "Reports",
    y1979: [{ text: "Special printouts of records in the data base and of the results of input and search.", cite: y79(13, "1.0") }],
    vol1: [{ text: "No report generator exists for this file.", cite: v1(60, "6.4") }],
    vol3: [
      { text: "A Report option: daily input report, document date report, and special CCR reports.", cite: v3(64, "6.5") },
      {
        text: "Special CCR reports: open or hold, approved or disapproved, cancelled or withdrawn, and search and print all.",
        cite: v3(67, "6.5.3"),
      },
    ],
  },
  {
    topic: "Archiving",
    y1979: [{ text: "An archive mode that stores existing records away.", cite: y79(43, "4.1.4") }],
    vol1: [{ text: "Archive by dates, archive individual records, or clean up deletions.", cite: v1(65, "6.8") }],
    vol3: [{ text: "The Mail Log menu lists no archive option.", cite: v3(38, "6.1") }],
  },
  {
    topic: "Printing",
    y1979: [],
    vol1: [{ text: "After a search, output can be spooled to a printer through the SPADS spooling menu.", cite: v1(64, "6.7") }],
    vol3: [
      {
        text: "Reports can be sent to the Scout Project Office, Vought in Dallas, or Projects Directorate printers.",
        cite: v3(65, "6.5.1"),
      },
    ],
  },
];
