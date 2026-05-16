/*
  Safe APK/WebView notification bridge.
  لا يحتوي على Capacitor imports حتى لا يسبب compile errors.
*/
import { normalizePrayerTimes } from '@/composables/prayerUtils'

function parseTime(value, fallback) {
  const raw = String(value || fallback || '08:00').trim()
  const match = raw.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return parseTime(fallback || '08:00', '08:00')
  let hour = Number(match[1])
  let minute = Number(match[2])
  if (Number.isNaN(hour) || hour < 0 || hour > 23) hour = 8
  if (Number.isNaN(minute) || minute < 0 || minute > 59) minute = 0
  return { hour, minute }
}

function hasAndroidBridgeMethod(name) {
  return typeof window !== 'undefined'
    && window.MuslimDailyAndroid
    && typeof window.MuslimDailyAndroid[name] === 'function'
}

function scheduleDailyNotification(id, title, body, hour, minute) {
  if (!hasAndroidBridgeMethod('scheduleDailyNotification')) return false
  window.MuslimDailyAndroid.scheduleDailyNotification(id, title, body, hour, minute)
  return true
}

export async function setupMuslimDailyNotifications(user = {}, prayerTimes = null) {
  const morning = parseTime(user.morning_adhkar_time, '07:00')
  const evening = parseTime(user.evening_adhkar_time, '18:00')
  const quran = parseTime(user.quran_reminder_time || user.quran_wird_time, '20:30')

  if (!hasAndroidBridgeMethod('scheduleDailyNotification')) {
    return { ok: false, reason: 'no-android-bridge' }
  }

  try {
    scheduleDailyNotification(7001, 'أذكار الصباح', 'حان وقت أذكار الصباح. ابدأ يومك بذكر الله.', morning.hour, morning.minute)
    scheduleDailyNotification(7002, 'أذكار المساء', 'حان وقت أذكار المساء. اختم يومك بالطمأنينة.', evening.hour, evening.minute)
    scheduleDailyNotification(7003, 'وردك القرآني', 'تذكير لطيف بوردك القرآني اليومي.', quran.hour, quran.minute)

    const times = normalizePrayerTimes(prayerTimes)
    if (times && hasAndroidBridgeMethod('schedulePrayerNotifications')) {
      window.MuslimDailyAndroid.schedulePrayerNotifications(JSON.stringify({
        minutesBefore: 15,
        prayers: times
      }))
    }

    return { ok: true, provider: 'android-webview-bridge' }
  } catch (e) {
    return { ok: false, message: e?.message || String(e) }
  }
}
