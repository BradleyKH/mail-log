import type { Session } from "./session";

// The printed SEND and ANSWER MESSAGE exchanges (CR-177949 PDF 16 to 20),
// replayed line for line. The called party's ID follows the same
// substitution as the printed user lists in menus.json.

const STARS = "*".repeat(70);

/** Lines of the printed phone exchange for contract-menu option 66 or 77. */
export function phoneReplay(s: Session, option: 66 | 77): string[] {
  const m = (key: string) => s.menu(key);
  const commands = (choice: string) => {
    const lines = m("messageCommands");
    return [...lines.slice(0, -1), `${lines[lines.length - 1]}${choice}`];
  };
  const one = (key: string) => m(key)[0];
  if (option === 66) {
    return [
      ...m("activeUserList"),
      "",
      ...commands("1"),
      one("messageWhoToCall"),
      "GMG",
      one("messageOneMoment"),
      one("messageRinging"),
      one("messageNotReceiving"),
      ...commands("3"),
      ...m("activeUserList"),
      "",
      ...commands("1"),
      one("messageWhoToCall"),
      "SHM",
      one("messageOneMoment"),
      one("messageNotLoggedIn"),
      ...commands("1"),
      one("messageWhoToCall"),
      "SMH",
      one("messageOneMoment"),
      one("messageRinging"),
      one("messageNotResponding"),
      "Y",
      one("messageWaiting"),
      one("messageHangupHint"),
      one("messageEndHint"),
      `${one("messageSendPrompt")}THIS IS A TEST MESSAGE`,
      `${one("messageSendPrompt")}THIS IS THE LAST LINE OF THE MESSAGE`,
      `${one("messageSendPrompt")}(* CNTL E * return *)`,
      one("messageDataSent"),
      STARS,
      "THANK YOU FOR MESSAGE. GOODBYE.",
      STARS,
      one("messageHangupHint"),
      one("messageEndHint"),
      `${one("messageSendPrompt")}(* CNTL E * return *)`,
      one("messageDisconnected"),
      ...commands(" 4"),
    ];
  }
  return [
    ...m("activeUserList"),
    "",
    ...commands("2"),
    one("messageIncomingHold"),
    STARS,
    "THIS IS A TEST MESSAGE",
    "THIS IS THE LAST LINE OF THE MESSAGE",
    STARS,
    one("messageEndHint"),
    one("messageHangupHint"),
    `${one("messageSendPrompt")}THANK YOU FOR MESSAGE. GOODBYE.`,
    `${one("messageSendPrompt")}(* CNTL E * return *)`,
    one("messageDataSent"),
    one("messageDisconnected"),
    ...commands(" 4"),
  ];
}
