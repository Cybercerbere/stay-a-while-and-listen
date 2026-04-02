// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Range & clientRects                                                       │
// │                                                                           │
// │ Trying to draw highlights based on getClientRects & getBoundingClientRect │
// │                                                                           │
// │ Known issues:                                                             │
// │ - Drawings are fixed                                                      │
// │ - On scroll, they don't follow their initial position                     │
// └───────────────────────────────────────────────────────────────────────────┘

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Variables                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const refs = []

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Inject CSS                                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const style = document.createElement('style')
style.textContent = `
.r-overlay {
  height: 100%;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10000;
}
.r-container {
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px solid black;
  border-radius: 10px;
  position: absolute;
}
.r-rect {
  background-color: rgba(0, 0, 255, 0.1);
  border: 1px solid black;
  border-radius: 5px;
  position: absolute;
}
`
document.body.appendChild(style)
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Attach overlay                                                            │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const overlay = document.createElement('div')
overlay.classList.add('r-overlay')
document.body.appendChild(overlay)
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Draw rectangles on mouse up                                               │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
window.addEventListener('mouseup', () => {
  for (const ref of refs) {
    ref.remove()
  }
  const s = window.getSelection()

  const r = new Range()
  r.setStart(s.anchorNode, s.anchorOffset)
  r.setEnd(s.focusNode, s.focusOffset)

  // Draw container
  const container = r.getBoundingClientRect()
  const { top, left, width, height } = container
  const div = document.createElement('div')
  div.classList.add('r-container')
  div.style.top = `${top}px`
  div.style.left = `${left}px`
  div.style.width = `${width}px`
  div.style.height = `${height}px`
  overlay.appendChild(div)
  refs.push(div)

  // Draw ranges
  const rects = r.getClientRects()
  for (const rect of rects) {
    const { top, left, width, height } = rect
    const div = document.createElement('div')
    div.classList.add('r-rect')
    div.style.top = `${top}px`
    div.style.left = `${left}px`
    div.style.width = `${width}px`
    div.style.height = `${height}px`
    overlay.appendChild(div)
    refs.push(div)
  }

  s.empty()
})
