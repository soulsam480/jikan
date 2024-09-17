<script setup lang="ts">
import type { ISavedNote } from '../lib/note'
import { ref } from 'vue'
import PreviewNote from '../lib/components/PreviewNote.vue'
import { dateFormat } from '../lib/date'
import { parseNote } from '../lib/markdown'
import { storedNotes } from '../lib/note'

const formatted = ref('')

async function handleCopyNotes(note: ISavedNote) {
  await navigator.clipboard.writeText(note.text)
}

function handlePreview(note: ISavedNote) {
  const parsed = parseNote(note.text)

  formatted.value = parsed

  document.querySelector<HTMLDialogElement>('#preview_modal')?.showModal()
}

function handleDelete(note: ISavedNote) {
  storedNotes.value = storedNotes.value.filter(it => it.id !== note.id)
}

function handleClose() {
  formatted.value = ''
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

    <PreviewNote :note-text="formatted" @close="handleClose" />
  </div>
</template>
