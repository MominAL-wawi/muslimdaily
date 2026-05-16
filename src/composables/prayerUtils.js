import staticPrayerFallback from '@/data/prayerTimesFallback.json'

export const PRAYER_LABELS = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
}

export function normalizeTime(value) {
  if (!value) return ''
  const match = String(value).trim().match(/(\d{1,2})[:.](\d{2})/)
  if (!match) return ''
  const hour = Math.max(0, Math.min(23, Number(match[1])))
  const minute = Math.max(0, Math.min(59, Number(match[2])))
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function formatTime12(value) {
  const normalized = normalizeTime(value)
  if (!normalized) return ''
  const [h, m] = normalized.split(':').map(Number)
  const suffix = h < 12 ? 'ص' : 'م'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function normalizePrayerTimes(source) {
  const p = source?.timings || source?.prayers || source?.prayer_times || source?.data?.timings || source?.dashboard?.prayers || source?.dashboard?.prayer_times || source
  if (!p) return null
  const times = {
    Fajr: normalizeTime(p.Fajr || p.fajr),
    Dhuhr: normalizeTime(p.Dhuhr || p.dhuhr),
    Asr: normalizeTime(p.Asr || p.asr),
    Maghrib: normalizeTime(p.Maghrib || p.maghrib),
    Isha: normalizeTime(p.Isha || p.isha)
  }
  return Object.values(times).every(Boolean) ? times : null
}

export function getStaticPrayerFallback() {
  return normalizePrayerTimes(staticPrayerFallback) || {
    Fajr: '04:19',
    Dhuhr: '12:39',
    Asr: '16:18',
    Maghrib: '19:27',
    Isha: '20:53'
  }
}

export async function getStaticPrayerFallbackFromWeb() {
  try {
    const res = await fetch(`/data/prayer-times-fallback.json?v=2026-05-10`, { cache: 'no-store' })
    if (!res.ok) throw new Error('fallback file unavailable')
    const json = await res.json()
    return normalizePrayerTimes(json) || getStaticPrayerFallback()
  } catch (e) {
    return getStaticPrayerFallback()
  }
}
