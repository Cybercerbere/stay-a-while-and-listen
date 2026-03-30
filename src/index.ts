import './main.css'
import talk from './ssu'

function extendForward(selection: Selection) {
  // Save end
  const endNode = selection.focusNode
  const endOffset = selection.focusOffset

  // Selection looks imutable
  // Get the 1st word entirely by creating a new range and updating the selection
  selection.collapseToStart()
  selection.modify('extend', 'backward', 'word')

  const startNode = selection.focusNode
  const startOffset = selection.focusOffset

  const range = document.createRange()
  range.setStart(startNode!, startOffset)
  range.setEnd(endNode!, endOffset)

  selection.removeAllRanges()
  selection.addRange(range)

  // Finally, get all characters from last word
  selection.modify('extend', 'forward', 'word')
}

function extendBackward(selection: Selection) {
  selection.modify('extend', 'backward', 'word')

  const startNode = selection.focusNode
  const startOffset = selection.focusOffset

  const endNode = selection.anchorNode
  const endOffset = selection.anchorOffset

  const range = document.createRange()
  range.setStart(startNode!, startOffset)
  range.setEnd(endNode!, endOffset)

  selection.removeAllRanges()
  selection.addRange(range)

  selection.modify('extend', 'forward', 'word')
}

function highlightSelection(selection: Selection) {
  const highlight = new Highlight(...selection.getComposedRanges())
  CSS.highlights.set('selected-text', highlight)
}

function onMouseUp() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  const selection = window.getSelection()

  if (!selection) return
  if (selection.isCollapsed) return
  if (selection.direction === 'none') return

  if (selection.direction === 'forward') {
    extendForward(selection)
  } else {
    extendBackward(selection)
  }

  highlightSelection(selection)
  talk(selection.toString().trim())
  selection.empty()
}

window.addEventListener('mouseup', onMouseUp)

window.addEventListener(
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    if (!window.speechSynthesis.speaking) return

    window.speechSynthesis.cancel()
  },
  true
)
