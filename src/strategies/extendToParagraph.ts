// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Strategy: extend to parent <p>                                            │
// │                                                                           │
// │ 2nd implementation, one step closer to lazyness.                          │
// │ While building version 1, I found out some big blocs of text I want to    │
// │ know about, but too lazy to read.                                         │
// │                                                                           │
// │ So, a lazy click in the middle of a paragraph (expecting naively a <p>    │
// │ behind the scene) should start the text-to-speech                         │
// └───────────────────────────────────────────────────────────────────────────┘
import ssu from '../ssu'
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ TreeWalker (for continuous reading)                                       │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const acceptNode = (n: Element) => {
  return n instanceof HTMLParagraphElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}
const w = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, { acceptNode })

const readNextParagraph = () => {
  w.nextNode()
  highlight()
  const p = w.currentNode as HTMLParagraphElement
  ssu.text = p.textContent.trim()
  window.speechSynthesis.speak(ssu)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Highlight                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const highlight = () => {
  window.CSS.highlights.clear()
  const r = new Range()
  r.selectNodeContents(w.currentNode)
  const hl = new Highlight(r)
  CSS.highlights.set('selected-text', hl)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Read selection                                                            │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const extendReadingFromSelectionToParagraph = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  const s = window.getSelection()

  if (!s) return
  if (s.rangeCount === 0) return
  if (!s.focusNode) return
  if (!s.focusNode.parentElement) return

  const p = s.focusNode.parentElement.closest('p') as HTMLParagraphElement

  if (!p) return

  w.currentNode = p
  highlight()
  ssu.text = p.textContent.trim()
  window.speechSynthesis.speak(ssu)

  s.empty()
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Setup                                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const setup = () => {
  window.addEventListener('mouseup', extendReadingFromSelectionToParagraph)
  ssu.addEventListener('end', readNextParagraph)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Export                                                                    │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
export default setup
