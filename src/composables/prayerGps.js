import { normalizePrayerTimes } from '@/composables/prayerUtils'

// v6: GPS only + official/verified backend provider. Aladhan and IP lookup are intentionally removed.
const CACHE_VERSION = 'v13-gaza-date-safe-cache'
const CACHE_CLEAR_KEY = `muslimdaily_prayer_cache_clear_${CACHE_VERSION}`
const LOCATION_KEY = `muslimdaily_selected_location_${CACHE_VERSION}`
const PRAYER_KEY = `muslimdaily_prayer_times_${CACHE_VERSION}`

const LEGACY_PREFIXES = [
  'muslimdaily_ip_',
  'muslimdaily_prayer_times_v2',
  'muslimdaily_prayer_times_v4',
  'muslimdaily_prayer_times_v5',
  'muslimdaily_selected_location_v',
  'muslimdaily_prayer_times:',
  'muslimdaily_api_cache:/dashboard',
  'muslimdaily_api_cache:/prayers'
]

const LEGACY_KEYS = [
  'muslimdaily_prayer_times',
  'muslimdaily_prayer_times_last',
  'muslimdaily_gps_location',
  'muslimdaily_ip_location',
  'muslimdaily_ip_location_v2-city-ip',
  'muslimdaily_prayer_times_v2-city-ip',
  'muslimdaily_selected_location_v4-manual-city-official-gaza',
  'muslimdaily_prayer_times_v4-manual-city-official-gaza',
  'muslimdaily_selected_location_v5-geo-only-gps',
  'muslimdaily_prayer_times_v5-geo-only-gps',
  'muslimdaily_prayer_times_v8-ministry-official-gps-settings',
  'muslimdaily_selected_location_v8-ministry-official-gps-settings'
]

export const ARAB_CITY_LOCATIONS = [
  { id: 'ps-gaza', city: 'غزة', country: 'فلسطين', countryCode: 'PS', lat: 31.5017, lng: 34.4668, timezone: 'Asia/Gaza' },
  { id: 'ps-khan-yunis', city: 'خانيونس', country: 'فلسطين', countryCode: 'PS', lat: 31.3462, lng: 34.3036, timezone: 'Asia/Gaza' },
  { id: 'ps-rafah', city: 'رفح', country: 'فلسطين', countryCode: 'PS', lat: 31.2969, lng: 34.2455, timezone: 'Asia/Gaza' },
  { id: 'ps-nablus', city: 'نابلس', country: 'فلسطين', countryCode: 'PS', lat: 32.2211, lng: 35.2544, timezone: 'Asia/Hebron' },
  { id: 'ps-hebron', city: 'الخليل', country: 'فلسطين', countryCode: 'PS', lat: 31.5326, lng: 35.0998, timezone: 'Asia/Hebron' },
  { id: 'ps-jerusalem', city: 'القدس', country: 'فلسطين', countryCode: 'PS', lat: 31.7683, lng: 35.2137, timezone: 'Asia/Hebron' },
  { id: 'jo-amman', city: 'عمّان', country: 'الأردن', countryCode: 'JO', lat: 31.9552, lng: 35.945, timezone: 'Asia/Amman' },
  { id: 'jo-aqaba', city: 'العقبة', country: 'الأردن', countryCode: 'JO', lat: 29.5321, lng: 35.0063, timezone: 'Asia/Amman' },
  { id: 'jo-irbid', city: 'إربد', country: 'الأردن', countryCode: 'JO', lat: 32.5556, lng: 35.85, timezone: 'Asia/Amman' },
  { id: 'jo-zarqa', city: 'الزرقاء', country: 'الأردن', countryCode: 'JO', lat: 32.0728, lng: 36.087, timezone: 'Asia/Amman' },
  { id: 'eg-cairo', city: 'القاهرة', country: 'مصر', countryCode: 'EG', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'sa-riyadh', city: 'الرياض', country: 'السعودية', countryCode: 'SA', lat: 24.7136, lng: 46.6753, timezone: 'Asia/Riyadh' },
  { id: 'sa-makkah', city: 'مكة', country: 'السعودية', countryCode: 'SA', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh' },
  { id: 'ae-dubai', city: 'دبي', country: 'الإمارات', countryCode: 'AE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'qa-doha', city: 'الدوحة', country: 'قطر', countryCode: 'QA', lat: 25.2854, lng: 51.531, timezone: 'Asia/Qatar' },
  { id: 'kw-kuwait', city: 'مدينة الكويت', country: 'الكويت', countryCode: 'KW', lat: 29.3759, lng: 47.9774, timezone: 'Asia/Kuwait' },
  { id: 'bh-manama', city: 'المنامة', country: 'البحرين', countryCode: 'BH', lat: 26.2285, lng: 50.586, timezone: 'Asia/Bahrain' },
  { id: 'om-muscat', city: 'مسقط', country: 'عُمان', countryCode: 'OM', lat: 23.588, lng: 58.3829, timezone: 'Asia/Muscat' }
]

function isValidCoord(lat, lng) {
  const a = Number(lat)
  const b = Number(lng)
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a) <= 90 && Math.abs(b) <= 180
}

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch (e) {}
}

