<template>
  <section class="card" style="max-width:520px;margin:auto">
    <h2 class="card-title">دخول الإدارة</h2>
    <form @submit.prevent="submit">
      <div class="field"><label>كلمة المرور</label><input v-model="password" type="password" class="input" required></div>
      <button class="btn primary block" style="margin-top:14px">دخول</button>
      <p v-if="error" class="alert" style="margin-top:14px">{{ error }}</p>
    </form>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, setToken } from '@/composables/api'
const router = useRouter()
const password = ref('')
const error = ref('')
async function submit(){
  try{
    const data = await api('/admin/login',{method:'POST',body:JSON.stringify({password:password.value})})
    setToken(data.token)
    router.push('/admin')
  }catch(e){ error.value=e.message }
}
</script>
