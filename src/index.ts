// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ index.ts: where everything begins                                         │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
import './main.css'
import ssu from './ssu'
import { extendReadingFromSelectionToParagraph, readNextParagraph } from './strategies/extendToParagraph'
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Utilities                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const clearAll = () => {
  window.CSS.highlights.clear()
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }
}

const clearOnEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  clearAll()
}

const clearOnHidden = () => {
  if (document.hidden) {
    clearAll()
  }
}

const addListeners = () => {
  window.addEventListener('keydown', clearOnEscape, true)
  document.addEventListener('visibilitychange', clearOnHidden)
  window.addEventListener('mouseup', extendReadingFromSelectionToParagraph)
  ssu.addEventListener('end', readNextParagraph)
}

const removeListeners = () => {
  clearAll()
  window.removeEventListener('keydown', clearOnEscape, true)
  document.removeEventListener('visibilitychange', clearOnHidden)
  window.removeEventListener('mouseup', extendReadingFromSelectionToParagraph)
  ssu.removeEventListener('end', readNextParagraph)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Init when tab is opened                                                   │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
chrome.storage.local.get({ isActive: false }).then(({ isActive }) => {
  if (isActive) {
    addListeners()
  }
})
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Update at runtime                                                         │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
chrome.storage.local.onChanged.addListener(({ isActive }) => {
  if (isActive.newValue) {
    addListeners()
  } else {
    removeListeners()
  }
})
