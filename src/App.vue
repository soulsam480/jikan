<script setup lang="ts">
import { ref, onMounted } from "vue";
import { notes, joinNotes } from "./lib/note";
import { initMarkdownWasm, parseNote } from "./lib/markdown";
import { dateFormat } from "./lib/date";

const currentNote = ref("");
const formatted = ref("");

function addNote() {
    const noteValue = currentNote.value;

    notes.value.push({
        note: noteValue,
        ts: Date.now(),
    });

    currentNote.value = "";
}

async function handleCopyNotes() {
    const result = joinNotes(notes.value);

    await navigator.clipboard.writeText(result);
}

function handlePreview() {
    const result = joinNotes(notes.value);

    const parsed = parseNote(result);

    formatted.value = parsed;

    document.querySelector<HTMLDialogElement>("#preview_modal")?.showModal();
}

function handleDialogClose() {
    formatted.value = "";
}

onMounted(() => {
    void initMarkdownWasm();
});
</script>

<template>
    <main class="flex flex-col gap-4 p-4 w-2/3 mx-auto">
        <div class="flex flex-col gap-2">
            <div class="chat chat-start" v-for="note in notes" :key="note.ts">
                <div class="chat-header">
                    {{ dateFormat(note.ts).mmmddyyyyhhmm() }}
                </div>
                <div class="chat-bubble">
                    <pre>{{ note.note }}</pre>
                </div>
            </div>
        </div>

        <textarea
            v-model="currentNote"
            @keyup.ctrl.enter="addNote"
            class="textarea textarea-bordered"
            placeholder="Enter message. Markdown is supported."
        />

        <div class="flex justify-end items-center gap-2">
            <button class="btn btn-sm btn-secondary" @click="handlePreview">
                Preview
            </button>
            <button class="btn btn-sm btn-primary" @click="handleCopyNotes">
                Copy notes as markdown
            </button>
        </div>

        <dialog id="preview_modal" class="modal" @close="handleDialogClose">
            <div class="modal-box">
                <h3 class="text-lg font-bold mb-4">Preview</h3>

                <article class="prose prose-slate" v-html="formatted"></article>

                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    </main>
</template>
