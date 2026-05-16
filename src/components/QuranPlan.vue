<template>
  <section class="card">
    <h2 class="card-title">خطة القرآن اليوم</h2>
    <div class="quran-plan">
      <div class="quran-box">
        <span class="muted">حفظ بعد الفجر</span>
        <strong>صفحة {{ plan?.morning_page }}</strong>
        <small class="muted">حسب خطتك</small>
      </div>
      <div class="quran-box">
        <span class="muted">حفظ بعد المغرب</span>
        <strong>صفحة {{ plan?.evening_page }}</strong>
        <small class="muted">حسب خطتك</small>
      </div>
      <div class="quran-box">
        <span class="muted">قراءة اليوم</span>
        <strong>{{ readingCount }} صفحات</strong>
        <small class="muted">من صفحة {{ readingStart }} إلى صفحة {{ readingEnd }}</small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ plan: Object })

const readingStart = computed(() => props.plan?.reading_start_page || props.plan?.review_start_page || '')
const readingEnd = computed(() => props.plan?.reading_end_page || props.plan?.review_end_page || '')
const readingCount = computed(() => {
  if (props.plan?.reading_pages_count) return props.plan.reading_pages_count
  const start = Number(readingStart.value)
  const end = Number(readingEnd.value)
  if (!start || !end) return 5
  return end >= start ? end - start + 1 : (604 - start + 1) + end
})
</script>
