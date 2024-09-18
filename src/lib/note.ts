import { useLocalStorage } from '@vueuse/core'

export interface INote {
  ts: number
  note: string
}

function timeDifference(date1: number, date2: number) {
  // Get the difference in milliseconds
  let diffInMs = Math.abs(date2 - date1) // Use abs to avoid negative difference

  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(diffInMs / (1000 * 60 * 60))
  diffInMs -= hours * (1000 * 60 * 60)

  const minutes = Math.floor(diffInMs / (1000 * 60))
  diffInMs -= minutes * (1000 * 60)

  const seconds = Math.floor(diffInMs / 1000)
  const milliseconds = diffInMs % 1000 // Remaining milliseconds

  // Format as hh:mm:ss,ms
  const formatted = `${[
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':')},${String(milliseconds).padStart(3, '0')}`

  return formatted
}

export function joinNotes(name: string, notes: INote[]) {
  let result = `
## ${name}
`

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const firstNote = notes[0]

    let ts: string

    if (i === 0) {
      ts = '00:00:00'
    }
    else {
      ts = timeDifference(note.ts, firstNote.ts)
    }

    result += `
#### [${ts}]

${note.note}
`
  }

  return result
}

export function exportNoteSubtitles(notes: INote[]) {
  let result = ''
  let lastTs = '00:00:00'

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const firstNote = notes[0]

    let ts: string

    if (i === 0) {
      ts = '00:00:00'
    }
    else {
      ts = timeDifference(note.ts, firstNote.ts)
    }

    result += `
${i + 1}
${lastTs} --> ${ts}
${note.note}
`
    lastTs = ts
  }

  return result
}

export interface ISavedNote {
  notes: INote[]
  ts: number
  id: string
  name: string
}

export const storedNotes = useLocalStorage<ISavedNote[]>('jikan_notes', [])
