// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ TreeWalker                                                                │
// │                                                                           │
// │ Highlight node after node                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Constants                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const CLASSNAME = 'tw-highlight'
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Inject CSS                                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const style = document.createElement('style')
style.textContent = `
::highlight(${CLASSNAME}) {
  background-color: rgb(0, 0, 0, 0.1);
  font-weight: bold;
}
`
document.body.appendChild(style)
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Init Tree Walker                                                          │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const acceptNode = (n) => {
  if (!n.textContent.trim()) {
    return NodeFilter.FILTER_SKIP
  }
  return n.parentElement.checkVisibility() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}
const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode })

const highlight = () => {
  window.CSS.highlights.clear()
  if (tw.nextNode()) {
    const r = new Range()
    r.selectNodeContents(tw.currentNode)
    window.CSS.highlights.set(CLASSNAME, new Highlight(r))
  }
}
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Lauch highlighter on mouseup                                              │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
window.addEventListener('mouseup', () => {
  const s = window.getSelection()
  tw.currentNode = s.anchorNode
  const r = new Range()
  r.selectNodeContents(tw.currentNode)
  window.CSS.highlights.set(CLASSNAME, new Highlight(r))
  setInterval(highlight, 1000)
  s.empty()
})
