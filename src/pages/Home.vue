<script setup lang="ts">
import type { ISavedNote } from '../lib/note'
import { ref } from 'vue'
import PreviewNote from '../lib/components/PreviewNote.vue'
import { dateFormat } from '../lib/date'
import { joinNotes, storedNotes } from '../lib/note'

const currentNote = ref<string | null>(null)

async function handleCopyNotes(note: ISavedNote) {
  await navigator.clipboard.writeText(joinNotes(note.name, note.notes))
}

function handlePreview(note: ISavedNote) {
  if (note.notes.length === 0)
    return

  const result = joinNotes(note.name, note.notes)

  currentNote.value = result

  document.querySelector<HTMLDialogElement>('#preview_modal')?.showModal()
}

function handleDelete(note: ISavedNote) {
  storedNotes.value = storedNotes.value.filter(it => it.id !== note.id)
}

function handleClose() {
  currentNote.value = null
}
</script>

<template>
  <div class="fles flex-col gap-2">
    <div v-for="note in storedNotes" :key="note.id" class="flex flex-col gap-1">
      <div class="text-neutral/60 text-xs">
        {{ dateFormat(note.ts).mmmddyyyyhhmm() }}
      </div>
      <div class="text-sm">
        {{ note.name }}
      </div>
      <div class="flex items-center gap-1 justify-end">
        <button class="btn btn-xs btn-accent" @click="handlePreview(note)">
          Preview
        </button>
        <button class="btn btn-xs btn-accent" @click="handleCopyNotes(note)">
          Copy as markdown
        </button>
        <button class="btn btn-xs btn-error" @click="handleDelete(note)">
          Delete
        </button>
      </div>
    </div>

    <div v-if="storedNotes.length === 0" class="text-center">
      Note saved notes. add <a href="#new" class="link">new</a>
    </div>

    <PreviewNote :note-text="currentNote ?? ''" @close="handleClose" />
  </div>
</template>