function androidBridgeMethod(name) {
  try {
    return !!(window.MuslimDailyAndroid && typeof window.MuslimDailyAndroid[name] === 'function')
  } catch (e) {
    return false
  }
}

function readAndroidJson(methodName) {
  try {
    if (!androidBridgeMethod(methodName)) return null
    const raw = window.MuslimDailyAndroid[methodName]()
    if (!raw || typeof raw !== 'string') return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function saveToAndroid(methodName, payload) {
  try {
    if (androidBridgeMethod(methodName)) {
      window.MuslimDailyAndroid[methodName](JSON.stringify(payload))
    }
  } catch (e) {}
}

function isSamePrayerDate(data, date = todayKey()) {
  if (!data) return false
  if (data.date === date) return true
  if (data.updated_at && String(data.updated_at).slice(0, 10) === date) return true
  return false
}

function readAndroidPrayerCache(date = todayKey()) {
  const cached = readAndroidJson('getPrayerTimesJson')
  if (!cached || !normalizePrayerTimes(cached) || !isSamePrayerDate(cached, date)) return null
  return { ...cached, source: cached.source || 'android_prayer_file_cache' }
}

function getGazaOfficialFromAndroid(loc, date = todayKey()) {
  try {
    if (!androidBridgeMethod('getGazaOfficialTimesJson')) return null
    if (Math.abs(Number(loc.lat) - 31.5017) > 0.45 || Math.abs(Number(loc.lng) - 34.4668) > 0.45) return null
    const raw = window.MuslimDailyAndroid.getGazaOfficialTimesJson()
    if (!raw) return null
    const table = JSON.parse(raw)
    const timings = table?.times?.[date]
    if (!timings || !normalizePrayerTimes(timings)) return null
    return packPrayerTimes(timings, 'official_gaza_android_asset', {
      city: 'غزة',
      country: 'فلسطين',
      countryCode: 'PS',
      lat: loc.lat,
      lng: loc.lng,
      timezone: loc.timezone || 'Asia/Gaza',
      date
    })
  } catch (e) {
    return null
  }
}

function savePrayerEverywhere(cacheKey, data) {
  save(cacheKey, data)
  save(PRAYER_KEY, data)
  save('muslimdaily_prayer_times', data)
  save('muslimdaily_prayer_times_last', data.timings || data.prayers || data.prayer_times)
  saveToAndroid('savePrayerTimes', data)
}

function clearOldPrayerCacheOnce() {
  try {
    if (localStorage.getItem(CACHE_CLEAR_KEY)) return
    const toRemove = [...LEGACY_KEYS]
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key) continue
      if (LEGACY_PREFIXES.some((prefix) => key.startsWith(prefix))) toRemove.push(key)
    }
    toRemove.forEach((key) => {
      try { localStorage.removeItem(key) } catch (e) {}
    })
    localStorage.setItem(CACHE_CLEAR_KEY, '1')
  } catch (e) {}
}

function packPrayerTimes(timings, source = 'fallback', extra = {}) {
  const normalized = normalizePrayerTimes(timings)
  return {
    ok: true,
    source,
    cacheVersion: CACHE_VERSION,
    ...extra,
    timings: normalized,
    prayers: normalized,
    prayer_times: normalized,
    updated_at: new Date().toISOString()
  }
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function normalizeLocation(loc) {
  if (!loc || !isValidCoord(loc.lat, loc.lng)) return null
  return {
    id: loc.id || `gps-${Number(loc.lat).toFixed(5)}-${Number(loc.lng).toFixed(5)}`,
    city: loc.city || 'موقعي الحالي',
    country: loc.country || '',
    countryCode: loc.countryCode || '',
    lat: Number(loc.lat),
    lng: Number(loc.lng),
    timezone: loc.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    source: loc.source || 'device_gps',
    saved_at: new Date().toISOString()
  }
}

function getBrowserPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('geolocation unavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: options.timeout || 20000,
      maximumAge: options.maximumAge || 60 * 1000
    })
  })
}

export function getSavedLocation() {
  clearOldPrayerCacheOnce()
  return normalizeLocation(read(LOCATION_KEY, null))
}

