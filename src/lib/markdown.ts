import { init, mdToHtml } from "md4w";
import wasmUrl from "md4w/js/md4w-small.wasm?url";
import { INote } from "./note";

export async function initMarkdownWasm() {
  return await init(wasmUrl);
}

export function parseNote(note: string) {
  return mdToHtml(note);
}
