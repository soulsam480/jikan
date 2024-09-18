<script setup lang="ts">
import { computed, ref } from 'vue'
import { highlightMd } from '../highlight'
import { parseNote } from '../markdown'

const { noteText } = defineProps<{
  noteText: string
}>()

defineEmits(['close'])

const currentTab = ref<'raw' | 'rendered'>('raw')

const highlightedCode = computed(() => {
  if (noteText === '')
    return ''

  return highlightMd(noteText)
})

const parsedMd = computed(() => {
  if (noteText === '')
    return ''

  return parseNote(noteText)
})
</script>

<template>
  <dialog id="preview_modal" class="modal" @close="$emit('close')">
    <div class="modal-box flex flex-col gap-2">
      <div role="tablist" class="tabs tabs-bordered">
        <span role="tab" class="tab" :class="[{ 'tab-active': currentTab === 'raw' }]" @click="currentTab = 'raw'">Raw MD</span>
        <span role="tab" class="tab" :class="[{ 'tab-active': currentTab === 'rendered' }]" @click="currentTab = 'rendered'">Rendered</span>
      </div>

      <article v-if="currentTab === 'rendered'" class="prose prose-slate bg-base-200 rounded-md p-2" v-html="parsedMd" />
      <div v-if="currentTab === 'raw'" v-html="highlightedCode" />

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