export function clearSavedPrayerLocation() {
  try {
    localStorage.removeItem(LOCATION_KEY)
    localStorage.removeItem(PRAYER_KEY)
    localStorage.removeItem('muslimdaily_prayer_times')
    localStorage.removeItem('muslimdaily_prayer_times_last')
  } catch (e) {}
}

// Kept for compatibility with older imports, but it no longer creates a manual city flow.
export function saveManualLocation(location) {
  const loc = normalizeLocation({ ...location, source: 'device_gps' })
  if (!loc) throw new Error('موقع غير صالح')
  save(LOCATION_KEY, loc)
  try {
    if (window.MuslimDailyAndroid && typeof window.MuslimDailyAndroid.saveLocationData === 'function') {
      window.MuslimDailyAndroid.saveLocationData(JSON.stringify(loc))
    }
  } catch (e) {}
  return loc
}

export async function getDeviceLocation() {
  clearOldPrayerCacheOnce()

  let lat = null
  let lng = null
  let source = 'device_gps'

  try {
    const nativeLoc = readAndroidJson('getNativeLocationData')
    if (nativeLoc && isValidCoord(nativeLoc.lat, nativeLoc.lng)) {
      lat = nativeLoc.lat
      lng = nativeLoc.lng
      source = nativeLoc.source || 'android_last_known_location'
    }
  } catch (e) {}

  if (!isValidCoord(lat, lng)) {
    const position = await getBrowserPosition({ timeout: 20000, maximumAge: 60 * 1000 })
    lat = position?.coords?.latitude
    lng = position?.coords?.longitude
    source = 'device_gps'
  }

  if (!isValidCoord(lat, lng)) throw new Error('invalid device coordinates')

  const loc = normalizeLocation({
    id: `gps-${Number(lat).toFixed(5)}-${Number(lng).toFixed(5)}`,
    city: 'موقعي الحالي',
    country: '',
    countryCode: '',
    lat,
    lng,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    source
  })
  save(LOCATION_KEY, loc)
  saveToAndroid('saveLocationData', loc)
  return loc
}

async function fetchOfficialPrayerTimes(loc) {
  const params = new URLSearchParams({
    lat: String(loc.lat),
    lng: String(loc.lng),
    date: todayKey(),
    tz: loc.timezone || ''
  })
  const json = await fetchJson(`/api/official-prayer-times.php?${params.toString()}`, 18000)
  const timings = normalizePrayerTimes(json)
  if (!json?.ok || !timings) throw new Error(json?.error || 'official provider failed')
  return packPrayerTimes(timings, json.source || 'official_provider', {
    city: json.city || loc.city,
    country: json.country || loc.country,
    countryCode: json.countryCode || loc.countryCode,
    lat: loc.lat,
    lng: loc.lng,
    timezone: loc.timezone,
    date: json.date || todayKey(),
    nearestCity: json.nearestCity || null,
    sourceUrl: json.source_url || ''
  })
}

export async function getPrayerTimesForLocation(location) {
  clearOldPrayerCacheOnce()
  const loc = normalizeLocation(location)
  if (!loc) throw new Error('location required')

  const today = todayKey()
  const cacheKey = `${PRAYER_KEY}:${today}:${Number(loc.lat).toFixed(5)}:${Number(loc.lng).toFixed(5)}`
  const cached = read(cacheKey, null)
  if (cached && normalizePrayerTimes(cached)) return cached

  try {
    const data = await fetchOfficialPrayerTimes(loc)
    savePrayerEverywhere(cacheKey, data)
    return data
  } catch (e) {
    const gazaAsset = getGazaOfficialFromAndroid(loc, today)
    if (gazaAsset) {
      savePrayerEverywhere(cacheKey, gazaAsset)
      return gazaAsset
    }
    const androidCached = readAndroidPrayerCache(today)
    if (androidCached) return androidCached
    const lastLocal = read(PRAYER_KEY, null) || read('muslimdaily_prayer_times', null)
    if (lastLocal && normalizePrayerTimes(lastLocal) && isSamePrayerDate(lastLocal, today)) return { ...lastLocal, source: lastLocal.source || 'local_prayer_file_cache' }
    throw e
  }
}

export async function getPrayerTimesByGps() {
  const loc = await getDeviceLocation()
  return getPrayerTimesForLocation(loc)
}

// IP lookup has been removed completely; this alias intentionally uses GPS only for old calls.
export async function getPrayerTimesByIp() {
  return getPrayerTimesByGps()
}

export async function getPrayerTimesWithFallback() {
  // No generic/static fallback without a real location.
  // This prevents showing wrong prayer times when the user has not allowed location access.
  return getPrayerTimesByGps()
}
