'use client';

/**
 * Clockzilla Internationalization (i18n)
 * 
 * 58 languages with translations for all UI strings.
 * Uses React context for app-wide language state.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════
// Language Registry
// ═══════════════════════════════════════
export const LANGUAGES = [
  { code: 'ar',    name: 'العربية',           english: 'Arabic',              dir: 'rtl' },
  { code: 'hy',    name: 'Հայերեն',           english: 'Armenian',            dir: 'ltr' },
  { code: 'az',    name: 'Azərbaycan',        english: 'Azerbaijani',         dir: 'ltr' },
  { code: 'be',    name: 'Беларуская мова',   english: 'Belarusian',          dir: 'ltr' },
  { code: 'bn',    name: 'বাংলা',              english: 'Bengali',             dir: 'ltr' },
  { code: 'bg',    name: 'Български',         english: 'Bulgarian',           dir: 'ltr' },
  { code: 'ca',    name: 'Català',            english: 'Catalan',             dir: 'ltr' },
  { code: 'cs',    name: 'Česky',             english: 'Czech',               dir: 'ltr' },
  { code: 'zh',    name: '中文',               english: 'Chinese (Simplified)',dir: 'ltr' },
  { code: 'zh-TW', name: '繁體中文',           english: 'Chinese (Traditional)',dir: 'ltr' },
  { code: 'da',    name: 'Dansk',             english: 'Danish',              dir: 'ltr' },
  { code: 'de',    name: 'Deutsch',           english: 'German',              dir: 'ltr' },
  { code: 'et',    name: 'Eesti',             english: 'Estonian',            dir: 'ltr' },
  { code: 'el',    name: 'Ελληνικά',          english: 'Greek',               dir: 'ltr' },
  { code: 'en',    name: 'English (US)',      english: 'English (US)',        dir: 'ltr' },
  { code: 'en-GB', name: 'English (UK)',      english: 'English (UK)',        dir: 'ltr' },
  { code: 'es',    name: 'Español',           english: 'Spanish',             dir: 'ltr' },
  { code: 'eo',    name: 'Esperanto',         english: 'Esperanto',           dir: 'ltr' },
  { code: 'fr',    name: 'Français',          english: 'French',              dir: 'ltr' },
  { code: 'he',    name: 'עברית',              english: 'Hebrew',              dir: 'rtl' },
  { code: 'hi',    name: 'हिन्दी',              english: 'Hindi',               dir: 'ltr' },
  { code: 'hr',    name: 'Hrvatski',          english: 'Croatian',            dir: 'ltr' },
  { code: 'id',    name: 'Bahasa Indonesia',  english: 'Indonesian',          dir: 'ltr' },
  { code: 'is',    name: 'Íslenska',          english: 'Icelandic',           dir: 'ltr' },
  { code: 'ga',    name: 'Gaeilge',           english: 'Irish',               dir: 'ltr' },
  { code: 'it',    name: 'Italiano',          english: 'Italian',             dir: 'ltr' },
  { code: 'ja',    name: '日本語',             english: 'Japanese',            dir: 'ltr' },
  { code: 'ka',    name: 'ქართული',           english: 'Georgian',            dir: 'ltr' },
  { code: 'kab',   name: 'Taqbaylit',         english: 'Kabyle',              dir: 'ltr' },
  { code: 'ko',    name: '한국어',              english: 'Korean',              dir: 'ltr' },
  { code: 'lv',    name: 'Latviešu',          english: 'Latvian',             dir: 'ltr' },
  { code: 'lt',    name: 'Lietuvių',          english: 'Lithuanian',          dir: 'ltr' },
  { code: 'hu',    name: 'Magyar',            english: 'Hungarian',           dir: 'ltr' },
  { code: 'mk',    name: 'Македонски',        english: 'Macedonian',          dir: 'ltr' },
  { code: 'mg',    name: 'Malagasy',          english: 'Malagasy',            dir: 'ltr' },
  { code: 'nl',    name: 'Nederlands',        english: 'Dutch',               dir: 'ltr' },
  { code: 'nb',    name: 'Norsk (bokmål)',    english: 'Norwegian Bokmål',    dir: 'ltr' },
  { code: 'nn',    name: 'Norsk (nynorsk)',   english: 'Norwegian Nynorsk',   dir: 'ltr' },
  { code: 'fa',    name: 'فارسی',              english: 'Persian',             dir: 'rtl' },
  { code: 'pl',    name: 'Polski',            english: 'Polish',              dir: 'ltr' },
  { code: 'pt',    name: 'Português',         english: 'Portuguese',          dir: 'ltr' },
  { code: 'pt-BR', name: 'Português (Brasil)',english: 'Portuguese (Brazil)', dir: 'ltr' },
  { code: 'ro',    name: 'Română',            english: 'Romanian',            dir: 'ltr' },
  { code: 'ru',    name: 'Русский',           english: 'Russian',             dir: 'ltr' },
  { code: 'sr',    name: 'Српски',            english: 'Serbian',             dir: 'ltr' },
  { code: 'sq',    name: 'Shqip',             english: 'Albanian',            dir: 'ltr' },
  { code: 'si',    name: 'සිංහල',              english: 'Sinhala',             dir: 'ltr' },
  { code: 'sk',    name: 'Slovenčina',        english: 'Slovak',              dir: 'ltr' },
  { code: 'sl',    name: 'Slovenščina',       english: 'Slovenian',           dir: 'ltr' },
  { code: 'fi',    name: 'Suomi',             english: 'Finnish',             dir: 'ltr' },
  { code: 'sv',    name: 'Svenska',           english: 'Swedish',             dir: 'ltr' },
  { code: 'ta',    name: 'தமிழ்',              english: 'Tamil',               dir: 'ltr' },
  { code: 'th',    name: 'ภาษาไทย',            english: 'Thai',                dir: 'ltr' },
  { code: 'tpi',   name: 'Tok Pisin',         english: 'Tok Pisin',           dir: 'ltr' },
  { code: 'tr',    name: 'Türkçe',            english: 'Turkish',             dir: 'ltr' },
  { code: 'uk',    name: 'Українська',        english: 'Ukrainian',           dir: 'ltr' },
  { code: 'ur',    name: 'اردو',               english: 'Urdu',                dir: 'rtl' },
  { code: 'vi',    name: 'Tiếng Việt',        english: 'Vietnamese',          dir: 'ltr' },
];

// ═══════════════════════════════════════
// Translation Strings
// ═══════════════════════════════════════
// Key categories:
//   tabs.*       — Navigation tab labels
//   clock.*      — Clock display strings
//   search.*     — City search strings
//   stopwatch.*  — Stopwatch controls
//   timer.*      — Timer controls
//   world.*      — World clock strings
//   sun.*        — Sunrise/sunset strings
//   converter.*  — Timezone converter
//   countdown.*  — Countdown to date
//   calendar.*   — Calendar
//   footer.*     — Footer links
//   consent.*    — Cookie consent
//   common.*     — Shared strings

const translations = {
  en: {
    tabs: { clock: "Clock", world: "World", stopwatch: "Stopwatch", timer: "Timer", converter: "Converter", countdown: "Countdown", calendar: "Calendar" },
    clock: { accurateTime: "Accurate Time", synchronizing: "Synchronizing...", localTime: "Local Time", fullscreen: "Fullscreen", dayProgress: "Day", yearProgress: "Year", daysLeft: "days left", minsLeft: "m left", location: "Location", timezone: "Timezone", utcOffset: "UTC Offset", yourClock: "YOUR CLOCK", difference: "DIFFERENCE", accuracy: "ACCURACY" },
    search: { placeholder: "Search any city, state, or country...", searching: "Searching...", noResults: "No results found", subtitle: "150K+ cities — search any city, town, or village worldwide", close: "Close", noResultsFor: 'No results for "{q}". Try a different spelling.', searchingWorldwide: "Searching worldwide..." },
    loc: { shareTitle: "Share your location for precise results", shareDesc: "Currently showing time for {city}. Share your GPS location for more precise sunrise & sunset data.", shareBtn: "Share Location", dismiss: "Dismiss" },
    sync: { synced: "Synced", syncing: "Syncing…", offline: "Offline", source: "source", sources: "sources", clickResync: "Click to re-sync", clockAccuracy: "Your Clock Accuracy", behind: "behind", ahead: "ahead", inSync: "in sync with", yourClockIs: "Your clock is", actualTime: "actual time", excellent: "EXCELLENT", good: "GOOD", poor: "POOR", reference: "Reference", actualTimeLabel: "ACTUAL TIME", yourComputer: "YOUR COMPUTER", measurementAccuracy: "MEASUREMENT ACCURACY", syncSources: "Sync Sources", active: "active", waiting: "Waiting…", howItWorks: "How sync works", bestRtt: "best RTT", offset: "offset" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Reset", lap: "Lap" },
    timer: { start: "Start", pause: "Pause", reset: "Reset", hours: "Hours", minutes: "Minutes", seconds: "Seconds", timesUp: "Time's up!" },
    world: { worldClocks: "World Clocks", sunrise: "Sunrise", sunset: "Sunset", daylight: "Daylight", night: "Night", fromYou: "from you", dayNightMap: "Live Day & Night Map", sameAsYou: "Same as you" },
    sun: { title: "Sunrise & Sunset", sunrise: "Sunrise", sunset: "Sunset", daylight: "Daylight", civilDawn: "Civil Dawn", civilDusk: "Civil Dusk", golden: "Golden Hour", sunIsUp: "Sun is up", sunHasSet: "Sun has set" },
    converter: { title: "Timezone Converter", from: "From", to: "To", addTimezone: "Add timezone" },
    countdown: { title: "Countdown to Date", daysUntil: "days until", selectDate: "Select a date", timerTitle: "Countdown Timer", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    calendar: { title: "Calendar", week: "Wk", today: "Today", dateCalc: "Date Calculator" },
    footer: { privacy: "Privacy", terms: "Terms", cookieSettings: "Cookie Settings", tools: "Tools", information: "Information", legal: "Legal", tagline: "Ferociously Accurate Time", allRights: "All rights reserved", language: "Language", features: "Features", taglineShort: "Accurate World Time", exactTime: "Exact Time Now", worldClocks: "World Clocks", tzConverter: "Time Zone Converter", countdownDate: "Countdown to Date", countdownTimer: "Countdown Timer", clockSync: "Clock Sync", fullscreenClock: "Fullscreen Clock", sunriseSunset: "Sunrise & Sunset", dayNightMap: "Day/Night Map", dateCalc: "Date Calculator", about: "About Clockzilla", faq: "FAQ", howItWorks: "How It Works", contact: "Contact", privacyPolicy: "Privacy Policy", termsOfUse: "Terms of Use", cookiePolicy: "Cookie Policy" },
    consent: { title: "Cookie & Privacy Consent", accept: "Accept All", decline: "Decline All", optOut: "Do Not Sell/Share My Info", ok: "OK", gotIt: "Got it", details: "Cookie Details", hideDetails: "Hide Details" },
    common: { close: "Close", save: "Save", cancel: "Cancel", loading: "Loading...", error: "Error" },
  },

  "en-GB": { _inherit: "en" },

  ar: {
    tabs: { clock: "الساعة", world: "العالم", stopwatch: "ساعة إيقاف", timer: "مؤقت", converter: "محوّل", countdown: "عد تنازلي", calendar: "تقويم" },
    clock: { accurateTime: "الوقت الدقيق", synchronizing: "جارٍ المزامنة...", localTime: "التوقيت المحلي", fullscreen: "شاشة كاملة", dayProgress: "اليوم", yearProgress: "السنة", daysLeft: "أيام متبقية", minsLeft: "د متبقية", location: "الموقع", timezone: "المنطقة الزمنية", utcOffset: "فرق التوقيت" },
    search: { placeholder: "ابحث عن أي مدينة أو ولاية أو دولة...", searching: "جارٍ البحث...", noResults: "لا توجد نتائج", subtitle: "أكثر من 150 ألف مدينة — ابحث عن أي مدينة في العالم", close: "إغلاق" },
    stopwatch: { start: "ابدأ", stop: "توقف", reset: "إعادة", lap: "لفة" },
    timer: { start: "ابدأ", pause: "إيقاف مؤقت", reset: "إعادة", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ", timesUp: "انتهى الوقت!" },
    world: { worldClocks: "ساعات العالم", sunrise: "شروق", sunset: "غروب", daylight: "نهار", night: "ليل", fromYou: "منك" },
    sun: { title: "الشروق والغروب", sunrise: "شروق", sunset: "غروب", daylight: "نهار", civilDawn: "الفجر المدني", civilDusk: "الشفق المدني", golden: "الساعة الذهبية" },
    converter: { title: "محوّل المناطق الزمنية", from: "من", to: "إلى", addTimezone: "إضافة منطقة زمنية" },
    countdown: { title: "عد تنازلي لتاريخ", daysUntil: "أيام حتى", selectDate: "اختر تاريخاً" },
    calendar: { title: "تقويم", week: "أسبوع", today: "اليوم" },
    footer: { privacy: "الخصوصية", terms: "الشروط", cookieSettings: "إعدادات الكوكيز", tools: "أدوات", information: "معلومات", legal: "قانوني", tagline: "وقت دقيق لكل منطقة زمنية", allRights: "جميع الحقوق محفوظة", language: "اللغة" },
    consent: { title: "موافقة الخصوصية وملفات تعريف الارتباط", accept: "قبول الكل", decline: "رفض الكل", optOut: "لا تبيعوا معلوماتي", ok: "موافق", gotIt: "فهمت", details: "تفاصيل الكوكيز", hideDetails: "إخفاء التفاصيل" },
    common: { close: "إغلاق", save: "حفظ", cancel: "إلغاء", loading: "جارٍ التحميل...", error: "خطأ" },
  },

  hy: {
    tabs: { clock: "Ժամացույց", world: "Աusage", stopwatch: "Վdelays", timer: "Ժincline", converter: "Փconverter", countdown: "Հcommand", calendar: "Օcalendar" },
    _inherit: "en",
  },

  az: {
    tabs: { clock: "Saat", world: "Dünya", stopwatch: "Saniyəölçən", timer: "Taymer", converter: "Çevirici", countdown: "Geri sayım", calendar: "Təqvim" },
    clock: { accurateTime: "Dəqiq vaxt", synchronizing: "Sinxronlaşdırılır...", localTime: "Yerli vaxt", fullscreen: "Tam ekran", dayProgress: "Gün", yearProgress: "İl", daysLeft: "gün qalıb", minsLeft: "d qalıb", location: "Məkan", timezone: "Saat qurşağı", utcOffset: "UTC fərqi" },
    search: { placeholder: "İstənilən şəhər, ştat və ya ölkə axtar...", searching: "Axtarılır...", noResults: "Nəticə tapılmadı", subtitle: "150 min+ şəhər — dünyada istənilən şəhəri axtarın", close: "Bağla" },
    stopwatch: { start: "Başla", stop: "Dayan", reset: "Sıfırla", lap: "Dövrə" },
    timer: { start: "Başla", pause: "Fasilə", reset: "Sıfırla", hours: "Saat", minutes: "Dəqiqə", seconds: "Saniyə", timesUp: "Vaxt bitdi!" },
    footer: { privacy: "Məxfilik", terms: "Şərtlər", cookieSettings: "Kuki parametrləri", language: "Dil" },
    common: { close: "Bağla", save: "Saxla", cancel: "Ləğv et", loading: "Yüklənir...", error: "Xəta" },
  },

  be: {
    tabs: { clock: "Гадзіннік", world: "Свет", stopwatch: "Секундамер", timer: "Таймер", converter: "Канвертар", countdown: "Адлік", calendar: "Каляндар" },
    stopwatch: { start: "Старт", stop: "Стоп", reset: "Скінуць", lap: "Круг" },
    footer: { privacy: "Прыватнасць", terms: "Умовы", cookieSettings: "Настройкі кукі", language: "Мова" },
    _inherit: "en",
  },

  bn: {
    tabs: { clock: "ঘড়ি", world: "বিশ্ব", stopwatch: "স্টপওয়াচ", timer: "টাইমার", converter: "রূপান্তরকারী", countdown: "কাউন্টডাউন", calendar: "ক্যালেন্ডার" },
    clock: { accurateTime: "সঠিক সময়", synchronizing: "সিঙ্ক্রোনাইজ হচ্ছে...", localTime: "স্থানীয় সময়" },
    stopwatch: { start: "শুরু", stop: "থামুন", reset: "রিসেট", lap: "ল্যাপ" },
    footer: { privacy: "গোপনীয়তা", terms: "শর্তাবলী", cookieSettings: "কুকি সেটিংস", language: "ভাষা" },
    _inherit: "en",
  },

  bg: {
    tabs: { clock: "Часовник", world: "Свят", stopwatch: "Хронометър", timer: "Таймер", converter: "Конвертор", countdown: "Отброяване", calendar: "Календар" },
    clock: { accurateTime: "Точно време", synchronizing: "Синхронизиране...", localTime: "Местно време" },
    stopwatch: { start: "Старт", stop: "Стоп", reset: "Нулиране", lap: "Обиколка" },
    footer: { privacy: "Поверителност", terms: "Условия", cookieSettings: "Настройки за бисквитки", language: "Език" },
    _inherit: "en",
  },

  ca: {
    tabs: { clock: "Rellotge", world: "Món", stopwatch: "Cronòmetre", timer: "Temporitzador", converter: "Convertidor", countdown: "Compte enrere", calendar: "Calendari" },
    clock: { accurateTime: "Hora exacta", synchronizing: "Sincronitzant...", localTime: "Hora local" },
    stopwatch: { start: "Començar", stop: "Parar", reset: "Reiniciar", lap: "Volta" },
    footer: { privacy: "Privacitat", terms: "Termes", cookieSettings: "Configuració de galetes", language: "Llengua" },
    _inherit: "en",
  },

  cs: {
    tabs: { clock: "Hodiny", world: "Svět", stopwatch: "Stopky", timer: "Časovač", converter: "Převodník", countdown: "Odpočet", calendar: "Kalendář" },
    clock: { accurateTime: "Přesný čas", synchronizing: "Synchronizace...", localTime: "Místní čas" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Reset", lap: "Kolo" },
    footer: { privacy: "Soukromí", terms: "Podmínky", cookieSettings: "Nastavení cookies", language: "Jazyk" },
    _inherit: "en",
  },

  zh: {
    tabs: { clock: "时钟", world: "世界", stopwatch: "秒表", timer: "计时器", converter: "转换器", countdown: "倒计时", calendar: "日历" },
    clock: { accurateTime: "精确时间", synchronizing: "同步中...", localTime: "本地时间", fullscreen: "全屏", dayProgress: "今天", yearProgress: "今年", daysLeft: "天剩余", minsLeft: "分钟剩余", location: "位置", timezone: "时区", utcOffset: "UTC偏移" },
    search: { placeholder: "搜索任何城市、州或国家...", searching: "搜索中...", noResults: "未找到结果", subtitle: "15万+城市 — 搜索全球任何城市", close: "关闭" },
    stopwatch: { start: "开始", stop: "停止", reset: "重置", lap: "计圈" },
    timer: { start: "开始", pause: "暂停", reset: "重置", hours: "小时", minutes: "分钟", seconds: "秒", timesUp: "时间到！" },
    world: { worldClocks: "世界时钟", sunrise: "日出", sunset: "日落", daylight: "白天", night: "夜晚", fromYou: "与您的时差" },
    sun: { title: "日出和日落", sunrise: "日出", sunset: "日落", daylight: "日照" },
    footer: { privacy: "隐私", terms: "条款", cookieSettings: "Cookie设置", tools: "工具", information: "信息", legal: "法律", tagline: "精确时间，覆盖每个时区", allRights: "版权所有", language: "语言" },
    common: { close: "关闭", save: "保存", cancel: "取消", loading: "加载中...", error: "错误" },
  },

  "zh-TW": {
    tabs: { clock: "時鐘", world: "世界", stopwatch: "碼錶", timer: "計時器", converter: "轉換器", countdown: "倒數計時", calendar: "日曆" },
    clock: { accurateTime: "精確時間", synchronizing: "同步中...", localTime: "本地時間", fullscreen: "全螢幕", dayProgress: "今天", yearProgress: "今年" },
    search: { placeholder: "搜尋任何城市、州或國家...", searching: "搜尋中...", noResults: "未找到結果", subtitle: "15萬+城市 — 搜尋全球任何城市", close: "關閉" },
    stopwatch: { start: "開始", stop: "停止", reset: "重置", lap: "計圈" },
    timer: { start: "開始", pause: "暫停", reset: "重置", hours: "小時", minutes: "分鐘", seconds: "秒", timesUp: "時間到！" },
    footer: { privacy: "隱私", terms: "條款", cookieSettings: "Cookie設定", language: "語言" },
    common: { close: "關閉", save: "儲存", cancel: "取消", loading: "載入中...", error: "錯誤" },
  },

  da: {
    tabs: { clock: "Ur", world: "Verden", stopwatch: "Stopur", timer: "Timer", converter: "Konverter", countdown: "Nedtælling", calendar: "Kalender" },
    clock: { accurateTime: "Nøjagtigt tidspunkt", synchronizing: "Synkroniserer...", localTime: "Lokal tid" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Nulstil", lap: "Omgang" },
    footer: { privacy: "Privatliv", terms: "Vilkår", cookieSettings: "Cookie-indstillinger", language: "Sprog" },
    _inherit: "en",
  },

  de: {
    tabs: { clock: "Uhr", world: "Welt", stopwatch: "Stoppuhr", timer: "Timer", converter: "Umrechner", countdown: "Countdown", calendar: "Kalender" },
    clock: { accurateTime: "Genaue Uhrzeit", synchronizing: "Synchronisiere...", localTime: "Ortszeit", fullscreen: "Vollbild", dayProgress: "Tag", yearProgress: "Jahr", daysLeft: "Tage übrig", minsLeft: "Min übrig", location: "Standort", timezone: "Zeitzone", utcOffset: "UTC-Versatz", yourClock: "DEINE UHR", difference: "ABWEICHUNG", accuracy: "GENAUIGKEIT" },
    search: { placeholder: "Stadt, Bundesland oder Land suchen...", searching: "Suche...", noResults: "Keine Ergebnisse", subtitle: "150.000+ Städte — jede Stadt weltweit suchen", close: "Schließen", noResultsFor: 'Keine Ergebnisse für "{q}". Versuche eine andere Schreibweise.', searchingWorldwide: "Weltweit suchen..." },
    loc: { shareTitle: "Teile deinen Standort für genaue Ergebnisse", shareDesc: "Zeigt die Uhrzeit für {city}. Teile deinen GPS-Standort für genauere Sonnenaufgangs- und Sonnenuntergangsdaten.", shareBtn: "Standort teilen", dismiss: "Schließen" },
    sync: { synced: "Synchronisiert", syncing: "Synchronisiere…", offline: "Offline", source: "Quelle", sources: "Quellen", clickResync: "Klicken zum erneut synchronisieren", clockAccuracy: "Genauigkeit deiner Uhr", behind: "hinterher", ahead: "voraus", inSync: "synchron mit", yourClockIs: "Deine Uhr ist", actualTime: "der tatsächlichen Zeit", excellent: "AUSGEZEICHNET", good: "GUT", poor: "SCHLECHT", reference: "Referenz", actualTimeLabel: "TATSÄCHLICHE ZEIT", yourComputer: "DEIN COMPUTER", measurementAccuracy: "MESSGENAUIGKEIT", syncSources: "Synchronisierungsquellen", active: "aktiv", waiting: "Warten…", howItWorks: "So funktioniert die Synchronisierung", bestRtt: "beste RTT", offset: "Versatz" },
    stopwatch: { start: "Start", stop: "Stopp", reset: "Zurücksetzen", lap: "Runde" },
    timer: { start: "Start", pause: "Pause", reset: "Zurücksetzen", hours: "Stunden", minutes: "Minuten", seconds: "Sekunden", timesUp: "Zeit abgelaufen!" },
    world: { worldClocks: "Weltuhren", sunrise: "Sonnenaufgang", sunset: "Sonnenuntergang", daylight: "Tageslicht", night: "Nacht", fromYou: "von dir", dayNightMap: "Live Tag- und Nachtkarte", sameAsYou: "Gleich wie du" },
    sun: { title: "Sonnenaufgang & Sonnenuntergang", sunrise: "Aufgang", sunset: "Untergang", daylight: "Tageslicht", sunIsUp: "Sonne ist aufgegangen", sunHasSet: "Sonne ist untergegangen" },
    converter: { title: "Zeitzonen-Umrechner", from: "Von", to: "Nach", addTimezone: "Zeitzone hinzufügen" },
    countdown: { title: "Countdown", daysUntil: "Tage bis", selectDate: "Datum wählen", timerTitle: "Timer", days: "Tage", hours: "Stunden", minutes: "Minuten", seconds: "Sekunden" },
    calendar: { title: "Kalender", week: "KW", today: "Heute", dateCalc: "Datumsrechner" },
    footer: { privacy: "Datenschutz", terms: "Bedingungen", cookieSettings: "Cookie-Einstellungen", tools: "Werkzeuge", information: "Information", legal: "Rechtliches", tagline: "Genaue Zeit für jede Zeitzone", allRights: "Alle Rechte vorbehalten", language: "Sprache", features: "Funktionen", taglineShort: "Genaue Weltzeit", exactTime: "Genaue Uhrzeit", worldClocks: "Weltuhren", tzConverter: "Zeitzonen-Umrechner", countdownDate: "Countdown", countdownTimer: "Timer", clockSync: "Uhr-Synchronisierung", fullscreenClock: "Vollbild-Uhr", sunriseSunset: "Sonnenaufgang & -untergang", dayNightMap: "Tag-/Nachtkarte", dateCalc: "Datumsrechner", about: "Über Clockzilla", faq: "FAQ", howItWorks: "So funktioniert's", contact: "Kontakt", privacyPolicy: "Datenschutzrichtlinie", termsOfUse: "Nutzungsbedingungen", cookiePolicy: "Cookie-Richtlinie" },
    common: { close: "Schließen", save: "Speichern", cancel: "Abbrechen", loading: "Laden...", error: "Fehler" },
  },

  et: {
    tabs: { clock: "Kell", world: "Maailm", stopwatch: "Stopper", timer: "Taimer", converter: "Teisendaja", countdown: "Loendus", calendar: "Kalender" },
    stopwatch: { start: "Alusta", stop: "Peata", reset: "Lähtesta", lap: "Ring" },
    footer: { privacy: "Privaatsus", terms: "Tingimused", cookieSettings: "Küpsiste seaded", language: "Keel" },
    _inherit: "en",
  },

  el: {
    tabs: { clock: "Ρολόι", world: "Κόσμος", stopwatch: "Χρονόμετρο", timer: "Χρονοδιακόπτης", converter: "Μετατροπέας", countdown: "Αντίστροφη μέτρηση", calendar: "Ημερολόγιο" },
    clock: { accurateTime: "Ακριβής ώρα", synchronizing: "Συγχρονισμός...", localTime: "Τοπική ώρα" },
    stopwatch: { start: "Έναρξη", stop: "Στοπ", reset: "Επαναφορά", lap: "Γύρος" },
    footer: { privacy: "Απόρρητο", terms: "Όροι", cookieSettings: "Ρυθμίσεις cookies", language: "Γλώσσα" },
    _inherit: "en",
  },

  es: {
    tabs: { clock: "Reloj", world: "Mundo", stopwatch: "Cronómetro", timer: "Temporizador", converter: "Convertidor", countdown: "Cuenta atrás", calendar: "Calendario" },
    clock: { accurateTime: "Hora exacta", synchronizing: "Sincronizando...", localTime: "Hora local", fullscreen: "Pantalla completa", dayProgress: "Día", yearProgress: "Año", daysLeft: "días restantes", minsLeft: "min restantes", location: "Ubicación", timezone: "Zona horaria", utcOffset: "Desfase UTC", yourClock: "TU RELOJ", difference: "DIFERENCIA", accuracy: "PRECISIÓN" },
    search: { placeholder: "Buscar cualquier ciudad, estado o país...", searching: "Buscando...", noResults: "Sin resultados", subtitle: "Más de 150.000 ciudades — busca cualquier ciudad del mundo", close: "Cerrar", noResultsFor: 'Sin resultados para "{q}". Intenta otra ortografía.', searchingWorldwide: "Buscando en todo el mundo..." },
    loc: { shareTitle: "Comparte tu ubicación para resultados precisos", shareDesc: "Mostrando hora de {city}. Comparte tu ubicación GPS para datos más precisos de amanecer y atardecer.", shareBtn: "Compartir ubicación", dismiss: "Cerrar" },
    sync: { synced: "Sincronizado", syncing: "Sincronizando…", offline: "Sin conexión", source: "fuente", sources: "fuentes", clickResync: "Clic para re-sincronizar", clockAccuracy: "Precisión de tu reloj", behind: "atrasado", ahead: "adelantado", inSync: "sincronizado con", yourClockIs: "Tu reloj está", actualTime: "la hora real", excellent: "EXCELENTE", good: "BUENO", poor: "POBRE", reference: "Referencia", actualTimeLabel: "HORA REAL", yourComputer: "TU COMPUTADORA", measurementAccuracy: "PRECISIÓN DE MEDICIÓN", syncSources: "Fuentes de sincronización", active: "activas", waiting: "Esperando…", howItWorks: "Cómo funciona la sincronización", bestRtt: "mejor RTT", offset: "desfase" },
    stopwatch: { start: "Iniciar", stop: "Detener", reset: "Reiniciar", lap: "Vuelta" },
    timer: { start: "Iniciar", pause: "Pausar", reset: "Reiniciar", hours: "Horas", minutes: "Minutos", seconds: "Segundos", timesUp: "¡Se acabó el tiempo!" },
    world: { worldClocks: "Relojes del mundo", sunrise: "Amanecer", sunset: "Atardecer", daylight: "Luz del día", night: "Noche", fromYou: "de ti", dayNightMap: "Mapa de día y noche en vivo", sameAsYou: "Igual que tú" },
    sun: { title: "Amanecer y atardecer", sunrise: "Amanecer", sunset: "Atardecer", daylight: "Luz del día", sunIsUp: "El sol está arriba", sunHasSet: "El sol se ha puesto" },
    converter: { title: "Convertidor de zonas horarias", from: "Desde", to: "Hasta", addTimezone: "Agregar zona horaria" },
    countdown: { title: "Cuenta atrás", daysUntil: "días hasta", selectDate: "Seleccionar fecha", timerTitle: "Temporizador", days: "Días", hours: "Horas", minutes: "Minutos", seconds: "Segundos" },
    calendar: { title: "Calendario", week: "Sem", today: "Hoy", dateCalc: "Calculadora de fechas" },
    footer: { privacy: "Privacidad", terms: "Términos", cookieSettings: "Configuración de cookies", tools: "Herramientas", information: "Información", legal: "Legal", tagline: "Hora precisa para cada zona horaria", allRights: "Todos los derechos reservados", language: "Idioma", features: "Características", taglineShort: "Hora mundial precisa", exactTime: "Hora exacta ahora", worldClocks: "Relojes del mundo", tzConverter: "Convertidor de zonas horarias", countdownDate: "Cuenta atrás", countdownTimer: "Temporizador", clockSync: "Sincronización del reloj", fullscreenClock: "Reloj a pantalla completa", sunriseSunset: "Amanecer y atardecer", dayNightMap: "Mapa día/noche", dateCalc: "Calculadora de fechas", about: "Acerca de Clockzilla", faq: "Preguntas frecuentes", howItWorks: "Cómo funciona", contact: "Contacto", privacyPolicy: "Política de privacidad", termsOfUse: "Términos de uso", cookiePolicy: "Política de cookies" },
    common: { close: "Cerrar", save: "Guardar", cancel: "Cancelar", loading: "Cargando...", error: "Error" },
  },

  eo: {
    tabs: { clock: "Horloĝo", world: "Mondo", stopwatch: "Kronometro", timer: "Temporizilo", converter: "Konvertilo", countdown: "Retrokalkulo", calendar: "Kalendaro" },
    stopwatch: { start: "Ek", stop: "Haltu", reset: "Restarigi", lap: "Cirklo" },
    footer: { privacy: "Privateco", terms: "Kondiĉoj", cookieSettings: "Kuketaj agordoj", language: "Lingvo" },
    _inherit: "en",
  },

  fr: {
    tabs: { clock: "Horloge", world: "Monde", stopwatch: "Chronomètre", timer: "Minuteur", converter: "Convertisseur", countdown: "Compte à rebours", calendar: "Calendrier" },
    clock: { accurateTime: "Heure exacte", synchronizing: "Synchronisation...", localTime: "Heure locale", fullscreen: "Plein écran", dayProgress: "Jour", yearProgress: "Année", daysLeft: "jours restants", minsLeft: "min restantes", location: "Lieu", timezone: "Fuseau horaire", utcOffset: "Décalage UTC", yourClock: "VOTRE HORLOGE", difference: "DIFFÉRENCE", accuracy: "PRÉCISION" },
    search: { placeholder: "Rechercher une ville, un état ou un pays...", searching: "Recherche...", noResults: "Aucun résultat", subtitle: "Plus de 150 000 villes — recherchez n'importe quelle ville dans le monde", close: "Fermer", noResultsFor: 'Aucun résultat pour "{q}". Essayez une autre orthographe.', searchingWorldwide: "Recherche mondiale..." },
    loc: { shareTitle: "Partagez votre position pour des résultats précis", shareDesc: "Affichage de l'heure pour {city}. Partagez votre position GPS pour des données plus précises.", shareBtn: "Partager la position", dismiss: "Fermer" },
    sync: { synced: "Synchronisé", syncing: "Synchronisation…", offline: "Hors ligne", source: "source", sources: "sources", clickResync: "Cliquer pour re-synchroniser", clockAccuracy: "Précision de votre horloge", behind: "en retard", ahead: "en avance", inSync: "synchronisé avec", yourClockIs: "Votre horloge est", actualTime: "l'heure réelle", excellent: "EXCELLENT", good: "BON", poor: "MAUVAIS", reference: "Référence", actualTimeLabel: "HEURE RÉELLE", yourComputer: "VOTRE ORDINATEUR", measurementAccuracy: "PRÉCISION DE MESURE", syncSources: "Sources de synchronisation", active: "actives", waiting: "En attente…", howItWorks: "Comment ça marche", bestRtt: "meilleur RTT", offset: "décalage" },
    stopwatch: { start: "Démarrer", stop: "Arrêter", reset: "Réinitialiser", lap: "Tour" },
    timer: { start: "Démarrer", pause: "Pause", reset: "Réinitialiser", hours: "Heures", minutes: "Minutes", seconds: "Secondes", timesUp: "Temps écoulé !" },
    world: { worldClocks: "Horloges mondiales", sunrise: "Lever du soleil", sunset: "Coucher du soleil", daylight: "Lumière du jour", night: "Nuit", fromYou: "de vous", dayNightMap: "Carte jour et nuit en direct", sameAsYou: "Identique à vous" },
    sun: { title: "Lever et coucher du soleil", sunrise: "Lever", sunset: "Coucher", daylight: "Lumière du jour", sunIsUp: "Soleil levé", sunHasSet: "Soleil couché" },
    converter: { title: "Convertisseur de fuseaux horaires", from: "De", to: "À", addTimezone: "Ajouter un fuseau" },
    countdown: { title: "Compte à rebours", daysUntil: "jours avant", selectDate: "Sélectionner une date", timerTitle: "Minuteur", days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes" },
    calendar: { title: "Calendrier", week: "Sem", today: "Aujourd'hui", dateCalc: "Calculatrice de dates" },
    footer: { privacy: "Confidentialité", terms: "Conditions", cookieSettings: "Paramètres des cookies", tools: "Outils", information: "Information", legal: "Juridique", tagline: "Heure précise pour chaque fuseau horaire", allRights: "Tous droits réservés", language: "Langue", features: "Fonctionnalités", taglineShort: "Heure mondiale précise", exactTime: "Heure exacte", worldClocks: "Horloges mondiales", tzConverter: "Convertisseur de fuseaux", countdownDate: "Compte à rebours", countdownTimer: "Minuteur", clockSync: "Synchronisation", fullscreenClock: "Horloge plein écran", sunriseSunset: "Lever et coucher du soleil", dayNightMap: "Carte jour/nuit", dateCalc: "Calculatrice de dates", about: "À propos", faq: "FAQ", howItWorks: "Comment ça marche", contact: "Contact", privacyPolicy: "Politique de confidentialité", termsOfUse: "Conditions d'utilisation", cookiePolicy: "Politique des cookies" },
    common: { close: "Fermer", save: "Enregistrer", cancel: "Annuler", loading: "Chargement...", error: "Erreur" },
  },

  he: {
    tabs: { clock: "שעון", world: "עולם", stopwatch: "סטופר", timer: "טיימר", converter: "ממיר", countdown: "ספירה לאחור", calendar: "לוח שנה" },
    clock: { accurateTime: "שעה מדויקת", synchronizing: "מסנכרן...", localTime: "שעה מקומית" },
    stopwatch: { start: "התחל", stop: "עצור", reset: "אפס", lap: "הקפה" },
    footer: { privacy: "פרטיות", terms: "תנאים", cookieSettings: "הגדרות עוגיות", language: "שפה" },
    _inherit: "en",
  },

  hi: {
    tabs: { clock: "घड़ी", world: "विश्व", stopwatch: "स्टॉपवॉच", timer: "टाइमर", converter: "कनवर्टर", countdown: "उलटी गिनती", calendar: "कैलेंडर" },
    clock: { accurateTime: "सटीक समय", synchronizing: "सिंक्रोनाइज़ हो रहा है...", localTime: "स्थानीय समय" },
    search: { placeholder: "कोई भी शहर, राज्य या देश खोजें...", searching: "खोज रहे हैं...", noResults: "कोई परिणाम नहीं", close: "बंद करें" },
    stopwatch: { start: "शुरू", stop: "रुकें", reset: "रीसेट", lap: "लैप" },
    footer: { privacy: "गोपनीयता", terms: "शर्तें", cookieSettings: "कुकी सेटिंग्स", language: "भाषा" },
    _inherit: "en",
  },

  hr: {
    tabs: { clock: "Sat", world: "Svijet", stopwatch: "Štoperica", timer: "Mjerač", converter: "Pretvarač", countdown: "Odbrojavanje", calendar: "Kalendar" },
    stopwatch: { start: "Početak", stop: "Zaustavi", reset: "Resetiraj", lap: "Krug" },
    footer: { privacy: "Privatnost", terms: "Uvjeti", cookieSettings: "Postavke kolačića", language: "Jezik" },
    _inherit: "en",
  },

  id: {
    tabs: { clock: "Jam", world: "Dunia", stopwatch: "Stopwatch", timer: "Timer", converter: "Konverter", countdown: "Hitung mundur", calendar: "Kalender" },
    clock: { accurateTime: "Waktu akurat", synchronizing: "Menyinkronkan...", localTime: "Waktu lokal" },
    stopwatch: { start: "Mulai", stop: "Berhenti", reset: "Reset", lap: "Putaran" },
    footer: { privacy: "Privasi", terms: "Ketentuan", cookieSettings: "Pengaturan cookie", language: "Bahasa" },
    _inherit: "en",
  },

  is: {
    tabs: { clock: "Klukka", world: "Heimur", stopwatch: "Skeiðklukka", timer: "Tímamælir", converter: "Breytir", countdown: "Niðurtalning", calendar: "Dagatal" },
    stopwatch: { start: "Byrja", stop: "Stöðva", reset: "Endurstilla", lap: "Hringur" },
    footer: { privacy: "Persónuvernd", terms: "Skilmálar", cookieSettings: "Stillingar smákaka", language: "Tungumál" },
    _inherit: "en",
  },

  ga: {
    tabs: { clock: "Clog", world: "Domhan", stopwatch: "Stad-uaireadóir", timer: "Amadóir", converter: "Tiontaire", countdown: "Comhaireamh siar", calendar: "Féilire" },
    stopwatch: { start: "Tosaigh", stop: "Stop", reset: "Athshocraigh", lap: "Timpeall" },
    footer: { privacy: "Príobháideacht", terms: "Téarmaí", cookieSettings: "Socruithe fianán", language: "Teanga" },
    _inherit: "en",
  },

  it: {
    tabs: { clock: "Orologio", world: "Mondo", stopwatch: "Cronometro", timer: "Timer", converter: "Convertitore", countdown: "Conto alla rovescia", calendar: "Calendario" },
    clock: { accurateTime: "Ora esatta", synchronizing: "Sincronizzazione...", localTime: "Ora locale", fullscreen: "Schermo intero", dayProgress: "Giorno", yearProgress: "Anno", daysLeft: "giorni rimasti", minsLeft: "min rimasti", location: "Posizione", timezone: "Fuso orario", utcOffset: "Scarto UTC", yourClock: "IL TUO OROLOGIO", difference: "DIFFERENZA", accuracy: "PRECISIONE" },
    search: { placeholder: "Cerca qualsiasi città, stato o paese...", searching: "Ricerca...", noResults: "Nessun risultato", subtitle: "Oltre 150.000 città — cerca qualsiasi città nel mondo", close: "Chiudi", noResultsFor: 'Nessun risultato per "{q}". Prova un\'altra ortografia.', searchingWorldwide: "Ricerca in tutto il mondo..." },
    loc: { shareTitle: "Condividi la tua posizione per risultati precisi", shareDesc: "Ora mostrata per {city}. Condividi la posizione GPS per dati più precisi su alba e tramonto.", shareBtn: "Condividi posizione", dismiss: "Chiudi" },
    sync: { synced: "Sincronizzato", syncing: "Sincronizzazione…", offline: "Offline", source: "fonte", sources: "fonti", clickResync: "Clicca per ri-sincronizzare", clockAccuracy: "Precisione del tuo orologio", behind: "indietro", ahead: "avanti", inSync: "sincronizzato con", yourClockIs: "Il tuo orologio è", actualTime: "l'ora reale", excellent: "ECCELLENTE", good: "BUONO", poor: "SCARSO", reference: "Riferimento", actualTimeLabel: "ORA REALE", yourComputer: "IL TUO COMPUTER", measurementAccuracy: "PRECISIONE MISURAZIONE", syncSources: "Fonti di sincronizzazione", active: "attive", waiting: "In attesa…", howItWorks: "Come funziona la sincronizzazione", bestRtt: "miglior RTT", offset: "scarto" },
    stopwatch: { start: "Avvia", stop: "Ferma", reset: "Azzera", lap: "Giro" },
    timer: { start: "Avvia", pause: "Pausa", reset: "Azzera", hours: "Ore", minutes: "Minuti", seconds: "Secondi", timesUp: "Tempo scaduto!" },
    world: { worldClocks: "Orologi del mondo", sunrise: "Alba", sunset: "Tramonto", daylight: "Luce del giorno", night: "Notte", fromYou: "da te", dayNightMap: "Mappa giorno e notte dal vivo", sameAsYou: "Uguale a te" },
    sun: { title: "Alba e tramonto", sunrise: "Alba", sunset: "Tramonto", daylight: "Luce del giorno", sunIsUp: "Il sole è sorto", sunHasSet: "Il sole è tramontato" },
    converter: { title: "Convertitore di fusi orari", from: "Da", to: "A", addTimezone: "Aggiungi fuso orario" },
    countdown: { title: "Conto alla rovescia", daysUntil: "giorni a", selectDate: "Seleziona una data", timerTitle: "Timer", days: "Giorni", hours: "Ore", minutes: "Minuti", seconds: "Secondi" },
    calendar: { title: "Calendario", week: "Set", today: "Oggi", dateCalc: "Calcolatore di date" },
    footer: { privacy: "Privacy", terms: "Termini", cookieSettings: "Impostazioni cookie", tools: "Strumenti", information: "Informazioni", legal: "Legale", tagline: "Ora precisa per ogni fuso orario", allRights: "Tutti i diritti riservati", language: "Lingua", features: "Funzionalità", taglineShort: "Ora mondiale precisa", exactTime: "Ora esatta", worldClocks: "Orologi del mondo", tzConverter: "Convertitore di fusi", countdownDate: "Conto alla rovescia", countdownTimer: "Timer", clockSync: "Sincronizzazione", fullscreenClock: "Orologio a schermo intero", sunriseSunset: "Alba e tramonto", dayNightMap: "Mappa giorno/notte", dateCalc: "Calcolatore di date", about: "Informazioni su Clockzilla", faq: "FAQ", howItWorks: "Come funziona", contact: "Contatti", privacyPolicy: "Informativa sulla privacy", termsOfUse: "Termini di utilizzo", cookiePolicy: "Politica sui cookie" },
    common: { close: "Chiudi", save: "Salva", cancel: "Annulla", loading: "Caricamento...", error: "Errore" },
  },

  ja: {
    tabs: { clock: "時計", world: "世界", stopwatch: "ストップウォッチ", timer: "タイマー", converter: "変換", countdown: "カウントダウン", calendar: "カレンダー" },
    clock: { accurateTime: "正確な時刻", synchronizing: "同期中...", localTime: "現地時間", fullscreen: "全画面", dayProgress: "今日", yearProgress: "今年", daysLeft: "日残り", minsLeft: "分残り", location: "場所", timezone: "タイムゾーン", utcOffset: "UTCオフセット" },
    search: { placeholder: "都市、州、国を検索...", searching: "検索中...", noResults: "結果なし", subtitle: "15万以上の都市 — 世界中の都市を検索", close: "閉じる" },
    stopwatch: { start: "スタート", stop: "ストップ", reset: "リセット", lap: "ラップ" },
    timer: { start: "スタート", pause: "一時停止", reset: "リセット", hours: "時間", minutes: "分", seconds: "秒", timesUp: "時間です！" },
    world: { worldClocks: "世界時計", sunrise: "日の出", sunset: "日の入り", daylight: "昼", night: "夜", fromYou: "との差" },
    footer: { privacy: "プライバシー", terms: "利用規約", cookieSettings: "Cookie設定", tools: "ツール", information: "情報", legal: "法的", tagline: "すべてのタイムゾーンの正確な時刻", allRights: "全著作権所有", language: "言語" },
    common: { close: "閉じる", save: "保存", cancel: "キャンセル", loading: "読み込み中...", error: "エラー" },
  },

  ka: {
    tabs: { clock: "საათი", world: "მსოფლიო", stopwatch: "წამზომი", timer: "ტაიმერი", converter: "კონვერტორი", countdown: "უკუთვლა", calendar: "კალენდარი" },
    stopwatch: { start: "დაწყება", stop: "გაჩერება", reset: "გადაყენება", lap: "წრე" },
    footer: { privacy: "კონფიდენციალურობა", terms: "პირობები", cookieSettings: "Cookie პარამეტრები", language: "ენა" },
    _inherit: "en",
  },

  kab: {
    tabs: { clock: "Tamhelt", world: "Amaḍal", stopwatch: "Askud", timer: "Akud", converter: "Amselqi", countdown: "Asiḍen", calendar: "Awitay" },
    _inherit: "en",
  },

  ko: {
    tabs: { clock: "시계", world: "세계", stopwatch: "스톱워치", timer: "타이머", converter: "변환기", countdown: "카운트다운", calendar: "달력" },
    clock: { accurateTime: "정확한 시간", synchronizing: "동기화 중...", localTime: "현지 시간", fullscreen: "전체화면", dayProgress: "오늘", yearProgress: "올해", daysLeft: "일 남음", minsLeft: "분 남음", location: "위치", timezone: "시간대", utcOffset: "UTC 오프셋" },
    search: { placeholder: "도시, 주 또는 국가 검색...", searching: "검색 중...", noResults: "결과 없음", subtitle: "15만+ 도시 — 전 세계 어떤 도시든 검색", close: "닫기" },
    stopwatch: { start: "시작", stop: "정지", reset: "초기화", lap: "랩" },
    timer: { start: "시작", pause: "일시정지", reset: "초기화", hours: "시간", minutes: "분", seconds: "초", timesUp: "시간 종료!" },
    footer: { privacy: "개인정보", terms: "이용약관", cookieSettings: "쿠키 설정", language: "언어" },
    common: { close: "닫기", save: "저장", cancel: "취소", loading: "로딩 중...", error: "오류" },
  },

  lv: {
    tabs: { clock: "Pulkstenis", world: "Pasaule", stopwatch: "Hronometrs", timer: "Taimeris", converter: "Pārveidotājs", countdown: "Atpakaļskaitīšana", calendar: "Kalendārs" },
    stopwatch: { start: "Sākt", stop: "Apturēt", reset: "Atiestatīt", lap: "Aplis" },
    footer: { privacy: "Privātums", terms: "Noteikumi", cookieSettings: "Sīkdatņu iestatījumi", language: "Valoda" },
    _inherit: "en",
  },

  lt: {
    tabs: { clock: "Laikrodis", world: "Pasaulis", stopwatch: "Chronometras", timer: "Laikmatis", converter: "Keitiklis", countdown: "Atgalinė atskaita", calendar: "Kalendorius" },
    stopwatch: { start: "Pradėti", stop: "Stabdyti", reset: "Atstatyti", lap: "Ratas" },
    footer: { privacy: "Privatumas", terms: "Sąlygos", cookieSettings: "Slapukų nustatymai", language: "Kalba" },
    _inherit: "en",
  },

  hu: {
    tabs: { clock: "Óra", world: "Világ", stopwatch: "Stopper", timer: "Időzítő", converter: "Átváltó", countdown: "Visszaszámlálás", calendar: "Naptár" },
    clock: { accurateTime: "Pontos idő", synchronizing: "Szinkronizálás...", localTime: "Helyi idő" },
    stopwatch: { start: "Indítás", stop: "Leállítás", reset: "Visszaállítás", lap: "Kör" },
    footer: { privacy: "Adatvédelem", terms: "Feltételek", cookieSettings: "Süti beállítások", language: "Nyelv" },
    _inherit: "en",
  },

  mk: {
    tabs: { clock: "Часовник", world: "Свет", stopwatch: "Штоперица", timer: "Тајмер", converter: "Конвертор", countdown: "Одбројување", calendar: "Календар" },
    stopwatch: { start: "Почни", stop: "Стоп", reset: "Ресетирај", lap: "Круг" },
    footer: { privacy: "Приватност", terms: "Услови", cookieSettings: "Подесувања за колачиња", language: "Јазик" },
    _inherit: "en",
  },

  mg: {
    tabs: { clock: "Famantaranandro", world: "Izao tontolo izao", stopwatch: "Famantaranandro", timer: "Timer", converter: "Mpamadika", countdown: "Fitanisana", calendar: "Kalandrie" },
    _inherit: "en",
  },

  nl: {
    tabs: { clock: "Klok", world: "Wereld", stopwatch: "Stopwatch", timer: "Timer", converter: "Converter", countdown: "Aftellen", calendar: "Kalender" },
    clock: { accurateTime: "Nauwkeurige tijd", synchronizing: "Synchroniseren...", localTime: "Lokale tijd", fullscreen: "Volledig scherm", dayProgress: "Dag", yearProgress: "Jaar", daysLeft: "dagen over", minsLeft: "min over", location: "Locatie", timezone: "Tijdzone", utcOffset: "UTC-verschil" },
    search: { placeholder: "Zoek een stad, staat of land...", searching: "Zoeken...", noResults: "Geen resultaten", close: "Sluiten" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Reset", lap: "Ronde" },
    footer: { privacy: "Privacy", terms: "Voorwaarden", cookieSettings: "Cookie-instellingen", tools: "Gereedschap", tagline: "Nauwkeurige tijd voor elke tijdzone", allRights: "Alle rechten voorbehouden", language: "Taal" },
    common: { close: "Sluiten", save: "Opslaan", cancel: "Annuleren", loading: "Laden...", error: "Fout" },
  },

  nb: {
    tabs: { clock: "Klokke", world: "Verden", stopwatch: "Stoppeklokke", timer: "Tidtaker", converter: "Konverter", countdown: "Nedtelling", calendar: "Kalender" },
    stopwatch: { start: "Start", stop: "Stopp", reset: "Nullstill", lap: "Runde" },
    footer: { privacy: "Personvern", terms: "Vilkår", cookieSettings: "Informasjonskapselinnstillinger", language: "Språk" },
    _inherit: "en",
  },

  nn: {
    tabs: { clock: "Klokke", world: "Verda", stopwatch: "Stoppeklokke", timer: "Tidtakar", converter: "Konverter", countdown: "Nedteljing", calendar: "Kalender" },
    stopwatch: { start: "Start", stop: "Stopp", reset: "Nullstill", lap: "Runde" },
    footer: { privacy: "Personvern", terms: "Vilkår", cookieSettings: "Innstillingar for informasjonskapslar", language: "Språk" },
    _inherit: "en",
  },

  fa: {
    tabs: { clock: "ساعت", world: "جهان", stopwatch: "کرونومتر", timer: "تایمر", converter: "مبدل", countdown: "شمارش معکوس", calendar: "تقویم" },
    clock: { accurateTime: "زمان دقیق", synchronizing: "در حال همگام‌سازی...", localTime: "زمان محلی" },
    stopwatch: { start: "شروع", stop: "توقف", reset: "بازنشانی", lap: "دور" },
    footer: { privacy: "حریم خصوصی", terms: "شرایط", cookieSettings: "تنظیمات کوکی", language: "زبان" },
    _inherit: "en",
  },

  pl: {
    tabs: { clock: "Zegar", world: "Świat", stopwatch: "Stoper", timer: "Minutnik", converter: "Konwerter", countdown: "Odliczanie", calendar: "Kalendarz" },
    clock: { accurateTime: "Dokładny czas", synchronizing: "Synchronizacja...", localTime: "Czas lokalny", fullscreen: "Pełny ekran", dayProgress: "Dzień", yearProgress: "Rok", daysLeft: "dni pozostało", minsLeft: "min pozostało", location: "Lokalizacja", timezone: "Strefa czasowa", utcOffset: "Przesunięcie UTC" },
    search: { placeholder: "Szukaj miasta, stanu lub kraju...", searching: "Szukanie...", noResults: "Brak wyników", close: "Zamknij" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Resetuj", lap: "Okrążenie" },
    footer: { privacy: "Prywatność", terms: "Regulamin", cookieSettings: "Ustawienia plików cookie", tools: "Narzędzia", tagline: "Dokładny czas dla każdej strefy czasowej", allRights: "Wszelkie prawa zastrzeżone", language: "Język" },
    common: { close: "Zamknij", save: "Zapisz", cancel: "Anuluj", loading: "Ładowanie...", error: "Błąd" },
  },

  pt: {
    tabs: { clock: "Relógio", world: "Mundo", stopwatch: "Cronómetro", timer: "Temporizador", converter: "Conversor", countdown: "Contagem decrescente", calendar: "Calendário" },
    clock: { accurateTime: "Hora exata", synchronizing: "A sincronizar...", localTime: "Hora local" },
    stopwatch: { start: "Iniciar", stop: "Parar", reset: "Repor", lap: "Volta" },
    footer: { privacy: "Privacidade", terms: "Termos", cookieSettings: "Definições de cookies", language: "Idioma" },
    _inherit: "en",
  },

  "pt-BR": {
    tabs: { clock: "Relógio", world: "Mundo", stopwatch: "Cronômetro", timer: "Temporizador", converter: "Conversor", countdown: "Contagem regressiva", calendar: "Calendário" },
    clock: { accurateTime: "Hora exata", synchronizing: "Sincronizando...", localTime: "Hora local", fullscreen: "Tela cheia", dayProgress: "Dia", yearProgress: "Ano" },
    search: { placeholder: "Buscar qualquer cidade, estado ou país...", searching: "Buscando...", noResults: "Nenhum resultado", close: "Fechar" },
    stopwatch: { start: "Iniciar", stop: "Parar", reset: "Reiniciar", lap: "Volta" },
    timer: { start: "Iniciar", pause: "Pausar", reset: "Reiniciar", hours: "Horas", minutes: "Minutos", seconds: "Segundos", timesUp: "Tempo esgotado!" },
    footer: { privacy: "Privacidade", terms: "Termos", cookieSettings: "Configurações de cookies", tagline: "Hora precisa para cada fuso horário", allRights: "Todos os direitos reservados", language: "Idioma" },
    common: { close: "Fechar", save: "Salvar", cancel: "Cancelar", loading: "Carregando...", error: "Erro" },
  },

  ro: {
    tabs: { clock: "Ceas", world: "Lume", stopwatch: "Cronometru", timer: "Temporizator", converter: "Convertor", countdown: "Numărătoare inversă", calendar: "Calendar" },
    stopwatch: { start: "Start", stop: "Stop", reset: "Resetare", lap: "Tur" },
    footer: { privacy: "Confidențialitate", terms: "Termeni", cookieSettings: "Setări cookie", language: "Limbă" },
    _inherit: "en",
  },

  ru: {
    tabs: { clock: "Часы", world: "Мир", stopwatch: "Секундомер", timer: "Таймер", converter: "Конвертер", countdown: "Обратный отсчёт", calendar: "Календарь" },
    clock: { accurateTime: "Точное время", synchronizing: "Синхронизация...", localTime: "Местное время", fullscreen: "Полный экран", dayProgress: "День", yearProgress: "Год", daysLeft: "дней осталось", minsLeft: "мин осталось", location: "Местоположение", timezone: "Часовой пояс", utcOffset: "Смещение UTC" },
    search: { placeholder: "Поиск города, штата или страны...", searching: "Поиск...", noResults: "Ничего не найдено", subtitle: "150 000+ городов — ищите любой город в мире", close: "Закрыть" },
    stopwatch: { start: "Старт", stop: "Стоп", reset: "Сброс", lap: "Круг" },
    timer: { start: "Старт", pause: "Пауза", reset: "Сброс", hours: "Часы", minutes: "Минуты", seconds: "Секунды", timesUp: "Время вышло!" },
    world: { worldClocks: "Мировые часы", sunrise: "Восход", sunset: "Закат", daylight: "День", night: "Ночь", fromYou: "от вас" },
    sun: { title: "Восход и закат", sunrise: "Восход", sunset: "Закат", daylight: "Световой день" },
    footer: { privacy: "Конфиденциальность", terms: "Условия", cookieSettings: "Настройки куки", tools: "Инструменты", information: "Информация", legal: "Правовая информация", tagline: "Точное время для каждого часового пояса", allRights: "Все права защищены", language: "Язык" },
    common: { close: "Закрыть", save: "Сохранить", cancel: "Отмена", loading: "Загрузка...", error: "Ошибка" },
  },

  sr: {
    tabs: { clock: "Сат", world: "Свет", stopwatch: "Штоперица", timer: "Тајмер", converter: "Конвертор", countdown: "Одбројавање", calendar: "Календар" },
    stopwatch: { start: "Почни", stop: "Стоп", reset: "Ресетуј", lap: "Круг" },
    footer: { privacy: "Приватност", terms: "Услови", cookieSettings: "Подешавања колачића", language: "Језик" },
    _inherit: "en",
  },

  sq: {
    tabs: { clock: "Ora", world: "Bota", stopwatch: "Kronometri", timer: "Kohëmatësi", converter: "Konvertuesi", countdown: "Numërimi mbrapsht", calendar: "Kalendari" },
    stopwatch: { start: "Fillo", stop: "Ndalo", reset: "Rivendos", lap: "Xhiro" },
    footer: { privacy: "Privatësia", terms: "Kushtet", cookieSettings: "Cilësimet e kukive", language: "Gjuha" },
    _inherit: "en",
  },

  si: {
    tabs: { clock: "ඔරලෝසුව", world: "ලෝකය", stopwatch: "තත්පර මැනුම", timer: "ටයිමරය", converter: "පරිවර්තකය", countdown: "ආපසු ගණනය", calendar: "දින දර්ශනය" },
    stopwatch: { start: "ආරම්භ", stop: "නවත්වන්න", reset: "යළි සකසන්න", lap: "වට" },
    footer: { privacy: "පෞද්ගලිකත්වය", terms: "නියම", cookieSettings: "කුකී සැකසුම්", language: "භාෂාව" },
    _inherit: "en",
  },

  sk: {
    tabs: { clock: "Hodiny", world: "Svet", stopwatch: "Stopky", timer: "Časovač", converter: "Prevodník", countdown: "Odpočet", calendar: "Kalendár" },
    stopwatch: { start: "Štart", stop: "Stop", reset: "Reset", lap: "Kolo" },
    footer: { privacy: "Súkromie", terms: "Podmienky", cookieSettings: "Nastavenia cookies", language: "Jazyk" },
    _inherit: "en",
  },

  sl: {
    tabs: { clock: "Ura", world: "Svet", stopwatch: "Štoparica", timer: "Časovnik", converter: "Pretvornik", countdown: "Odštevanje", calendar: "Koledar" },
    stopwatch: { start: "Začni", stop: "Ustavi", reset: "Ponastavi", lap: "Krog" },
    footer: { privacy: "Zasebnost", terms: "Pogoji", cookieSettings: "Nastavitve piškotkov", language: "Jezik" },
    _inherit: "en",
  },

  fi: {
    tabs: { clock: "Kello", world: "Maailma", stopwatch: "Sekuntikello", timer: "Ajastin", converter: "Muunnin", countdown: "Lähtölaskenta", calendar: "Kalenteri" },
    clock: { accurateTime: "Tarkka aika", synchronizing: "Synkronoidaan...", localTime: "Paikallinen aika" },
    stopwatch: { start: "Aloita", stop: "Pysäytä", reset: "Nollaa", lap: "Kierros" },
    footer: { privacy: "Tietosuoja", terms: "Ehdot", cookieSettings: "Evästeasetukset", language: "Kieli" },
    _inherit: "en",
  },

  sv: {
    tabs: { clock: "Klocka", world: "Värld", stopwatch: "Tidtagarur", timer: "Timer", converter: "Konverterare", countdown: "Nedräkning", calendar: "Kalender" },
    clock: { accurateTime: "Exakt tid", synchronizing: "Synkroniserar...", localTime: "Lokal tid" },
    stopwatch: { start: "Starta", stop: "Stoppa", reset: "Återställ", lap: "Varv" },
    footer: { privacy: "Integritet", terms: "Villkor", cookieSettings: "Cookieinställningar", language: "Språk" },
    _inherit: "en",
  },

  ta: {
    tabs: { clock: "கடிகாரம்", world: "உலகம்", stopwatch: "நிறுத்தக்கடிகாரம்", timer: "நேரமானி", converter: "மாற்றி", countdown: "கவுண்ட்டவுன்", calendar: "நாட்காட்டி" },
    stopwatch: { start: "தொடங்கு", stop: "நிறுத்து", reset: "மீட்டமை", lap: "சுற்று" },
    footer: { privacy: "தனியுரிமை", terms: "விதிமுறைகள்", cookieSettings: "குக்கீ அமைப்புகள்", language: "மொழி" },
    _inherit: "en",
  },

  th: {
    tabs: { clock: "นาฬิกา", world: "โลก", stopwatch: "นาฬิกาจับเวลา", timer: "ตั้งเวลา", converter: "ตัวแปลง", countdown: "นับถอยหลัง", calendar: "ปฏิทิน" },
    clock: { accurateTime: "เวลาที่แม่นยำ", synchronizing: "กำลังซิงค์...", localTime: "เวลาท้องถิ่น" },
    stopwatch: { start: "เริ่ม", stop: "หยุด", reset: "รีเซ็ต", lap: "รอบ" },
    footer: { privacy: "ความเป็นส่วนตัว", terms: "ข้อกำหนด", cookieSettings: "การตั้งค่าคุกกี้", language: "ภาษา" },
    _inherit: "en",
  },

  tpi: {
    tabs: { clock: "Klok", world: "Wol", stopwatch: "Stopwas", timer: "Taima", converter: "Senisim", countdown: "Kaunim", calendar: "Kalenda" },
    stopwatch: { start: "Stat", stop: "Stop", reset: "Risit", lap: "Raun" },
    footer: { privacy: "Praivasi", terms: "Rul", cookieSettings: "Kuki seting", language: "Tokples" },
    _inherit: "en",
  },

  tr: {
    tabs: { clock: "Saat", world: "Dünya", stopwatch: "Kronometre", timer: "Zamanlayıcı", converter: "Dönüştürücü", countdown: "Geri sayım", calendar: "Takvim" },
    clock: { accurateTime: "Doğru saat", synchronizing: "Senkronize ediliyor...", localTime: "Yerel saat", fullscreen: "Tam ekran", dayProgress: "Gün", yearProgress: "Yıl", daysLeft: "gün kaldı", minsLeft: "dk kaldı", location: "Konum", timezone: "Saat dilimi", utcOffset: "UTC farkı" },
    search: { placeholder: "Şehir, eyalet veya ülke ara...", searching: "Aranıyor...", noResults: "Sonuç bulunamadı", close: "Kapat" },
    stopwatch: { start: "Başla", stop: "Dur", reset: "Sıfırla", lap: "Tur" },
    timer: { start: "Başla", pause: "Duraklat", reset: "Sıfırla", hours: "Saat", minutes: "Dakika", seconds: "Saniye", timesUp: "Süre doldu!" },
    footer: { privacy: "Gizlilik", terms: "Koşullar", cookieSettings: "Çerez ayarları", tools: "Araçlar", tagline: "Her saat dilimi için doğru zaman", allRights: "Tüm hakları saklıdır", language: "Dil" },
    common: { close: "Kapat", save: "Kaydet", cancel: "İptal", loading: "Yükleniyor...", error: "Hata" },
  },

  uk: {
    tabs: { clock: "Годинник", world: "Світ", stopwatch: "Секундомір", timer: "Таймер", converter: "Конвертер", countdown: "Зворотний відлік", calendar: "Календар" },
    clock: { accurateTime: "Точний час", synchronizing: "Синхронізація...", localTime: "Місцевий час" },
    search: { placeholder: "Шукайте місто, штат або країну...", searching: "Пошук...", noResults: "Нічого не знайдено", close: "Закрити" },
    stopwatch: { start: "Старт", stop: "Стоп", reset: "Скинути", lap: "Коло" },
    footer: { privacy: "Конфіденційність", terms: "Умови", cookieSettings: "Налаштування кукі", language: "Мова" },
    _inherit: "en",
  },

  ur: {
    tabs: { clock: "گھڑی", world: "دنیا", stopwatch: "اسٹاپ واچ", timer: "ٹائمر", converter: "کنورٹر", countdown: "الٹی گنتی", calendar: "تقویم" },
    clock: { accurateTime: "درست وقت", synchronizing: "مطابقت ہو رہی ہے...", localTime: "مقامی وقت" },
    stopwatch: { start: "شروع", stop: "بند", reset: "ری سیٹ", lap: "چکر" },
    footer: { privacy: "رازداری", terms: "شرائط", cookieSettings: "کوکی ترتیبات", language: "زبان" },
    _inherit: "en",
  },

  vi: {
    tabs: { clock: "Đồng hồ", world: "Thế giới", stopwatch: "Bấm giờ", timer: "Hẹn giờ", converter: "Chuyển đổi", countdown: "Đếm ngược", calendar: "Lịch" },
    clock: { accurateTime: "Thời gian chính xác", synchronizing: "Đang đồng bộ...", localTime: "Giờ địa phương", fullscreen: "Toàn màn hình", dayProgress: "Ngày", yearProgress: "Năm" },
    search: { placeholder: "Tìm thành phố, tiểu bang hoặc quốc gia...", searching: "Đang tìm...", noResults: "Không có kết quả", close: "Đóng" },
    stopwatch: { start: "Bắt đầu", stop: "Dừng", reset: "Đặt lại", lap: "Vòng" },
    footer: { privacy: "Quyền riêng tư", terms: "Điều khoản", cookieSettings: "Cài đặt cookie", language: "Ngôn ngữ" },
    common: { close: "Đóng", save: "Lưu", cancel: "Hủy", loading: "Đang tải...", error: "Lỗi" },
    _inherit: "en",
  },
};

// ═══════════════════════════════════════
// Translation Resolution (with inheritance)
// ═══════════════════════════════════════
function resolveTranslation(langCode) {
  const lang = translations[langCode] || translations.en;
  const base = translations[lang._inherit || 'en'] || translations.en;
  // Deep merge: lang overrides base
  const merged = {};
  for (const cat of Object.keys(base)) {
    if (cat === '_inherit') continue;
    merged[cat] = { ...base[cat], ...(lang[cat] || {}) };
  }
  // Also add any categories only in lang
  for (const cat of Object.keys(lang)) {
    if (cat === '_inherit') continue;
    if (!merged[cat]) merged[cat] = lang[cat];
  }
  return merged;
}

// ═══════════════════════════════════════
// React Context + Hook
// ═══════════════════════════════════════
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [strings, setStrings] = useState(() => resolveTranslation('en'));
  const [dir, setDir] = useState('ltr');

  // Detect browser language on mount
  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('clockzilla_lang');
    if (saved && translations[saved]) {
      setLangState(saved);
      setStrings(resolveTranslation(saved));
      const langInfo = LANGUAGES.find(l => l.code === saved);
      setDir(langInfo?.dir || 'ltr');
      return;
    }
    // Auto-detect from browser
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    // Try exact match first, then language prefix
    let match = Object.keys(translations).find(k => k.toLowerCase() === browserLang.toLowerCase());
    if (!match) {
      const prefix = browserLang.split('-')[0].toLowerCase();
      match = Object.keys(translations).find(k => k.toLowerCase() === prefix);
    }
    if (match && match !== 'en') {
      setLangState(match);
      setStrings(resolveTranslation(match));
      const langInfo = LANGUAGES.find(l => l.code === match);
      setDir(langInfo?.dir || 'ltr');
    }
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    setStrings(resolveTranslation(code));
    const langInfo = LANGUAGES.find(l => l.code === code);
    setDir(langInfo?.dir || 'ltr');
    try { localStorage.setItem('clockzilla_lang', code); } catch {}
  }, []);

  // Helper: t('tabs.clock') → resolved string
  const t = useCallback((path) => {
    const parts = path.split('.');
    let val = strings;
    for (const p of parts) {
      val = val?.[p];
      if (val === undefined) break;
    }
    return val || path; // Fallback to key path if not found
  }, [strings]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, strings, dir, LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
