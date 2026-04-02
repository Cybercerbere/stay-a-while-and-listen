// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Strategy: extend to previous and next words                               │
// │                                                                           │
// │ 1st implementation, knowing nothing about text-to-speech technologies     │
// │ nor users needs or existing products                                      │
// │                                                                           │
// │ Found out that clicking precisely may be difficult (end of day,           │
// │ lack of coffee, ...). What if a script could give me a little  help?      │
// └───────────────────────────────────────────────────────────────────────────┘
import ssu from '../ssu'
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Tree Walker                                                               │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const acceptNode = (n: Text) => {
  if (!n.textContent.trim()) {
    return NodeFilter.FILTER_SKIP
  }
  const parent = n.parentElement as HTMLElement
  return parent.checkVisibility() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}
const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode })

const readNextText = () => {
  w.nextNode()

  if (!w.currentNode.textContent) return

  const text = w.currentNode.textContent.trim()
  ssu.text = text
  window.speechSynthesis.speak(ssu)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Extend to words                                                           │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const extendForward = () => {
  const s = window.getSelection()

  // Early returns
  if (!s) return
  if (s.rangeCount === 0) return
  if (!s.anchorNode) return
  if (!s.focusNode) return

  // Save end
  const end = {
    node: s.focusNode,
    offset: s.focusOffset,
  }

  // Extend 1st word
  s.collapseToStart()
  s.modify('extend', 'backward', 'word')

  const start = {
    node: s.focusNode,
    offset: s.focusOffset,
  }

  const range = new Range()
  range.setStart(start.node, start.offset)
  range.setEnd(end.node, end.offset)

  s.removeAllRanges()
  s.addRange(range)

  s.modify('extend', 'forward', 'word')
}

const extendBackward = () => {
  const s = window.getSelection()

  if (!s) return
  if (s.rangeCount === 0) return
  if (!s.anchorNode) return
  if (!s.focusNode) return

  s.modify('extend', 'backward', 'word')

  const start = {
    node: s.focusNode,
    offset: s.focusOffset,
  }
  const end = {
    node: s.anchorNode,
    offset: s.anchorOffset,
  }

  const range = new Range()
  range.setStart(start.node, start.offset)
  range.setEnd(end.node, end.offset)

  s.removeAllRanges()
  s.addRange(range)

  s.modify('extend', 'forward', 'word')
}

const highlightSelection = (): string => {
  const s = window.getSelection()

  if (!s) return ''
  if (s.rangeCount === 0) return ''
  if (!s.focusNode) return ''

  const text = s.toString().trim()

  const highlight = new Highlight(s.getRangeAt(0))
  CSS.highlights.set('selected-text', highlight)

  w.currentNode = s.focusNode
  s.empty()
  return text
}

const extendReadingFromSelectionToWords = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  const s = window.getSelection()

  if (!s) return
  if (s.rangeCount === 0) return
  if (s.direction === 'none') return

  if (s.direction === 'forward') {
    extendForward()
  } else {
    extendBackward()
  }

  const text = highlightSelection()
  ssu.text = text
  window.speechSynthesis.speak(ssu)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Setup                                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const setup = () => {
  window.addEventListener('mouseup', extendReadingFromSelectionToWords)
  ssu.addEventListener('end', readNextText)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Export                                                                    │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
export default setup
