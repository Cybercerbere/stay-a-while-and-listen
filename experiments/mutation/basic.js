// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Mutation Observer                                                         │
// │                                                                           │
// │ Did not have a professional use case to test it. Reviewing the syntax     │
// │ Might be useful on websites with infinite scroll                          │
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
