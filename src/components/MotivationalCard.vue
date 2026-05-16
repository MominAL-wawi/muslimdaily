<template>
  <section class="md-card md-message">
    <div class="md-section-row">
      <div>
        <span class="md-chip">رسالة اليوم</span>
        <h2>دفعة إيمانية</h2>
      </div>
      <button class="md-btn md-btn--soft" @click="nextMessage">رسالة أخرى</button>
    </div>

    <p>{{ current.text }}</p>
    <small>{{ current.note }}</small>

    <div class="md-actions">
      <button class="md-btn md-btn--primary" @click="copyMessage">نسخ الرسالة</button>
      <RouterLink class="md-btn md-btn--soft" to="/adhkar">اذكر الله الآن</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const messages = [
  { text: 'مهما كثرت ذنوبك، باب التوبة أوسع. ارجع إلى الله الآن ولا تؤجل.', note: 'استغفر الله العظيم وأتوب إليه.' },
  { text: 'القرآن لا يطلب وقت فراغك، بل يصنع البركة في وقتك.', note: 'اقرأ ولو صفحة واحدة.' },
  { text: 'كل استغفار يمحو، وكل تسبيحة ترفع، وكل صلاة على النبي نور.', note: 'صلّ على النبي ﷺ.' },
  { text: 'لا تنتظر أن تكون كاملًا حتى تقترب من الله؛ اقترب منه ليصلحك.', note: 'اللهم أصلح قلبي وعملي.' },
  { text: 'من حافظ على ورده حفظ الله قلبه من التيه.', note: 'وردك اليومي أمان لقلبك.' }
]

const index = ref(Number(localStorage.getItem('daily_message_index') || new Date().getDate()) % messages.length)
const current = computed(() => messages[index.value])

function nextMessage() {
  index.value = (index.value + 1) % messages.length
  localStorage.setItem('daily_message_index', String(index.value))
}

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(`${current.value.text}\n${current.value.note}`)
  } catch (e) {}
}
</script>
