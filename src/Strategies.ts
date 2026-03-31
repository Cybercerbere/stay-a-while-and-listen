// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Extend to worlds                                                          │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘

import ssu from './ssu'

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

  const text = s.toString().trim()

  const highlight = new Highlight(s.getRangeAt(0))
  CSS.highlights.set('selected-text', highlight)

  s.empty()
  return text
}

const extendSelectionToWords = () => {
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

export default { extendSelectionToWords }
