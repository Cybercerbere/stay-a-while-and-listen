import createButton from './btn'
import talk from './ssu'

const button = createButton()

function onMouseUp(event: MouseEvent) {
  const selection = window.getSelection()

  if (!selection) return
  if (selection.isCollapsed) return

  selection.modify('extend', 'forward', 'word')

  const text = selection.toString().trim()
  console.log('SSU', text)
  talk(text)
}

window.addEventListener('mouseup', onMouseUp)
