// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Intersection Observer                                                     │
// │                                                                           │
// │ At Dailymotion, working on the video player, I worked on a visibility     │
// │ feature to "video.play()" when the player is visible "enough"             │
// │ It was done years ago, I wanted to refresh my knowledge with this snippet │
// │                                                                           │
// │ Known issues:                                                             │
// │ - Target <p> to have blocs of text to read                                │
// │ - In real website, we can't rely on tag semantic                          │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Constants                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const CLASSNAME = 'intersection-highlight'
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Inject CSS                                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const style = document.createElement('style')
style.textContent = `
::highlight(${CLASSNAME}) {
  background-color: rgb(50, 100, 150);
  color: white;
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
ssu.rate = 1.1
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ On intersection, highlight <p> with 90% visibility and read it            │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const onIntersection = (entries, observer) => {
  const validEntries = entries.filter((e) => e.isIntersecting && e.intersectionRatio >= 0.9)
  for (const entry of validEntries) {
    window.CSS.highlights.delete(CLASSNAME)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    ssu.text = entry.target.textContent
    window.speechSynthesis.speak(ssu)

    const r = new Range()
    r.selectNodeContents(entry.target)
    window.CSS.highlights.set(CLASSNAME, new Highlight(r))

    return
  }
}

const o = new IntersectionObserver(onIntersection, { threshold: 0.9 })
const paragraphs = document.querySelectorAll('p').forEach((p) => o.observe(p))
