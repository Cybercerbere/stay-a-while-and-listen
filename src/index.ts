import './main.css'
import ssu from './ssu'
import Strategies from './Strategies'

// const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode })
// ssu.addEventListener('end', () => {
//   walker.nextNode()
//   ssu.text = walker.currentNode.textContent!
//   window.speechSynthesis.speak(ssu)
// })

function acceptNode(n: Text) {
  if (!n.textContent.trim()) {
    return NodeFilter.FILTER_REJECT
  }
  const parent = n.parentElement as HTMLElement
  return parent.checkVisibility() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
}

window.addEventListener('mouseup', Strategies.extendSelectionToParentParagraph)

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
