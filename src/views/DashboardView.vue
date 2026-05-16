<template>
  <div class="dashboard-page luxury-page">
    <section class="luxury-hero">
      <div class="luxury-hero__content">
        <span class="luxury-chip">بسم الله</span>
        <h1>ابدأ يومك بطمأنينة</h1>
        <p>هنا ترتّب وردك، تتابع صلاتك، وتترك لقلبك مساحة يهدأ فيها.</p>
      </div>
      <div class="luxury-hero__date">
        <strong>{{ dayName }}</strong>
        <span>{{ formattedDate }}</span>
      </div>
    </section>

    <section class="luxury-dashboard-grid">
      <article class="md-card luxury-card luxury-prayer-card">
        <div class="luxury-card-head">
          <div>
            <span class="luxury-chip">مواقيت الصلاة</span>
            <h2>أوقات صلاتك اليوم</h2>
            <small v-if="selectedCityLabel" class="selected-city-label">{{ selectedCityLabel }}</small>
          </div>
          <div class="prayer-actions">
            <button class="luxury-btn luxury-btn--gold location-btn" type="button" @click="openLocationSettings">
              <span class="location-btn__icon">📍</span> إعدادات الموقع
            </button>
            <button class="luxury-btn luxury-btn--ghost" type="button" @click="loadDashboard">تحديث</button>
          </div>
        </div>

        <div v-if="prayerTimes" class="luxury-prayer-grid">
          <div class="luxury-prayer-item"><span>الفجر</span><strong>{{ formatTime12(prayerTimes.Fajr) }}</strong></div>
          <div class="luxury-prayer-item"><span>الظهر</span><strong>{{ formatTime12(prayerTimes.Dhuhr) }}</strong></div>
          <div class="luxury-prayer-item"><span>العصر</span><strong>{{ formatTime12(prayerTimes.Asr) }}</strong></div>
          <div class="luxury-prayer-item"><span>المغرب</span><strong>{{ formatTime12(prayerTimes.Maghrib) }}</strong></div>
          <div class="luxury-prayer-item"><span>العشاء</span><strong>{{ formatTime12(prayerTimes.Isha) }}</strong></div>
        </div>

      </article>

      <article class="luxury-card luxury-quran-callout">
        <div>
          <span class="luxury-chip">وردك القرآني</span>
          <h2>خذ وردك بهدوء</h2>
          <p>صفحات قليلة كل يوم تصنع أثرًا لا يزول.</p>
        </div>
        <RouterLink class="luxury-btn luxury-btn--gold" to="/quran">افتح وردك القرآني</RouterLink>
      </article>

      <article class="luxury-card luxury-faith-card motivation-card">
        <div class="luxury-faith-orb">✦</div>
        <div class="luxury-faith-content">
          <span class="luxury-chip">{{ faithQuote.tag }}</span>
          <h2>{{ faithQuote.title }}</h2>
          <p>{{ faithQuote.text }}</p>
          <div class="luxury-actions">
            <button class="luxury-btn luxury-btn--gold" type="button" @click="nextFaithQuote">رسالة أخرى</button>
            <RouterLink class="luxury-btn luxury-btn--ghost" to="/quran">{{ faithQuote.action }}</RouterLink>
          </div>
        </div>
      </article>

      <article class="luxury-card luxury-good-deeds-card deeds-card">
        <div class="deeds-card__content">
          <span class="luxury-chip">زاد اليوم</span>
          <h2>توبة، استغفار، وصدقة</h2>
          <p>ثلاثة أبواب قريبة تفتح للقلب طريقًا أهدأ. اختر معنى اليوم وخذه معك.</p>

          <div class="deed-highlight">
            <span>{{ deedMessage.type }}</span>
            <strong>{{ deedMessage.title }}</strong>
            <p>{{ deedMessage.text }}</p>
          </div>

          <div class="luxury-actions">
            <button class="luxury-btn luxury-btn--gold" type="button" @click="nextDeedMessage">فكرة أخرى</button>
            <RouterLink class="luxury-btn luxury-btn--ghost" to="/adhkar">{{ deedMessage.action }}</RouterLink>
          </div>
        </div>

        <div class="good-deeds-list">
          <button type="button" @click="deedMessage = { type: 'استغفار', title: 'أستغفر الله وأتوب إليه', text: 'اجعلها وردًا حاضرًا كلما شعرت بثقل أو تقصير.', action: 'استغفر' }">
            <strong>استغفار</strong>
            <span>يمحو ويطمئن</span>
          </button>

          <button type="button" @click="deedMessage = { type: 'توبة', title: 'رجوع صادق', text: 'خطوة رجوع واحدة بصدق خير من تأجيل طويل.', action: 'تب الآن' }">
            <strong>توبة</strong>
            <span>بداية جديدة</span>
          </button>

          <button type="button" @click="deedMessage = { type: 'صدقة', title: 'ولو بكلمة طيبة', text: 'الخير القليل حين يخرج بإخلاص يكون كبيرًا عند الله.', action: 'اصنع خيرًا' }">
            <strong>صدقة</strong>
            <span>ترفع وتبارك</span>
          </button>
        </div>
      </article>

      <article class="md-card luxury-card luxury-quick-card">
        <div class="luxury-card-head">
          <div>
            <span class="luxury-chip">اختصر الطريق</span>
            <h2>ما تحتاجه اليوم</h2>
          </div>
        </div>

        <div class="luxury-quick-links">
          <RouterLink to="/quran">
            <strong>القرآن</strong>
            <span>قراءة وحفظ</span>
          </RouterLink>

          <RouterLink to="/adhkar">
            <strong>الأذكار</strong>
            <span>أذكار اليوم</span>
          </RouterLink>

          <RouterLink to="/hadith">
            <strong>الأحاديث</strong>
            <span>حديث وفائدة</span>
          </RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { setupMuslimDailyNotifications } from '@/composables/localNotifications'
