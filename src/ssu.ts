// Quick baguette configuration
const ssu = new SpeechSynthesisUtterance()
ssu.lang = 'fr-FR'
ssu.pitch = 1
ssu.rate = 1.1

export default function talk(text: string) {
  ssu.text = text
  window.speechSynthesis.speak(ssu)
}
