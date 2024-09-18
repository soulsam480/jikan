<script setup lang="ts">
import { useBrowserLocation } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { initShiki } from './lib/highlight'
import { initMarkdownWasm } from './lib/markdown'
import Home from './pages/Home.vue'
import NewNote from './pages/NewNote.vue'

const loc = useBrowserLocation()

const hash = computed(() => loc.value.hash)

onMounted(() => {
  void initMarkdownWasm()
  void initShiki()

  if (location.hash.length === 0) {
    location.hash = '#notes'
  }
})
</script>

<template>
  <main class="flex flex-col gap-4 p-4 w-2/3 mx-auto">
    <div class="flex flex-col gap-2">
      <div class="text-lg font-semibold">
        Jikan
      </div>
      <div class="text-sm text-neutral/60 ">
        Timestamp based note taking tool that allows to add notes as chunks then can sort them based on start and end time.
      </div>

      <div class="flex items-center gap-2">
        <a href="#notes" class="btn px-0 btn-link btn-xs">Notes</a>
        <a href="#new" class="btn px-0 btn-link btn-xs">New note</a>
      </div>
    </div>

    <div class="divider !m-0" />

    <NewNote v-if="hash === '#new'" />

    <Home v-if="hash === '#notes'" />
  </main>
</template>
