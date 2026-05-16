<template>
  <section class="card" style="max-width:560px;margin:auto">
    <h2 class="card-title">دخول المستخدم</h2>
    <p class="muted">اكتب رقم واتساب الذي سجلت به.</p>
    <form @submit.prevent="submit">
      <div class="field">
        <label>رقم واتساب</label>
        <input v-model="phone" class="input" required placeholder="970597908665">
      </div>
      <button class="btn primary block" style="margin-top:14px">دخول</button>
      <p v-if="error" class="alert" style="margin-top:14px">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/store'

const router = useRouter()
const phone = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await login(phone.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}
</script>
