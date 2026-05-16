<template>
  <section class="md-card md-faith">
    <div class="md-section-row">
      <div>
        <span class="md-chip">خلوة دقيقة</span>
        <h2>لحظة إيمانية</h2>
      </div>
      <button class="md-btn md-btn--soft" @click="next">تحدي آخر</button>
    </div>

    <div class="md-faith-body">
      <div class="md-icon">✦</div>
      <div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
        <small>{{ done ? 'ثبتك الله وزادك قربًا.' : item.note }}</small>
      </div>
    </div>

    <div class="md-actions">
      <button v-if="!done" class="md-btn md-btn--primary" @click="markDone">تم إنجازها اليوم</button>
      <button v-else class="md-btn md-btn--danger" @click="undoDone">تراجع، لم أنجزها</button>
      <button class="md-btn md-btn--soft" @click="copy">نسخ</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const challenges = [
  { title: 'استغفار بنية بداية جديدة', text: 'قل 100 مرة: أستغفر الله العظيم وأتوب إليه. ثم ادعُ الله أن يفتح لك باب توبة صادقة.', note: 'خمس دقائق قد تغير حال القلب.' },
  { title: 'ركعتان بلا استعجال', text: 'صل ركعتين بهدوء، واجعل أول دعائك حمدًا وشكرًا قبل الطلب.', note: 'خلوة قصيرة تترك أثرًا طويلًا.' },
  { title: 'آية تعيش معها', text: 'اقرأ صفحة من القرآن، واختر آية واحدة تردد معناها خلال يومك.', note: 'التدبر يصنع نورًا لا يراه الناس.' },
  { title: 'صدقة سر', text: 'تصدق ولو بشيء بسيط، أو انوِ صدقة عند أول فرصة. المهم أن تكون لله وحده.', note: 'السرائر تربي الإخلاص.' },
  { title: 'سلامة القلب', text: 'سامح شخصًا في قلبك اليوم، واترك الأمر لله. القلب الخفيف أقرب للطمأنينة.', note: 'العفو عبادة لا يراها إلا الله.' }
]

const todayIndex = Number(new Date().getDate()) % challenges.length
const index = ref(Number(localStorage.getItem('faith_spark_index') || todayIndex))
const item = computed(() => challenges[index.value])
const doneKey = computed(() => `faith_spark_done:${new Date().toISOString().slice(0, 10)}:${index.value}`)
const done = ref(localStorage.getItem(doneKey.value) === '1')

watch(doneKey, () => {
  done.value = localStorage.getItem(doneKey.value) === '1'
})

function next() {
  index.value = (index.value + 1) % challenges.length
  localStorage.setItem('faith_spark_index', String(index.value))
}

function markDone() {
  localStorage.setItem(doneKey.value, '1')
  done.value = true
}

function undoDone() {
  localStorage.removeItem(doneKey.value)
  done.value = false
}

async function copy() {
  try {
    await navigator.clipboard.writeText(`${item.value.title}\n${item.value.text}`)
  } catch (e) {}
}
</script>
