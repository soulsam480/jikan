<script setup lang="ts">
defineProps<{
  noteText: string
}>()

defineEmits(['close'])
</script>

<template>
  <dialog id="preview_modal" class="modal" @close="$emit('close')">
    <div class="modal-box flex flex-col gap-2">
      <h3 class="text-lg font-semibold">
        Preview
      </h3>

      <article class="prose prose-slate bg-base-200 rounded-md p-2" v-html="noteText" />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm">
            Close
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>
