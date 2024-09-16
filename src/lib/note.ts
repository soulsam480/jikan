import { ref } from "vue";
import { dateFormat } from "./date";

export interface INote {
  ts: number;
  note: string;
}

export const notes = ref<INote[]>([]);

export function joinNotes(notes: INote[]) {
  let result = "";

  for (const note of notes) {
    result += `
#### [${dateFormat(new Date(note.ts)).ddmmyyyyhhmm()}]

${note.note}
`;
  }

  return result;
}
