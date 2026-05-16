import { store } from '@/store'
import { normalizePrayerTimes } from '@/composables/prayerUtils'

function parseTime(value, fallback) {
  const raw = String(value || fallback || '08:00')
  const m = raw.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return parseTime(fallback, '08:00')
  return { hour: Math.min(23, Math.max(0, Number(m[1]))), minute: Math.min(59, Math.max(0, Number(m[2]))) }
}

function hasBridgeMethod(name) {
  return typeof window !== 'undefined'
    && window.MuslimDailyAndroid
    && typeof window.MuslimDailyAndroid[name] === 'function'
}

export async function setupAppNotifications(user = store.user, prayerTimes = null) {
  if (!hasBridgeMethod('scheduleDailyNotifications') && !hasBridgeMethod('scheduleDailyNotification')) return false

  const morning = parseTime(user?.morning_adhkar_time, '07:00')
  const evening = parseTime(user?.evening_adhkar_time, '18:00')
  const hadith = parseTime(user?.hadith_reminder_time, '08:00')
  const quran = parseTime(user?.quran_reminder_time || user?.quran_wird_time, '20:30')

  try {
    if (hasBridgeMethod('scheduleDailyNotifications')) {
      window.MuslimDailyAndroid.scheduleDailyNotifications(JSON.stringify({
        morningHour: morning.hour,
        morningMinute: morning.minute,
        eveningHour: evening.hour,
        eveningMinute: evening.minute,
        hadithHour: hadith.hour,
        hadithMinute: hadith.minute,
        quranHour: quran.hour,
        quranMinute: quran.minute
      }))
    } else {
      window.MuslimDailyAndroid.scheduleDailyNotification(7001, 'أذكار الصباح', 'حان وقت أذكار الصباح. ابدأ يومك بذكر الله.', morning.hour, morning.minute)
      window.MuslimDailyAndroid.scheduleDailyNotification(7002, 'أذكار المساء', 'حان وقت أذكار المساء. اختم يومك بالطمأنينة.', evening.hour, evening.minute)
      window.MuslimDailyAndroid.scheduleDailyNotification(7003, 'وردك القرآني', 'تذكير لطيف بوردك القرآني اليومي.', quran.hour, quran.minute)
    }

    const times = normalizePrayerTimes(prayerTimes)
    if (times && hasBridgeMethod('schedulePrayerNotifications')) {
      window.MuslimDailyAndroid.schedulePrayerNotifications(JSON.stringify({ minutesBefore: 15, prayers: times }))
    }
    return true
  } catch (e) {
    return false
  }
}
