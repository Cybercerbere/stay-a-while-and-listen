import './main.css'
import setup from './strategies/extendToParagraph'

window.addEventListener(
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
      return
    }
  },
  true
)

setup()
