// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ SSU: get familiar with API                                                │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const ssu = new SpeechSynthesisUtterance()
ssu.lang = 'fr-FR'
ssu.pitch = 1.3
ssu.rate = 1.1
ssu.text = 'Bonjour, je suis une voix synthétique'
ssu.volume = 0.7
window.speechSynthesis.speak(ssu)
