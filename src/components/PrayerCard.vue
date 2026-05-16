<template>
  <section class="card">
    <h2 class="card-title">أوقات الصلاة اليوم</h2>
    <div v-if="!timings" class="alert">تعذر جلب أوقات الصلاة الآن.</div>
    <div v-else class="prayer-grid">
      <div v-for="p in prayers" :key="p.key" class="prayer">
        <span>{{ p.label }}</span>
        <strong>{{ formatTime12(timings[p.key]) || '-' }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import { formatTime12 } from '@/composables/prayerUtils'

defineProps({ timings: Object })
const prayers = [
  { key: 'Fajr', label: 'الفجر' },
  { key: 'Dhuhr', label: 'الظهر' },
  { key: 'Asr', label: 'العصر' },
  { key: 'Maghrib', label: 'المغرب' },
  { key: 'Isha', label: 'العشاء' }
]
</script>
