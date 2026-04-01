// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Shadow DOM: get familiar with the concept                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const root = document.createElement('div')
root.style.position = 'fixed'
root.style.top = '0px'
root.style.left = '0px'
root.style.width = '100%'
root.style.height = '100%'
root.style.zIndex = '10000'
root.style.display = 'flex'
root.style.justifyContent = 'center'
root.style.alignItems = 'center'

const stylesheet = new CSSStyleSheet()
stylesheet.insertRule(`
  .play {
    background-color: rgba(0, 255, 0, 0.2);
    border: 2px solid black;
    border-radius: 50%;
    box-shadow: 2px 2px 5px black;
    cursor: pointer;
    padding: 20px;
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}`)
const shadow = root.attachShadow({ mode: 'open' })
shadow.adoptedStyleSheets = [stylesheet]
const div = document.createElement('div')
div.textContent = '▶'
div.classList.add('play')

shadow.appendChild(div)
document.body.appendChild(root)
