<template>
  <section class="card" style="max-width:880px;margin:auto">
    <h2 class="card-title">تسجيل جديد</h2>
    <p class="muted">اكتب رقم واتساب بصيغة دولية مثل: 970597908665</p>

    <form @submit.prevent="submit">
      <div class="form-grid">
        <div class="field">
          <label>الاسم</label>
          <input v-model="form.name" class="input" required>
        </div>
        <div class="field">
          <label>رقم واتساب</label>
          <input v-model="form.phone" class="input" required placeholder="97059xxxxxxx">
        </div>
        <div class="field">
          <label>الدولة</label>
          <select v-model="form.country_index" class="input" @change="pickDefaultCity">
            <option v-for="(c,i) in countries" :key="c.country" :value="i">{{ c.ar }}</option>
          </select>
        </div>
        <div class="field">
          <label>المدينة</label>
          <select v-model="form.city" class="input">
            <option v-for="city in selectedCountry.cities" :key="city.name" :value="city.name">{{ city.ar }}</option>
          </select>
        </div>
        <div class="field">
          <label>تذكير الصلاة قبل كم دقيقة</label>
          <input v-model.number="form.prayer_notify_before" type="number" min="0" class="input">
        </div>
        <div class="field">
          <label>ورد الذكر كل كم دقيقة</label>
          <input v-model.number="form.dhikr_interval" type="number" min="0" class="input">
        </div>
      </div>

      <label style="display:flex;gap:10px;align-items:center;margin:16px 0">
        <input v-model="form.consent" type="checkbox" required>
        أوافق على استقبال التذكيرات عبر واتساب.
      </label>

      <button class="btn primary block">تسجيل ودخول</button>
      <p v-if="error" class="alert" style="margin-top:14px">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/composables/api'
import { register } from '@/store'

const router = useRouter()
const error = ref('')
const countries = ref([])
const form = reactive({
  name: '',
  phone: '',
  country_index: 0,
  city: '',
  prayer_notify_before: 10,
  dhikr_interval: 60,
  consent: false
})

const selectedCountry = computed(() => countries.value[form.country_index] || { cities: [] })

function pickDefaultCity() {
  form.city = selectedCountry.value.cities?.[0]?.name || ''
}

onMounted(async () => {
  const data = await api('/countries')
  countries.value = data.countries
  pickDefaultCity()
})

async function submit() {
  error.value = ''
  try {
    await register(form)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}
</script>
