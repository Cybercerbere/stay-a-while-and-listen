export default function createButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.textContent = 'READ OUT LOUD'
  button.style.position = 'fixed'
  button.style.bottom = '10px'
  button.style.right = '10px'
  button.style.fontSize = '30px'
  button.style.border = '3px solid black'
  button.style.zIndex = '1000'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '10px'
  button.style.pointerEvents = 'auto'

  document.body.appendChild(button)

  return button
}
