const API_BASE = process.env.VUE_APP_API_BASE || '/api'
const CACHE_PREFIX = 'muslimdaily_api_cache:'

function getToken() {
  return localStorage.getItem('muslimdaily_token') || ''
}

export function setToken(token) {
  if (token) localStorage.setItem('muslimdaily_token', token)
  else localStorage.removeItem('muslimdaily_token')
}

function cacheKey(path) {
  return `${CACHE_PREFIX}${path}`
}

function saveCache(path, data) {
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify({
      saved_at: new Date().toISOString(),
      data
    }))
  } catch (e) {}
}

function readCache(path) {
  try {
    const raw = localStorage.getItem(cacheKey(path))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.data) return null
    return {
      ...parsed.data,
      __cache: true,
      __saved_at: parsed.saved_at
    }
  } catch (e) {
    return null
  }
}

export async function api(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const canUseCache = method === 'GET'

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {})
      }
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok || data.ok === false) {
      throw new Error(data.message || 'حدث خطأ غير متوقع')
    }

    if (canUseCache) saveCache(path, data)
    return data
  } catch (error) {
    if (canUseCache) {
      const cached = readCache(path)
      if (cached) return cached
    }

    if (!navigator.onLine) {
      throw new Error('أنت  الآن. هذه العملية تحتاج اتصال.')
    }

    throw error
  }
}

export function currentToken() {
  return getToken()
}

export function getCachedApi(path) {
  return readCache(path)
}
