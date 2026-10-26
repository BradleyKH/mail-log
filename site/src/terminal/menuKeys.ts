import type { RecordType } from "./types";

export type MenuKey = {
  /** The first step of the search this key selects. */
  goto: number;
  /** How the program heads its listing for this search. */
  label: string;
};

/**
 * The search menu (step 301) keeps its routing in the menu text, so the key-to-search table is
 * built by hand from the manual: correspondence Steps #2, #7, #10 (cr-159065 PDF 35-36), DIR
 * Step #2 (PDF 54), drawing/E.O. Steps #2 and #4 (PDF 79).
 */
export const MENU_KEYS: Record<RecordType, Record<string, MenuKey>> = {
  correspondence: {
    MS: { goto: 346, label: "MAIL STATUS" },
    AUTH: { goto: 330, label: "AUTHOR/SOURCE" },
    DOC: { goto: 321, label: "DOCUMENT DATE" },
    TO: { goto: 318, label: "TO/ADDRESSEE" },
    DLN: { goto: 333, label: "DOCUMENT/LETTER NUMBER" },
    SUB: { goto: 339, label: "SUBJECT" },
    IDD: { goto: 336, label: "INPUT DATA DATE" },
    CWN: { goto: 327, label: "W.A. NUMBER/ID CODE" },
    CON: { goto: 324, label: "CONTRACT NUMBER" },
    ADD: { goto: 311, label: "ACTION ITEM DUE DATE" },
    NRE: { goto: 315, label: "RESPONSIBLE ENGINEER" },
    ALL: { goto: 313, label: "PRINT ALL" },
    QUIT: { goto: 350, label: "QUIT" },
  },
  dir: {
    TITLE: { goto: 308, label: "TITLE" },
    DIR: { goto: 315, label: "DIR-REPORT NUMBER" },
    DATE: { goto: 317, label: "DOCUMENT DATE" },
    SYS: { goto: 321, label: "SYSTEM" },
    WAN: { goto: 319, label: "W.A. NUMBER/ID CODE" },
    CON: { goto: 323, label: "CONTRACT NUMBER" },
    VEH: { goto: 325, label: "VEHICLE" },
    ALL: { goto: 303, label: "PRINT ALL" },
    QUIT: { goto: 329, label: "QUIT" },
  },
  "drawing-eo": {
    TITLE: { goto: 305, label: "DRAWING TITLE" },
    DRAW: { goto: 325, label: "DRAWING NUMBER" },
    DATE: { goto: 328, label: "DRAWING DATE" },
    SYS: { goto: 332, label: "SYSTEM" },
    VEH: { goto: 336, label: "VEHICLE" },
    SECT: { goto: 346, label: "SECTION" },
    CODE: { goto: 350, label: "VENDOR CODE" },
    ALL: { goto: 312, label: "PRINT ALL" },
    ACT: { goto: 320, label: "REV ACTION DUE" },
    EO: { goto: 354, label: "E.O. NUMBER" },
    QUIT: { goto: 360, label: "QUIT" },
  },
};

/** The step where each record's search mode reads the key chosen at 301 and branches to that search. */
export const DISPATCH_STEP: Record<RecordType, number> = { correspondence: 310, dir: 302, "drawing-eo": 304 };

export const menuKey = (record: RecordType, input: string): MenuKey | undefined => MENU_KEYS[record][input];
