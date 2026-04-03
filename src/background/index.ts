// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Constants                                                                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
const RED = '#cb3c3c'
const GREEN = '#76ba7f'

// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Init when extension is enabled                                            │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
chrome.action.setBadgeText({ text: ' ' })
chrome.storage.local.get({ isActive: false }).then(({ isActive }) => {
  chrome.action.setBadgeBackgroundColor({ color: isActive ? GREEN : RED })
})
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │ Update at runtime                                                         │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
chrome.action.onClicked.addListener(async () => {
  const { isActive } = await chrome.storage.local.get({ isActive: false })
  const newActive = !isActive
  await chrome.storage.local.set({ isActive: newActive })
  chrome.action.setBadgeBackgroundColor({ color: newActive ? GREEN : RED })
})
