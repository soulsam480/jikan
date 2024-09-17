<script setup lang="ts">
import type { INote } from '../lib/note'
import { ref } from 'vue'
import PreviewNote from '../lib/components/PreviewNote.vue'
import { dateFormat } from '../lib/date'
import { parseNote } from '../lib/markdown'
import { joinNotes, storedNotes } from '../lib/note'

interface ICurrentNote {
  name: string
  text: string
}

const notes = ref<INote[]>([])

const currentNote = ref<ICurrentNote>({
  name: 'Untitled note',
  text: '',
})
const formatted = ref('')

function addNote() {
  const noteValue = currentNote.value

  if (noteValue.text.length === 0)
    return

  notes.value.push({
    note: noteValue.text,
    ts: Date.now(),
  })

  currentNote.value = {
    name: noteValue.name,
    text: '',
  }
}

async function handleCopyNotes() {
  const result = joinNotes(notes.value)

  await navigator.clipboard.writeText(result)
}

function handlePreview() {
  if (notes.value.length === 0)
    return

  const result = joinNotes(notes.value)

  const parsed = parseNote(result)

  formatted.value = parsed

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
    name: currentNote.value.name,
    text: joinNotes(notes.value),
    ts: Date.now(),
  })

  currentNote.value = {
    name: 'Untitled',
    text: '',
  }

  notes.value = []
}

function handleClear() {
  currentNote.value = {
    name: 'Untitled',
    text: '',
  }

  notes.value = []
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <input v-model="currentNote.name" type="text" placeholder="Enter name" class="input input-bordered w-full input-sm font-semibold">
      <button class="btn btn-sm btn-primary" @click="handleSave">
        Save
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="note in notes" :key="note.ts"
        class="flex flex-col gap-1 p-2 rounded-md border border-base-300"
      >
        <div class="text-neutral/60 text-xs">
          {{ dateFormat(note.ts).mmmddyyyyhhmm() }}
        </div>

        <textarea
          v-model="note.note"
          class="textarea textarea-ghost textarea-xs"
          placeholder="Enter note. Markdown is supported."
        />
      </div>
    </div>

    <textarea
      v-model="currentNote.text"
      class="textarea textarea-bordered"
      placeholder="Enter note. Markdown is supported."
      @keyup.ctrl.enter="addNote"
      @keyup.meta.enter="addNote"
    />

    <div class="flex justify-end items-center gap-2">
      <button class="btn btn-sm btn-secondary" @click="handleClear">
        Reset
      </button>

      <button class="btn btn-sm btn-secondary" @click="handlePreview">
        Preview
      </button>

      <button class="btn btn-sm btn-primary" @click="handleCopyNotes">
        Copy as markdown
      </button>
    </div>

    <PreviewNote :note-text="formatted" @close="handleDialogClose" />
  </div>
</template>
