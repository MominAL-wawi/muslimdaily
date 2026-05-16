function randomId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID()
  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getDeviceId() {
  let id = localStorage.getItem('muslimdaily_device_id')
  if (!id) {
    id = randomId()
    localStorage.setItem('muslimdaily_device_id', id)
  }
  return id
}

export function getDeviceUser() {
  const id = getDeviceId()
  const saved = localStorage.getItem('muslimdaily_device_user')

  if (saved) {
    try { return JSON.parse(saved) } catch(e) {}
  }

  const user = {
    id,
    name: 'زائر مسلم',
    device_id: id,
    phone: '',
    country: '',
    city: '',
    lat: null,
    lng: null,
    morning_adhkar_time: '07:00',
    evening_adhkar_time: '18:00',
    quran_reminder_time: '20:30'
  }

  localStorage.setItem('muslimdaily_device_user', JSON.stringify(user))
  return user
}

export function saveDeviceUser(user) {
  const current = getDeviceUser()
  const merged = { ...current, ...user, phone: '' }
  localStorage.setItem('muslimdaily_device_user', JSON.stringify(merged))
  return merged
}
