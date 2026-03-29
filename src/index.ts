import talk from './ssu'

function onMouseUp() {
  const selection = window.getSelection()

  if (!selection) return
  if (selection.isCollapsed) return

  const endNode = selection.focusNode
  const endOffset = selection.focusOffset

  selection.collapseToStart()
  selection.modify('extend', 'backward', 'word')

  const startNode = selection.focusNode
  const startOffset = selection.focusOffset

  const range = document.createRange()
  range.setStart(startNode!, startOffset)
  range.setEnd(endNode!, endOffset)

  selection.removeAllRanges()
  selection.addRange(range)
  selection.modify('extend', 'forward', 'word')

  const text = selection.toString().trim()
  console.log('SSU', text)
  talk(text)
}

window.addEventListener('mouseup', onMouseUp)
