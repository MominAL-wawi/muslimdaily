<template>
  <section class="md-today">
    <div>
      <span class="md-dot"></span>
      <strong>{{ dayName }}</strong>
      <span>{{ dateLabel }}</span>
    </div>
    <small>وردك يبدأ من هنا</small>
  </section>
</template>

<script setup>
const now = new Date()
const dayName = new Intl.DateTimeFormat('ar', { weekday: 'long' }).format(now)
const dateLabel = new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'long', day: 'numeric' }).format(now)
</script>
