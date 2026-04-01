// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Mutation Observer: get familiar with the concept                          │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const onMutation = (mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes') {
      console.log(`mutation of ${mutation.attributeName}`, mutation)
    }
  }
}

const o = new MutationObserver(onMutation)

o.observe(document.body, { attributes: true, subtree: true })
