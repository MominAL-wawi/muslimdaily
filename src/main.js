import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import '@/assets/stunning-final-ui.css'
import '@/assets/full-db-display-fix.css'
import '@/assets/luxury-ornament-theme.css'
createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
