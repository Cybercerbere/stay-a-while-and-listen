// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Strategy: extend to parent <p>                                            │
// │                                                                           │
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
  const p = w.currentNode as HTMLParagraphElement
  ssu.text = p.textContent.trim()
  window.speechSynthesis.speak(ssu)
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

  ssu.text = p.textContent.trim()
  window.speechSynthesis.speak(ssu)
  w.currentNode = p
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
