<template>
  <div class="md-page">
    <section class="md-hero-card">
      <div>
        <span class="md-chip">من الهدي النبوي</span>
        <h1>أحاديث تُنير الطريق</h1>
        <p>اقرأ حديثًا، تأمّل معناه، وخذ منه زادًا ليومك.</p>
      </div>
      <div class="md-seal">حديث</div>
    </section>

    <section class="md-card">
      <div class="md-hadith-nav">
        <button class="md-btn md-btn--soft" type="button" @pointerdown.prevent="prevHadith">السابق</button>
        <span class="md-pill">{{ hadiths.length ? currentIndex + 1 : 0 }} / {{ hadiths.length }}</span>
        <button class="md-btn md-btn--soft" type="button" @pointerdown.prevent="nextHadith">التالي</button>
      </div>

      <article v-if="current" class="md-hadith">
        <span class="md-chip">{{ current.title }}</span>
        <p class="md-hadith-text">{{ current.text }}</p>

        <div class="md-explain" v-if="current.explanation">
          <h3>فائدة الحديث</h3>
          <p>{{ current.explanation }}</p>
        </div>

        <div class="md-actions">
          <button
            class="md-btn md-btn--primary"
            :class="{ 'is-done': isDone }"
            type="button"
            @pointerdown.prevent="markDone"
          >
            {{ isDone ? 'تمت القراءة' : 'أنجزت قراءته' }}
          </button>

          <button
            v-if="isDone"
            class="md-btn md-btn--danger"
            type="button"
            @pointerdown.prevent="undoDone"
          >
            رجوع
          </button>

          <button
            class="md-btn md-btn--soft"
            type="button"
            @pointerdown.prevent="copyHadith"
          >
            {{ copied ? 'تم النسخ' : 'نسخ الحديث' }}
          </button>
        </div>
      </article>
    </section>

    <section v-if="hadiths.length" class="md-card hadith-index">
      <div class="md-section-row">
        <div>
          <span class="md-chip">الفهرس</span>
          <h2>فهرس الأحاديث</h2>
        </div>
        <span class="md-pill">{{ hadiths.length }}</span>
      </div>

      <div class="hadith-buttons">
        <button
          v-for="(h, i) in hadiths"
          :key="h.id || i"
          type="button"
          :class="{ active: i === currentIndex }"
          @pointerdown.prevent="goTo(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import hadithFallback from '@/data/hadithFallback.json'

const STORAGE_KEY = 'muslimdaily_hadiths_offline'
const INDEX_KEY = 'hadith_current_index'
const DONE_MAP_KEY = 'muslimdaily_hadith_done_map'

const hadiths = ref([])
const currentIndex = ref(Number(localStorage.getItem(INDEX_KEY) || 0))
const doneMap = ref({})
const copied = ref(false)

const current = computed(() => hadiths.value[currentIndex.value] || null)
const currentDoneId = computed(() => current.value ? String(current.value.id || currentIndex.value) : '')
const isDone = computed(() => Boolean(doneMap.value[currentDoneId.value]))

function normalizeHadiths(data) {
  const list = Array.isArray(data) ? data : []

  return list
    .filter(h => h && (h.text || h.title))
    .map((h, i) => ({
      id: Number(h.id || i + 1),
      title: h.title || `الحديث ${i + 1}`,
      text: h.text || '',
      explanation: h.explanation || ''
    }))
    .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
}

function loadDoneMap() {
  try {
    doneMap.value = JSON.parse(localStorage.getItem(DONE_MAP_KEY) || '{}')
  } catch (e) {
    doneMap.value = {}
  }
}

function saveDoneMap() {
  localStorage.setItem(DONE_MAP_KEY, JSON.stringify(doneMap.value))
}

function loadLocalHadiths() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeHadiths(JSON.parse(raw)) : []
  } catch (e) {
    return []
  }
}

function saveLocalHadiths(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function load() {
  const cached = loadLocalHadiths()
  const fallback = normalizeHadiths(hadithFallback)

  hadiths.value = cached.length >= fallback.length ? cached : fallback
  saveLocalHadiths(hadiths.value)
  loadDoneMap()

  if (currentIndex.value >= hadiths.value.length) currentIndex.value = 0
  saveIndex()
}

function saveIndex() {
  localStorage.setItem(INDEX_KEY, String(currentIndex.value))
  copied.value = false
}

function goTo(index) {
  currentIndex.value = index
  saveIndex()
}

function nextHadith() {
  if (!hadiths.value.length) return
  currentIndex.value = (currentIndex.value + 1) % hadiths.value.length
  saveIndex()
}

function prevHadith() {
  if (!hadiths.value.length) return
  currentIndex.value = currentIndex.value === 0 ? hadiths.value.length - 1 : currentIndex.value - 1
  saveIndex()
}

function markDone() {
  if (!currentDoneId.value) return
  doneMap.value = {
    ...doneMap.value,
    [currentDoneId.value]: true
  }
  saveDoneMap()
}

function undoDone() {
  if (!currentDoneId.value) return
  const next = { ...doneMap.value }
  delete next[currentDoneId.value]
  doneMap.value = next
  saveDoneMap()
}

async function copyHadith() {
  if (!current.value) return

  copied.value = true
  const text = `${current.value.title}\n${current.value.text}\n${current.value.explanation || ''}`

  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    document.body.removeChild(area)
  }

  window.setTimeout(() => {
    copied.value = false
  }, 900)
}

onMounted(load)
</script>
