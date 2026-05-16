(function () {
  'use strict';

  var VERSION = 'simple-gps-gaza-v168';
  var GAZA_CENTER = { lat: 31.5017, lng: 34.4668 };
  var GAZA_TABLE = {
    '2026-04-19': { Fajr: '04:35', Sunrise: '06:09', Dhuhr: '12:41', Asr: '16:19', Maghrib: '19:16', Isha: '20:37' },
    '2026-04-20': { Fajr: '04:34', Sunrise: '06:08', Dhuhr: '12:41', Asr: '16:19', Maghrib: '19:17', Isha: '20:38' },
    '2026-04-21': { Fajr: '04:33', Sunrise: '06:07', Dhuhr: '12:41', Asr: '16:19', Maghrib: '19:18', Isha: '20:39' },
    '2026-04-22': { Fajr: '04:31', Sunrise: '06:06', Dhuhr: '12:41', Asr: '16:19', Maghrib: '19:18', Isha: '20:40' },
    '2026-04-23': { Fajr: '04:30', Sunrise: '06:05', Dhuhr: '12:41', Asr: '16:19', Maghrib: '19:19', Isha: '20:41' },
    '2026-04-24': { Fajr: '04:29', Sunrise: '06:04', Dhuhr: '12:40', Asr: '16:18', Maghrib: '19:20', Isha: '20:41' },
    '2026-04-25': { Fajr: '04:28', Sunrise: '06:03', Dhuhr: '12:40', Asr: '16:18', Maghrib: '19:21', Isha: '20:42' },
    '2026-04-26': { Fajr: '04:26', Sunrise: '06:02', Dhuhr: '12:40', Asr: '16:18', Maghrib: '19:21', Isha: '20:43' },
    '2026-04-27': { Fajr: '04:25', Sunrise: '06:01', Dhuhr: '12:40', Asr: '16:18', Maghrib: '19:22', Isha: '20:45' },
    '2026-04-28': { Fajr: '04:24', Sunrise: '06:00', Dhuhr: '12:40', Asr: '16:18', Maghrib: '19:23', Isha: '20:45' },
    '2026-04-29': { Fajr: '04:23', Sunrise: '05:59', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:24', Isha: '20:46' },
    '2026-04-30': { Fajr: '04:21', Sunrise: '05:58', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:24', Isha: '20:47' },
    '2026-05-01': { Fajr: '04:20', Sunrise: '05:57', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:25', Isha: '20:48' },
    '2026-05-02': { Fajr: '04:19', Sunrise: '05:56', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:26', Isha: '20:49' },
    '2026-05-03': { Fajr: '04:18', Sunrise: '05:55', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:26', Isha: '20:50' },
    '2026-05-04': { Fajr: '04:17', Sunrise: '05:55', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:27', Isha: '20:51' },
    '2026-05-05': { Fajr: '04:15', Sunrise: '05:54', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:28', Isha: '20:52' },
    '2026-05-06': { Fajr: '04:14', Sunrise: '05:53', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:28', Isha: '20:53' },
    '2026-05-07': { Fajr: '04:13', Sunrise: '05:52', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:29', Isha: '20:54' },
    '2026-05-08': { Fajr: '04:12', Sunrise: '05:51', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:30', Isha: '20:55' },
    '2026-05-09': { Fajr: '04:11', Sunrise: '05:51', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:30', Isha: '20:55' },
    '2026-05-10': { Fajr: '04:10', Sunrise: '05:50', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:31', Isha: '20:56' },
    '2026-05-11': { Fajr: '04:09', Sunrise: '05:49', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:32', Isha: '20:57' },
    '2026-05-12': { Fajr: '04:08', Sunrise: '05:48', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:32', Isha: '20:59' },
    '2026-05-13': { Fajr: '04:06', Sunrise: '05:47', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:33', Isha: '20:59' },
    '2026-05-14': { Fajr: '04:05', Sunrise: '05:47', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:34', Isha: '21:00' },
    '2026-05-15': { Fajr: '04:04', Sunrise: '05:46', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:34', Isha: '21:01' },
    '2026-05-16': { Fajr: '04:03', Sunrise: '05:45', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:35', Isha: '21:02' },
    '2026-05-17': { Fajr: '04:02', Sunrise: '05:45', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:36', Isha: '21:03' },
    '2026-05-18': { Fajr: '04:01', Sunrise: '05:44', Dhuhr: '12:39', Asr: '16:18', Maghrib: '19:36', Isha: '21:04' }
  };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function norm(v) {
    var m = String(v || '').match(/(\d{1,2})[:.](\d{2})/);
    if (!m) return '';
    return String(Math.min(23, Math.max(0, Number(m[1])))).padStart(2, '0') + ':' + m[2];
  }
  function fmt(v) {
    var t = norm(v); if (!t) return '';
    var p = t.split(':'), h = Number(p[0]), m = p[1], s = h < 12 ? 'ص' : 'م';
    return (h % 12 || 12) + ':' + m + ' ' + s;
  }
  function hasTimes(times) { return times && times.Fajr && times.Dhuhr && times.Asr && times.Maghrib && times.Isha; }
  function extract(data) {
    var src = data && (data.timings || data.prayers || data.prayer_times || data.data && data.data.timings || data);
    if (!src) return null;
    var out = { Fajr: norm(src.Fajr || src.fajr), Dhuhr: norm(src.Dhuhr || src.dhuhr), Asr: norm(src.Asr || src.asr), Maghrib: norm(src.Maghrib || src.maghrib), Isha: norm(src.Isha || src.isha) };
    return hasTimes(out) ? out : null;
  }
  function isGaza(lat, lng) {
    lat = Number(lat); lng = Number(lng);
    return lat >= 31.15 && lat <= 31.62 && lng >= 34.15 && lng <= 34.65;
  }
  function getNativeLocation() {
    try {
      if (window.MuslimDailyAndroid && typeof window.MuslimDailyAndroid.getNativeLocationData === 'function') {
        var raw = window.MuslimDailyAndroid.getNativeLocationData();
        return raw ? JSON.parse(raw) : null;
      }
    } catch (e) {}
    return null;
  }
  function getPosition() {
    return new Promise(function (resolve, reject) {
      var nativeLoc = getNativeLocation();
      if (nativeLoc && nativeLoc.lat && nativeLoc.lng) { resolve({ lat: nativeLoc.lat, lng: nativeLoc.lng }); return; }
      if (!navigator.geolocation) { reject(new Error('no geolocation')); return; }
      navigator.geolocation.getCurrentPosition(function (pos) {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
  }
  async function fetchTimes(lat, lng) {
    var date = todayKey();
    if (isGaza(lat, lng) && GAZA_TABLE[date]) {
      return { city: 'غزة', country: 'فلسطين', timings: GAZA_TABLE[date], source: 'gaza_official_local_table', date: date };
    }
    var res = await fetch('/api/official-prayer-times.php?lat=' + encodeURIComponent(lat) + '&lng=' + encodeURIComponent(lng) + '&date=' + encodeURIComponent(date) + '&v=' + VERSION, { cache: 'no-store' });
    if (!res.ok) throw new Error('api failed');
    return await res.json();
  }
  function render(times, meta) {
    if (!hasTimes(times)) return;
    var card = document.querySelector('.luxury-prayer-card');
    if (!card) return;
    var old = card.querySelector('.luxury-prayer-grid');
    if (old) old.remove();
    var grid = document.createElement('div');
    grid.className = 'luxury-prayer-grid';
    var items = [['الفجر', 'Fajr'], ['الظهر', 'Dhuhr'], ['العصر', 'Asr'], ['المغرب', 'Maghrib'], ['العشاء', 'Isha']];
    items.forEach(function (it) {
      var div = document.createElement('div');
      div.className = 'luxury-prayer-item';
      div.innerHTML = '<span>' + it[0] + '</span><strong>' + fmt(times[it[1]]) + '</strong>';
      grid.appendChild(div);
    });
    card.appendChild(grid);
    try {
      if (window.MuslimDailyAndroid && typeof window.MuslimDailyAndroid.savePrayerTimes === 'function') {
        window.MuslimDailyAndroid.savePrayerTimes(JSON.stringify({ date: todayKey(), city: meta && meta.city || '', country: meta && meta.country || '', timings: times, prayers: times, prayer_times: times, source: meta && meta.source || VERSION }));
      }
    } catch (e) {}
  }
  async function load() {
    try {
      Object.keys(localStorage).forEach(function (k) { if (/muslimdaily_(prayer|api|ip|selected_location)/.test(k)) localStorage.removeItem(k); });
    } catch (e) {}
    try {
      var loc = await getPosition();
      var data = await fetchTimes(loc.lat, loc.lng);
      var times = extract(data);
      if (times) { render(times, data); return; }
    } catch (e) {}
    var gaza = GAZA_TABLE[todayKey()];
    if (gaza) render(gaza, { city: 'غزة', country: 'فلسطين', source: 'gaza_default_when_location_unavailable' });
  }
  function boot() {
    setTimeout(load, 600);
    setTimeout(load, 1800);
    var updateBtn = Array.prototype.find.call(document.querySelectorAll('button'), function (b) { return /تحديث/.test(b.textContent || ''); });
    if (updateBtn) updateBtn.addEventListener('click', function () { setTimeout(load, 200); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
