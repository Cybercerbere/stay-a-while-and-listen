let isActive = false

chrome.action.setBadgeBackgroundColor({ color: '#f00' })
chrome.action.setBadgeText({ text: ' ' })

chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: isActive ? '#f00' : '#0f0' })
  isActive = !isActive
})
