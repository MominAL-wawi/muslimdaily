<template>
  <div class="md-app luxury-app">
    <div class="luxury-bg-orb luxury-bg-orb--one"></div>
    <div class="luxury-bg-orb luxury-bg-orb--two"></div>

    <header class="md-header luxury-header">
      <div class="md-container md-header__inner">
        <RouterLink class="md-brand luxury-brand" to="/dashboard">
          <span class="luxury-logo-wrap">
            <img src="@/assets/logo-premium.svg" alt="Muslim Daily">
          </span>
          <span class="luxury-brand-text">
            <strong>Muslim Daily</strong>
            <small>رفيق يومك للقرآن والذكر</small>
          </span>
        </RouterLink>

        <nav class="md-nav md-nav--desktop luxury-nav">
          <RouterLink to="/dashboard">صفحتي</RouterLink>
          <RouterLink to="/quran">القرآن</RouterLink>
          <RouterLink to="/adhkar">الأذكار</RouterLink>
          <RouterLink to="/hadith">الأحاديث</RouterLink>
        </nav>

        <button class="md-menu-btn luxury-menu-btn" type="button" @click="menuOpen = true" aria-label="القائمة">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <transition name="md-fade">
      <div v-if="menuOpen" class="md-menu-backdrop" @click="menuOpen = false"></div>
    </transition>

    <transition name="md-pop">
      <nav v-if="menuOpen" class="md-mobile-menu luxury-mobile-menu">
        <div class="md-mobile-menu__head">
          <strong>Muslim Daily</strong>
          <button type="button" @click="menuOpen = false">×</button>
        </div>

        <RouterLink to="/dashboard" @click="menuOpen = false">صفحتي</RouterLink>
        <RouterLink to="/quran" @click="menuOpen = false">القرآن</RouterLink>
        <RouterLink to="/adhkar" @click="menuOpen = false">الأذكار</RouterLink>
        <RouterLink to="/hadith" @click="menuOpen = false">الأحاديث</RouterLink>
      </nav>
    </transition>

    <main class="md-container md-main luxury-main">
      <RouterView />
    </main>

    <footer class="md-footer luxury-footer">Muslim Daily — يومك أقرب وأهدأ</footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { loadMe } from '@/store'

const menuOpen = ref(false)

onMounted(loadMe)
</script>
