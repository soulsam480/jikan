<script setup lang="ts">
import type { INote, ISavedNote } from '../lib/note'
import { ref } from 'vue'
import PreviewNote from '../lib/components/PreviewNote.vue'
import { dateFormat } from '../lib/date'
import { exportNoteSubtitles, joinNotes, storedNotes } from '../lib/note'

const notes = ref<INote[]>([])

const noteMeta = ref<Pick<ISavedNote, 'name'>>({
  name: 'Untitled note',
})

const currentNote = ref('')
const formatted = ref('')

function addNote() {
  const noteValue = currentNote.value

  if (noteValue.length === 0)
    return

  notes.value.push({
    note: noteValue,
    ts: Date.now(),
  })

  currentNote.value = ''
}

async function handleCopyNotes() {
  const result = joinNotes(noteMeta.value.name, notes.value)

  await navigator.clipboard.writeText(result)
}

async function handleCopySubtitles() {
  const result = exportNoteSubtitles(notes.value)

  const a = window.document.createElement('a')

  a.href = window.URL.createObjectURL(new Blob([result], { type: 'text/srt' }))
  a.download = `${noteMeta.value.name}-subtitles.srt`

  // Append anchor to body.
  document.body.appendChild(a)
  a.click()

  // Remove anchor from body
  document.body.removeChild(a)
}

function handlePreview() {
  if (notes.value.length === 0)
    return

  const result = joinNotes(noteMeta.value.name, notes.value)

  formatted.value = result

  document.querySelector<HTMLDialogElement>('#preview_modal')?.showModal()
}

function handleDialogClose() {
  formatted.value = ''
}

function handleSave() {
  if (notes.value.length === 0)
    return

  storedNotes.value.push({
    id: window.crypto.randomUUID(),
    name: noteMeta.value.name,
    notes: notes.value,
    ts: Date.now(),
  })

  handleClear()
}

function handleClear() {
  currentNote.value = ''

  notes.value = []

  noteMeta.value = {
    name: 'Untitled note',
  }
}

function handleDeleteNote(index: number) {
  notes.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <input v-model="noteMeta.name" type="text" placeholder="Enter name" class="input input-bordered w-full input-sm font-semibold">

      <button class="btn btn-sm btn-accent" @click="handleSave">
        Save
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="note, i in notes" :key="note.ts"
        class="flex flex-col gap-1 p-2 rounded-md border border-base-300"
      >
        <div class="flex justify-between gap-2">
          <div class="text-neutral/60 text-xs">
            {{ dateFormat(note.ts).mmmddyyyyhhmm() }}
          </div>

          <button class="btn btn-xs btn-error" @click="handleDeleteNote(i)">
            Delete
          </button>
        </div>

        <textarea
          v-model="note.note"
          class="textarea textarea-ghost textarea-xs"
          placeholder="Enter note. Markdown is supported."
        />
      </div>
    </div>

    <textarea
      v-model="currentNote"
      class="textarea textarea-bordered"
      placeholder="Enter note. Markdown is supported. Hit ctrl+enter to add."
      @keyup.ctrl.enter="addNote"
      @keyup.meta.enter="addNote"
    />

    <div class="flex justify-end items-center gap-2">
      <button class="btn btn-sm btn-error" @click="handleClear">
        Reset
      </button>

      <button class="btn btn-sm btn-secondary" @click="handlePreview">
        Preview
      </button>

      <button class="btn btn-sm btn-accent" @click="handleCopyNotes">
        Copy as markdown
      </button>
      <button class="btn btn-sm btn-accent" @click="handleCopySubtitles">
        Download subtitles
      </button>
    </div>

    <PreviewNote :note-text="formatted" @close="handleDialogClose" />
  </div>
</template>
