import { reactive } from 'vue'

function randomId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID()
  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getDeviceUser() {
  let id = localStorage.getItem('muslimdaily_device_id')
  if (!id) {
    id = randomId()
    localStorage.setItem('muslimdaily_device_id', id)
  }

  const saved = localStorage.getItem('muslimdaily_device_user')
  if (saved) {
    try {
      return { ...JSON.parse(saved), phone: '' }
    } catch (e) {}
  }

  const user = {
    id,
    device_id: id,
    name: 'زائر مسلم',
    phone: '',
    country: '',
    city: '',
    lat: null,
    lng: null,
    method: 3,
    morning_adhkar_time: '07:00',
    evening_adhkar_time: '18:00',
    quran_reminder_time: '20:30'
  }

  localStorage.setItem('muslimdaily_device_user', JSON.stringify(user))
  return user
}

export const store = reactive({
  user: getDeviceUser(),
  loading: false,
  token: localStorage.getItem('muslimdaily_token') || ''
})

export async function loadMe() {
  store.user = getDeviceUser()
  return store.user
}

export async function login() {
  store.user = getDeviceUser()
  return { ok: true, user: store.user }
}

export async function register(payload = {}) {
  const user = { ...getDeviceUser(), ...payload, phone: '' }
  localStorage.setItem('muslimdaily_device_user', JSON.stringify(user))
  store.user = user
  return { ok: true, user }
}

export function logout() {
  store.user = getDeviceUser()
}
