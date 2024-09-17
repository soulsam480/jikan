import { useLocalStorage } from '@vueuse/core'
import { dateFormat } from './date'

export interface INote {
  ts: number
  note: string
}

export function joinNotes(notes: INote[]) {
  let result = ''

  for (const note of notes) {
    result += `
#### [${dateFormat(new Date(note.ts)).ddmmyyyyhhmm()}]

${note.note}
`
  }

  return result
}

export interface ISavedNote {
  text: string
  ts: number
  id: string
  name: string
}

export const storedNotes = useLocalStorage<ISavedNote[]>('jikan_notes', [])
