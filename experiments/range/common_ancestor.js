// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Range: highligh common ancestor in red                                    │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Inject CSS                                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const style = document.createElement('style')
style.textContent = `
.r-red {
  background-color: white;
  border: 2px solid red;
  border-radius: 10px;
  color: red;
  font-weight: bold;
}
`
document.body.appendChild(style)
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Highlight ancestor on mouse up                                            │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
window.addEventListener('mouseup', () => {
  const s = window.getSelection()

  const r = new Range()
  r.setStart(s.anchorNode, s.anchorOffset)
  r.setEnd(s.focusNode, s.focusOffset)
  let ancestor = r.commonAncestorContainer

  if (ancestor.nodeType === Node.TEXT_NODE) {
    const parent = ancestor.parentElement
    ancestor.parentElement.classList.add('r-red')
  } else if (ancestor.nodeType === Node.ELEMENT_NODE) {
    ancestor.classList.add('r-bold')
  }
})
