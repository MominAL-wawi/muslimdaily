import motivationalMessages from '@/data/motivationalMessages.json'
import deedsMessages from '@/data/deedsMessages.json'

function daySeed(offset = 0) {
  const now = new Date()
  return Number(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`) + offset
}

export function getTodayFaithQuote() {
  return motivationalMessages[daySeed(0) % motivationalMessages.length] || motivationalMessages[0]
}

export function getRandomFaithQuote(currentTitle = '') {
  if (!motivationalMessages.length) return null
  let next = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  if (motivationalMessages.length > 1) {
    let guard = 0
    while (next?.title === currentTitle && guard < 8) {
      next = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      guard += 1
    }
  }
  return next || motivationalMessages[0]
}

export function getTodayDeedMessage() {
  return deedsMessages[daySeed(7) % deedsMessages.length] || deedsMessages[0]
}

export function getRandomDeedMessage(currentTitle = '') {
  if (!deedsMessages.length) return null
  let next = deedsMessages[Math.floor(Math.random() * deedsMessages.length)]
  if (deedsMessages.length > 1) {
    let guard = 0
    while (next?.title === currentTitle && guard < 8) {
      next = deedsMessages[Math.floor(Math.random() * deedsMessages.length)]
      guard += 1
    }
  }
  return next || deedsMessages[0]
}

export { motivationalMessages, deedsMessages }
