<template>
  <section class="luxury-page adhkar-luxury-page">
    <div class="luxury-hero luxury-hero--small">
      <div>
        <span class="luxury-chip">وردٌ يطمئنك</span>
        <h1>أذكارك</h1>
        <p>خذها على مهل؛ ذكرٌ قصير قد يفتح في القلب بابًا واسعًا.</p>
      </div>

      <div class="adhkar-tabs-luxury">
        <button :class="{ active: cat === 'morning' }" @click="setCat('morning')">أذكار الصباح</button>
        <button :class="{ active: cat === 'evening' }" @click="setCat('evening')">أذكار المساء</button>
        <button :class="{ active: cat === 'general' }" @click="setCat('general')">أذكار مختارة</button>
      </div>
    </div>

    <div class="adhkar-grid-luxury">
      <article v-for="d in visibleItems" :key="d.id" class="adhkar-card-luxury">
        <div class="adhkar-card-luxury__top">
          <div>
            <span class="luxury-chip">{{ categoryLabel(d.category) }}</span>
            <h3>{{ d.title }}</h3>
          </div>
          <strong>×{{ Number(d.repeat_count || 1) }}</strong>
        </div>

        <p class="adhkar-text-luxury">{{ d.text }}</p>

        <div class="luxury-progress">
          <span>{{ Number(d.count_done || 0) }} / {{ Number(d.repeat_count || 1) }}</span>
          <div><i :style="{ width: progressPercent(d) + '%' }"></i></div>
        </div>

        <div class="luxury-actions">
          <button class="luxury-btn luxury-btn--emerald" @click="inc(d.id, 1)">+1</button>
          <button v-if="Number(d.repeat_count || 1) > 10" class="luxury-btn luxury-btn--ghost" @click="inc(d.id, 10)">+10</button>
          <button class="luxury-btn luxury-btn--danger" @click="reset(d.id)">إعادة</button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/composables/api'
import fallback from '@/data/adhkarFallback.json'

const cat = ref(localStorage.getItem('adhkar_active_cat') || 'morning')
const items = ref([])

const visibleItems = computed(() => {
  const base = items.value.length ? items.value : (fallback[cat.value] || [])
  const seen = new Set()

  return base
    .filter(item => String(item.category || cat.value) === cat.value)
    .filter(item => {
      const key = `${item.category}|${String(item.title || '').trim()}|${String(item.text || '').replace(/\s+/g, ' ').trim()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a,b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
})

function categoryLabel(category){ return category === 'morning' ? 'الصباح' : category === 'evening' ? 'المساء' : 'عام' }
function cacheKey(){ return `muslimdaily_adhkar_${cat.value}` }

function normalizeItems(data){
  let list = []
  if (Array.isArray(data)) list = data
  else if (Array.isArray(data?.items)) list = data.items
  else if (Array.isArray(data?.adhkar)) list = data.adhkar
  else if (Array.isArray(data?.data)) list = data.data
  else if (Array.isArray(data?.rows)) list = data.rows

  return list
    .filter(x => x && (x.text || x.title))
    .map((x, i) => ({
      id: x.id || `${cat.value}-${i}`,
      category: x.category || cat.value,
      title: x.title || 'ذكر',
      text: x.text || '',
      repeat_count: Number(x.repeat_count || 1),
      sort_order: Number(x.sort_order || i + 1),
      count_done: Number(x.count_done || 0)
    }))
}

function progressPercent(d){
  const total = Math.max(1, Number(d.repeat_count || 1))
  const done = Math.min(total, Number(d.count_done || 0))
  return Math.round((done / total) * 100)
}

function loadLocal(){
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey()) || '[]')
    const list = normalizeItems(saved)
    items.value = list.length ? list : normalizeItems(fallback[cat.value] || [])
  } catch(e) {
    items.value = normalizeItems(fallback[cat.value] || [])
  }
}

function saveLocal(){ localStorage.setItem(cacheKey(), JSON.stringify(items.value)) }

async function load(){
  loadLocal()

  const endpoints = [
    `/adhkar?cat=${cat.value}&all=1&limit=1000`,
    `/adhkar?category=${cat.value}&all=1&limit=1000`,
    `/adhkar.php?cat=${cat.value}&all=1&limit=1000`,
    `/api/adhkar?cat=${cat.value}&all=1&limit=1000`
  ]

  for (const endpoint of endpoints) {
    try{
      const data = await api(endpoint)
      const list = normalizeItems(data)
      if (list.length){
        items.value = list
        saveLocal()
        return
      }
    }catch(e){}
  }

  if (!items.value.length) {
    items.value = normalizeItems(fallback[cat.value] || [])
    saveLocal()
  }
}

function setCat(c){
  cat.value = c
  localStorage.setItem('adhkar_active_cat', c)
  load()
}

async function inc(id, amount){
  const item = items.value.find(x => String(x.id) === String(id))
  if (item) item.count_done = Math.min(Number(item.repeat_count || 1), Number(item.count_done || 0) + amount)
  saveLocal()
  await api('/adhkar/inc', { method:'POST', body: JSON.stringify({ id, amount }) })
}

async function reset(id){
  const item = items.value.find(x => String(x.id) === String(id))
  if (item) item.count_done = 0
  saveLocal()
  await api('/adhkar/reset', { method:'POST', body: JSON.stringify({ id }) })
}

onMounted(load)
</script>
