import talk from './ssu'

function onMouseUp() {
  const selection = window.getSelection()

  if (!selection) return
  if (selection.isCollapsed) return

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

  const text = selection.toString().trim()
  talk(text)
}

// TODO : ONLY LEFT TO RIGHT AT THE MOMENT
window.addEventListener('mouseup', onMouseUp)
