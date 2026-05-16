<template>
  <section class="card">
    <h2 class="card-title">لوحة إدارة مؤمن الواوي</h2>
    <p class="muted">إدارة المستخدمين والتأكد من حالة التسجيل.</p>
    <table class="table">
      <thead><tr><th>الاسم</th><th>الرقم</th><th>المدينة</th><th>الحالة</th></tr></thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.name }}</td><td>{{ u.phone }}</td><td>{{ u.country_ar }} - {{ u.city_ar }}</td>
          <td><span class="badge">{{ Number(u.enabled) ? 'مفعل' : 'موقوف' }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/composables/api'
const users = ref([])
onMounted(async()=>{ users.value = (await api('/admin/users')).users })
</script>
