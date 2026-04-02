// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Intersection Observer: get familiar with the concept                      │
// │                                                                           │
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
  font-weight: bold;
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
  for (const entry of entries) {
    if (!entry.isIntersecting) return
    if (entry.intersectionRatio < 0.9) return

    window.CSS.highlights.clear()
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
