import type { HookTable } from "../hook";
import type { RecordType } from "../types";
import { commonHooks } from "./common";
import { correspondenceHooks } from "./correspondence";
import { dirHooks } from "./dir";
import { drawingEoHooks } from "./drawingEo";

export const HOOKS: Record<RecordType | "common", HookTable> = {
  common: commonHooks,
  correspondence: correspondenceHooks,
  dir: dirHooks,
  "drawing-eo": drawingEoHooks,
};