import { store } from '@/store'
import { formatTime12, normalizePrayerTimes } from '@/composables/prayerUtils'
import { getPrayerTimesByGps } from '@/composables/prayerGps'
import { getRandomFaithQuote, getRandomDeedMessage, getTodayDeedMessage, getTodayFaithQuote } from '@/composables/faithQuotes'

const loading = ref(false)
const prayerTimes = ref(null)
const prayerMeta = ref(null)
const selectedCityLabel = ref('')
const locationError = ref('')
const faithQuote = ref(getTodayFaithQuote())
const deedMessage = ref(getTodayDeedMessage())

const today = new Date()
const dayName = computed(() => today.toLocaleDateString('ar', { weekday: 'long' }))
const formattedDate = computed(() => today.toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric' }))

function extractPrayerTimes(data) {
  return normalizePrayerTimes(data)
}


function savePrayerCache(times) {
  if (times && times.Fajr) {
    localStorage.setItem('muslimdaily_prayer_times_last', JSON.stringify(times))
  }
}

function nextFaithQuote() {
  faithQuote.value = getRandomFaithQuote(faithQuote.value?.title)
}

function nextDeedMessage() {
  deedMessage.value = getRandomDeedMessage(deedMessage.value?.title)
}

async function applyPrayerData(data) {
  const times = extractPrayerTimes(data)
  if (!times || !times.Fajr) return false
  prayerTimes.value = times
  prayerMeta.value = data
  if (data?.city) selectedCityLabel.value = data.country ? `${data.city} - ${data.country}` : data.city
  else if (data?.lat && data?.lng) selectedCityLabel.value = `موقعي الحالي: ${Number(data.lat).toFixed(4)}, ${Number(data.lng).toFixed(4)}`
  savePrayerCache(times)
  try { await setupMuslimDailyNotifications(store.user, prayerTimes.value) } catch (e) {}
  return true
}

function openLocationSettings() {
  try {
    if (window.MuslimDailyAndroid && typeof window.MuslimDailyAndroid.openLocationSettings === 'function') {
      window.MuslimDailyAndroid.openLocationSettings()
      return
    }
  } catch (e) {}
  useDeviceLocation()
}


function isAndroidAppWithoutLocationPermission() {
  try {
    return !!(window.MuslimDailyAndroid &&
      typeof window.MuslimDailyAndroid.hasLocationPermission === 'function' &&
      window.MuslimDailyAndroid.hasLocationPermission() !== true)
  } catch (e) {
    return false
  }
}

async function useDeviceLocation() {
  loading.value = true
  locationError.value = ''
  try {
    const data = await getPrayerTimesByGps()
    await applyPrayerData(data)
  } catch (e) {
    prayerTimes.value = null
    selectedCityLabel.value = ''
  } finally {
    loading.value = false
  }
}

async function loadDashboard() {
  if (isAndroidAppWithoutLocationPermission()) {
    prayerTimes.value = null
    selectedCityLabel.value = ''
    locationError.value = ''
    return
  }
  loading.value = true
  locationError.value = ''

  try {
    // GPS first, every time. No IP, no saved manual city, and no old city guess.
    const data = await getPrayerTimesByGps()
    if (await applyPrayerData(data)) return
  } catch (e) {
    prayerTimes.value = null
    selectedCityLabel.value = ''
    locationError.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  window.MuslimDailyLocation = {
    request: async () => {
      await useDeviceLocation()
    }
  }
  await loadDashboard()
  try { await setupMuslimDailyNotifications(store.user, prayerTimes.value) } catch(e) {}
})

onUnmounted(() => {
  try {
    if (window.MuslimDailyLocation) delete window.MuslimDailyLocation
  } catch (e) {}
})
</script>

<style scoped>
 .prayer-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.location-btn{display:inline-flex;align-items:center;gap:7px}
.location-btn__icon{font-size:18px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.16))}
.selected-city-label{display:inline-flex;margin-top:8px;padding:7px 12px;border-radius:999px;background:linear-gradient(135deg,rgba(255,246,218,.92),rgba(240,218,164,.72));border:1px solid rgba(198,151,55,.32);color:#5f4610;font-weight:900;box-shadow:0 8px 18px rgba(116,85,22,.08)}
@media(max-width:640px){.prayer-actions{width:100%;justify-content:stretch}.prayer-actions .luxury-btn{flex:1}.selected-city-label{font-size:12px}}
</style>
