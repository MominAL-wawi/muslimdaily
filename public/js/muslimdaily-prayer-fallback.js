/*
  Muslim Daily prayer fallback for WEB.
  المصدر الأساسي API. عند فشل API وعدم وجود كاش صالح، يقرأ ملفًا ثابتًا داخل الموقع.
*/
(function(){
  var FALLBACK_URL = '/data/prayer-times-fallback.json?v=2026-05-10';

  function norm(v){
    if (!v) return '';
    var m = String(v).match(/(\d{1,2})[:.](\d{2})/);
    if (!m) return '';
    var h = ('0' + Math.max(0, Math.min(23, parseInt(m[1], 10)))).slice(-2);
    var mm = ('0' + Math.max(0, Math.min(59, parseInt(m[2], 10)))).slice(-2);
    return h + ':' + mm;
  }

  function valid(t){
    return t && norm(t.Fajr || t.fajr) && norm(t.Dhuhr || t.dhuhr) && norm(t.Asr || t.asr) && norm(t.Maghrib || t.maghrib) && norm(t.Isha || t.isha);
  }

  function normalizeTimes(t){
    return {
      Fajr: norm(t.Fajr || t.fajr),
      Dhuhr: norm(t.Dhuhr || t.dhuhr),
      Asr: norm(t.Asr || t.asr),
      Maghrib: norm(t.Maghrib || t.maghrib),
      Isha: norm(t.Isha || t.isha)
    };
  }

  function pack(times, source){
    times = normalizeTimes(times);
    return { ok:true, source:source || 'web_fallback', timings:times, prayers:times, prayer_times:times, updated_at:Date.now() };
  }

  function save(times, source){
    if (!valid(times)) return null;
    var data = pack(times, source);
    try {
      localStorage.setItem('muslimdaily_prayer_times', JSON.stringify(data));
      localStorage.setItem('muslimdaily_prayer_times_last', JSON.stringify(data.timings));
      localStorage.setItem('muslimdaily_last_good_prayer_times', JSON.stringify(data));
      window.__MUSLIM_DAILY_NATIVE_PRAYERS__ = data;
      window.dispatchEvent(new CustomEvent('muslimdaily-prayers-updated', { detail:data }));
    } catch(e){}
    return data;
  }

  function read(key){ try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch(e){ return null; } }

  function extract(obj){
    if (!obj) return null;
    var src = obj.timings || obj.prayers || obj.prayer_times || obj;
    if (src.timings) src = src.timings;
    return valid(src) ? normalizeTimes(src) : null;
  }

  function lastGood(){
    return extract(read('muslimdaily_last_good_prayer_times')) || extract(read('muslimdaily_prayer_times')) || extract(read('muslimdaily_prayer_times_last'));
  }

  async function fetchStaticFallback(){
    try {
      var res = await fetch(FALLBACK_URL, { cache:'no-store', headers:{'Accept':'application/json'} });
      if (!res.ok) return null;
      var json = await res.json();
      var t = extract(json);
      return t ? save(t, 'static_web_file') : null;
    } catch(e){ return null; }
  }

  async function fetchPrayerEndpoint(){
    var endpoints = ['/api/prayers?t=' + Date.now(), '/api/prayer-times?t=' + Date.now(), '/api/prayer_times?t=' + Date.now(), '/api/dashboard-public?t=' + Date.now(), '/api/dashboard?t=' + Date.now()];
    for (var i=0; i<endpoints.length; i++){
      try {
        var res = await fetch(endpoints[i], { method:'GET', cache:'no-store', credentials:'include', headers:{'Accept':'application/json','X-Requested-With':'XMLHttpRequest'} });
        if (!res.ok) continue;
        var json = await res.json();
        var t = extract(json);
        if (valid(t)) return save(t, 'website_api:' + endpoints[i]);
      } catch(e){}
    }
    return null;
  }

  function hideFailureMessages(){
    try {
      document.querySelectorAll('*').forEach(function(el){
        var txt = (el.textContent || '').trim();
        if (txt.indexOf('لم نستطع تحديث المواقيت') !== -1 || txt.indexOf('تعذر جلب أوقات الصلاة') !== -1 || txt.indexOf('حاول مرة أخرى') !== -1) {
          el.style.display = 'none';
        }
      });
    } catch(e){}
  }

  async function ensurePrayerTimes(){
    var api = await fetchPrayerEndpoint();
    if (api) { hideFailureMessages(); return api; }
    var last = lastGood();
    if (last) { save(last, 'last_good_web'); hideFailureMessages(); return pack(last, 'last_good_web'); }
    var fixed = await fetchStaticFallback();
    hideFailureMessages();
    return fixed;
  }

  window.MuslimDailyPrayerFallback = { ensure: ensurePrayerTimes, save: save, lastGood: lastGood };
  function run(){ setTimeout(ensurePrayerTimes, 200); setTimeout(ensurePrayerTimes, 1600); setTimeout(ensurePrayerTimes, 4200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('online', function(){ setTimeout(ensurePrayerTimes, 600); });
})();
