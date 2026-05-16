<template>
  <div class="md-page quran-page">
    <section class="md-hero-card">
      <div>
        <span class="md-chip">ورد القرآن</span>
        <h1>خطة القرآن اليومية</h1>
        <p>تظهر الخطة حتى بدون اتصال، وآخر تعديل يبقى محفوظًا على الجهاز.</p>
      </div>
      <div class="md-seal">القرآن</div>
    </section>

    <section class="md-card quran-plan-card">
      <div class="quran-cards">
        <article class="quran-task">
          <span>حفظ الفجر</span>
          <strong>{{ pageLabel(plan.morning_page, plan.morning_end_page) }}</strong>
          <small>{{ countLabel(morningCount) }} حسب خطتك</small>
          <button
            type="button"
            class="md-btn md-btn--primary"
            :class="{ 'is-done': plan.morning_done }"
            @pointerdown.prevent="toggleDone('morning')"
          >
            {{ plan.morning_done ? 'تم الحفظ' : 'أتممت الحفظ' }}
          </button>
        </article>

        <article class="quran-task">
          <span>حفظ المغرب</span>
          <strong>{{ pageLabel(plan.evening_page, plan.evening_end_page) }}</strong>
          <small>{{ countLabel(eveningCount) }} حسب خطتك</small>
          <button
            type="button"
            class="md-btn md-btn--primary"
            :class="{ 'is-done': plan.evening_done }"
            @pointerdown.prevent="toggleDone('evening')"
          >
            {{ plan.evening_done ? 'تم الحفظ' : 'أتممت الحفظ' }}
          </button>
        </article>

        <article class="quran-task quran-task--reading">
          <span>ورد القراءة</span>
          <strong>{{ readingCount }} صفحات</strong>
          <small>من صفحة {{ plan.reading_start_page }} إلى صفحة {{ plan.reading_end_page }}</small>
          <button
            type="button"
            class="md-btn md-btn--gold"
            :class="{ 'is-done': plan.reading_done }"
            @pointerdown.prevent="toggleDone('reading')"
          >
            {{ plan.reading_done ? 'تمت القراءة' : 'أتممت القراءة' }}
          </button>
        </article>
      </div>
    </section>

    <section class="md-card quran-edit-card">
      <div class="md-section-row">
        <div>
          <span class="md-chip">تخصيص</span>
          <h2>عدّل خطتك</h2>
        </div>
      </div>

      <form class="quran-form" @submit.prevent="saveSettings">
        <label>
          <span>حفظ الفجر</span>
          <input type="number" min="1" max="20" v-model.number="settings.quran_morning_pages" @input="autoPreview">
        </label>

        <label>
          <span>حفظ المغرب</span>
          <input type="number" min="1" max="20" v-model.number="settings.quran_evening_pages" @input="autoPreview">
        </label>

        <label>
          <span>ورد القراءة</span>
          <input type="number" min="1" max="50" v-model.number="settings.quran_reading_pages" @input="autoPreview">
        </label>

        <label>
          <span>بداية الحفظ</span>
          <input type="number" min="1" max="604" v-model.number="settings.next_new_page" @input="autoPreview">
        </label>

        <label>
          <span>بداية القراءة</span>
          <input type="number" min="1" max="604" v-model.number="settings.next_reading_page" @input="autoPreview">
        </label>

        <div class="quran-form-actions">
          <button class="md-btn md-btn--primary" type="submit" @pointerdown="saveSettings">حفظ الخطة</button>
          <button class="md-btn md-btn--soft" type="button" @pointerdown.prevent="resetDefault">استعادة الافتراضي</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'

const SETTINGS_KEY = 'muslimdaily_quran_settings'
const PLAN_KEY = 'muslimdaily_quran_plan'

const defaultSettings = {
  quran_morning_pages: 1,
  quran_evening_pages: 1,
  quran_reading_pages: 5,
  next_new_page: 1,
  next_reading_page: 1
}

const settings = reactive({ ...defaultSettings })

