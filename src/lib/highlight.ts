import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore, createWasmOnigEngine } from 'shiki/core'
import nord from 'shiki/themes/nord.mjs'

let highlighter: HighlighterCore

export async function initShiki() {
  highlighter = await createHighlighterCore({
    themes: [
      nord,
    ],
    langs: [
      import('shiki/langs/markdown.mjs'),
    ],
    // `shiki/wasm` contains the wasm binary inlined as base64 string.
    engine: createWasmOnigEngine(import('shiki/wasm')),
  })
}

export function highlightMd(code: string) {
  return highlighter.codeToHtml(code, {
    lang: 'markdown',
    theme: 'nord',
  })
}
