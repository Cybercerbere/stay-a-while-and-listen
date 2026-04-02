import './main.css'
import setup from './strategies/extendToParagraphAndReadWordByWord'

window.addEventListener(
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      window.CSS.highlights.clear()
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
      return
    }
  },
  true
)

setup()