const plan = reactive({
  morning_page: 1,
  morning_end_page: 1,
  evening_page: 2,
  evening_end_page: 2,
  reading_start_page: 1,
  reading_end_page: 5,
  morning_done: 0,
  evening_done: 0,
  reading_done: 0
})

const morningCount = computed(() => pagesCount(plan.morning_page, plan.morning_end_page))
const eveningCount = computed(() => pagesCount(plan.evening_page, plan.evening_end_page))
const readingCount = computed(() => pagesCount(plan.reading_start_page, plan.reading_end_page))

function clampPage(page) {
  let n = Number(page || 1)
  if (Number.isNaN(n)) n = 1
  while (n < 1) n += 604
  while (n > 604) n -= 604
  return n
}

function pagesCount(start, end) {
  const s = clampPage(start)
  const e = clampPage(end)
  return e >= s ? e - s + 1 : (604 - s + 1) + e
}

function endPage(start, count) {
  return clampPage(Number(start || 1) + Math.max(1, Number(count || 1)) - 1)
}

function pageLabel(start, end) {
  const s = clampPage(start)
  const e = clampPage(end)
  return s === e ? `صفحة ${s}` : `صفحات ${s} - ${e}`
}

function countLabel(count) {
  return count === 1 ? 'صفحة واحدة' : `${count} صفحات`
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function applySettings(next) {
  Object.assign(settings, {
    ...defaultSettings,
    ...(next || {})
  })

  settings.quran_morning_pages = Math.max(1, Number(settings.quran_morning_pages || 1))
  settings.quran_evening_pages = Math.max(1, Number(settings.quran_evening_pages || 1))
  settings.quran_reading_pages = Math.max(1, Number(settings.quran_reading_pages || 5))
  settings.next_new_page = clampPage(settings.next_new_page)
  settings.next_reading_page = clampPage(settings.next_reading_page)
}

function buildPlanFromSettings(keepDone = false) {
  const morningStart = clampPage(settings.next_new_page)
  const morningEnd = endPage(morningStart, settings.quran_morning_pages)
  const eveningStart = endPage(morningEnd, 2)
  const eveningEnd = endPage(eveningStart, settings.quran_evening_pages)
  const readingStart = clampPage(settings.next_reading_page)
  const readingEnd = endPage(readingStart, settings.quran_reading_pages)

  const previous = { ...plan }

  Object.assign(plan, {
    morning_page: morningStart,
    morning_end_page: morningEnd,
    evening_page: eveningStart,
    evening_end_page: eveningEnd,
    reading_start_page: readingStart,
    reading_end_page: readingEnd,
    morning_done: keepDone ? previous.morning_done : 0,
    evening_done: keepDone ? previous.evening_done : 0,
    reading_done: keepDone ? previous.reading_done : 0
  })
}

function saveAll() {
  saveJson(SETTINGS_KEY, settings)
  saveJson(PLAN_KEY, plan)
}

function load() {
  applySettings(loadJson(SETTINGS_KEY, defaultSettings))
  const savedPlan = loadJson(PLAN_KEY, null)

  if (savedPlan) {
    Object.assign(plan, {
      ...plan,
      ...savedPlan,
      morning_end_page: savedPlan.morning_end_page || savedPlan.morning_page || 1,
      evening_end_page: savedPlan.evening_end_page || savedPlan.evening_page || 2,
      reading_end_page: savedPlan.reading_end_page || endPage(savedPlan.reading_start_page || 1, settings.quran_reading_pages)
    })
  } else {
    buildPlanFromSettings(false)
    saveAll()
  }
}

function autoPreview() {
  applySettings(settings)
  buildPlanFromSettings(true)
  saveAll()
}

function saveSettings() {
  applySettings(settings)
  buildPlanFromSettings(false)
  saveAll()
}

function resetDefault() {
  applySettings(defaultSettings)
  buildPlanFromSettings(false)
  saveAll()
}

function toggleDone(type) {
  if (type === 'morning') plan.morning_done = plan.morning_done ? 0 : 1
  if (type === 'evening') plan.evening_done = plan.evening_done ? 0 : 1
  if (type === 'reading') plan.reading_done = plan.reading_done ? 0 : 1
  saveAll()
}

onMounted(load)
</script>
