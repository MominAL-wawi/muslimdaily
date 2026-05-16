<template>
  <section class="today-hero card">
    <div class="crescent-aura"></div>
    <div class="today-hero-text">
      <span class="badge">نور اليوم</span>
      <h2>{{ dayName }}</h2>
      <p>{{ dateLabel }}</p>
    </div>

    <div class="today-seal">
      <span>{{ dayNumber }}</span>
      <small>{{ monthName }}</small>
    </div>
  </section>
</template>

<script setup>
const now = new Date()

const dayName = new Intl.DateTimeFormat('ar', { weekday: 'long' }).format(now)
const dateLabel = new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'long', day: 'numeric' }).format(now)
const dayNumber = new Intl.DateTimeFormat('ar', { day: 'numeric' }).format(now)
const monthName = new Intl.DateTimeFormat('ar', { month: 'short' }).format(now)
</script>
