// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ SSU                                                                       │
// │                                                                           │
// │ Highlight text to be read on selection                                    │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Constants & variables                                                     │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const CLASSNAME_PARAGRAPH = 'ssu-paragraph'
const CLASSNAME_WORD = 'ssu-word' // Not used: can't finish "on boundary" implementation
let p
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Inject CSS                                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const style = document.createElement('style')
style.textContent = `
::highlight(${CLASSNAME_PARAGRAPH}) {
  background-color: rgba(250, 0, 0, 0.1);
}
::highlight(${CLASSNAME_WORD}) {
  background-color: rgba(255, 0, 0, 0.5);
}
`
document.body.appendChild(style)
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Init SSU                                                                  │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const ssu = new SpeechSynthesisUtterance()
ssu.lang = 'fr-FR'
ssu.pitch = 0.8
ssu.rate = 1.3
ssu.volume = 1

ssu.addEventListener('start', () => {
  // Highlight paragraph to be read
  const r = new Range()
  r.selectNodeContents(p)
  window.CSS.highlights.set(CLASSNAME_PARAGRAPH, new Highlight(r))
})

ssu.addEventListener('boundary', (e) => {
  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ Tried something and discovered "boundary" partial support on Chrome 33  │
  // └─────────────────────────────────────────────────────────────────────────┘
  // window.CSS.highlights.delete(CLASSNAME_WORD)
  // if (!p) return
  // const text = e.utterance.text
  // const start = e.charIndex
  // const end = text.indexOf(' ', start)
  // const r = new Range()
  // r.setStart(p, start)
  // r.setEnd(p, end)
  // window.CSS.highlights.set(CLASSNAME_WORD, new Highlight(r))
})

ssu.addEventListener('end', () => {
  window.CSS.highlights.clear()
})
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Read text out loud on selection                                           │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
window.addEventListener('mouseup', () => {
  // Cancel current reading
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  // Get closest <p>
  const s = window.getSelection()
  p = s.anchorNode.parentElement.closest('p')
  if (!p) return

  // Read text
  ssu.text = p.textContent
  window.speechSynthesis.speak(ssu)

  s.empty()
})
