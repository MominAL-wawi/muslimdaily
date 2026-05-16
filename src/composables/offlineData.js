export const FALLBACK_HADITHS = [
  {
    id: 1,
    title: 'الحديث الأول: إنما الأعمال بالنيات',
    text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.',
    explanation: 'صلاح العمل يبدأ من القلب. اجعل نيتك لله في صلاتك ووردك ودراستك وعملك.'
  },
  {
    id: 2,
    title: 'الحديث الثاني: مراتب الدين',
    text: 'الإسلام أن تشهد أن لا إله إلا الله وأن محمدًا رسول الله، وتقيم الصلاة، وتؤتي الزكاة، وتصوم رمضان، وتحج البيت إن استطعت إليه سبيلًا.',
    explanation: 'هذا الحديث يذكرك أن الدين علم وعمل وحضور قلب.'
  },
  {
    id: 3,
    title: 'الحديث الثالث: بني الإسلام على خمس',
    text: 'بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وحج البيت، وصوم رمضان.',
    explanation: 'الثبات يبدأ بالمحافظة على الأركان، وأولها الصلاة.'
  },
  {
    id: 4,
    title: 'الحديث الرابع: مراحل الخلق',
    text: 'إن أحدكم يجمع خلقه في بطن أمه أربعين يومًا...',
    explanation: 'يعلمك الحديث الإيمان بالقدر وسؤال الله الثبات.'
  },
  {
    id: 5,
    title: 'الحديث الخامس: رد البدع',
    text: 'من أحدث في أمرنا هذا ما ليس منه فهو رد.',
    explanation: 'الدين عبادة باتباع، لا بمجرد العاطفة.'
  }
]

export const FALLBACK_QURAN_PLAN = {
  morning_page: 1,
  evening_page: 2,
  morning_done: 0,
  evening_done: 0,
  reading_start_page: 1,
  reading_end_page: 5,
  reading_done: 0,
  reading_pages_count: 5
}

export const FALLBACK_QURAN_SETTINGS = {
  quran_morning_pages: 1,
  quran_evening_pages: 1,
  quran_reading_pages: 5,
  next_new_page: 1,
  next_reading_page: 1
}

export function saveOfflineSnapshot(key, value) {
  try {
    localStorage.setItem(`muslimdaily_snapshot:${key}`, JSON.stringify({
      saved_at: new Date().toISOString(),
      value
    }))
  } catch (e) {}
}

export function readOfflineSnapshot(key, fallback = null) {
  try {
    const raw = localStorage.getItem(`muslimdaily_snapshot:${key}`)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed?.value || fallback
  } catch (e) {
    return fallback
  }
}
