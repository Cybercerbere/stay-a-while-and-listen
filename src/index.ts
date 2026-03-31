import './main.css'
import ssu from './ssu'

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode })
ssu.addEventListener('end', () => {
  walker.nextNode()
  ssu.text = walker.currentNode.textContent!
  window.speechSynthesis.speak(ssu)
})

function acceptNode(n: Text) {
  if (!n.textContent.trim()) {
    return NodeFilter.FILTER_REJECT
  }
  const parent = n.parentElement as HTMLElement
  return parent.checkVisibility() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
}

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
  ssu.text = selection.toString().trim()
  window.speechSynthesis.speak(ssu)

  walker.currentNode = selection.focusNode as Node

  selection.empty()
}

window.addEventListener('mouseup', onMouseUp)

window.addEventListener(
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
      return
    }
  },
  true
)
