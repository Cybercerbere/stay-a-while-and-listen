// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Strategy: read word after word because of lack of "boundary" event        │
// │                                                                           │
// │ 3rd implementation: I saw the word-by-word highlight on Speechify's       │
// │ extension. I expected to do an easy version with "boundary" event         │
// │ But after some tests, I found out the "boundary" event as only partial    │
// │ support since Chrome 33.                                                  │
// │                                                                           │
// │ I needed a way to get each word separately and highlight them without     │
// │ breaking the DOM.                                                         │
// │ Result is a bit ugly (too much silence between word) but it works.        │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Types                                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
interface Word {
  w: string
  r: Range
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Constants & Variables                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const CLASSNAME_TEXT = 'selected-text'
const CLASSNAME_WORD = 'selected-word'

let wordsToRead: Word[] = []
let index = 0
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ SSU                                                                       │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const ssu = new SpeechSynthesisUtterance()
ssu.lang = 'fr-FR'
ssu.pitch = 0.8
ssu.rate = 1.1

ssu.addEventListener('start', () => {
  window.CSS.highlights.set(CLASSNAME_WORD, new Highlight(wordsToRead[index].r))
})

ssu.addEventListener('end', () => {
  window.CSS.highlights.delete(CLASSNAME_WORD)
  index++
  ssu.text = wordsToRead[index].w
  window.speechSynthesis.speak(ssu)
})
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Utilities                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const buildWords = (p: HTMLParagraphElement) => {
  // Reset
  wordsToRead = []
  index = 0
  // Init walker
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
    acceptNode: (n: Node) => {
      if (!n.textContent) return NodeFilter.FILTER_SKIP
      if (!n.textContent.trim()) return NodeFilter.FILTER_SKIP

      const parent = n.parentElement as HTMLElement
      return parent.checkVisibility() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })

  while (walker.nextNode()) {
    let start = 0
    let end = 0
    const node = walker.currentNode as Text
    const words = node.textContent.split(' ')

    for (const w of words) {
      end = start + w.length
      const r = new Range()
      r.setStart(node, start)
      r.setEnd(node, end)
      start = end + index + 1
      wordsToRead.push({ w, r })
    }
  }
}

const getClosestP = () => {
  // Reset
  window.CSS.highlights.clear()
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  // Get selection
  const s = window.getSelection()

  if (!s) return
  if (!s.anchorNode) return
  if (!s.anchorNode.parentElement) return

  // Get closest <p>
  const p = s.anchorNode.parentElement.closest('p')

  if (!p) return

  // Highlight <p>
  const r = new Range()
  r.selectNodeContents(p)
  window.CSS.highlights.set(CLASSNAME_TEXT, new Highlight(r))

  // Map words with ranges
  buildWords(p)

  // Read 1st word and let events do the continuous reading
  ssu.text = wordsToRead[index].w
  window.speechSynthesis.speak(ssu)

  // Clear selection to show highlights
  s.empty()
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Setup                                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const setup = () => {
  window.addEventListener('mouseup', getClosestP)
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Export                                                                    │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
export default setup
