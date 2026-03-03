"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import useTimeSync from "@/hooks/useTimeSync";
import { searchCities } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import LanguageSelector from "@/components/LanguageSelector";

const WORLD_CLOCKS = [
  { city: "New York", tz: "America/New_York", emoji: "🗽", country: "US" },
  { city: "London", tz: "Europe/London", emoji: "🇬🇧", country: "UK" },
  { city: "Paris", tz: "Europe/Paris", emoji: "🗼", country: "FR" },
  { city: "Dubai", tz: "Asia/Dubai", emoji: "🏙️", country: "AE" },
  { city: "Mumbai", tz: "Asia/Kolkata", emoji: "🇮🇳", country: "IN" },
  { city: "Tokyo", tz: "Asia/Tokyo", emoji: "🗾", country: "JP" },
  { city: "Sydney", tz: "Australia/Sydney", emoji: "🇦🇺", country: "AU" },
  { city: "São Paulo", tz: "America/Sao_Paulo", emoji: "🇧🇷", country: "BR" },
  { city: "Los Angeles", tz: "America/Los_Angeles", emoji: "🌴", country: "US" },
  { city: "Singapore", tz: "Asia/Singapore", emoji: "🇸🇬", country: "SG" },
  { city: "Berlin", tz: "Europe/Berlin", emoji: "🇩🇪", country: "DE" },
  { city: "Moscow", tz: "Europe/Moscow", emoji: "🇷🇺", country: "RU" },
];

const QUOTES = [
  { text: "Time flies over us, but leaves its shadow behind.", author: "Nathaniel Hawthorne" },
  { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
  { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
  { text: "Lost time is never found again.", author: "Benjamin Franklin" },
  { text: "Time is the wisest counselor of all.", author: "Pericles" },
  { text: "Better three hours too soon than a minute too late.", author: "William Shakespeare" },
];

/* ══════════ THEMES ══════════ */
const THEMES = {
  earth: {
    name: "Earth", icon: "🌿",
    bg: "#F5F0EA", bgSub: "#EDE6DC", card: "#FFFFFF",
    border: "#E0D5C4", borderLight: "#EDE6DC",
    text: "#3B3228", textSoft: "#7A6E5D", textMuted: "#A89F91",
    accent: "#B87333", accentSoft: "rgba(184,115,51,0.12)",
    secondary: "#7D8B6A", secondarySoft: "rgba(125,139,106,0.12)",
    warn: "#C17C5A", success: "#6B8E5A", danger: "#C15A5A",
    gradientBar: "linear-gradient(90deg, #B87333, #C4956A, #7D8B6A, #D4C5A9)",
    clockFace: "#FFFFFF", clockMarker: "#3B3228", clockMarkerSoft: "#E0D5C4",
    clockHour: "#3B3228", clockMin: "#7A6E5D", clockSec: "#B87333", clockCenter: "#B87333",
    dotDay: "#C4956A", dotNight: "#9B9082",
    shadow: "rgba(60,50,40,0.05)",
  },
  midnight: {
    name: "Midnight", icon: "🌙",
    bg: "#0F1117", bgSub: "#181B25", card: "#1E2130",
    border: "#2A2E3F", borderLight: "#232738",
    text: "#E4E6EF", textSoft: "#9BA1B7", textMuted: "#5F6580",
    accent: "#7B93FF", accentSoft: "rgba(123,147,255,0.12)",
    secondary: "#65DCB8", secondarySoft: "rgba(101,220,184,0.12)",
    warn: "#FFB86B", success: "#65DCB8", danger: "#FF7B7B",
    gradientBar: "linear-gradient(90deg, #7B93FF, #A78BFA, #65DCB8, #7B93FF)",
    clockFace: "#1E2130", clockMarker: "#E4E6EF", clockMarkerSoft: "#2A2E3F",
    clockHour: "#E4E6EF", clockMin: "#9BA1B7", clockSec: "#7B93FF", clockCenter: "#7B93FF",
    dotDay: "#65DCB8", dotNight: "#5F6580",
    shadow: "rgba(0,0,0,0.2)",
  },
  ocean: {
    name: "Ocean", icon: "🌊",
    bg: "#F0F7FA", bgSub: "#E3EFF5", card: "#FFFFFF",
    border: "#C8DDE8", borderLight: "#E3EFF5",
    text: "#1A3A4A", textSoft: "#4A7A8A", textMuted: "#8AB0BF",
    accent: "#0E8BA0", accentSoft: "rgba(14,139,160,0.10)",
    secondary: "#E8853D", secondarySoft: "rgba(232,133,61,0.10)",
    warn: "#E8853D", success: "#2A9D6E", danger: "#D95555",
    gradientBar: "linear-gradient(90deg, #0E8BA0, #3CBFCF, #E8853D, #0E8BA0)",
    clockFace: "#FFFFFF", clockMarker: "#1A3A4A", clockMarkerSoft: "#C8DDE8",
    clockHour: "#1A3A4A", clockMin: "#4A7A8A", clockSec: "#0E8BA0", clockCenter: "#0E8BA0",
    dotDay: "#3CBFCF", dotNight: "#8AB0BF",
    shadow: "rgba(20,60,80,0.05)",
  },
  rose: {
    name: "Rosé", icon: "🌸",
    bg: "#FBF5F3", bgSub: "#F5EDED", card: "#FFFFFF",
    border: "#E8D5D0", borderLight: "#F2E6E2",
    text: "#3D2B2B", textSoft: "#8A6A6A", textMuted: "#BFA0A0",
    accent: "#C0616B", accentSoft: "rgba(192,97,107,0.10)",
    secondary: "#8B7EC8", secondarySoft: "rgba(139,126,200,0.10)",
    warn: "#D97B4A", success: "#6B9E6B", danger: "#C0616B",
    gradientBar: "linear-gradient(90deg, #C0616B, #E8A0A0, #8B7EC8, #C0616B)",
    clockFace: "#FFFFFF", clockMarker: "#3D2B2B", clockMarkerSoft: "#E8D5D0",
    clockHour: "#3D2B2B", clockMin: "#8A6A6A", clockSec: "#C0616B", clockCenter: "#C0616B",
    dotDay: "#E8A0A0", dotNight: "#BFA0A0",
    shadow: "rgba(60,30,30,0.04)",
  },
  noir: {
    name: "Noir", icon: "🖤",
    bg: "#111111", bgSub: "#1A1A1A", card: "#222222",
    border: "#333333", borderLight: "#2A2A2A",
    text: "#F0F0F0", textSoft: "#AAAAAA", textMuted: "#666666",
    accent: "#F0F0F0", accentSoft: "rgba(240,240,240,0.08)",
    secondary: "#888888", secondarySoft: "rgba(136,136,136,0.10)",
    warn: "#DDDD55", success: "#66DD88", danger: "#FF6B6B",
    gradientBar: "linear-gradient(90deg, #F0F0F0, #888888, #555555, #F0F0F0)",
    clockFace: "#222222", clockMarker: "#F0F0F0", clockMarkerSoft: "#333333",
    clockHour: "#F0F0F0", clockMin: "#AAAAAA", clockSec: "#F0F0F0", clockCenter: "#F0F0F0",
    dotDay: "#AAAAAA", dotNight: "#555555",
    shadow: "rgba(0,0,0,0.3)",
  },
  sunset: {
    name: "Sunset", icon: "🌅",
    bg: "#1A1015", bgSub: "#241820", card: "#2E1F28",
    border: "#4A3040", borderLight: "#3A2533",
    text: "#F5E0D0", textSoft: "#C8A090", textMuted: "#7A5A5A",
    accent: "#F0924A", accentSoft: "rgba(240,146,74,0.14)",
    secondary: "#E05A8A", secondarySoft: "rgba(224,90,138,0.12)",
    warn: "#F0C24A", success: "#6ACD8A", danger: "#E05A5A",
    gradientBar: "linear-gradient(90deg, #F0924A, #E05A8A, #A040C0, #F0924A)",
    clockFace: "#2E1F28", clockMarker: "#F5E0D0", clockMarkerSoft: "#4A3040",
    clockHour: "#F5E0D0", clockMin: "#C8A090", clockSec: "#F0924A", clockCenter: "#F0924A",
    dotDay: "#F0924A", dotNight: "#7A5A5A",
    shadow: "rgba(0,0,0,0.3)",
  },
};

/* ── Helpers ── */
function getTimeInTZ(tz) { return new Date(new Date().toLocaleString("en-US", { timeZone: tz })); }
function getTZAbbr(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(date || new Date());
    const tzPart = parts.find(p => p.type === "timeZoneName");
    return tzPart ? tzPart.value : tz.split("/").pop().replace(/_/g, " ");
  } catch { return tz.split("/").pop().replace(/_/g, " "); }
}
function getTZLong(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "long" }).formatToParts(date || new Date());
    const tzPart = parts.find(p => p.type === "timeZoneName");
    return tzPart ? tzPart.value : tz.split("/").pop().replace(/_/g, " ");
  } catch { return tz.split("/").pop().replace(/_/g, " "); }
}
function getTZUtcOffset(tz, date) {
  try {
    const d = date || new Date();
    const utcStr = d.toLocaleString("en-US", { timeZone: "UTC" });
    const tzStr = d.toLocaleString("en-US", { timeZone: tz });
    const diffMs = new Date(tzStr) - new Date(utcStr);
    const diffMin = Math.round(diffMs / 60000);
    const sign = diffMin >= 0 ? "+" : "-";
    const absMin = Math.abs(diffMin);
    const h = Math.floor(absMin / 60);
    const m = absMin % 60;
    return m > 0 ? `UTC${sign}${h}:${m.toString().padStart(2, "0")}` : `UTC${sign}${h}`;
  } catch { return ""; }
}
function getTZFull(tz, date) {
  const long = getTZLong(tz, date);
  const abbr = getTZAbbr(tz, date);
  const utc = getTZUtcOffset(tz, date);
  // Avoid duplication if long and abbr are the same (some browsers)
  if (long === abbr) return `${long}, ${utc}`;
  return `${long} (${abbr}, ${utc})`;
}
function formatTime(date, showSeconds = true) {
  const hr = date.getHours() % 12 || 12;
  const h = hr.toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}
function getDayProgress(date) { return ((date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400) * 100; }
function getYearProgress() {
  const now = new Date(); const s = new Date(now.getFullYear(), 0, 1); const e = new Date(now.getFullYear() + 1, 0, 1);
  return ((now - s) / (e - s)) * 100;
}
function isNight(date) { const h = date.getHours(); return h < 6 || h >= 20; }

/* ---- USER LOCATION DETECTION ---- */
// Complete offline timezone → location map (no API needed)
const TZ_LOCATION = {
  // USA
  "America/New_York": { city: "New York", state: "New York", country: "United States", cc: "US", lat: 40.7, lng: -74 },
  "America/Chicago": { city: "Chicago", state: "Illinois", country: "United States", cc: "US", lat: 41.9, lng: -87.6 },
  "America/Denver": { city: "Denver", state: "Colorado", country: "United States", cc: "US", lat: 39.7, lng: -105 },
  "America/Los_Angeles": { city: "Los Angeles", state: "California", country: "United States", cc: "US", lat: 34.1, lng: -118.2 },
  "America/Phoenix": { city: "Phoenix", state: "Arizona", country: "United States", cc: "US", lat: 33.4, lng: -112.1 },
  "America/Anchorage": { city: "Anchorage", state: "Alaska", country: "United States", cc: "US", lat: 61.2, lng: -149.9 },
  "Pacific/Honolulu": { city: "Honolulu", state: "Hawaii", country: "United States", cc: "US", lat: 21.3, lng: -157.8 },
  "America/Detroit": { city: "Detroit", state: "Michigan", country: "United States", cc: "US", lat: 42.3, lng: -83.0 },
  "America/Indiana/Indianapolis": { city: "Indianapolis", state: "Indiana", country: "United States", cc: "US", lat: 39.8, lng: -86.2 },
  "America/Indianapolis": { city: "Indianapolis", state: "Indiana", country: "United States", cc: "US", lat: 39.8, lng: -86.2 },
  "America/Boise": { city: "Boise", state: "Idaho", country: "United States", cc: "US", lat: 43.6, lng: -116.2 },
  "America/Juneau": { city: "Juneau", state: "Alaska", country: "United States", cc: "US", lat: 58.3, lng: -134.4 },
  "America/Adak": { city: "Adak", state: "Alaska", country: "United States", cc: "US", lat: 51.9, lng: -176.6 },
  "America/Nome": { city: "Nome", state: "Alaska", country: "United States", cc: "US", lat: 64.5, lng: -165.4 },
  "America/Menominee": { city: "Menominee", state: "Michigan", country: "United States", cc: "US", lat: 45.1, lng: -87.6 },
  "America/Kentucky/Louisville": { city: "Louisville", state: "Kentucky", country: "United States", cc: "US", lat: 38.3, lng: -85.8 },
  "America/North_Dakota/Center": { city: "Center", state: "North Dakota", country: "United States", cc: "US", lat: 47.1, lng: -101.3 },
  // Canada
  "America/Toronto": { city: "Toronto", state: "Ontario", country: "Canada", cc: "CA", lat: 43.7, lng: -79.4 },
  "America/Vancouver": { city: "Vancouver", state: "British Columbia", country: "Canada", cc: "CA", lat: 49.3, lng: -123.1 },
  "America/Winnipeg": { city: "Winnipeg", state: "Manitoba", country: "Canada", cc: "CA", lat: 49.9, lng: -97.1 },
  "America/Edmonton": { city: "Edmonton", state: "Alberta", country: "Canada", cc: "CA", lat: 53.5, lng: -113.5 },
  "America/Halifax": { city: "Halifax", state: "Nova Scotia", country: "Canada", cc: "CA", lat: 44.6, lng: -63.6 },
  "America/St_Johns": { city: "St. John's", state: "Newfoundland", country: "Canada", cc: "CA", lat: 47.6, lng: -52.7 },
  "America/Regina": { city: "Regina", state: "Saskatchewan", country: "Canada", cc: "CA", lat: 50.4, lng: -104.6 },
  // Latin America
  "America/Mexico_City": { city: "Mexico City", state: "", country: "Mexico", cc: "MX", lat: 19.4, lng: -99.1 },
  "America/Cancun": { city: "Cancun", state: "Quintana Roo", country: "Mexico", cc: "MX", lat: 21.2, lng: -86.8 },
  "America/Tijuana": { city: "Tijuana", state: "Baja California", country: "Mexico", cc: "MX", lat: 32.5, lng: -117.0 },
  "America/Sao_Paulo": { city: "S\u00e3o Paulo", state: "", country: "Brazil", cc: "BR", lat: -23.5, lng: -46.6 },
  "America/Argentina/Buenos_Aires": { city: "Buenos Aires", state: "", country: "Argentina", cc: "AR", lat: -34.6, lng: -58.4 },
  "America/Bogota": { city: "Bogot\u00e1", state: "", country: "Colombia", cc: "CO", lat: 4.7, lng: -74.1 },
  "America/Lima": { city: "Lima", state: "", country: "Peru", cc: "PE", lat: -12.0, lng: -77.0 },
  "America/Santiago": { city: "Santiago", state: "", country: "Chile", cc: "CL", lat: -33.4, lng: -70.6 },
  "America/Caracas": { city: "Caracas", state: "", country: "Venezuela", cc: "VE", lat: 10.5, lng: -66.9 },
  "America/Guayaquil": { city: "Guayaquil", state: "", country: "Ecuador", cc: "EC", lat: -2.2, lng: -79.9 },
  "America/Havana": { city: "Havana", state: "", country: "Cuba", cc: "CU", lat: 23.1, lng: -82.4 },
  "America/Panama": { city: "Panama City", state: "", country: "Panama", cc: "PA", lat: 9.0, lng: -79.5 },
  "America/Costa_Rica": { city: "San Jos\u00e9", state: "", country: "Costa Rica", cc: "CR", lat: 9.9, lng: -84.1 },
  // Europe
  "Europe/London": { city: "London", state: "England", country: "United Kingdom", cc: "GB", lat: 51.5, lng: -0.1 },
  "Europe/Paris": { city: "Paris", state: "", country: "France", cc: "FR", lat: 48.9, lng: 2.3 },
  "Europe/Berlin": { city: "Berlin", state: "", country: "Germany", cc: "DE", lat: 52.5, lng: 13.4 },
  "Europe/Madrid": { city: "Madrid", state: "", country: "Spain", cc: "ES", lat: 40.4, lng: -3.7 },
  "Europe/Rome": { city: "Rome", state: "", country: "Italy", cc: "IT", lat: 41.9, lng: 12.5 },
  "Europe/Amsterdam": { city: "Amsterdam", state: "", country: "Netherlands", cc: "NL", lat: 52.4, lng: 4.9 },
  "Europe/Brussels": { city: "Brussels", state: "", country: "Belgium", cc: "BE", lat: 50.8, lng: 4.4 },
  "Europe/Vienna": { city: "Vienna", state: "", country: "Austria", cc: "AT", lat: 48.2, lng: 16.4 },
  "Europe/Zurich": { city: "Zurich", state: "", country: "Switzerland", cc: "CH", lat: 47.4, lng: 8.5 },
  "Europe/Stockholm": { city: "Stockholm", state: "", country: "Sweden", cc: "SE", lat: 59.3, lng: 18.1 },
  "Europe/Oslo": { city: "Oslo", state: "", country: "Norway", cc: "NO", lat: 59.9, lng: 10.8 },
  "Europe/Copenhagen": { city: "Copenhagen", state: "", country: "Denmark", cc: "DK", lat: 55.7, lng: 12.6 },
  "Europe/Helsinki": { city: "Helsinki", state: "", country: "Finland", cc: "FI", lat: 60.2, lng: 24.9 },
  "Europe/Warsaw": { city: "Warsaw", state: "", country: "Poland", cc: "PL", lat: 52.2, lng: 21.0 },
  "Europe/Prague": { city: "Prague", state: "", country: "Czech Republic", cc: "CZ", lat: 50.1, lng: 14.4 },
  "Europe/Budapest": { city: "Budapest", state: "", country: "Hungary", cc: "HU", lat: 47.5, lng: 19.0 },
  "Europe/Bucharest": { city: "Bucharest", state: "", country: "Romania", cc: "RO", lat: 44.4, lng: 26.1 },
  "Europe/Athens": { city: "Athens", state: "", country: "Greece", cc: "GR", lat: 37.98, lng: 23.7 },
  "Europe/Istanbul": { city: "Istanbul", state: "", country: "Turkey", cc: "TR", lat: 41.0, lng: 29.0 },
  "Europe/Moscow": { city: "Moscow", state: "", country: "Russia", cc: "RU", lat: 55.8, lng: 37.6 },
  "Europe/Kiev": { city: "Kyiv", state: "", country: "Ukraine", cc: "UA", lat: 50.4, lng: 30.5 },
  "Europe/Kyiv": { city: "Kyiv", state: "", country: "Ukraine", cc: "UA", lat: 50.4, lng: 30.5 },
  "Europe/Lisbon": { city: "Lisbon", state: "", country: "Portugal", cc: "PT", lat: 38.7, lng: -9.1 },
  "Europe/Dublin": { city: "Dublin", state: "", country: "Ireland", cc: "IE", lat: 53.3, lng: -6.3 },
  "Europe/Belgrade": { city: "Belgrade", state: "", country: "Serbia", cc: "RS", lat: 44.8, lng: 20.5 },
  "Europe/Zagreb": { city: "Zagreb", state: "", country: "Croatia", cc: "HR", lat: 45.8, lng: 16.0 },
  "Europe/Sofia": { city: "Sofia", state: "", country: "Bulgaria", cc: "BG", lat: 42.7, lng: 23.3 },
  "Europe/Riga": { city: "Riga", state: "", country: "Latvia", cc: "LV", lat: 56.9, lng: 24.1 },
  "Europe/Tallinn": { city: "Tallinn", state: "", country: "Estonia", cc: "EE", lat: 59.4, lng: 24.7 },
  "Europe/Vilnius": { city: "Vilnius", state: "", country: "Lithuania", cc: "LT", lat: 54.7, lng: 25.3 },
  // Asia
  "Asia/Tokyo": { city: "Tokyo", state: "", country: "Japan", cc: "JP", lat: 35.7, lng: 139.7 },
  "Asia/Shanghai": { city: "Shanghai", state: "", country: "China", cc: "CN", lat: 31.2, lng: 121.5 },
  "Asia/Hong_Kong": { city: "Hong Kong", state: "", country: "Hong Kong", cc: "HK", lat: 22.3, lng: 114.2 },
  "Asia/Singapore": { city: "Singapore", state: "", country: "Singapore", cc: "SG", lat: 1.3, lng: 103.8 },
  "Asia/Seoul": { city: "Seoul", state: "", country: "South Korea", cc: "KR", lat: 37.6, lng: 127.0 },
  "Asia/Taipei": { city: "Taipei", state: "", country: "Taiwan", cc: "TW", lat: 25.0, lng: 121.5 },
  "Asia/Bangkok": { city: "Bangkok", state: "", country: "Thailand", cc: "TH", lat: 13.8, lng: 100.5 },
  "Asia/Jakarta": { city: "Jakarta", state: "", country: "Indonesia", cc: "ID", lat: -6.2, lng: 106.8 },
  "Asia/Kolkata": { city: "Mumbai", state: "Maharashtra", country: "India", cc: "IN", lat: 19.1, lng: 72.9 },
  "Asia/Calcutta": { city: "Kolkata", state: "West Bengal", country: "India", cc: "IN", lat: 22.6, lng: 88.4 },
  "Asia/Dubai": { city: "Dubai", state: "", country: "United Arab Emirates", cc: "AE", lat: 25.2, lng: 55.3 },
  "Asia/Riyadh": { city: "Riyadh", state: "", country: "Saudi Arabia", cc: "SA", lat: 24.7, lng: 46.7 },
  "Asia/Tehran": { city: "Tehran", state: "", country: "Iran", cc: "IR", lat: 35.7, lng: 51.4 },
  "Asia/Karachi": { city: "Karachi", state: "Sindh", country: "Pakistan", cc: "PK", lat: 24.9, lng: 67.0 },
  "Asia/Dhaka": { city: "Dhaka", state: "", country: "Bangladesh", cc: "BD", lat: 23.8, lng: 90.4 },
  "Asia/Kuala_Lumpur": { city: "Kuala Lumpur", state: "", country: "Malaysia", cc: "MY", lat: 3.1, lng: 101.7 },
  "Asia/Manila": { city: "Manila", state: "", country: "Philippines", cc: "PH", lat: 14.6, lng: 121.0 },
  "Asia/Colombo": { city: "Colombo", state: "", country: "Sri Lanka", cc: "LK", lat: 6.9, lng: 79.9 },
  "Asia/Ho_Chi_Minh": { city: "Ho Chi Minh City", state: "", country: "Vietnam", cc: "VN", lat: 10.8, lng: 106.7 },
  "Asia/Yangon": { city: "Yangon", state: "", country: "Myanmar", cc: "MM", lat: 16.9, lng: 96.2 },
  "Asia/Kathmandu": { city: "Kathmandu", state: "", country: "Nepal", cc: "NP", lat: 27.7, lng: 85.3 },
  "Asia/Baghdad": { city: "Baghdad", state: "", country: "Iraq", cc: "IQ", lat: 33.3, lng: 44.4 },
  "Asia/Jerusalem": { city: "Jerusalem", state: "", country: "Israel", cc: "IL", lat: 31.8, lng: 35.2 },
  "Asia/Beirut": { city: "Beirut", state: "", country: "Lebanon", cc: "LB", lat: 33.9, lng: 35.5 },
  "Asia/Almaty": { city: "Almaty", state: "", country: "Kazakhstan", cc: "KZ", lat: 43.2, lng: 76.9 },
  "Asia/Tashkent": { city: "Tashkent", state: "", country: "Uzbekistan", cc: "UZ", lat: 41.3, lng: 69.3 },
  // Australia & Pacific
  "Australia/Sydney": { city: "Sydney", state: "New South Wales", country: "Australia", cc: "AU", lat: -33.9, lng: 151.2 },
  "Australia/Melbourne": { city: "Melbourne", state: "Victoria", country: "Australia", cc: "AU", lat: -37.8, lng: 145.0 },
  "Australia/Brisbane": { city: "Brisbane", state: "Queensland", country: "Australia", cc: "AU", lat: -27.5, lng: 153.0 },
  "Australia/Perth": { city: "Perth", state: "Western Australia", country: "Australia", cc: "AU", lat: -31.9, lng: 115.9 },
  "Australia/Adelaide": { city: "Adelaide", state: "South Australia", country: "Australia", cc: "AU", lat: -34.9, lng: 138.6 },
  "Australia/Hobart": { city: "Hobart", state: "Tasmania", country: "Australia", cc: "AU", lat: -42.9, lng: 147.3 },
  "Australia/Darwin": { city: "Darwin", state: "Northern Territory", country: "Australia", cc: "AU", lat: -12.5, lng: 130.8 },
  "Pacific/Auckland": { city: "Auckland", state: "", country: "New Zealand", cc: "NZ", lat: -36.9, lng: 174.8 },
  "Pacific/Fiji": { city: "Suva", state: "", country: "Fiji", cc: "FJ", lat: -18.1, lng: 178.4 },
  "Pacific/Guam": { city: "Hagatna", state: "Guam", country: "United States", cc: "US", lat: 13.4, lng: 144.7 },
  // Africa
  "Africa/Cairo": { city: "Cairo", state: "", country: "Egypt", cc: "EG", lat: 30.0, lng: 31.2 },
  "Africa/Lagos": { city: "Lagos", state: "", country: "Nigeria", cc: "NG", lat: 6.5, lng: 3.4 },
  "Africa/Johannesburg": { city: "Johannesburg", state: "Gauteng", country: "South Africa", cc: "ZA", lat: -26.2, lng: 28.0 },
  "Africa/Nairobi": { city: "Nairobi", state: "", country: "Kenya", cc: "KE", lat: -1.3, lng: 36.8 },
  "Africa/Casablanca": { city: "Casablanca", state: "", country: "Morocco", cc: "MA", lat: 33.6, lng: -7.6 },
  "Africa/Accra": { city: "Accra", state: "", country: "Ghana", cc: "GH", lat: 5.6, lng: -0.2 },
  "Africa/Addis_Ababa": { city: "Addis Ababa", state: "", country: "Ethiopia", cc: "ET", lat: 9.0, lng: 38.7 },
  "Africa/Dar_es_Salaam": { city: "Dar es Salaam", state: "", country: "Tanzania", cc: "TZ", lat: -6.8, lng: 39.3 },
  "Africa/Tunis": { city: "Tunis", state: "", country: "Tunisia", cc: "TN", lat: 36.8, lng: 10.2 },
  "Africa/Algiers": { city: "Algiers", state: "", country: "Algeria", cc: "DZ", lat: 36.8, lng: 3.1 },
};

function useUserLocation() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const info = TZ_LOCATION[tz];

  // Build display immediately from timezone — this ALWAYS works, no API needed
  const initCity = info ? info.city : tz.split("/").pop().replace(/_/g, " ");
  const initState = info ? info.state : "";
  const initCountry = info ? info.country : "";
  const initCC = info ? info.cc : "";
  const initLat = info ? info.lat : 38.9;
  const initLng = info ? info.lng : -77.4;

  const buildDisplayName = (city, state, country, cc) => {
    if (!city) return initCity;
    if (cc === "US" || cc === "CA" || cc === "AU") {
      return state ? `${city}, ${state}` : city;
    }
    return country ? `${city}, ${country}` : city;
  };

  const [location, setLocation] = useState({
    city: initCity,
    state: initState,
    country: initCountry,
    countryCode: initCC,
    lat: initLat,
    lng: initLng,
    tz,
    source: "timezone",
    displayName: buildDisplayName(initCity, initState, initCountry, initCC),
  });

  // Optional GPS refinement for more precise sunrise/sunset
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: "gps",
        }));
      },
      () => {},
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  // Try IP geolocation in background to get more precise city
  useEffect(() => {
    const tryIpGeo = async () => {
      const apis = [
        async () => {
          const r = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined });
          const d = await r.json();
          return d.city ? { city: d.city, state: d.region || "", country: d.country_name || "", cc: d.country_code || "", lat: d.latitude, lng: d.longitude } : null;
        },
        async () => {
          const r = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined });
          const d = await r.json();
          return (d.success !== false && d.city) ? { city: d.city, state: d.region || "", country: d.country || "", cc: d.country_code || "", lat: d.latitude, lng: d.longitude } : null;
        },
      ];
      for (const api of apis) {
        try {
          const r = await api();
          if (r) {
            setLocation(prev => {
              if (prev.source === "gps") return { ...prev }; // GPS already active, keep it
              return {
                ...prev,
                city: r.city, state: r.state, country: r.country, countryCode: r.cc,
                lat: r.lat, lng: r.lng,
                displayName: buildDisplayName(r.city, r.state, r.country, r.cc),
                source: "ip-geo",
              };
            });
            return;
          }
        } catch (e) {}
      }
      // All APIs failed — timezone data already showing, that's fine
    };

    tryIpGeo();

    // Also silently try GPS if already granted
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then(result => {
        if (result.state === "granted") {
          requestLocation();
        }
      }).catch(() => {});
    }
  }, []);

  return { ...location, requestLocation };
}

/* ---- Location Permission Banner ---- */
function LocationBanner({ userLoc, t }) {
  const { t: tr } = useI18n();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || userLoc.source === "gps") return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${t.accentSoft}, ${t.secondarySoft || t.accentSoft})`,
      border: `1.5px solid ${t.accent}30`, borderRadius: 16,
      padding: "14px 20px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ fontSize: 28 }}>📍</div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 2 }}>
          {tr("loc.shareTitle")}
        </div>
        <div style={{ fontSize: 14, color: t.textSoft, lineHeight: 1.5 }}>
          {tr("loc.shareDesc").replace("{city}", userLoc.displayName)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={userLoc.requestLocation} style={{
          background: t.accent, color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 22px", cursor: "pointer", fontSize: 14, fontWeight: 700,
          fontFamily: "'Outfit', sans-serif", transition: "opacity 0.2s",
        }}>{tr("loc.shareBtn")}</button>
        <button onClick={() => setDismissed(true)} style={{
          background: "transparent", color: t.textMuted, border: `1.5px solid ${t.border}`,
          borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 14,
          fontWeight: 600, fontFamily: "'Outfit', sans-serif",
        }}>{tr("loc.dismiss")}</button>
      </div>
    </div>
  );
}



/* ---- TIME SYNC ENGINE (Backend-Proxied NTP-style) ----
 *
 * Architecture: Browser → Backend Proxy (cached 3s) → External APIs
 * Tier 1 (Primary):   TimeAPI.io - reliable public time API
 * Tier 2 (Fallback):  Cloudflare CDN - Unix timestamp from /cdn-cgi/trace
 *
 * The backend fetches upstream time and caches it for 3 seconds.
 * All visitors share the same cached result, preventing rate limits.
 *
 * Approach per sample:
 *   t1 = local time before request (Date.now + performance.now for precision)
 *   t4 = local time after response
 *   rtt = t4 - t1
 *   offset = serverTime - (t1 + rtt/2)
 *
 * Multiple rounds, outlier removal via MAD, RTT-weighted mean.
 */

const SYNC_SOURCES = {
  timeapi:      { name: "TimeAPI.io",    tier: 1, icon: "🕐", desc: "Primary time source (via backend proxy)" },
  cloudflare:   { name: "Cloudflare",    tier: 2, icon: "☁️", desc: "CDN timestamp fallback (via backend proxy)" },
};


/* ── Analog Clock ── */
function AnalogClock({ date, size = 240, t }) {
  const s = date.getSeconds() + date.getMilliseconds() / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;
  const cx = size / 2, cy = size / 2;
  const hand = (angle, len, w, color) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return <line x1={cx} y1={cy} x2={cx + len * Math.cos(rad)} y2={cy + len * Math.sin(rad)}
      stroke={color} strokeWidth={w} strokeLinecap="round" />;
  };
  const markers = Array.from({ length: 60 }, (_, i) => {
    const angle = ((i / 60) * 360 - 90) * Math.PI / 180;
    const isHour = i % 5 === 0;
    const r1 = size * (isHour ? 0.37 : 0.41), r2 = size * 0.44;
    return <line key={i} x1={cx + r1 * Math.cos(angle)} y1={cy + r1 * Math.sin(angle)}
      x2={cx + r2 * Math.cos(angle)} y2={cy + r2 * Math.sin(angle)}
      stroke={isHour ? t.clockMarker : t.clockMarkerSoft} strokeWidth={isHour ? 2.2 : 0.8} strokeLinecap="round" />;
  });
  const hourNums = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = ((i / 12) * 360 - 90) * Math.PI / 180;
    const r = size * 0.31;
    return <text key={i} x={cx + r * Math.cos(angle)} y={cy + r * Math.sin(angle)}
      textAnchor="middle" dominantBaseline="central"
      fill={t.textSoft} fontSize={size * 0.058} fontFamily="'Outfit', sans-serif" fontWeight="500">{num}</text>;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={size * 0.47} fill={t.clockFace} stroke={t.border} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={size * 0.455} fill="none" stroke={t.borderLight} strokeWidth="0.5" />
      {markers}{hourNums}
      {hand((h / 12) * 360, size * 0.21, 4.5, t.clockHour)}
      {hand((m / 60) * 360, size * 0.3, 3, t.clockMin)}
      {hand((s / 60) * 360, size * 0.35, 1.2, t.clockSec)}
      <circle cx={cx} cy={cy} r={5} fill={t.clockCenter} />
      <circle cx={cx} cy={cy} r={2.5} fill={t.clockFace} />
    </svg>
  );
}

/* ── Sync Status Badge ── */
function SyncBadge({ sync, t, onResync }) {
  const { t: tr } = useI18n();
  const statusColor = sync.syncStatus === "synced" ? t.success : sync.syncStatus === "syncing" ? t.warn : t.danger;
  const statusLabel = sync.syncStatus === "synced" ? tr("sync.synced") : sync.syncStatus === "syncing" ? tr("sync.syncing") : tr("sync.offline");
  const okCount = Object.values(sync.sourceResults || {}).filter(s => s.status === "ok").length;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, background: t.bgSub,
      border: `1.5px solid ${t.borderLight}`, borderRadius: 10, padding: "6px 14px",
      fontSize: 12, fontWeight: 600, cursor: "pointer",
    }} onClick={onResync} title={tr("sync.clickResync")}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%", background: statusColor,
        boxShadow: `0 0 6px ${statusColor}`,
        animation: sync.syncStatus === "syncing" ? "pulse 1s infinite" : "none",
      }} />
      <span style={{ color: t.textSoft }}>{statusLabel}</span>
      {sync.syncStatus === "synced" && okCount > 0 && (
        <span style={{ color: t.textMuted, fontSize: 10 }}>{okCount} {okCount !== 1 ? tr("sync.sources") : tr("sync.source")}</span>
      )}
      {sync.accuracy !== null && (
        <span style={{ color: t.textMuted, fontSize: 10 }}>±{Math.round(sync.accuracy)}ms</span>
      )}
    </div>
  );
}

/* ── Offset Display (the hero feature) ── */
function OffsetHero({ offset, accuracy, syncStatus, sourceResults, samples, t }) {
  const { t: tr } = useI18n();
  if (syncStatus === "syncing" && offset === null) {
    return (
      <div style={{
        background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`,
        padding: "28px 24px", textAlign: "center", boxShadow: `0 2px 12px ${t.shadow}`,
      }}>
        <div style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>
          <span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>{tr("sync.syncing")}…</span>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {Object.entries(SYNC_SOURCES).map(([key, src]) => (
            <div key={key} style={{
              fontSize: 10, color: t.textMuted, background: t.bgSub,
              padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.borderLight}`,
            }}>{src.icon} {src.name}…</div>
          ))}
        </div>
      </div>
    );
  }

  const absOffset = Math.abs(offset || 0);

  let severity, severityLabel, severityColor, severityBg;
  if (absOffset < 50) {
    severity = "excellent"; severityLabel = tr("sync.excellent"); severityColor = t.success; severityBg = `${t.success}18`;
  } else if (absOffset < 500) {
    severity = "good"; severityLabel = tr("sync.good"); severityColor = t.secondary; severityBg = t.secondarySoft;
  } else if (absOffset < 2000) {
    severity = "fair"; severityLabel = tr("sync.good"); severityColor = t.warn; severityBg = `${t.warn}18`;
  } else {
    severity = "poor"; severityLabel = tr("sync.poor"); severityColor = t.danger; severityBg = `${t.danger}18`;
  }

  const formatOffset = (ms) => {
    const abs = Math.abs(ms);
    if (abs < 1000) return `${abs.toFixed(0)} milliseconds`;
    if (abs < 60000) return `${(abs / 1000).toFixed(2)} seconds`;
    return `${(abs / 60000).toFixed(1)} minutes`;
  };

  const directionWord = offset > 0 ? "Behind" : offset < 0 ? "Ahead" : tr("sync.inSync");
  const direction = offset > 0 ? tr("sync.behind") : offset < 0 ? tr("sync.ahead") : tr("sync.inSync");
  const okSources = Object.entries(sourceResults || {}).filter(([_, s]) => s.status === "ok");
  const failSources = Object.entries(sourceResults || {}).filter(([_, s]) => s.status === "error");

  // Count samples per tier
  const tier1Count = (samples || []).filter(s => s.tier === 1).length;
  const tier2Count = (samples || []).filter(s => s.tier === 2).length;

  return (
    <div style={{
      background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`,
      padding: "24px", boxShadow: `0 2px 16px ${t.shadow}`,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {tr("sync.clockAccuracy")}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: severityColor, letterSpacing: 1,
          background: severityBg, padding: "4px 12px", borderRadius: 8, textTransform: "uppercase",
        }}>{severityLabel}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        {/* Big offset number */}
        <div style={{ flex: "1 1 200px" }}>
          <div className="cz-offset-big" style={{
            fontSize: 48, fontWeight: 200, color: severityColor,
            fontVariantNumeric: "tabular-nums", lineHeight: 1.1,
          }}>
            {offset === 0 ? "0" : `${directionWord} ${formatOffset(offset)}`}
          </div>
          <div style={{ fontSize: 14, color: t.textSoft, marginTop: 6 }}>
            {absOffset < 50
              ? `${tr("sync.yourClockIs")} ${tr("sync.inSync")} ✓`
              : `${tr("sync.yourClockIs")} ${formatOffset(offset)} ${direction} ${tr("sync.actualTime")}`}
          </div>
        </div>

        {/* Visual gauge */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ position: "relative", width: 140, height: 74 }}>
            <svg width={140} height={74} viewBox="0 0 140 74">
              <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke={t.borderLight} strokeWidth={8} strokeLinecap="round" />
              <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke={severityColor} strokeWidth={8} strokeLinecap="round"
                strokeDasharray={`${Math.PI * 60}`}
                strokeDashoffset={`${Math.PI * 60 * (1 - Math.min(1, absOffset / 5000))}`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              {(() => {
                const pct = Math.min(1, absOffset / 5000);
                const angle = -180 + pct * 180;
                const rad = (angle * Math.PI) / 180;
                const nx = 70 + 45 * Math.cos(rad);
                const ny = 70 + 45 * Math.sin(rad);
                return <line x1={70} y1={70} x2={nx} y2={ny} stroke={t.text} strokeWidth={2} strokeLinecap="round" />;
              })()}
              <circle cx={70} cy={70} r={4} fill={t.text} />
            </svg>
            <div style={{ position: "absolute", bottom: 0, left: 0, fontSize: 9, color: t.textMuted }}>0s</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, fontSize: 9, color: t.textMuted }}>5s+</div>
          </div>
        </div>
      </div>

      {/* Comparison bars */}
      <div style={{
        marginTop: 20, padding: "16px 0 0", borderTop: `1px solid ${t.borderLight}`,
        display: "flex", gap: 20, flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{tr("sync.actualTimeLabel")}</div>
          <div style={{
            fontSize: 14, fontWeight: 600, color: t.success, fontVariantNumeric: "tabular-nums",
            background: `${t.success}12`, padding: "6px 10px", borderRadius: 8, display: "inline-block",
          }}>✓ {tr("sync.reference")} ({okSources.length} {okSources.length !== 1 ? tr("sync.sources") : tr("sync.source")})</div>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{tr("sync.yourComputer")}</div>
          <div style={{
            fontSize: 14, fontWeight: 600, color: severity === "excellent" ? t.success : severityColor,
            fontVariantNumeric: "tabular-nums",
            background: severityBg, padding: "6px 10px", borderRadius: 8, display: "inline-block",
          }}>{offset === 0 ? "= ✓" : `${formatOffset(offset)} ${tr("sync.offset")}`}</div>
        </div>
        {accuracy !== null && (
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{tr("sync.measurementAccuracy")}</div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: t.textSoft, fontVariantNumeric: "tabular-nums",
              background: t.bgSub, padding: "6px 10px", borderRadius: 8, display: "inline-block",
            }}>±{Math.round(accuracy)} ms ({tr("sync.bestRtt")})</div>
          </div>
        )}
      </div>

      {/* ── Sync Sources Panel ── */}
      <div style={{ marginTop: 20, padding: "16px 0 0", borderTop: `1px solid ${t.borderLight}` }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5,
          textTransform: "uppercase", marginBottom: 12,
        }}>
          {tr("sync.syncSources")} ({okSources.length}/{Object.keys(SYNC_SOURCES).length} {tr("sync.active")})
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {Object.entries(SYNC_SOURCES).map(([key, src]) => {
            const result = (sourceResults || {})[key];
            const isOk = result?.status === "ok";
            const isFail = result?.status === "error";
            return (
              <div key={key} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 12,
                background: isOk ? `${t.success}08` : isFail ? `${t.danger}08` : t.bgSub,
                border: `1px solid ${isOk ? `${t.success}25` : isFail ? `${t.danger}20` : t.borderLight}`,
              }}>
                <div style={{ fontSize: 16, width: 24, textAlign: "center" }}>{src.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{src.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                      color: src.tier === 1 ? t.accent : src.tier === 2 ? t.secondary : t.textMuted,
                      background: src.tier === 1 ? t.accentSoft : src.tier === 2 ? t.secondarySoft : t.bgSub,
                      padding: "1px 6px", borderRadius: 4, textTransform: "uppercase",
                    }}>Tier {src.tier}</span>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                    {isOk ? (
                      <span>
                        <span style={{ color: t.success }}>✓</span> RTT {Math.round(result.rtt)}ms
                        <span style={{ opacity: 0.5, margin: "0 4px" }}>·</span>
                        {tr("sync.offset")} {result.offset > 0 ? "+" : ""}{Math.round(result.offset)}ms
                      </span>
                    ) : isFail ? (
                      <span style={{ color: t.danger }}>✗ {result.error}</span>
                    ) : (
                      <span>{tr("sync.waiting")}</span>
                    )}
                  </div>
                </div>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isOk ? t.success : isFail ? t.danger : t.textMuted,
                  opacity: isOk ? 1 : 0.4,
                  boxShadow: isOk ? `0 0 4px ${t.success}` : "none",
                }} />
              </div>
            );
          })}
        </div>

        {/* How it works note */}
        <div style={{
          marginTop: 12, fontSize: 11, color: t.textMuted, lineHeight: 1.5,
          padding: "10px 14px", background: t.bgSub, borderRadius: 10,
        }}>
          <strong style={{ color: t.textSoft }}>{tr("sync.howItWorks")}:</strong> Clockzilla syncs through a backend proxy that caches upstream time (3-second TTL), so external APIs are called once per 3 seconds no matter how many visitors are on the site.
          Your browser measures round-trip latency to our server across 3 rounds, then computes your local clock offset using statistical filtering.
          Tier 1 (TimeAPI.io) provides precise UTC timestamps. Tier 2 (Cloudflare) serves as a fast fallback.
        </div>
      </div>
    </div>
  );
}

/* ── World Clock Card ── */
function WorldClockCard({ city, tz, emoji, country, isSelected, onClick, t, offsetMs, onRemove }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const accurate = new Date(now.getTime() + (offsetMs || 0));
  const tzTime = new Date(accurate.toLocaleString("en-US", { timeZone: tz }));
  const night = isNight(tzTime);
  const utcOff = (tzTime.getTime() - accurate.getTime()) / 3600000;
  const offStr = utcOff >= 0 ? `+${utcOff.toFixed(0)}` : utcOff.toFixed(0);
  return (
    <div onClick={onClick} className="wc-card" style={{
      background: isSelected ? t.accentSoft : t.card,
      border: `1.5px solid ${isSelected ? t.accent : t.border}`,
      borderRadius: 16, padding: "16px 18px", cursor: "pointer",
      transition: "all 0.25s ease", minWidth: 158, position: "relative",
    }}>
      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{
          position: "absolute", top: 6, right: 6, background: t.bgSub, border: `1px solid ${t.borderLight}`,
          borderRadius: 6, width: 22, height: 22, cursor: "pointer", fontSize: 12, color: t.textMuted,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif",
          opacity: 0.6, transition: "opacity 0.2s",
        }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>×</button>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>{emoji} {city}</span>
        {night && <span style={{ fontSize: 11, opacity: 0.5 }}>🌙</span>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 600, color: isSelected ? t.accent : t.text, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>
        {formatTime(tzTime, false)}
        <span style={{ fontSize: 16, fontWeight: 400, color: t.textMuted }}>:{tzTime.getSeconds().toString().padStart(2, "0")}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, marginLeft: 4 }}>{tzTime.getHours() >= 12 ? "PM" : "AM"}</span>
      </div>
      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, display: "flex", gap: 8 }}>
        <span>UTC{offStr}</span><span style={{ opacity: 0.4 }}>·</span>
        <span>{tzTime.toLocaleDateString("en-US", { weekday: "short" })}</span>
      </div>
    </div>
  );
}

/* ── Progress Ring ── */
function ProgressRing({ value, size = 100, strokeW = 5, color, label, detail, t }) {
  const r = (size - strokeW * 2) / 2; const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.borderLight} strokeWidth={strokeW} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div style={{ textAlign: "center", marginTop: -size / 2 - 14 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{value.toFixed(1)}%</div>
      </div>
      <div style={{ textAlign: "center", marginTop: size / 2 - 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textSoft, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

/* ── Alarm Sound Utility (Web Audio API) ── */
function useAlarmSound() {
  const ctxRef = useRef(null);
  const play = useCallback(() => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      const playBeep = (freq, startTime, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
        osc.start(startTime);
        osc.stop(startTime + dur);
      };
      // Play 3 ascending beeps
      const now = ctx.currentTime;
      playBeep(880, now, 0.15);
      playBeep(1100, now + 0.2, 0.15);
      playBeep(1320, now + 0.4, 0.3);
      // Repeat pattern after 1 second
      playBeep(880, now + 1.2, 0.15);
      playBeep(1100, now + 1.4, 0.15);
      playBeep(1320, now + 1.6, 0.3);
    } catch (e) { /* Audio not available */ }
  }, []);
  return play;
}

/* ── Stopwatch ── */
function StopwatchView({ t }) {
  const { t: tr } = useI18n();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const ref = useRef(null), startRef = useRef(0);
  useEffect(() => {
    if (running) { startRef.current = Date.now() - elapsed; ref.current = setInterval(() => setElapsed(Date.now() - startRef.current), 10); }
    else clearInterval(ref.current); return () => clearInterval(ref.current);
  }, [running]);
  const fmt = (ms) => `${Math.floor(ms / 60000).toString().padStart(2, "0")}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")}.${Math.floor((ms % 1000) / 10).toString().padStart(2, "0")}`;

  // Lap splits (time of each individual lap)
  const lapSplits = laps.map((l, i) => i === 0 ? l : l - laps[i - 1]);
  const bestLap = lapSplits.length > 0 ? Math.min(...lapSplits) : null;
  const worstLap = lapSplits.length > 0 ? Math.max(...lapSplits) : null;
  const avgLap = lapSplits.length > 0 ? lapSplits.reduce((a, b) => a + b, 0) / lapSplits.length : null;

  const copyLaps = () => {
    if (laps.length === 0) return;
    const lines = laps.map((l, i) => `Lap ${i + 1}: ${fmt(lapSplits[i])} (Total: ${fmt(l)})`);
    if (avgLap) lines.push(`\nAverage: ${fmt(avgLap)} | Best: ${fmt(bestLap)} | Worst: ${fmt(worstLap)}`);
    navigator.clipboard?.writeText(lines.join("\n"));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="cz-stopwatch-time" style={{ fontSize: 56, fontWeight: 300, color: t.text, letterSpacing: "-1px", marginBottom: 28, fontVariantNumeric: "tabular-nums" }}>{fmt(elapsed)}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
        <Btn t={t} onClick={() => setRunning(!running)} primary>{running ? tr("timer.pause") : tr("stopwatch.start")}</Btn>
        <Btn t={t} onClick={() => { if (running) setLaps([...laps, elapsed]); }} disabled={!running}>{tr("stopwatch.lap")}</Btn>
        <Btn t={t} onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }}>{tr("stopwatch.reset")}</Btn>
      </div>

      {/* Lap stats summary */}
      {lapSplits.length >= 2 && (
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Best", value: fmt(bestLap), color: "#22c55e" },
            { label: "Average", value: fmt(avgLap), color: t.accent },
            { label: "Worst", value: fmt(worstLap), color: t.danger || "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ background: t.bgSub, borderRadius: 10, padding: "8px 16px", border: `1px solid ${t.borderLight}`, textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {laps.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Laps ({laps.length})</span>
            <button onClick={copyLaps} style={{
              background: t.bgSub, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "4px 12px",
              cursor: "pointer", fontSize: 11, fontWeight: 600, color: t.textMuted, fontFamily: "'Outfit', sans-serif",
            }}>Copy All</button>
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", textAlign: "left" }}>
            {laps.map((l, i) => {
              const split = lapSplits[i];
              const isBest = lapSplits.length >= 2 && split === bestLap;
              const isWorst = lapSplits.length >= 2 && split === worstLap;
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${t.borderLight}`, fontSize: 14,
                  background: isBest ? "rgba(34,197,94,0.06)" : isWorst ? "rgba(239,68,68,0.06)" : "transparent",
                  borderRadius: 6, padding: "10px 8px",
                }}>
                  <span style={{ color: t.textMuted, fontWeight: 500 }}>
                    {tr("stopwatch.lap")} {i + 1}
                    {isBest && <span style={{ color: "#22c55e", fontSize: 10, marginLeft: 6 }}>BEST</span>}
                    {isWorst && <span style={{ color: t.danger || "#ef4444", fontSize: 10, marginLeft: 6 }}>WORST</span>}
                  </span>
                  <span style={{ color: isBest ? "#22c55e" : isWorst ? (t.danger || "#ef4444") : t.accent, fontWeight: 600 }}>{fmt(split)}</span>
                  <span style={{ color: t.textMuted }}>{fmt(l)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Timer ── */
function TimerView({ t }) {
  const { t: tr } = useI18n();
  const [total, setTotal] = useState(300); const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false); const [editing, setEditing] = useState(true);
  const [customHr, setCustomHr] = useState(""); const [customMin, setCustomMin] = useState("");
  const ref = useRef(null);
  const playAlarm = useAlarmSound();
  const alarmFired = useRef(false);
  useEffect(() => {
    if (running && remaining > 0) {
      alarmFired.current = false;
      ref.current = setInterval(() => { setRemaining(r => { if (r <= 1) { setRunning(false); return 0; } return r - 1; }); }, 1000);
    }
    else clearInterval(ref.current); return () => clearInterval(ref.current);
  }, [running]);
  // Play alarm when timer reaches 0
  useEffect(() => {
    if (remaining === 0 && !editing && !alarmFired.current) {
      alarmFired.current = true;
      playAlarm();
    }
  }, [remaining, editing, playAlarm]);
  const applyCustom = () => {
    const h = parseInt(customHr) || 0;
    const m = parseInt(customMin) || 0;
    const secs = h * 3600 + m * 60;
    if (secs > 0) { setTotal(secs); setRemaining(secs); }
  };
  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const min = Math.floor(remaining / 60), sec = remaining % 60;
  const presets = [60, 300, 600, 900, 1800, 3600]; const presetLabels = ["1m", "5m", "10m", "15m", "30m", "1h"];
  return (
    <div style={{ textAlign: "center" }}>
      {editing ? (<>
        <div className="cz-timer-time" style={{ fontSize: 56, fontWeight: 300, color: t.text, marginBottom: 24, fontVariantNumeric: "tabular-nums" }}>
          {Math.floor(total / 60).toString().padStart(2, "0")}:{(total % 60).toString().padStart(2, "0")}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          {presets.map((p, i) => <button key={p} onClick={() => { setTotal(p); setRemaining(p); setCustomHr(""); setCustomMin(""); }} style={{
            background: total === p ? t.accent : t.bgSub, color: total === p ? "#fff" : t.textSoft,
            border: `1.5px solid ${total === p ? t.accent : t.border}`, borderRadius: 10, padding: "8px 18px",
            cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
          }}>{presetLabels[i]}</button>)}
        </div>
        {/* Custom time input */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          <input type="number" min="0" max="99" placeholder="0" value={customHr}
            onChange={e => setCustomHr(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") applyCustom(); }}
            style={{
              width: 64, background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 10,
              padding: "10px 12px", fontSize: 16, fontFamily: "'Outfit', sans-serif", textAlign: "center", outline: "none",
            }} />
          <span style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>hr</span>
          <input type="number" min="0" max="59" placeholder="0" value={customMin}
            onChange={e => setCustomMin(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") applyCustom(); }}
            style={{
              width: 64, background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 10,
              padding: "10px 12px", fontSize: 16, fontFamily: "'Outfit', sans-serif", textAlign: "center", outline: "none",
            }} />
          <span style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>min</span>
          <button onClick={applyCustom} style={{
            background: t.accent, color: "#fff", border: `1.5px solid ${t.accent}`, borderRadius: 10,
            padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          }}>Set</button>
        </div>
        <Btn t={t} primary onClick={() => { setEditing(false); setRunning(true); setRemaining(total); }}>{tr("timer.start")}</Btn>
      </>) : (<>
        <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 28px" }}>
          <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={100} cy={100} r={88} fill="none" stroke={t.borderLight} strokeWidth={7} />
            <circle cx={100} cy={100} r={88} fill="none" stroke={remaining === 0 ? t.danger : t.accent}
              strokeWidth={7} strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            fontSize: 44, fontWeight: 300, color: remaining === 0 ? t.danger : t.text, fontVariantNumeric: "tabular-nums",
          }}>{min.toString().padStart(2, "0")}:{sec.toString().padStart(2, "0")}</div>
        </div>
        {remaining === 0 && <div style={{ fontSize: 16, color: t.danger, marginBottom: 16, fontWeight: 600, animation: "pulse 1s infinite" }}>{tr("timer.timesUp")}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn t={t} primary onClick={() => setRunning(!running)}>{running ? tr("timer.pause") : tr("timer.start")}</Btn>
          <Btn t={t} onClick={() => { setRunning(false); setEditing(true); setRemaining(total); }}>{tr("timer.reset")}</Btn>
        </div>
      </>)}
    </div>
  );
}

function Btn({ children, onClick, primary, disabled, t }) {
  return <button onClick={onClick} disabled={disabled} style={{
    background: primary ? t.accent : t.bgSub, color: primary ? "#fff" : t.textSoft,
    border: `1.5px solid ${primary ? t.accent : t.border}`, borderRadius: 12,
    padding: "11px 26px", cursor: disabled ? "default" : "pointer",
    fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s", opacity: disabled ? 0.4 : 1,
  }}>{children}</button>;
}

/* ── Pomodoro Timer ── */
function PomodoroView({ t }) {
  const playAlarm = useAlarmSound();
  const [mode, setMode] = useState("work"); // "work" | "shortBreak" | "longBreak"
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0); // total focus seconds completed
  const ref = useRef(null);
  const alarmFired = useRef(false);

  const durations = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  const labels = { work: "Focus", shortBreak: "Short Break", longBreak: "Long Break" };
  const colors = { work: t.accent, shortBreak: "#22c55e", longBreak: "#6366f1" };

  useEffect(() => {
    if (running && remaining > 0) {
      alarmFired.current = false;
      ref.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); return 0; }
          return r - 1;
        });
        if (mode === "work") setTotalFocus(prev => prev + 1);
      }, 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running, mode]);

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (remaining === 0 && !alarmFired.current) {
      alarmFired.current = true;
      playAlarm();
      if (mode === "work") {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        // Every 4 sessions → long break, otherwise short break
        if (newSessions % 4 === 0) {
          setMode("longBreak");
          setRemaining(durations.longBreak);
        } else {
          setMode("shortBreak");
          setRemaining(durations.shortBreak);
        }
      } else {
        setMode("work");
        setRemaining(durations.work);
      }
    }
  }, [remaining, mode, sessions, playAlarm]);

  const switchMode = (m) => {
    setMode(m);
    setRemaining(durations[m]);
    setRunning(false);
  };

  const progress = durations[mode] > 0 ? ((durations[mode] - remaining) / durations[mode]) * 100 : 0;
  const min = Math.floor(remaining / 60), sec = remaining % 60;
  const focusMin = Math.floor(totalFocus / 60);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Mode selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: t.bgSub, borderRadius: 12, padding: 4, justifyContent: "center", border: `1.5px solid ${t.borderLight}` }}>
        {Object.entries(labels).map(([id, label]) => (
          <button key={id} onClick={() => switchMode(id)} style={{
            background: mode === id ? t.card : "transparent", color: mode === id ? colors[id] : t.textMuted,
            border: mode === id ? `1.5px solid ${t.border}` : "1.5px solid transparent",
            borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
          }}>{label}</button>
        ))}
      </div>

      {/* Circular timer */}
      <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 24px" }}>
        <svg width={220} height={220} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={110} cy={110} r={96} fill="none" stroke={t.borderLight} strokeWidth={7} />
          <circle cx={110} cy={110} r={96} fill="none" stroke={colors[mode]}
            strokeWidth={7} strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * (1 - progress / 100)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: t.text, fontVariantNumeric: "tabular-nums" }}>
            {min.toString().padStart(2, "0")}:{sec.toString().padStart(2, "0")}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors[mode], letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>{labels[mode]}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
        <Btn t={t} primary onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</Btn>
        <Btn t={t} onClick={() => { setRunning(false); setRemaining(durations[mode]); }}>Reset</Btn>
      </div>

      {/* Session stats */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ background: t.bgSub, borderRadius: 12, padding: "10px 20px", border: `1px solid ${t.borderLight}`, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Sessions</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{sessions}</div>
        </div>
        <div style={{ background: t.bgSub, borderRadius: 12, padding: "10px 20px", border: `1px solid ${t.borderLight}`, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Focus Time</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{focusMin}m</div>
        </div>
        <div style={{ background: t.bgSub, borderRadius: 12, padding: "10px 20px", border: `1px solid ${t.borderLight}`, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Next Break</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{mode === "work" ? `${4 - (sessions % 4)}` : "—"}</div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, icon, t }) {
  return <div style={{ background: t.bgSub, border: `1.5px solid ${t.borderLight}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 15, color: t.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  </div>;
}

/* ── Theme Switcher ── */
function ThemeSwitcher({ current, onChange, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: 40, height: 40, borderRadius: 12, border: `1.5px solid ${t.border}`,
        background: t.card, cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 18, transition: "all 0.2s",
      }}>{THEMES[current].icon}</button>
      {open && (<>
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
        <div style={{
          position: "absolute", top: 48, right: 0, zIndex: 99, background: t.card,
          border: `1.5px solid ${t.border}`, borderRadius: 16, padding: 8, minWidth: 200,
          boxShadow: `0 12px 40px ${t.shadow}`,
        }}>
          <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Choose Theme</div>
          {Object.entries(THEMES).map(([key, theme]) => (
            <button key={key} onClick={() => { onChange(key); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              border: "none", borderRadius: 10, background: current === key ? t.accentSoft : "transparent",
              cursor: "pointer", transition: "all 0.15s", textAlign: "left",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: theme.bg, border: `1.5px solid ${theme.border}` }}>
                {theme.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: current === key ? t.accent : t.text }}>{theme.name}</div>
                <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                  {[theme.accent, theme.secondary, theme.text, theme.bg].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: c, border: `1px solid ${theme.border}` }} />
                  ))}
                </div>
              </div>
              {current === key && <div style={{ marginLeft: "auto", color: t.accent, fontSize: 14, fontWeight: 700 }}>✓</div>}
            </button>
          ))}
        </div>
      </>)}
    </div>
  );
}

/* ---- SUNRISE/SUNSET — NOAA Solar Calculator Algorithm ---- */
function getSunTimes(date, lat, lng) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Julian Day Number from date
  const y = date.getFullYear(), mo = date.getMonth() + 1, d = date.getDate();
  const A = Math.floor((14 - mo) / 12);
  const yy = y + 4800 - A;
  const mm = mo + 12 * A - 3;
  const JD = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045.5;

  // Julian Century
  const T = (JD - 2451545.0) / 36525.0;

  // Sun's geometric mean longitude (degrees)
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;

  // Sun's mean anomaly (degrees)
  const M = (357.52911 + T * (35999.05029 - T * 0.0001537)) % 360;

  // Equation of center (degrees)
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(M * rad)
          + (0.019993 - T * 0.000101) * Math.sin(2 * M * rad)
          + 0.000289 * Math.sin(3 * M * rad);

  // Sun's true longitude
  const sunLng = L0 + C;

  // Sun's apparent longitude
  const omega = 125.04 - 1934.136 * T;
  const lambda = sunLng - 0.00569 - 0.00478 * Math.sin(omega * rad);

  // Mean obliquity of ecliptic (degrees)
  const e0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const obliquity = e0 + 0.00256 * Math.cos(omega * rad);

  // Sun's declination
  const sinDec = Math.sin(obliquity * rad) * Math.sin(lambda * rad);
  const declination = Math.asin(sinDec) * deg;

  // Equation of Time (minutes)
  const ecc = 0.016708634 - T * (0.000042037 + T * 0.0000001267);
  const yFactor = Math.tan(obliquity * rad / 2) ** 2;
  const EoT = 4 * deg * (
    yFactor * Math.sin(2 * L0 * rad)
    - 2 * ecc * Math.sin(M * rad)
    + 4 * ecc * yFactor * Math.sin(M * rad) * Math.cos(2 * L0 * rad)
    - 0.5 * yFactor * yFactor * Math.sin(4 * L0 * rad)
    - 1.25 * ecc * ecc * Math.sin(2 * M * rad)
  );

  // Solar noon in minutes from midnight UTC
  const solarNoonUTC = 720 - 4 * lng - EoT;

  // Hour angle for sunrise/sunset — using -0.833° for standard refraction + solar disc
  const zenith = 90.833;
  const cosHA = (Math.cos(zenith * rad) / (Math.cos(lat * rad) * Math.cos(declination * rad)))
    - Math.tan(lat * rad) * Math.tan(declination * rad);

  // Polar edge case: no sunrise or no sunset
  if (cosHA > 1) return { sunrise: "No sunrise", sunset: "No sunset", dayLength: "0h 0m", sunriseFrac: 0, sunsetFrac: 0, polar: "dark" };
  if (cosHA < -1) return { sunrise: "No sunset", sunset: "No sunrise", dayLength: "24h 0m", sunriseFrac: 0, sunsetFrac: 1, polar: "light" };

  const HA = Math.acos(cosHA) * deg;

  // Sunrise and sunset in minutes from midnight UTC
  const sunriseUTC = solarNoonUTC - HA * 4;
  const sunsetUTC = solarNoonUTC + HA * 4;

  // Convert UTC minutes to local time using browser timezone offset
  const tzOffsetMin = -date.getTimezoneOffset(); // positive for east of UTC
  const sunriseLocal = ((sunriseUTC + tzOffsetMin) % 1440 + 1440) % 1440;
  const sunsetLocal = ((sunsetUTC + tzOffsetMin) % 1440 + 1440) % 1440;

  const toTime = (minutes) => {
    const hr = Math.floor(minutes / 60) % 24;
    const mn = Math.round(minutes % 60);
    const hr12 = hr % 12 || 12;
    const ampm = hr >= 12 ? "PM" : "AM";
    return `${hr12}:${mn.toString().padStart(2, "0")} ${ampm}`;
  };

  const dayLengthMin = sunsetLocal - sunriseLocal;
  const dl = dayLengthMin > 0 ? dayLengthMin : dayLengthMin + 1440;
  const dayHr = Math.floor(dl / 60);
  const dayMin = Math.round(dl % 60);

  return {
    sunrise: toTime(sunriseLocal),
    sunset: toTime(sunsetLocal),
    dayLength: `${dayHr}h ${dayMin}m`,
    sunriseFrac: sunriseLocal / 1440,
    sunsetFrac: sunsetLocal / 1440,
  };
}

function SunriseSunsetCard({ date, t, loc }) {
  const { t: tr } = useI18n();
  const sun = getSunTimes(date, loc.lat, loc.lng);
  const nowFrac = (date.getHours() * 60 + date.getMinutes()) / 1440;
  const isDaytime = nowFrac >= sun.sunriseFrac && nowFrac <= sun.sunsetFrac;
  return (
    <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, boxShadow: `0 2px 12px ${t.shadow}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{ tr("sun.title") }</span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.5, textTransform: "none", color: t.textSoft }}>
          {loc.displayName || loc.city}
        </span>
      </div>
      {/* Arc visualization */}
      <div style={{ position: "relative", height: 80, marginBottom: 12 }}>
        <svg width="100%" height={80} viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet">
          <path d="M 20 70 Q 150 -20 280 70" fill="none" stroke={t.borderLight} strokeWidth={3} strokeLinecap="round" />
          <path d="M 20 70 Q 150 -20 280 70" fill="none" stroke={t.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={400} strokeDashoffset={400 * (1 - (sun.sunsetFrac - sun.sunriseFrac))}
            style={{ transition: "stroke-dashoffset 1s" }} />
          {/* Sun position */}
          {(() => {
            const pct = isDaytime ? (nowFrac - sun.sunriseFrac) / (sun.sunsetFrac - sun.sunriseFrac) : 0;
            const x = 20 + pct * 260;
            const y = 70 - Math.sin(pct * Math.PI) * 90;
            return isDaytime ? <circle cx={x} cy={Math.max(5, y)} r={8} fill={t.accent} style={{ filter: `drop-shadow(0 0 6px ${t.accent})` }} /> : null;
          })()}
          <line x1={20} y1={70} x2={280} y2={70} stroke={t.borderLight} strokeWidth={1} strokeDasharray="4,4" />
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{ tr("sun.sunrise") }</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.warn || t.accent }}>{sun.sunrise}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{ tr("sun.daylight") }</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{sun.dayLength}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{ tr("sun.sunset") }</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.secondary }}>{sun.sunset}</div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: t.textMuted }}>
        {isDaytime ? tr("sun.sunIsUp") : tr("sun.sunHasSet")} &middot; {loc.displayName || loc.city} ({loc.lat.toFixed(1)}&deg;{loc.lat >= 0 ? "N" : "S"}, {Math.abs(loc.lng).toFixed(1)}&deg;{loc.lng < 0 ? "W" : "E"})
        {loc.source === "gps" && <span style={{ color: t.success }}> &middot; GPS</span>}
        {loc.source === "ip-geo" && <span style={{ color: t.secondary }}> &middot; IP</span>}
      </div>
    </div>
  );
}

/* ---- DST INFO CARD ---- */
function DSTInfoCard({ date, t, tz }) {
  // Find next DST transition by checking offset changes month by month
  const getDSTInfo = () => {
    try {
      const now = date;
      const currentYear = now.getFullYear();
      const currentOffset = -new Date(now.toLocaleString("en-US", { timeZone: tz })).getTimezoneOffset
        ? now.getTimezoneOffset() : 0;

      // Check every day for the next 400 days for an offset change
      let transitions = [];
      const fmt = { timeZone: tz, hour: "numeric", hour12: false, timeZoneName: "short" };
      let prevOffset = null;

      for (let dayOff = 0; dayOff <= 400; dayOff++) {
        const checkDate = new Date(currentYear, 0, 1 + dayOff, 12);
        // Get offset for this timezone
        const utcStr = checkDate.toLocaleString("en-US", { timeZone: "UTC" });
        const tzStr = checkDate.toLocaleString("en-US", { timeZone: tz });
        const utcDate = new Date(utcStr);
        const tzDate = new Date(tzStr);
        const offsetMin = Math.round((tzDate - utcDate) / 60000);

        if (prevOffset !== null && offsetMin !== prevOffset) {
          const springForward = offsetMin > prevOffset;
          transitions.push({
            date: checkDate,
            springForward,
            label: springForward ? "Spring Forward" : "Fall Back",
            emoji: springForward ? "☀️" : "🌙",
            desc: springForward
              ? "Clocks move forward 1 hour. You lose 1 hour of sleep."
              : "Clocks move back 1 hour. You gain 1 extra hour.",
            offsetBefore: prevOffset,
            offsetAfter: offsetMin,
          });
        }
        prevOffset = offsetMin;
      }

      // Find the next transition from today
      const upcoming = transitions.filter(tr => tr.date >= now);
      const past = transitions.filter(tr => tr.date < now);
      const lastChange = past.length > 0 ? past[past.length - 1] : null;
      const nextChange = upcoming.length > 0 ? upcoming[0] : null;

      // Check if this timezone observes DST at all
      if (transitions.length === 0) return { observesDST: false };

      return { observesDST: true, nextChange, lastChange };
    } catch (e) {
      return { observesDST: false };
    }
  };

  const info = getDSTInfo();

  if (!info.observesDST) {
    return (
      <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, boxShadow: `0 2px 12px ${t.shadow}`, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Daylight Saving Time</div>
        <div style={{ fontSize: 14, color: t.textSoft }}>This timezone does not observe Daylight Saving Time.</div>
      </div>
    );
  }

  const daysUntil = info.nextChange ? Math.ceil((info.nextChange.date - date) / 86400000) : null;

  return (
    <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, boxShadow: `0 2px 12px ${t.shadow}`, marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Daylight Saving Time</div>

      {info.nextChange && (
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 32 }}>{info.nextChange.emoji}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>
              {info.nextChange.label} — {info.nextChange.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div style={{ fontSize: 13, color: t.textSoft, marginTop: 2 }}>{info.nextChange.desc}</div>
          </div>
          <div style={{ background: daysUntil <= 14 ? `${t.accent}18` : t.bgSub, borderRadius: 12, padding: "10px 18px", textAlign: "center", border: `1px solid ${daysUntil <= 14 ? t.accent + "40" : t.borderLight}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: daysUntil <= 14 ? t.accent : t.text }}>{daysUntil}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>days away</div>
          </div>
        </div>
      )}

      {info.lastChange && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.borderLight}`, fontSize: 13, color: t.textMuted }}>
          Last change: {info.lastChange.label} on {info.lastChange.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </div>
      )}
    </div>
  );
}

/* ---- DAY/NIGHT WORLD MAP ---- */
function DayNightMap({ date, t, worldClocks, onSelectCity }) {
  const { t: tr } = useI18n();
  const w = 600, h = 300;
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
  const sunLng = -(hour - 12) * 15;
  const dayOfYear = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000);
  const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));

  const lngToX = (lng) => ((lng + 180) / 360) * w;
  const latToY = (lat) => ((90 - lat) / 180) * h;

  // Generate terminator line points
  const terminatorPoints = [];
  for (let lat = -90; lat <= 90; lat += 2) {
    const latRad = lat * Math.PI / 180;
    const decRad = declination * Math.PI / 180;
    const cosHA = -Math.tan(latRad) * Math.tan(decRad);
    if (cosHA >= -1 && cosHA <= 1) {
      const ha = Math.acos(cosHA) * 180 / Math.PI;
      terminatorPoints.push({ lat, lngLeft: sunLng - ha, lngRight: sunLng + ha });
    }
  }

  // Build day polygon path for clipping
  const dayPath = (() => {
    if (terminatorPoints.length < 2) return null;
    const pts = terminatorPoints.map(p => {
      const xl = lngToX(((p.lngLeft % 360) + 540) % 360 - 180);
      const xr = lngToX(((p.lngRight % 360) + 540) % 360 - 180);
      const y = latToY(p.lat);
      return { xl, xr, y };
    });
    // Build polygon: go down the left side, then back up the right side
    let d = `M ${pts[0].xl} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].xl} ${pts[i].y}`;
    // across bottom of last point to right side
    d += ` L ${pts[pts.length - 1].xr} ${pts[pts.length - 1].y}`;
    for (let i = pts.length - 2; i >= 0; i--) d += ` L ${pts[i].xr} ${pts[i].y}`;
    d += " Z";
    return d;
  })();

  // Sun position
  const sunX = lngToX(((sunLng % 360) + 540) % 360 - 180);
  const sunY = latToY(declination);

  // Compute a nighttime label position (opposite side of sun)
  const nightLng = sunLng + 180;
  const nightX = lngToX(((nightLng % 360) + 540) % 360 - 180);

  // City coordinates (approximate)
  const cityCoords = {
    "New York": { lat: 40.7, lng: -74 }, "London": { lat: 51.5, lng: -0.1 }, "Paris": { lat: 48.9, lng: 2.3 },
    "Dubai": { lat: 25.2, lng: 55.3 }, "Mumbai": { lat: 19.1, lng: 72.9 }, "Tokyo": { lat: 35.7, lng: 139.7 },
    "Sydney": { lat: -33.9, lng: 151.2 }, "Los Angeles": { lat: 34.1, lng: -118.2 },
    "Singapore": { lat: 1.3, lng: 103.8 }, "Berlin": { lat: 52.5, lng: 13.4 },
    "Moscow": { lat: 55.8, lng: 37.6 }, "S\u00e3o Paulo": { lat: -23.5, lng: -46.6 },
  };

  // Dark/light colors based on theme
  const isDark = t.bg === "#0A0A0A" || t.bg === "#0D0D0D" || t.bg === "#1A1A2E" || t.bg === "#0B1929" || (t.bg && t.bg.startsWith("#0"));
  const nightBg = isDark ? "#080818" : "#1a1a3a";
  const dayBg = isDark ? "#1e2d4a" : "#fdf6e3";
  const nightTextColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.85)";
  const dayTextColor = isDark ? "rgba(100,80,40,0.7)" : "rgba(100,80,40,0.75)";

  // Detect if polygon wraps around the antimeridian (±180°)
  // When wrapping occurs, the SVG polygon covers the NIGHT side instead of DAY side
  // so we need to swap: use nightClip for day color, dayClip for night color
  const dayWraps = (() => {
    if (terminatorPoints.length < 2) return false;
    const mid = terminatorPoints[Math.floor(terminatorPoints.length / 2)];
    const xl = lngToX(((mid.lngLeft % 360) + 540) % 360 - 180);
    const xr = lngToX(((mid.lngRight % 360) + 540) % 360 - 180);
    return xl > xr; // If left edge is to the right of right edge, polygon wraps
  })();

  return (
    <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, boxShadow: `0 2px 12px ${t.shadow}`, marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>{tr("world.dayNightMap")}</div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ borderRadius: 12, overflow: "hidden" }}>
        <defs>
          {dayPath && <clipPath id="dayClip"><path d={dayPath} /></clipPath>}
          {dayPath && <clipPath id="nightClip"><path d={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z ${dayPath}`} clipRule="evenodd" /></clipPath>}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={t.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base layer + overlay: swap clips when polygon wraps the antimeridian */}
        {dayWraps ? (<>
          {/* Wrapping case: polygon covers night side, so base=day, overlay polygon=night */}
          <rect x={0} y={0} width={w} height={h} fill={dayBg} />
          {dayPath && <rect x={0} y={0} width={w} height={h} fill={nightBg} clipPath="url(#dayClip)" />}
        </>) : (<>
          {/* Normal case: polygon covers day side, so base=night, overlay polygon=day */}
          <rect x={0} y={0} width={w} height={h} fill={nightBg} />
          {dayPath && <rect x={0} y={0} width={w} height={h} fill={dayBg} clipPath="url(#dayClip)" />}
        </>)}

        {/* Grid lines */}
        {[-60, -30, 0, 30, 60].map(lat => <line key={`lat${lat}`} x1={0} y1={latToY(lat)} x2={w} y2={latToY(lat)} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth={0.5} />)}
        {[-120, -60, 0, 60, 120].map(lng => <line key={`lng${lng}`} x1={lngToX(lng)} y1={0} x2={lngToX(lng)} y2={h} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth={0.5} />)}
        {/* Equator */}
        <line x1={0} y1={latToY(0)} x2={w} y2={latToY(0)} stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth={0.8} strokeDasharray="4,4" />

        {/* Terminator edge glow */}
        {dayPath && <path d={dayPath} fill="none" stroke={isDark ? "rgba(255,200,100,0.25)" : "rgba(200,150,50,0.3)"} strokeWidth={2} />}

        {/* Sun glow */}
        <circle cx={sunX} cy={sunY} r={30} fill="url(#sunGlow)" />

        {/* "Daytime" label */}
        <text x={sunX} y={h - 20} textAnchor="middle" fontSize={16} fill={dayTextColor} fontFamily="'Outfit', sans-serif" fontWeight={700} letterSpacing={3} style={{ textTransform: "uppercase" }}>
          ☀ Daytime
        </text>

        {/* "Nighttime" label */}
        <text x={nightX} y={h - 20} textAnchor="middle" fontSize={16} fill={nightTextColor} fontFamily="'Outfit', sans-serif" fontWeight={700} letterSpacing={3} style={{ textTransform: "uppercase" }}>
          🌙 Nighttime
        </text>

        {/* Sun position */}
        <circle cx={sunX} cy={sunY} r={7} fill="#FFB800" stroke="#FFF8E0" strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 10px rgba(255,184,0,0.8))` }} />

        {/* City dots */}
        {worldClocks.map(wc => {
          const coords = cityCoords[wc.city];
          if (!coords) return null;
          const cx = lngToX(coords.lng), cy = latToY(coords.lat);
          const tzTime = new Date(date.toLocaleString("en-US", { timeZone: wc.tz }));
          const night = isNight(tzTime);
          return (
            <g key={wc.city} onClick={() => onSelectCity(wc)} style={{ cursor: "pointer" }}>
              <circle cx={cx} cy={cy} r={4} fill={night ? "#8890a8" : t.accent} stroke={night ? "#bbb" : "#fff"} strokeWidth={1.5} />
              <text x={cx} y={cy - 8} textAnchor="middle" fontSize={7} fill={night ? "#aab" : isDark ? "#ddd" : "#554430"} fontFamily="'Outfit', sans-serif" fontWeight={600}>{wc.city}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---- SEARCHABLE TIMEZONE PICKER ---- */
function TZPicker({ label, value, onChange, t, accurateNow, presets }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const debRef = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = (val) => {
    setQuery(val);
    if (val.length < 2) { setResults([]); setShowDrop(true); return; }
    const q = val.toLowerCase();
    if (cacheRef.current[q]) { setResults(cacheRef.current[q]); setShowDrop(true); setLoading(false); return; }
    if (debRef.current) clearTimeout(debRef.current);
    setLoading(true);
    debRef.current = setTimeout(async () => {
      const apiResults = await searchCities(val, 10);
      if (apiResults && apiResults.length > 0) {
        cacheRef.current[q] = apiResults;
        setResults(apiResults);
      } else {
        setResults([]);
      }
      setShowDrop(true);
      setLoading(false);
    }, 250);
  };

  const pick = (zone) => {
    onChange(zone);
    setQuery("");
    setShowDrop(false);
  };

  // Filtered presets when query is short
  const filteredPresets = query.length < 2
    ? presets
    : presets.filter(p => p.city.toLowerCase().includes(query.toLowerCase()));

  const displayLabel = value ? `${value.emoji || "📍"} ${value.city} — ${getTZFull(value.tz, accurateNow)}` : "Select timezone...";

  return (
    <div ref={wrapRef} style={{ position: "relative", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>

      {/* Selected display / trigger */}
      <div onClick={() => setShowDrop(!showDrop)} style={{
        background: t.bgSub, color: t.text, border: `1.5px solid ${showDrop ? t.accent : t.border}`,
        borderRadius: 12, padding: "14px 18px", fontSize: 15, fontFamily: "'Outfit', sans-serif",
        fontWeight: 500, cursor: "pointer", width: "100%", transition: "border-color 0.2s",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
        <span style={{ fontSize: 10, color: t.textMuted, marginLeft: 8 }}>▼</span>
      </div>

      {/* Dropdown */}
      {showDrop && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, marginTop: 4,
          background: t.card, border: `1.5px solid ${t.border}`, borderRadius: 14,
          boxShadow: `0 8px 32px ${t.shadow}`, maxHeight: 340, overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Search input */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${t.borderLight}` }}>
            <input
              autoFocus
              type="text"
              placeholder="Search any city or country..."
              value={query}
              onChange={e => doSearch(e.target.value)}
              style={{
                width: "100%", background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`,
                borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "'Outfit', sans-serif",
                outline: "none",
              }}
            />
          </div>

          {/* Results list */}
          <div style={{ overflowY: "auto", maxHeight: 270 }}>
            {loading && (
              <div style={{ padding: "12px 16px", fontSize: 13, color: t.textMuted, textAlign: "center" }}>Searching...</div>
            )}

            {/* API search results */}
            {!loading && query.length >= 2 && results.length > 0 && (
              <>
                <div style={{ padding: "8px 14px", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Search Results</div>
                {results.map((r, i) => (
                  <div key={`api-${i}`} onClick={() => pick({ city: r.city, tz: r.tz, emoji: "📍", country: r.country })}
                    style={{
                      padding: "10px 16px", cursor: "pointer", fontSize: 14, color: t.text,
                      transition: "background 0.1s", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = t.bgSub}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{r.city}</span>
                      {r.state && <span style={{ color: t.textMuted }}>, {r.state}</span>}
                      <span style={{ color: t.textMuted }}> — {r.country}</span>
                    </div>
                    <span style={{ fontSize: 11, color: t.textMuted }}>{getTZAbbr(r.tz, accurateNow)}</span>
                  </div>
                ))}
              </>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div style={{ padding: "12px 16px", fontSize: 13, color: t.textMuted, textAlign: "center" }}>No cities found</div>
            )}

            {/* Preset zones (when not searching or as fallback) */}
            {(query.length < 2) && (
              <>
                <div style={{ padding: "8px 14px", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Popular Timezones</div>
                {filteredPresets.map((z, i) => (
                  <div key={`pre-${i}`} onClick={() => pick(z)}
                    style={{
                      padding: "10px 16px", cursor: "pointer", fontSize: 14, color: value?.tz === z.tz && value?.city === z.city ? t.accent : t.text,
                      fontWeight: value?.tz === z.tz && value?.city === z.city ? 600 : 400,
                      transition: "background 0.1s", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = t.bgSub}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span>{z.emoji} {z.city}</span>
                    <span style={{ fontSize: 11, color: t.textMuted }}>{getTZAbbr(z.tz, accurateNow)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- TIMEZONE CONVERTER ---- */
function TimezoneConverterView({ t, worldClocks, accurateNow }) {
  const { t: tr } = useI18n();
  const presets = [
    ...worldClocks,
    { city: "UTC", tz: "UTC", emoji: "🌐" },
    { city: "Hong Kong", tz: "Asia/Hong_Kong", emoji: "🇭🇰" },
    { city: "Chicago", tz: "America/Chicago", emoji: "🇺🇸" },
    { city: "Denver", tz: "America/Denver", emoji: "🇺🇸" },
    { city: "Honolulu", tz: "Pacific/Honolulu", emoji: "🌺" },
    { city: "Anchorage", tz: "America/Anchorage", emoji: "❄️" },
    { city: "Cairo", tz: "Africa/Cairo", emoji: "🇪🇬" },
    { city: "Johannesburg", tz: "Africa/Johannesburg", emoji: "🇿🇦" },
    { city: "Auckland", tz: "Pacific/Auckland", emoji: "🇳🇿" },
    { city: "Bangkok", tz: "Asia/Bangkok", emoji: "🇹🇭" },
  ].sort((a, b) => a.city.localeCompare(b.city));

  const [fromZone, setFromZone] = useState(presets.find(z => z.city === "Anchorage") || presets[0]);
  const [toZone, setToZone] = useState(presets.find(z => z.city === "London") || presets[1]);
  const [inputHr, setInputHr] = useState(accurateNow.getHours() % 12 || 12);
  const [inputMin, setInputMin] = useState(accurateNow.getMinutes());
  const [inputAmPm, setInputAmPm] = useState(accurateNow.getHours() >= 12 ? "PM" : "AM");

  // Convert
  const hr24 = inputAmPm === "PM" ? (inputHr === 12 ? 12 : inputHr + 12) : (inputHr === 12 ? 0 : inputHr);
  const fakeDate = new Date(accurateNow);
  fakeDate.setHours(hr24, inputMin, 0, 0);

  const fromStr = fakeDate.toLocaleString("en-US", { timeZone: fromZone.tz, hour: "numeric", minute: "2-digit", hour12: true });
  const toStr = fakeDate.toLocaleString("en-US", { timeZone: toZone.tz, hour: "numeric", minute: "2-digit", hour12: true });

  const fromOff = new Date(fakeDate.toLocaleString("en-US", { timeZone: fromZone.tz })).getTime();
  const toOff = new Date(fakeDate.toLocaleString("en-US", { timeZone: toZone.tz })).getTime();
  const diffHrs = (toOff - fromOff) / 3600000;
  const diffStr = diffHrs >= 0 ? `+${diffHrs.toFixed(1)}h` : `${diffHrs.toFixed(1)}h`;

  const inputStyle = {
    background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`,
    borderRadius: 12, padding: "10px", fontSize: 28, fontFamily: "'Outfit', sans-serif",
    fontWeight: 600, width: 80, textAlign: "center", appearance: "none",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="cz-converter" style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 36, boxShadow: `0 4px 24px ${t.shadow}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28, textAlign: "center" }}>{ tr("converter.title") }</div>

        {/* From */}
        <TZPicker label={tr("converter.from")} value={fromZone} onChange={setFromZone} t={t} accurateNow={accurateNow} presets={presets} />

        {/* Time input */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", justifyContent: "center" }}>
          <input type="number" min={1} max={12} value={inputHr} onChange={e => setInputHr(Math.max(1, Math.min(12, +e.target.value)))}
            className="cz-converter-time" style={inputStyle} />
          <span style={{ fontSize: 28, fontWeight: 300, color: t.textMuted }}>:</span>
          <input type="number" min={0} max={59} value={inputMin.toString().padStart(2, "0")} onChange={e => setInputMin(Math.max(0, Math.min(59, +e.target.value)))}
            className="cz-converter-time" style={inputStyle} />
          <button onClick={() => setInputAmPm(inputAmPm === "AM" ? "PM" : "AM")}
            style={{ ...inputStyle, width: 70, fontSize: 16, fontWeight: 700, color: t.accent, cursor: "pointer" }}>{inputAmPm}</button>
        </div>

        {/* Swap button */}
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <button onClick={() => { const tmp = fromZone; setFromZone(toZone); setToZone(tmp); }} style={{
            background: t.accentSoft, border: `1.5px solid ${t.accent}40`, borderRadius: 12, padding: "10px 28px",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.accent, fontFamily: "'Outfit', sans-serif",
          }}>⇅ Swap</button>
        </div>

        {/* To */}
        <TZPicker label="To" value={toZone} onChange={setToZone} t={t} accurateNow={accurateNow} presets={presets} />

        {/* Result */}
        <div style={{ background: t.bgSub, borderRadius: 18, padding: "24px 28px", textAlign: "center", border: `1.5px solid ${t.borderLight}` }}>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Result</div>
          <div className="cz-converter-result" style={{ fontSize: 42, fontWeight: 600, color: t.accent, fontVariantNumeric: "tabular-nums" }}>{toStr}</div>
          <div style={{ fontSize: 14, color: t.textSoft, marginTop: 6 }}>{toZone.emoji} {toZone.city} — {getTZAbbr(toZone.tz, accurateNow)}</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 8, background: t.card, display: "inline-block", padding: "4px 14px", borderRadius: 8 }}>
            Difference: {diffStr}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- COUNTDOWN TO DATE ---- */
function CountdownView({ t, accurateNow }) {
  const { t: tr } = useI18n();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customName, setCustomName] = useState("");
  const [customDate, setCustomDate] = useState("");

  const defaultPresets = [
    { label: "New Year " + (accurateNow.getFullYear() + 1), date: new Date(accurateNow.getFullYear() + 1, 0, 1), removable: false },
    { label: "Christmas", date: new Date(accurateNow.getMonth() === 11 && accurateNow.getDate() > 25 ? accurateNow.getFullYear() + 1 : accurateNow.getFullYear(), 11, 25), removable: false },
    { label: "Halloween", date: new Date(accurateNow.getMonth() >= 10 ? accurateNow.getFullYear() + 1 : accurateNow.getFullYear(), 9, 31), removable: false },
    { label: "Summer Solstice", date: new Date(accurateNow.getMonth() >= 6 ? accurateNow.getFullYear() + 1 : accurateNow.getFullYear(), 5, 21), removable: false },
  ];

  const [countdowns, setCountdowns] = useState(defaultPresets);

  // Helper: get short timeframe text
  const getTimeframe = (targetDate) => {
    const diff = targetDate.getTime() - accurateNow.getTime();
    if (diff <= 0) return "Passed";
    const totalDays = Math.floor(diff / 86400000);
    if (totalDays >= 365) {
      const yrs = Math.floor(totalDays / 365);
      const remMonths = Math.floor((totalDays % 365) / 30);
      return remMonths > 0 ? `${yrs}y ${remMonths}mo` : `${yrs} year${yrs > 1 ? "s" : ""}`;
    }
    if (totalDays >= 60) {
      const months = Math.floor(totalDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    }
    if (totalDays >= 14) {
      const weeks = Math.floor(totalDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    return `${totalDays} day${totalDays !== 1 ? "s" : ""}`;
  };

  const addCustom = () => {
    if (!customName.trim() || !customDate) return;
    const d = new Date(customDate + "T00:00:00");
    setCountdowns(prev => [...prev, { label: customName.trim(), date: d, removable: true }]);
    setSelectedIdx(countdowns.length);
    setCustomName("");
    setCustomDate("");
  };

  const removeCountdown = (idx) => {
    setCountdowns(prev => prev.filter((_, i) => i !== idx));
    if (selectedIdx >= idx && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  const selected = countdowns[selectedIdx] || countdowns[0];
  const target = selected.date;
  const diff = target.getTime() - accurateNow.getTime();
  const isPast = diff <= 0;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / 86400000);
  const hours = Math.floor((absDiff % 86400000) / 3600000);
  const minutes = Math.floor((absDiff % 3600000) / 60000);
  const seconds = Math.floor((absDiff % 60000) / 1000);
  const ms = Math.floor(absDiff % 1000);

  const totalSec = absDiff / 1000;
  const totalMin = totalSec / 60;
  const totalHr = totalMin / 60;

  const unitBox = (val, lbl) => (
    <div className="cz-countdown-unit" style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
      <div className="cz-countdown-unit-val" style={{ fontSize: 48, fontWeight: 700, color: isPast ? t.danger : t.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {val.toString().padStart(2, "0")}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6 }}>{lbl}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="cz-countdown" style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 36, boxShadow: `0 4px 24px ${t.shadow}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>{ tr("countdown.title") }</div>
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 600, color: t.accent, marginBottom: 24 }}>{selected.label}</div>

        {/* Big countdown */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
          {unitBox(days, tr("countdown.days"))}
          <div style={{ fontSize: 36, fontWeight: 200, color: t.borderLight, alignSelf: "flex-start", marginTop: 6 }}>:</div>
          {unitBox(hours, tr("countdown.hours"))}
          <div style={{ fontSize: 36, fontWeight: 200, color: t.borderLight, alignSelf: "flex-start", marginTop: 6 }}>:</div>
          {unitBox(minutes, tr("countdown.minutes"))}
          <div style={{ fontSize: 36, fontWeight: 200, color: t.borderLight, alignSelf: "flex-start", marginTop: 6 }}>:</div>
          {unitBox(seconds, tr("countdown.seconds"))}
        </div>

        {isPast && <div style={{ textAlign: "center", fontSize: 15, color: t.danger, fontWeight: 600, marginBottom: 20, marginTop: 16 }}>This date has passed!</div>}

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28, marginTop: 24, alignItems: "center" }}>
          {[
            { label: "Total Hours", value: Math.floor(totalHr).toLocaleString() },
            { label: "Total Minutes", value: Math.floor(totalMin).toLocaleString() },
            { label: "Total Seconds", value: Math.floor(totalSec).toLocaleString() },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontStyle: "italic" }}>or</div>}
              <div style={{ background: t.bgSub, borderRadius: 12, padding: "10px 18px", textAlign: "center", border: `1px solid ${t.borderLight}` }}>
                <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Countdown Cards */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          {countdowns.map((p, idx) => (
            <button key={`${p.label}-${idx}`} onClick={() => setSelectedIdx(idx)}
              style={{
                background: selectedIdx === idx ? t.accent : t.bgSub, color: selectedIdx === idx ? "#fff" : t.textSoft,
                border: `1.5px solid ${selectedIdx === idx ? t.accent : t.border}`, borderRadius: 10,
                padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                position: "relative", textAlign: "center", minWidth: 100,
              }}>
              {p.removable && (
                <span onClick={e => { e.stopPropagation(); removeCountdown(idx); }} style={{
                  position: "absolute", top: -6, right: -6, background: t.danger || "#e74c3c", color: "#fff",
                  borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  border: `2px solid ${t.card}`,
                }}>×</span>
              )}
              <div>{p.label}</div>
              <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>{getTimeframe(p.date)}</div>
            </button>
          ))}
        </div>

        {/* Add Custom Countdown */}
        <div style={{
          borderTop: `1px solid ${t.borderLight}`, paddingTop: 20,
          display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap",
        }}>
          <input type="text" placeholder="Countdown name..." value={customName}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCustom(); }}
            style={{
              background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12,
              padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit', sans-serif", minWidth: 160,
              outline: "none",
            }} />
          <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCustom(); }}
            style={{
              background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12,
              padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit', sans-serif",
            }} />
          <button onClick={addCustom} style={{
            background: customName.trim() && customDate ? t.accent : t.bgSub,
            color: customName.trim() && customDate ? "#fff" : t.textMuted,
            border: `1.5px solid ${customName.trim() && customDate ? t.accent : t.border}`,
            borderRadius: 12, padding: "10px 20px", cursor: customName.trim() && customDate ? "pointer" : "default",
            fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
          }}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

/* ---- CALENDAR WITH WEEK NUMBERS + DATE CALCULATOR ---- */

// Moon phase calculator (simplified Metonic cycle)
function getMoonPhase(date) {
  let y = date.getFullYear(), m = date.getMonth() + 1;
  const day = date.getDate();
  if (m < 3) { y--; m += 12; }
  ++m;
  const c = 365.25 * y;
  const e = 30.6 * m;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const bi = parseInt(jd);
  jd -= bi;
  let b = Math.round(jd * 8);
  if (b >= 8) b = 0;
  const icons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const names = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
  return { phase: b, icon: icons[b], name: names[b] };
}

// US Federal Holidays + major international holidays
function getHolidays(year) {
  const holidays = {};
  const add = (m, d, name, emoji) => {
    const key = `${year}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    holidays[key] = { name, emoji };
  };
  // Fixed-date US holidays
  add(1, 1, "New Year's Day", "🎆");
  add(6, 19, "Juneteenth", "✊");
  add(7, 4, "Independence Day", "🇺🇸");
  add(11, 11, "Veterans Day", "🎖️");
  add(12, 25, "Christmas Day", "🎄");
  add(12, 31, "New Year's Eve", "🎉");
  // Floating US holidays
  // MLK Day: 3rd Monday of Jan
  const mlk = new Date(year, 0, 1); mlk.setDate(1 + (1 - mlk.getDay() + 7) % 7 + 14);
  add(1, mlk.getDate(), "MLK Day", "✊");
  // Presidents Day: 3rd Monday of Feb
  const pres = new Date(year, 1, 1); pres.setDate(1 + (1 - pres.getDay() + 7) % 7 + 14);
  add(2, pres.getDate(), "Presidents' Day", "🏛️");
  // Memorial Day: last Monday of May
  const mem = new Date(year, 4, 31); mem.setDate(31 - (mem.getDay() + 6) % 7);
  add(5, mem.getDate(), "Memorial Day", "🇺🇸");
  // Labor Day: 1st Monday of Sep
  const lab = new Date(year, 8, 1); lab.setDate(1 + (1 - lab.getDay() + 7) % 7);
  add(9, lab.getDate(), "Labor Day", "⚒️");
  // Columbus Day: 2nd Monday of Oct
  const col = new Date(year, 9, 1); col.setDate(1 + (1 - col.getDay() + 7) % 7 + 7);
  add(10, col.getDate(), "Columbus Day", "🌎");
  // Thanksgiving: 4th Thursday of Nov
  const thx = new Date(year, 10, 1); thx.setDate(1 + (4 - thx.getDay() + 7) % 7 + 21);
  add(11, thx.getDate(), "Thanksgiving", "🦃");
  // International holidays
  add(2, 14, "Valentine's Day", "❤️");
  add(3, 17, "St. Patrick's Day", "☘️");
  add(10, 31, "Halloween", "🎃");
  // Easter (Computus algorithm)
  const a = year % 19, b2 = Math.floor(year / 100), c2 = year % 100;
  const d2 = Math.floor(b2 / 4), e2 = b2 % 4, f = Math.floor((b2 + 8) / 25);
  const g = Math.floor((b2 - f + 1) / 3), h2 = (19 * a + b2 - d2 - g + 15) % 30;
  const i = Math.floor(c2 / 4), k = c2 % 4, l = (32 + 2 * e2 + 2 * i - h2 - k) % 7;
  const m2 = Math.floor((a + 11 * h2 + 22 * l) / 451);
  const eMonth = Math.floor((h2 + l - 7 * m2 + 114) / 31);
  const eDay = ((h2 + l - 7 * m2 + 114) % 31) + 1;
  add(eMonth, eDay, "Easter", "🐣");
  // Mother's Day: 2nd Sunday of May
  const moth = new Date(year, 4, 1); moth.setDate(1 + (0 - moth.getDay() + 7) % 7 + 7);
  add(5, moth.getDate(), "Mother's Day", "💐");
  // Father's Day: 3rd Sunday of June
  const fath = new Date(year, 5, 1); fath.setDate(1 + (0 - fath.getDay() + 7) % 7 + 14);
  add(6, fath.getDate(), "Father's Day", "👔");
  return holidays;
}

function CalendarView({ t, accurateNow }) {
  const { t: tr, lang } = useI18n();
  const [viewDate, setViewDate] = useState(new Date(accurateNow.getFullYear(), accurateNow.getMonth(), 1));
  const [calcMode, setCalcMode] = useState("between");
  const [dateA, setDateA] = useState(accurateNow.toISOString().split("T")[0]);
  const [birthDate, setBirthDate] = useState("");
  const [dateB, setDateB] = useState("");
  const [addDays, setAddDays] = useState(30);
  const [viewMode, setViewMode] = useState("month"); // month | year
  const [selectedDay, setSelectedDay] = useState(null);

  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const holidays = getHolidays(year);
  const today = accurateNow.getDate();
  const todayMonth = accurateNow.getMonth();
  const todayYear = accurateNow.getFullYear();
  const isCurrentMonth = todayMonth === month && todayYear === year;

  const getWeekNum = (d) => {
    const start = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  };

  // Generate month grid
  const genMonth = (y, m) => {
    const first = new Date(y, m, 1);
    const startDow = first.getDay();
    const startDate = new Date(first);
    startDate.setDate(startDate.getDate() - startDow);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      cells.push(d);
    }
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  const weeks = genMonth(year, month);

  const monthNames = Array.from({length: 12}, (_, i) => new Date(2024, i, 1).toLocaleDateString(lang || "en", { month: "long" }));
  const monthNamesShort = Array.from({length: 12}, (_, i) => new Date(2024, i, 1).toLocaleDateString(lang || "en", { month: "short" }));
  const dayNames = Array.from({length: 7}, (_, i) => new Date(2024, 0, i).toLocaleDateString(lang || "en", { weekday: "narrow" }));

  // Date calc results
  let calcResult = null;
  if (calcMode === "between" && dateA && dateB) {
    const a = new Date(dateA + "T00:00:00"), b = new Date(dateB + "T00:00:00");
    const diffMs = Math.abs(b - a);
    const diffDays = Math.round(diffMs / 86400000);
    const diffWeeks = diffDays / 7;
    const diffMonths = diffDays / 30.4375;
    calcResult = { days: diffDays, weeks: diffWeeks, months: diffMonths };
  }
  if (calcMode === "add" && dateA && addDays) {
    const a = new Date(dateA);
    a.setDate(a.getDate() + addDays);
    calcResult = { resultDate: a };
  }
  // Birthday / Age calculation
  let birthdayResult = null;
  if (calcMode === "birthday" && birthDate) {
    const bd = new Date(birthDate + "T00:00:00");
    const now = accurateNow;
    // Exact age in years, months, days
    let ageYears = now.getFullYear() - bd.getFullYear();
    let ageMonths = now.getMonth() - bd.getMonth();
    let ageDays = now.getDate() - bd.getDate();
    if (ageDays < 0) { ageMonths--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); ageDays += prevMonth.getDate(); }
    if (ageMonths < 0) { ageYears--; ageMonths += 12; }
    // Total days alive
    const totalDays = Math.floor((now - bd) / 86400000);
    // Day of week born
    const bornDay = bd.toLocaleDateString("en-US", { weekday: "long" });
    // Next birthday
    let nextBday = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
    if (nextBday <= now) nextBday = new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate());
    const daysUntilBday = Math.ceil((nextBday - now) / 86400000);
    // Zodiac sign
    const zodiacSigns = [
      { sign: "Capricorn", emoji: "♑", start: [0, 20] }, { sign: "Aquarius", emoji: "♒", start: [1, 19] },
      { sign: "Pisces", emoji: "♓", start: [2, 20] }, { sign: "Aries", emoji: "♈", start: [3, 21] },
      { sign: "Taurus", emoji: "♉", start: [4, 20] }, { sign: "Gemini", emoji: "♊", start: [5, 21] },
      { sign: "Cancer", emoji: "♋", start: [6, 22] }, { sign: "Leo", emoji: "♌", start: [7, 23] },
      { sign: "Virgo", emoji: "♍", start: [8, 23] }, { sign: "Libra", emoji: "♎", start: [9, 23] },
      { sign: "Scorpio", emoji: "♏", start: [10, 22] }, { sign: "Sagittarius", emoji: "♐", start: [11, 22] },
      { sign: "Capricorn", emoji: "♑", start: [12, 0] },
    ];
    let zodiac = zodiacSigns[0];
    const bm = bd.getMonth(), bdd = bd.getDate();
    for (let i = zodiacSigns.length - 1; i >= 0; i--) {
      if (bm > zodiacSigns[i].start[0] || (bm === zodiacSigns[i].start[0] && bdd >= zodiacSigns[i].start[1])) { zodiac = zodiacSigns[i]; break; }
    }
    birthdayResult = { ageYears, ageMonths, ageDays, totalDays, bornDay, daysUntilBday, zodiac, nextBday };
  }

  // Year picker range
  const yearOptions = [];
  for (let y = todayYear - 50; y <= todayYear + 50; y++) yearOptions.push(y);

  const selectStyle = {
    background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 8,
    padding: "6px 10px", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
    cursor: "pointer", appearance: "none", textAlign: "center",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.2' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: 24,
  };

  // Render a single calendar day cell
  const renderDay = (day, m, compact = false) => {
    const inMonth = day.getMonth() === m;
    const isToday = day.getDate() === today && day.getMonth() === todayMonth && day.getFullYear() === todayYear;
    const dow = day.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const dateKey = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,"0")}-${String(day.getDate()).padStart(2,"0")}`;
    const holiday = holidays[dateKey];
    const moon = getMoonPhase(day);
    const showMoon = !compact && (moon.phase === 0 || moon.phase === 4); // only new/full in month view

    return (
      <div key={day.toISOString()} onClick={() => { if (inMonth && !compact) setSelectedDay(selectedDay === dateKey ? null : dateKey); }}
        style={{
          textAlign: "center", padding: compact ? "3px 0" : "6px 2px", borderRadius: compact ? 6 : 10,
          fontSize: compact ? 10 : 14, fontWeight: isToday ? 700 : 500,
          color: isToday ? "#fff" : !inMonth ? t.textMuted : holiday ? t.accent : t.text,
          background: isToday ? t.accent : isWeekend && inMonth ? `${t.accent}08` : "transparent",
          opacity: inMonth ? 1 : 0.3, cursor: inMonth && !compact ? "pointer" : "default",
          transition: "all 0.15s", position: "relative",
          outline: selectedDay === dateKey ? `2px solid ${t.accent}` : "none",
          outlineOffset: -2,
        }}>
        <div>{day.getDate()}</div>
        {!compact && holiday && <div style={{ fontSize: 8, lineHeight: 1, marginTop: 1 }} title={holiday.name}>{holiday.emoji}</div>}
        {showMoon && <div style={{ fontSize: 7, lineHeight: 1, marginTop: 1, opacity: 0.7 }} title={moon.name}>{moon.icon}</div>}
      </div>
    );
  };

  // Selected day info panel
  const selectedDayInfo = (() => {
    if (!selectedDay) return null;
    const [sy, sm, sd] = selectedDay.split("-").map(Number);
    const d = new Date(sy, sm - 1, sd);
    const dayOfYear = Math.ceil((d - new Date(sy, 0, 1)) / 86400000) + 1;
    const daysInYear = ((sy % 4 === 0 && sy % 100 !== 0) || sy % 400 === 0) ? 366 : 365;
    const diff = Math.round((d - new Date(todayYear, todayMonth, today)) / 86400000);
    const moon = getMoonPhase(d);
    const holiday = holidays[selectedDay];
    return { d, dayOfYear, daysInYear, weekNum: getWeekNum(d), diff, moon, holiday };
  })();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Calendar Card */}
      <div className="cz-calendar" style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, boxShadow: `0 4px 24px ${t.shadow}`, marginBottom: 16 }}>

        {/* View mode toggle + Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          {/* Month/Year toggle */}
          <div style={{ display: "flex", gap: 4, background: t.bgSub, borderRadius: 10, padding: 3, border: `1.5px solid ${t.borderLight}` }}>
            {[{ id: "month", label: "Month" }, { id: "year", label: "Year" }].map(m => (
              <button key={m.id} onClick={() => setViewMode(m.id)} style={{
                background: viewMode === m.id ? t.card : "transparent", color: viewMode === m.id ? t.accent : t.textMuted,
                border: viewMode === m.id ? `1.5px solid ${t.border}` : "1.5px solid transparent",
                borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
              }}>{m.label}</button>
            ))}
          </div>

          {/* Jump to month/year */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {viewMode === "month" && (
              <select value={month} onChange={e => setViewDate(new Date(year, +e.target.value, 1))} style={selectStyle}>
                {monthNames.map((mn, i) => <option key={i} value={i}>{mn}</option>)}
              </select>
            )}
            <select value={year} onChange={e => setViewDate(new Date(+e.target.value, month, 1))} style={selectStyle}>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Prev / Today / Next */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDate(new Date(year, month - (viewMode === "year" ? 12 : 1), 1))} style={{
              background: t.bgSub, border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "6px 14px",
              cursor: "pointer", fontSize: 14, color: t.textSoft, fontFamily: "'Outfit',sans-serif",
            }}>&larr;</button>
            <button onClick={() => { setViewDate(new Date(todayYear, todayMonth, 1)); setSelectedDay(null); }} style={{
              background: t.bgSub, border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "6px 14px",
              cursor: "pointer", fontSize: 11, fontWeight: 600, color: t.accent, fontFamily: "'Outfit',sans-serif",
            }}>Today</button>
            <button onClick={() => setViewDate(new Date(year, month + (viewMode === "year" ? 12 : 1), 1))} style={{
              background: t.bgSub, border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "6px 14px",
              cursor: "pointer", fontSize: 14, color: t.textSoft, fontFamily: "'Outfit',sans-serif",
            }}>&rarr;</button>
          </div>
        </div>

        {/* ══ MONTH VIEW ══ */}
        {viewMode === "month" && (<>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{monthNames[month]} {year}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Week {getWeekNum(accurateNow)}</div>
          </div>

          {/* Day headers */}
          <div className="cz-calendar-grid" style={{ display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textAlign: "center", padding: 6 }}>Wk</div>
            {dayNames.map((d, i) => (
              <div key={d+i} style={{
                fontSize: 11, color: (i === 0 || i === 6) ? t.accent : t.textMuted, fontWeight: 700,
                textAlign: "center", padding: 6, textTransform: "uppercase", letterSpacing: 0.5,
              }}>{d}</div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => {
            if (wi > 4 && week[0].getMonth() !== month) return null;
            return (
              <div key={wi} className="cz-calendar-grid" style={{ display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", gap: 2 }}>
                <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 500, textAlign: "center", padding: "8px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {getWeekNum(week[0])}
                </div>
                {week.map((day) => renderDay(day, month))}
              </div>
            );
          })}

          {/* Moon phase legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            {[{ icon: "🌑", label: "New Moon" }, { icon: "🌕", label: "Full Moon" }, { icon: "🎃", label: "Holiday" }].map(l => (
              <div key={l.label} style={{ fontSize: 11, color: t.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12 }}>{l.icon}</span> {l.label}
              </div>
            ))}
            <div style={{ fontSize: 11, color: t.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: `${t.accent}15`, border: `1px solid ${t.accent}30` }} /> Weekend
            </div>
          </div>

          {/* Selected day detail panel */}
          {selectedDayInfo && (
            <div style={{
              marginTop: 16, background: t.bgSub, borderRadius: 16, padding: "16px 20px",
              border: `1.5px solid ${t.accent}30`, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", alignItems: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>{selectedDayInfo.d.getDate()}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{selectedDayInfo.d.toLocaleDateString(lang || "en", { weekday: "long", month: "long", year: "numeric" })}</div>
              </div>
              <div style={{ width: 1, height: 40, background: t.borderLight }} />
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[
                  { label: "Day of Year", value: `${selectedDayInfo.dayOfYear} / ${selectedDayInfo.daysInYear}` },
                  { label: "Week", value: `#${selectedDayInfo.weekNum}` },
                  { label: selectedDayInfo.diff === 0 ? "Today" : selectedDayInfo.diff > 0 ? "Days Away" : "Days Ago", value: selectedDayInfo.diff === 0 ? "✓" : Math.abs(selectedDayInfo.diff).toString() },
                  { label: "Moon", value: `${selectedDayInfo.moon.icon} ${selectedDayInfo.moon.name}` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.value}</div>
                  </div>
                ))}
                {selectedDayInfo.holiday && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Holiday</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.accent }}>{selectedDayInfo.holiday.emoji} {selectedDayInfo.holiday.name}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>)}

        {/* ══ YEAR VIEW ══ */}
        {viewMode === "year" && (<>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.text }}>{year}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
            {Array.from({ length: 12 }, (_, mi) => {
              const mWeeks = genMonth(year, mi);
              const isCurrMonth = todayMonth === mi && todayYear === year;
              return (
                <div key={mi}
                  onClick={() => { setViewDate(new Date(year, mi, 1)); setViewMode("month"); }}
                  style={{
                    background: isCurrMonth ? `${t.accent}08` : t.bgSub, borderRadius: 14,
                    padding: "10px 8px", border: `1.5px solid ${isCurrMonth ? t.accent + "40" : t.borderLight}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isCurrMonth ? t.accent : t.textSoft, textAlign: "center", marginBottom: 6 }}>
                    {monthNamesShort[mi]}
                  </div>
                  {/* Mini day headers */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 2 }}>
                    {dayNames.map((dn, di) => (
                      <div key={di} style={{ fontSize: 7, color: (di === 0 || di === 6) ? `${t.accent}90` : t.textMuted, textAlign: "center", fontWeight: 700 }}>{dn}</div>
                    ))}
                  </div>
                  {/* Mini weeks */}
                  {mWeeks.map((week, wi) => {
                    if (wi > 4 && week[0].getMonth() !== mi) return null;
                    return (
                      <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0 }}>
                        {week.map((day, di) => {
                          const inM = day.getMonth() === mi;
                          const isTdy = day.getDate() === today && day.getMonth() === todayMonth && day.getFullYear() === todayYear;
                          const isWknd = day.getDay() === 0 || day.getDay() === 6;
                          const dk = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,"0")}-${String(day.getDate()).padStart(2,"0")}`;
                          const hol = getHolidays(year)[dk];
                          return (
                            <div key={di} style={{
                              textAlign: "center", fontSize: 8, padding: "2px 0",
                              fontWeight: isTdy ? 800 : 400,
                              color: isTdy ? "#fff" : !inM ? "transparent" : hol ? t.accent : isWknd ? `${t.accent}90` : t.textSoft,
                              background: isTdy ? t.accent : "transparent",
                              borderRadius: isTdy ? 4 : 0,
                            }}>{inM ? day.getDate() : ""}</div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>)}
      </div>

      {/* Upcoming Holidays Card */}
      <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 28, boxShadow: `0 4px 24px ${t.shadow}`, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Upcoming Holidays</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {Object.entries({ ...getHolidays(todayYear), ...getHolidays(todayYear + 1) })
            .filter(([key]) => new Date(key + "T00:00:00") >= new Date(todayYear, todayMonth, today))
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(0, 8)
            .map(([key, hol]) => {
              const d = new Date(key + "T00:00:00");
              const diff = Math.round((d - new Date(todayYear, todayMonth, today)) / 86400000);
              return (
                <div key={key} style={{
                  background: t.bgSub, borderRadius: 12, padding: "10px 14px", border: `1px solid ${t.borderLight}`,
                  textAlign: "center", minWidth: 110,
                }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{hol.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{hol.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{d.toLocaleDateString(lang || "en", { month: "short", day: "numeric" })}</div>
                  <div style={{ fontSize: 10, color: t.accent, fontWeight: 600, marginTop: 2 }}>{diff === 0 ? "Today!" : `${diff} days`}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Date Calculator */}
      <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, boxShadow: `0 4px 24px ${t.shadow}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>{tr("calendar.dateCalc")}</div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: t.bgSub, borderRadius: 12, padding: 4, justifyContent: "center", border: `1.5px solid ${t.borderLight}`, flexWrap: "wrap" }}>
          {[{ id: "between", label: "Days Between" }, { id: "add", label: "Add/Subtract Days" }, { id: "birthday", label: "Age Calculator" }].map(m => (
            <button key={m.id} onClick={() => setCalcMode(m.id)} style={{
              background: calcMode === m.id ? t.card : "transparent", color: calcMode === m.id ? t.accent : t.textMuted,
              border: calcMode === m.id ? `1.5px solid ${t.border}` : "1.5px solid transparent",
              borderRadius: 10, padding: "9px 22px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
            }}>{m.label}</button>
          ))}
        </div>

        {calcMode === "between" && (<>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Start Date</div>
              <input type="date" value={dateA} onChange={e => setDateA(e.target.value)} style={{
                background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit',sans-serif",
              }} />
            </div>
            <div style={{ fontSize: 20, color: t.textMuted, marginTop: 20 }}>&rarr;</div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>End Date</div>
              <input type="date" value={dateB} onChange={e => setDateB(e.target.value)} style={{
                background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit',sans-serif",
              }} />
            </div>
          </div>
          {calcResult && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              {[{ v: calcResult.days, l: "Total Days", fmt: v => v.toString() }, { v: calcResult.weeks, l: "Total Weeks", fmt: v => Number.isInteger(v) ? v.toString() : v.toFixed(2) }, { v: calcResult.months, l: "Total Months", fmt: v => Number.isInteger(v) ? v.toString() : v.toFixed(2) }].map((r, i) => (
                <React.Fragment key={r.l}>
                  {i > 0 && <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontStyle: "italic" }}>or</div>}
                  <div style={{ background: t.bgSub, borderRadius: 14, padding: "14px 24px", textAlign: "center", border: `1px solid ${t.borderLight}`, minWidth: 100 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>{r.fmt(r.v)}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{r.l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </>)}

        {calcMode === "add" && (<>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Start Date</div>
              <input type="date" value={dateA} onChange={e => setDateA(e.target.value)} style={{
                background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit',sans-serif",
              }} />
            </div>
            <div style={{ fontSize: 20, color: t.textMuted, marginTop: 20 }}>+</div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Days</div>
              <input type="number" value={addDays} onChange={e => setAddDays(+e.target.value)} style={{
                background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit',sans-serif", width: 100, textAlign: "center",
              }} />
            </div>
          </div>
          {calcResult?.resultDate && (
            <div style={{ textAlign: "center", background: t.bgSub, borderRadius: 14, padding: "18px 24px", border: `1px solid ${t.borderLight}` }}>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Result</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>
                {calcResult.resultDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          )}
        </>)}

        {calcMode === "birthday" && (<>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Your Birthday</div>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} style={{
                background: t.bgSub, color: t.text, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, fontFamily: "'Outfit',sans-serif",
              }} />
            </div>
          </div>
          {birthdayResult && (
            <div>
              {/* Age display */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 42, fontWeight: 700, color: t.accent, lineHeight: 1.1 }}>
                  {birthdayResult.ageYears} years
                </div>
                <div style={{ fontSize: 16, color: t.textSoft, marginTop: 4 }}>
                  {birthdayResult.ageMonths} months, {birthdayResult.ageDays} days
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                <div style={{ background: t.bgSub, borderRadius: 14, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.borderLight}` }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{birthdayResult.totalDays.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Days Alive</div>
                </div>
                <div style={{ background: t.bgSub, borderRadius: 14, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.borderLight}` }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{birthdayResult.bornDay}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Born On</div>
                </div>
                <div style={{ background: t.bgSub, borderRadius: 14, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.borderLight}` }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: birthdayResult.daysUntilBday <= 30 ? "#22c55e" : t.accent }}>
                    {birthdayResult.daysUntilBday === 0 ? "Today!" : `${birthdayResult.daysUntilBday}`}
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    {birthdayResult.daysUntilBday === 0 ? "Happy Birthday!" : "Days Until Birthday"}
                  </div>
                </div>
                <div style={{ background: t.bgSub, borderRadius: 14, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.borderLight}` }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{birthdayResult.zodiac.emoji} {birthdayResult.zodiac.sign}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Zodiac Sign</div>
                </div>
              </div>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}


function CitySearchBar({ t, onSelect, accurateNow }) {
  const { t: tr } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowResults(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    setSelectedResult(null);
    if (val.length < 2) { setResults([]); setShowResults(false); setLoading(false); return; }
    const q = val.toLowerCase();

    // Check cache first
    if (cacheRef.current[q]) {
      setResults(cacheRef.current[q]);
      setShowResults(true);
      setLoading(false);
      return;
    }

    // Debounced search via backend API (150K+ cities)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const apiResults = await searchCities(val, 12);
      if (apiResults && apiResults.length > 0) {
        cacheRef.current[q] = apiResults;
        setResults(apiResults);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(true);
      }
      setLoading(false);
    }, 300);
  };

  const selectCity = (city) => {
    setSelectedResult(city);
    setQuery(`${city.city}${city.state ? ", " + city.state : ""}, ${city.country}`);
    setShowResults(false);
    if (onSelect) onSelect(city);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedResult(null);
    setShowResults(false);
    if (onSelect) onSelect(null);
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", marginBottom: 20 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: t.card, borderRadius: 16, border: `1.5px solid ${t.border}`,
        padding: "12px 18px", boxShadow: `0 2px 12px ${t.shadow}`,
      }}>
        <span style={{ fontSize: 18, opacity: 0.6 }}>🔍</span>
        <input
          ref={inputRef} type="text" value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          placeholder={tr("search.placeholder")}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none",
            fontSize: 16, fontWeight: 500, color: t.text, fontFamily: "'Outfit', sans-serif" }}
        />
        {loading && <span style={{ fontSize: 12, color: t.accent, fontWeight: 600, whiteSpace: "nowrap", animation: "pulse 1s infinite" }}>{ tr("search.searching") }</span>}
        {query && <button onClick={clearSearch} style={{
          background: t.bgSub, border: "none", borderRadius: 8, width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 14, color: t.textMuted, fontFamily: "'Outfit', sans-serif",
        }}>×</button>}
      </div>

      {showResults && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
          background: t.card, borderRadius: 16, border: `1.5px solid ${t.border}`,
          boxShadow: `0 12px 40px ${t.shadow}`, maxHeight: 420, overflowY: "auto", padding: 6,
        }}>
          {results.length === 0 && !loading && query.length >= 2 && (
            <div style={{ padding: "20px 16px", textAlign: "center", color: t.textMuted, fontSize: 14 }}>
              {tr("search.noResultsFor").replace("{q}", query)}
            </div>
          )}
          {results.length === 0 && loading && (
            <div style={{ padding: "20px 16px", textAlign: "center", color: t.accent, fontSize: 14, animation: "pulse 1s infinite" }}>
              {tr("search.searchingWorldwide")}
            </div>
          )}
          {results.map((c, i) => {
            let tzTime, timeStr, ampm, night;
            try {
              tzTime = new Date(accurateNow.toLocaleString("en-US", { timeZone: c.tz }));
              timeStr = formatTime(tzTime, false);
              ampm = tzTime.getHours() >= 12 ? "PM" : "AM";
              night = isNight(tzTime);
            } catch (e) { tzTime = accurateNow; timeStr = "--:--"; ampm = ""; night = false; }
            return (
              <div key={`${c.city}-${c.country}-${i}`} onClick={() => selectCity(c)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", borderRadius: 12, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = t.bgSub}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{c.city}</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>{c.state ? `${c.state}, ` : ""}{c.country}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: night ? t.secondary : t.accent, fontVariantNumeric: "tabular-nums" }}>
                    {timeStr} <span style={{ fontSize: 11, fontWeight: 600 }}>{ampm}</span>
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{night ? "🌙" : "☀️"} {tzTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            );
          })}
          {results.length > 0 && (
            <div style={{ padding: "8px 16px", textAlign: "center", fontSize: 11, color: t.textMuted }}>
              {tr("search.subtitle")}
            </div>
          )}
        </div>
      )}

      {selectedResult && null}
    </div>
  );
}

function SearchResultCard({ city, t, accurateNow, onClose }) {
  const { t: tr } = useI18n();
  let tzTime, sun;
  try {
    tzTime = new Date(accurateNow.toLocaleString("en-US", { timeZone: city.tz }));
    sun = getSunTimes(accurateNow, city.lat, city.lng);
  } catch (e) { tzTime = accurateNow; sun = { sunrise: "N/A", sunset: "N/A", dayLength: "N/A" }; }
  const night = isNight(tzTime);
  let diffStr = "Unknown";
  try {
    const localOffset = -new Date().getTimezoneOffset();
    const cityDate = new Date(accurateNow.toLocaleString("en-US", { timeZone: city.tz }));
    const utcDate = new Date(accurateNow.toLocaleString("en-US", { timeZone: "UTC" }));
    const cityOffMin = Math.round((cityDate - utcDate) / 60000);
    const diffMin = cityOffMin - localOffset;
    const diffH = Math.floor(Math.abs(diffMin) / 60);
    const diffM = Math.abs(diffMin) % 60;
    diffStr = diffMin === 0 ? tr("world.sameAsYou") : `${diffMin > 0 ? "+" : "-"}${diffH}h${diffM ? ` ${diffM}m` : ""} ${tr("world.fromYou")}`;
  } catch (e) {}

  return (
    <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 28, marginTop: 16, boxShadow: `0 4px 24px ${t.shadow}`, position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: t.bgSub, border: `1px solid ${t.borderLight}`, borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>×</button>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{tr("clock.accurateTime")}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{city.city}{city.state ? `, ${city.state}` : ""}</div>
        <div style={{ fontSize: 16, color: t.textSoft, fontWeight: 500 }}>{city.country}</div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: t.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-2px", lineHeight: 1, display: "inline-flex", alignItems: "baseline" }}>
          <span>{formatTime(tzTime, false)}</span>
          <span style={{ fontSize: 32, fontWeight: 600, color: t.accent, marginLeft: 2 }}>:{tzTime.getSeconds().toString().padStart(2, "0")}</span>
          <span style={{ fontSize: 20, fontWeight: 500, color: t.textMuted, marginLeft: 6 }}>{tzTime.getHours() >= 12 ? "pm" : "am"}</span>
        </div>
        <div style={{ fontSize: 15, color: t.textSoft, marginTop: 8 }}>{tzTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: tr("clock.timezone"), value: getTZFull(city.tz, accurateNow) },
          { label: tr("clock.difference"), value: diffStr },
          { label: tr("sun.sunrise"), value: sun.sunrise },
          { label: tr("sun.sunset"), value: sun.sunset },
          { label: tr("sun.daylight"), value: sun.dayLength },
          { label: tr("world.night"), value: night ? "🌙" : "☀️" },
        ].map(p => (
          <div key={p.label} style={{ background: t.bgSub, borderRadius: 12, padding: "10px 16px", textAlign: "center", border: `1px solid ${t.borderLight}`, minWidth: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{p.label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ GOOGLE AD PLACEHOLDERS ══════════ */
/*
 * Replace the placeholder content with actual Google AdSense code.
 * 
 * To set up:
 * 1. Sign up at https://adsense.google.com
 * 2. Add your site and get approved
 * 3. Replace the ad-slot values below with your real ad unit IDs
 * 4. Add the AdSense script to layout.js:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
 *
 * Ad Slot Locations:
 *   slot-1 : Below nav, above search (Leaderboard 728×90)
 *   slot-2 : After hero section (Rectangle 336×280)
 *   slot-3 : Before world clocks (In-article 468×60)
 *   slot-4 : End of tab content (Rectangle 300×250)
 *   slot-5 : Above footer (Leaderboard 728×90)
 */

const AD_CONFIG = {
  enabled: true, // Set to false to hide all ads
  // Replace with your real Google AdSense publisher ID
  publisherId: "ca-pub-XXXXXXXXXXXXXXXX",
  slots: {
    "slot-1": { id: "1234567890", format: "horizontal",  label: "Leaderboard",  w: 728, h: 90  },
    "slot-2": { id: "2345678901", format: "rectangle",   label: "Rectangle",    w: 336, h: 280 },
    "slot-3": { id: "3456789012", format: "horizontal",  label: "In-Article",   w: 468, h: 60  },
    "slot-4": { id: "4567890123", format: "rectangle",   label: "Rectangle",    w: 300, h: 250 },
    "slot-5": { id: "5678901234", format: "horizontal",  label: "Leaderboard",  w: 728, h: 90  },
  },
};

function AdPlaceholder({ slot, t, style = {} }) {
  if (!AD_CONFIG.enabled) return null;
  const cfg = AD_CONFIG.slots[slot];
  if (!cfg) return null;

  const isHorizontal = cfg.format === "horizontal";

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: "8px 0",
      ...style,
    }}>
      <div style={{
        width: "100%",
        maxWidth: cfg.w,
        minHeight: cfg.h,
        background: `${t.bgSub}`,
        border: `1.5px dashed ${t.border}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 
          ┌─────────────────────────────────────────────────┐
          │ REPLACE THIS ENTIRE <div> WITH GOOGLE ADSENSE:  │
          │                                                 │
          │ <ins className="adsbygoogle"                    │
          │   style={{ display: "block" }}                  │
          │   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"      │
          │   data-ad-slot="{cfg.id}"                       │
          │   data-ad-format="auto"                         │
          │   data-full-width-responsive="true" />          │
          │                                                 │
          │ Then add in a useEffect:                        │
          │   (window.adsbygoogle = window.adsbygoogle      │
          │    || []).push({});                              │
          └─────────────────────────────────────────────────┘
        */}
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", opacity: 0.5 }}>
          Advertisement
        </div>
        <div style={{
          width: Math.min(cfg.w - 32, isHorizontal ? 400 : 200),
          height: isHorizontal ? 30 : 100,
          background: `linear-gradient(135deg, ${t.border} 0%, transparent 100%)`,
          borderRadius: 8,
          opacity: 0.3,
        }} />
        <div style={{ fontSize: 10, color: t.textMuted, opacity: 0.4 }}>
          {cfg.label} • {cfg.w}×{cfg.h}
        </div>
      </div>
    </div>
  );
}

/* ══════════ MAIN ══════════ */
export default function ClockzillaApp() {
  const { t: tr, dir, lang } = useI18n();
  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState("clock");
  const [selectedTZ, setSelectedTZ] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [themeKey, setThemeKey] = useState("earth");
  const [footerPage, setFooterPage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [worldClocks, setWorldClocks] = useState([...WORLD_CLOCKS]);
  const t = THEMES[themeKey];
  const sync = useTimeSync();
  const userLoc = useUserLocation();

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 50); return () => clearInterval(id); }, []);
  useEffect(() => { const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 12000); return () => clearInterval(id); }, []);

  const accurateNow = sync.offset !== null ? new Date(now.getTime() + sync.offset) : now;
  const displayDate = selectedTZ
    ? new Date(accurateNow.toLocaleString("en-US", { timeZone: selectedTZ.tz }))
    : accurateNow;

  const dayProgress = getDayProgress(accurateNow);
  const yearProgress = getYearProgress();
  const weekDay = accurateNow.toLocaleDateString(lang || "en", { weekday: "long" });
  const dateStr = accurateNow.toLocaleDateString(lang || "en", { month: "long", day: "numeric", year: "numeric" });
  const dayOfYear = Math.ceil((accurateNow - new Date(accurateNow.getFullYear(), 0, 1)) / 86400000);
  const weekNum = Math.ceil(dayOfYear / 7);
  const unixTime = Math.floor(accurateNow.getTime() / 1000);

  const tabs = [
    { id: "clock", label: tr("tabs.clock") }, { id: "world", label: tr("tabs.world") }, { id: "converter", label: tr("tabs.converter") },
    { id: "countdown", label: tr("tabs.countdown") }, { id: "calendar", label: tr("tabs.calendar") },
    { id: "stopwatch", label: tr("tabs.stopwatch") }, { id: "timer", label: tr("tabs.timer") },
    { id: "pomodoro", label: "Pomodoro" },
  ];

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div onClick={() => setIsFullscreen(false)} style={{
        position: "fixed", inset: 0, zIndex: 300, background: t.bg, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Outfit', sans-serif", transition: "background 0.4s",
      }}>
        <style>{`
          @keyframes tickBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {sync.syncStatus === "synced" ? tr("clock.accurateTime") : tr("clock.localTime")}
        </div>
        {selectedTZ && (
          <div style={{ fontSize: "min(4vw, 40px)", fontWeight: 700, color: t.text, marginBottom: 8 }}>
            {selectedTZ.city}{selectedTZ.state ? `, ${selectedTZ.state}` : ""}
          </div>
        )}
        <div style={{ fontSize: "min(22vw, 240px)", fontWeight: 700, color: t.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-6px", lineHeight: 1, display: "flex", alignItems: "baseline" }}>
          <span>{formatTime(displayDate, false)}</span>
          <span style={{ fontSize: "min(10vw, 100px)", fontWeight: 600, color: t.accent, animation: "tickBlink 1s ease infinite", letterSpacing: "-2px" }}>
            :{displayDate.getSeconds().toString().padStart(2, "0")}
          </span>
          <span style={{ fontSize: "min(4vw, 44px)", fontWeight: 500, color: t.textMuted, marginLeft: 12 }}>
            {displayDate.getHours() >= 12 ? "pm" : "am"}
          </span>
        </div>
        <div style={{ fontSize: "min(3vw, 28px)", fontWeight: 400, color: t.textSoft, marginTop: 20 }}>
          {displayDate.toLocaleDateString(lang || "en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <div className="cz-fullscreen-tz" style={{ fontSize: "min(1.8vw, 16px)", fontWeight: 500, color: t.textMuted, marginTop: 12, textAlign: "center", padding: "0 24px" }}>
          {selectedTZ
            ? `${selectedTZ.city}${selectedTZ.state ? `, ${selectedTZ.state}` : ""}, ${selectedTZ.country} · ${getTZFull(selectedTZ.tz, accurateNow)}`
            : `${userLoc.displayName} · ${getTZFull(userLoc.tz, accurateNow)}`
          }
        </div>
        <div style={{ position: "absolute", bottom: 30, fontSize: 12, color: t.textMuted }}>Click anywhere to exit fullscreen</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Outfit', sans-serif", transition: "background 0.4s, color 0.4s" }}>
      <style>{`
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeSlide { 0% { opacity:0; transform:translateY(8px); } 10% { opacity:1; transform:translateY(0); } 90% { opacity:1; } 100% { opacity:0; transform:translateY(-8px); } }
        @keyframes tickBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .wc-card { transition: all 0.25s ease; }
        .wc-card:hover { transform: translateY(-2px); }
        .scroll-row::-webkit-scrollbar { height: 4px; }
        .scroll-row::-webkit-scrollbar-track { background: transparent; }
        .scroll-row::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      `}</style>

      <div style={{ height: 3, background: t.gradientBar, transition: "background 0.4s" }} />

      <div className="cz-main" style={{ maxWidth: 1600, margin: "0 auto", padding: "20px 50px 40px" }}>
        {/* Header */}
        <header className="cz-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/clockzilla-icon.png" alt="Clockzilla" style={{ width: 60, height: 60, borderRadius: 14, objectFit: "cover", transition: "transform 0.3s" }} />
            <div>
              <h1 className="cz-header-logo" style={{ fontSize: 42, fontWeight: 400, letterSpacing: "2px", color: t.text, lineHeight: 1, fontFamily: "'Anton', sans-serif", textTransform: "uppercase" }}>Clockzilla</h1>
              <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 400, letterSpacing: 0.5 }}>Ferociously Accurate Time</div>
            </div>
          </div>
          <div className="cz-header-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SyncBadge sync={sync} t={t} onResync={sync.resync} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{weekDay}</div>
              <div style={{ fontSize: 13, color: t.textMuted }}>{dateStr}</div>
              <div style={{ fontSize: 12, color: t.accent, fontWeight: 500 }}>{userLoc.displayName}</div>
            </div>
            <ThemeSwitcher current={themeKey} onChange={setThemeKey} t={t} />
          </div>
        </header>

        {/* Nav */}
        <nav className="scroll-row cz-nav" style={{ display: "flex", gap: 4, marginBottom: 16, background: t.bgSub, borderRadius: 14, padding: 4, border: `1.5px solid ${t.borderLight}`, overflowX: "auto" }}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => { setTab(tb.id); setSelectedTZ(null); }} style={{
              background: tab === tb.id ? t.card : "transparent", color: tab === tb.id ? t.accent : t.textMuted,
              border: tab === tb.id ? `1.5px solid ${t.border}` : "1.5px solid transparent",
              borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontSize: 15, fontWeight: 600,
              fontFamily: "'Outfit', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap",
              boxShadow: tab === tb.id ? `0 2px 8px ${t.shadow}` : "none", flex: 1, textAlign: "center",
            }}>{tb.label}</button>
          ))}
        </nav>

        {/* Location permission banner */}
        <LocationBanner userLoc={userLoc} t={t} />

        {/* City Search - only on Clock and World tabs */}
        {(tab === "clock" || tab === "world") && (
        <CitySearchBar t={t} accurateNow={accurateNow} onSelect={(city) => {
          if (city) {
            if (tab === "world") {
              // Add to world clocks grid
              setWorldClocks(prev => {
                const exists = prev.some(c => c.city === city.city && c.tz === city.tz);
                if (exists) return prev;
                return [...prev, { city: city.city, tz: city.tz, emoji: "📍", country: city.country }];
              });
            } else {
              setSelectedTZ({ city: city.city, tz: city.tz, emoji: "", country: city.country, state: city.state, lat: city.lat, lng: city.lng });
            }
          } else {
            setSelectedTZ(null);
          }
        }} />
        )}

        {/* CLOCK TAB */}
        {tab === "clock" && (<div>
          {/* Hero: Massive Time Display */}
          <div className="cz-hero" style={{
            background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`,
            padding: "28px 20px 28px", marginBottom: 16, boxShadow: `0 4px 24px ${t.shadow}`,
            textAlign: "center", overflow: "hidden",
          }}>
            {/* Sync status label */}
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              {sync.syncStatus === "synced" ? tr("clock.accurateTime") : sync.syncStatus === "syncing" ? tr("clock.synchronizing") : tr("clock.localTime")}
            </div>

            {/* Location — big and prominent */}
            {selectedTZ
              ? <div style={{ marginBottom: 4 }}>
                  <div className="cz-hero-city" style={{ fontSize: 32, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>
                    {selectedTZ.emoji} {selectedTZ.city}{selectedTZ.state ? `, ${selectedTZ.state}` : ""}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: t.textSoft, marginTop: 2 }}>
                    {selectedTZ.country}
                    <span className="cz-hero-tz" style={{ color: t.textMuted, marginLeft: 8, fontSize: 14 }}>{getTZFull(selectedTZ.tz, accurateNow)}</span>
                  </div>
                </div>
              : <div style={{ marginBottom: 4 }}>
                  <div className="cz-hero-city" style={{ fontSize: 32, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>
                    {userLoc.city}{userLoc.state && userLoc.state !== userLoc.city ? `, ${userLoc.state}` : ""}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: t.textSoft, marginTop: 2 }}>
                    {userLoc.country}
                    <span className="cz-hero-tz" style={{ color: t.textMuted, marginLeft: 8, fontSize: 14 }}>{getTZFull(userLoc.tz, accurateNow)}</span>
                    {userLoc.source === "gps" && <span style={{ fontSize: 10, color: t.success, marginLeft: 8, background: `${t.success}18`, padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>GPS</span>}
                  </div>
                </div>
            }

            {/* THE BIG TIME */}
            <div style={{
              fontSize: "min(16vw, 180px)", fontWeight: 700, letterSpacing: "-4px", lineHeight: 1,
              color: t.text, fontVariantNumeric: "tabular-nums",
              margin: "8px 0 0",
              display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "nowrap",
            }}>
              <span>{formatTime(displayDate, false)}</span>
              <span style={{
                fontSize: "min(7vw, 76px)", fontWeight: 600, color: t.accent,
                animation: "tickBlink 1s ease infinite", letterSpacing: "-1px",
              }}>
                :{displayDate.getSeconds().toString().padStart(2, "0")}
              </span>
              <span style={{
                fontSize: "min(3.5vw, 38px)", fontWeight: 500, color: t.textMuted,
                marginLeft: 8, letterSpacing: 0,
              }}>
                {displayDate.getHours() >= 12 ? "pm" : "am"}
              </span>
            </div>

            {/* Milliseconds */}

            {/* Date line + meta */}
            <div className="cz-date-row" style={{
              fontSize: 22, fontWeight: 400, color: t.textSoft, marginTop: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap",
            }}>
              <span>{accurateNow.toLocaleDateString(lang || "en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              <span style={{ opacity: 0.3, fontSize: 16 }}>&middot;</span>
              <span style={{ fontSize: 16, color: t.textMuted, fontWeight: 500 }}>Day {dayOfYear}</span>
              <span style={{ opacity: 0.3, fontSize: 16 }}>&middot;</span>
              <span style={{ fontSize: 16, color: t.textMuted, fontWeight: 500 }}>Week {weekNum}</span>
              <span style={{ opacity: 0.3, fontSize: 16 }}>&middot;</span>
              <button onClick={() => setIsFullscreen(true)} style={{
                background: t.bgSub, border: `1.5px solid ${t.borderLight}`, borderRadius: 8,
                padding: "4px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600,
                color: t.accent, fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
              }}>{ tr("clock.fullscreen") }</button>
            </div>

            {/* Clock offset comparison */}
            {(() => {
              const sunLat = selectedTZ?.lat ?? userLoc.lat;
              const sunLng = selectedTZ?.lng ?? userLoc.lng;
              const heroSun = getSunTimes(accurateNow, sunLat, sunLng);

              // Compute timezone difference when a city is selected
              let diffStr = null;
              if (selectedTZ) {
                try {
                  const localOffset = -new Date().getTimezoneOffset();
                  const cityDate = new Date(accurateNow.toLocaleString("en-US", { timeZone: selectedTZ.tz }));
                  const utcDate = new Date(accurateNow.toLocaleString("en-US", { timeZone: "UTC" }));
                  const cityOffMin = Math.round((cityDate - utcDate) / 60000);
                  const diffMin = cityOffMin - localOffset;
                  const diffH = Math.floor(Math.abs(diffMin) / 60);
                  const diffM = Math.abs(diffMin) % 60;
                  diffStr = diffMin === 0 ? tr("world.sameAsYou") : `${diffMin > 0 ? "+" : "-"}${diffH}h${diffM ? ` ${diffM}m` : ""} ${tr("world.fromYou")}`;
                } catch (e) {}
              }

              return (
            <div className="cz-stats-row" style={{
              marginTop: 20, display: "inline-flex", gap: 24, fontSize: 14,
              background: t.bgSub, padding: "12px 24px", borderRadius: 14,
              border: `1px solid ${t.borderLight}`, flexWrap: "wrap", justifyContent: "center",
            }}>
              {selectedTZ ? (<>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("clock.timezone") }</div>
                  <div style={{ color: t.textSoft, fontWeight: 500 }}>{getTZFull(selectedTZ.tz, accurateNow)}</div>
                </div>
                <div style={{ width: 1, background: t.borderLight }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("clock.difference") }</div>
                  <div style={{ color: t.accent, fontWeight: 600 }}>{diffStr || "—"}</div>
                </div>
                <div style={{ width: 1, background: t.borderLight }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("sun.sunrise") }</div>
                  <div style={{ color: t.warn || t.accent, fontWeight: 600 }}>{heroSun.sunrise}</div>
                </div>
                <div style={{ width: 1, background: t.borderLight }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("sun.sunset") }</div>
                  <div style={{ color: t.secondary, fontWeight: 600 }}>{heroSun.sunset}</div>
                </div>
                <div style={{ width: 1, background: t.borderLight }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("sun.daylight") }</div>
                  <div style={{ color: t.textSoft, fontWeight: 600 }}>{heroSun.dayLength}</div>
                </div>
              </>) : (<>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("clock.yourClock") }</div>
                <div style={{ color: t.textSoft, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{formatTime(now)}</div>
              </div>
              <div style={{ width: 1, background: t.borderLight }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("clock.difference") }</div>
                <div style={{
                  color: sync.offset !== null && Math.abs(sync.offset) < 50 ? t.success : t.accent,
                  fontVariantNumeric: "tabular-nums", fontWeight: 600,
                }}>
                  {sync.offset !== null
                    ? (Math.abs(sync.offset) < 50 ? tr("sync.synced") : `${sync.offset < 0 ? "Ahead" : "Behind"} ${(Math.abs(sync.offset) / 1000).toFixed(2)} seconds`)
                    : "\u2014"}
                </div>
              </div>
              <div style={{ width: 1, background: t.borderLight }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("clock.accuracy") }</div>
                <div style={{ color: t.textSoft, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                  {sync.accuracy !== null ? `\u00B1${Math.round(sync.accuracy)}ms` : "\u2014"}
                </div>
              </div>
              <div style={{ width: 1, background: t.borderLight }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("sun.sunrise") }</div>
                <div style={{ color: t.warn || t.accent, fontWeight: 600 }}>{heroSun.sunrise}</div>
              </div>
              <div style={{ width: 1, background: t.borderLight }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ color: t.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{ tr("sun.sunset") }</div>
                <div style={{ color: t.secondary, fontWeight: 600 }}>{heroSun.sunset}</div>
              </div>
              </>)}
            </div>
              );
            })()}

          </div>

          {/* Analog clock + Offset panel side by side */}
          <div className="cz-clock-offset-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{
              background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`,
              padding: 24, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 12px ${t.shadow}`,
            }}>
              <AnalogClock date={displayDate} size={200} t={t} />
            </div>
            <OffsetHero offset={sync.offset} accuracy={sync.accuracy} syncStatus={sync.syncStatus} sourceResults={sync.sourceResults} samples={sync.samples} t={t} />
          </div>

          {/* Ad Slot 2: After analog clock section */}
          <AdPlaceholder slot="slot-2" t={t} style={{ marginBottom: 16 }} />

          {/* Progress + Stats */}
          <div className="cz-progress-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: "28px 20px", display: "flex", justifyContent: "center", boxShadow: `0 2px 12px ${t.shadow}` }}>
              <ProgressRing value={dayProgress} color={t.accent} label={tr("clock.dayProgress")} detail={`${Math.floor((100 - dayProgress) * 864 / 100)}m left`} t={t} />
            </div>
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: "28px 20px", display: "flex", justifyContent: "center", boxShadow: `0 2px 12px ${t.shadow}` }}>
              <ProgressRing value={yearProgress} color={t.secondary} label={tr("clock.yearProgress")} detail={`${365 - dayOfYear} days left`} t={t} />
            </div>
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "center", boxShadow: `0 2px 12px ${t.shadow}` }}>
              <StatPill t={t} label={tr("clock.location")} value={userLoc.displayName} icon="📍" />
              <StatPill t={t} label={tr("clock.timezone")} value={getTZFull(userLoc.tz, accurateNow)} icon="🌍" />
              <StatPill t={t} label={tr("clock.utcOffset")} value={`UTC${now.getTimezoneOffset() <= 0 ? "+" : "-"}${Math.abs(now.getTimezoneOffset() / 60)}`} icon="⏱️" />
            </div>
          </div>

          {/* Sunrise & Sunset */}
          <div style={{ marginBottom: 16 }}>
            <SunriseSunsetCard date={accurateNow} t={t} loc={userLoc} />
          </div>

          {/* DST Info */}
          <DSTInfoCard date={accurateNow} t={t} tz={selectedTZ?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone} />

          {/* Ad Slot 3: Before World Clocks */}
          <AdPlaceholder slot="slot-3" t={t} style={{ marginBottom: 16 }} />

          {/* World Clocks */}
          <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, marginBottom: 16, boxShadow: `0 2px 12px ${t.shadow}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>{ tr("world.worldClocks") }</div>
            <div className="scroll-row" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
              {worldClocks.slice(0, 6).map(wc => (
                <WorldClockCard key={wc.city} {...wc} t={t} offsetMs={sync.offset}
                  isSelected={selectedTZ?.city === wc.city}
                  onClick={() => setSelectedTZ(selectedTZ?.city === wc.city ? null : wc)} />
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{ textAlign: "center", padding: "28px 20px", background: t.bgSub, borderRadius: 20, border: `1.5px solid ${t.borderLight}` }}>
            <div key={quoteIdx} style={{ animation: "fadeSlide 12s ease-in-out" }}>
              <div style={{ fontSize: 18, fontWeight: 300, fontStyle: "italic", color: t.textSoft, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>"{QUOTES[quoteIdx].text}"</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginTop: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>— {QUOTES[quoteIdx].author}</div>
            </div>
          </div>

          {/* Ad Slot 4: End of content section */}
          <AdPlaceholder slot="slot-4" t={t} style={{ marginTop: 16 }} />
        </div>)}

        {/* ══ WORLD ══ */}
        {tab === "world" && (<div>
          <div className="cz-world-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 12 }}>
            {worldClocks.map((wc, idx) => <WorldClockCard key={`${wc.city}-${wc.tz}-${idx}`} {...wc} t={t} offsetMs={sync.offset}
              isSelected={selectedTZ?.city === wc.city}
              onClick={() => setSelectedTZ(selectedTZ?.city === wc.city ? null : wc)}
              onRemove={() => setWorldClocks(prev => prev.filter((_, i) => i !== idx))} />)}
          </div>
          {/* Day/Night Map */}
          <div style={{ marginTop: 16 }}>
            <DayNightMap date={accurateNow} t={t} worldClocks={worldClocks} onSelectCity={wc => setSelectedTZ(selectedTZ?.city === wc.city ? null : wc)} />
          </div>
          <div style={{ marginTop: 12, padding: 24, background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, boxShadow: `0 2px 12px ${t.shadow}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, marginBottom: 20, textTransform: "uppercase" }}>24-Hour Timeline</div>
            <div style={{ position: "relative", height: 56, marginBottom: 8 }}>
              <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 8, background: t.borderLight, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "25%", width: "50%", height: "100%", background: `linear-gradient(90deg, ${t.accentSoft}, ${t.secondarySoft})`, borderRadius: 4 }} />
              </div>
              {worldClocks.map(wc => {
                const time = new Date(accurateNow.toLocaleString("en-US", { timeZone: wc.tz }));
                const pos = ((time.getHours() * 60 + time.getMinutes()) / 1440) * 100;
                const isActive = selectedTZ?.city === wc.city;
                return <div key={wc.city} onClick={() => setSelectedTZ(isActive ? null : wc)}
                  style={{ position: "absolute", left: `${pos}%`, top: 18, transform: "translateX(-50%)", cursor: "pointer", zIndex: isActive ? 10 : 1 }}>
                  <div style={{ width: isActive ? 18 : 12, height: isActive ? 18 : 12, borderRadius: "50%",
                    background: isActive ? t.accent : isNight(time) ? t.dotNight : t.dotDay,
                    border: `2px solid ${t.card}`, boxShadow: isActive ? `0 0 0 2px ${t.accent}` : "0 1px 4px rgba(0,0,0,0.1)", transition: "all 0.3s" }} />
                  {isActive && <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10, whiteSpace: "nowrap", color: t.accent, fontWeight: 600 }}>{wc.city}</div>}
                </div>;
              })}
              {[0, 6, 12, 18, 24].map(h => <div key={h} style={{ position: "absolute", left: `${(h / 24) * 100}%`, top: 40, transform: "translateX(-50%)", fontSize: 10, color: t.textMuted, fontWeight: 500 }}>{h === 24 ? "0" : h}:00</div>)}
            </div>
          </div>
        </div>)}

        {/* ══ STOPWATCH ══ */}
        {tab === "stopwatch" && (
          <div className="cz-tool-card" style={{ background: t.card, borderRadius: 24, padding: 44, border: `1.5px solid ${t.border}`, maxWidth: 500, margin: "0 auto", boxShadow: `0 4px 24px ${t.shadow}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, marginBottom: 32, textTransform: "uppercase", textAlign: "center" }}>Stopwatch</div>
            <StopwatchView t={t} />
          </div>
        )}

        {/* TIMER */}
        {tab === "timer" && (
          <div className="cz-tool-card" style={{ background: t.card, borderRadius: 24, padding: 44, border: `1.5px solid ${t.border}`, maxWidth: 500, margin: "0 auto", boxShadow: `0 4px 24px ${t.shadow}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, marginBottom: 32, textTransform: "uppercase", textAlign: "center" }}>{tr("countdown.timerTitle")}</div>
            <TimerView t={t} />
          </div>
        )}

        {/* POMODORO */}
        {tab === "pomodoro" && (
          <div className="cz-tool-card" style={{ background: t.card, borderRadius: 24, padding: 44, border: `1.5px solid ${t.border}`, maxWidth: 540, margin: "0 auto", boxShadow: `0 4px 24px ${t.shadow}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, marginBottom: 32, textTransform: "uppercase", textAlign: "center" }}>Pomodoro Timer</div>
            <PomodoroView t={t} />
          </div>
        )}

        {/* CONVERTER */}
        {tab === "converter" && (
          <TimezoneConverterView t={t} worldClocks={WORLD_CLOCKS} accurateNow={accurateNow} />
        )}

        {/* COUNTDOWN */}
        {tab === "countdown" && (
          <CountdownView t={t} accurateNow={accurateNow} />
        )}

        {/* CALENDAR */}
        {tab === "calendar" && (
          <CalendarView t={t} accurateNow={accurateNow} />
        )}

        {/* Ad Slot 5: Above footer */}
        <AdPlaceholder slot="slot-5" t={t} style={{ marginTop: 32, marginBottom: 16 }} />

        {/* Footer */}
        <footer style={{ marginTop: 64, paddingTop: 40, borderTop: `1.5px solid ${t.borderLight}` }}>
          {/* Tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <img src="/clockzilla-icon.png" alt="Clockzilla" style={{ width: 58, height: 58, borderRadius: 14, objectFit: "cover" }} />
            <div>
              <div className="cz-footer-logo" style={{ fontSize: 38, fontWeight: 400, color: t.text, letterSpacing: "2px", fontFamily: "'Anton', sans-serif", textTransform: "uppercase" }}>Clockzilla</div>
              <div style={{ fontSize: 16, color: t.textMuted, fontWeight: 400 }}>{tr("footer.tagline")}</div>
            </div>
          </div>

          {/* Link columns */}
          <div className="cz-footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 36, marginBottom: 40 }}>
            {/* Tools */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textSoft, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{tr("footer.tools")}</div>
              {[
                { label: tr("footer.exactTime"), action: () => { setTab("clock"); setSelectedTZ(null); } },
                { label: tr("footer.worldClocks"), action: () => setTab("world") },
                { label: tr("footer.tzConverter"), action: () => setTab("converter") },
                { label: tr("footer.countdownDate"), action: () => setTab("countdown") },
                { label: tr("tabs.calendar"), action: () => setTab("calendar") },
                { label: tr("tabs.stopwatch"), action: () => setTab("stopwatch") },
                { label: tr("footer.countdownTimer"), action: () => setTab("timer") },
              ].map(item => (
                <div key={item.label} onClick={item.action} style={{
                  fontSize: 16, color: t.textMuted, padding: "7px 0", cursor: "pointer",
                  transition: "color 0.15s",
                }} onMouseEnter={e => e.target.style.color = t.accent}
                   onMouseLeave={e => e.target.style.color = t.textMuted}>{item.label}</div>
              ))}
            </div>

            {/* Features */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textSoft, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{tr("footer.features")}</div>
              {[
                { label: tr("footer.clockSync"), action: () => { setTab("clock"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { label: tr("footer.fullscreenClock"), action: () => setIsFullscreen(true) },
                { label: tr("footer.sunriseSunset"), action: () => setTab("clock") },
                { label: tr("footer.dayNightMap"), action: () => setTab("world") },
                { label: tr("footer.dateCalc"), action: () => setTab("calendar") },
              ].map(item => (
                <div key={item.label} onClick={item.action} style={{
                  fontSize: 16, color: t.textMuted, padding: "7px 0", cursor: "pointer",
                  transition: "color 0.15s",
                }} onMouseEnter={e => e.target.style.color = t.accent}
                   onMouseLeave={e => e.target.style.color = t.textMuted}>{item.label}</div>
              ))}
            </div>

            {/* Information */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textSoft, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{tr("footer.information")}</div>
              {[
                { label: tr("footer.about"), page: "about" },
                { label: tr("footer.faq"), page: "faq" },
                { label: tr("footer.howItWorks"), page: "how" },
                { label: tr("footer.contact"), page: "contact" },
              ].map(item => (
                <div key={item.label} onClick={() => setFooterPage(item.page)} style={{
                  fontSize: 16, color: t.textMuted, padding: "7px 0", cursor: "pointer",
                  transition: "color 0.15s",
                }} onMouseEnter={e => e.target.style.color = t.accent}
                   onMouseLeave={e => e.target.style.color = t.textMuted}>{item.label}</div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textSoft, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{tr("footer.legal")}</div>
              {[
                { label: tr("footer.privacyPolicy"), page: "privacy" },
                { label: tr("footer.termsOfUse"), page: "terms" },
                { label: tr("footer.cookiePolicy"), page: "cookies" },
              ].map(item => (
                <div key={item.label} onClick={() => setFooterPage(item.page)} style={{
                  fontSize: 16, color: t.textMuted, padding: "7px 0", cursor: "pointer",
                  transition: "color 0.15s",
                }} onMouseEnter={e => e.target.style.color = t.accent}
                   onMouseLeave={e => e.target.style.color = t.textMuted}>{item.label}</div>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div style={{ 
            borderTop: `1px solid ${t.borderLight}`, 
            paddingTop: 24, paddingBottom: 24,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <LanguageSelector theme={t} />
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: `1px solid ${t.borderLight}`, paddingTop: 20, paddingBottom: 8,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ fontSize: 14, color: t.textMuted }}>
              &copy; {new Date().getFullYear()} Clockzilla. {tr("footer.allRights")}.
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 14, flexWrap: "wrap" }}>
              <span onClick={() => setFooterPage("privacy")} style={{ color: t.textMuted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = t.accent} onMouseLeave={e => e.target.style.color = t.textMuted}>{tr("footer.privacy")}</span>
              <span onClick={() => setFooterPage("terms")} style={{ color: t.textMuted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = t.accent} onMouseLeave={e => e.target.style.color = t.textMuted}>{tr("footer.terms")}</span>
              <span onClick={() => { try { localStorage.removeItem("clockzilla_consent"); window.location.reload(); } catch(e) { window.location.reload(); } }} style={{ color: t.textMuted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = t.accent} onMouseLeave={e => e.target.style.color = t.textMuted}>{tr("footer.cookieSettings")}</span>
              <span style={{ color: t.textMuted }}>{userLoc.displayName} &middot; {getTZFull(userLoc.tz, accurateNow)}</span>
              {sync.syncCount > 0 && <span style={{ color: t.textMuted }}>Synced {sync.syncCount}x</span>}
            </div>
          </div>
        </footer>
      </div>

      {/* ══════════ FOOTER PAGE OVERLAYS ══════════ */}
      {footerPage && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: 60, overflowY: "auto",
        }} onClick={() => setFooterPage(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`,
            padding: "40px 44px", maxWidth: 680, width: "90%", marginBottom: 60,
            boxShadow: `0 20px 60px rgba(0,0,0,0.2)`, position: "relative",
          }}>
            {/* Close button */}
            <button onClick={() => setFooterPage(null)} style={{
              position: "absolute", top: 16, right: 16, width: 36, height: 36,
              borderRadius: 10, border: `1.5px solid ${t.border}`, background: t.bgSub,
              cursor: "pointer", fontSize: 18, color: t.textMuted, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>&times;</button>

            {footerPage === "about" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>About Clockzilla</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 16 }}>
                Clockzilla is a precision time observatory that synchronizes with multiple atomic clock-referenced servers to deliver the most accurate time possible directly in your browser.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 16 }}>
                Unlike your computer's built-in clock, which can drift by seconds or even minutes over time, Clockzilla uses a multi-tier NTP-style synchronization engine that cross-references multiple time sources and applies statistical filtering to determine the true time with millisecond-level precision.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 16 }}>
                Our sync engine queries up to 3 independent time sources across multiple rounds, discards statistical outliers, and computes a weighted average that favors the lowest-latency, highest-accuracy samples. The result is a reliable offset measurement that tells you exactly how far ahead or behind your computer clock is.
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: t.text, marginTop: 28, marginBottom: 12 }}>Features</h3>
              <div style={{ fontSize: 14, lineHeight: 2, color: t.textSoft }}>
                {"Atomic-accurate time sync, Clock offset measurement, 12 world clocks across all major timezones, Analog and digital clock displays, Stopwatch with lap tracking, Countdown timer with presets, Day and year progress tracking, Unix timestamp display, 6 beautiful themes, Auto-resync every 4 minutes".split(", ").map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: t.accent }}>&#10003;</span> {f}
                  </div>
                ))}
              </div>
            </div>)}

            {footerPage === "faq" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Frequently Asked Questions</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              {[
                { q: "How accurate is Clockzilla?", a: "Clockzilla synchronizes with NTP-referenced time servers and achieves accuracy typically within 100-500 milliseconds, depending on your network latency. The accuracy of each sync is displayed in the interface." },
                { q: "Why does my computer clock show a different time?", a: "Computer clocks use internal oscillators that drift over time. While your OS periodically syncs via NTP, the clock can be off by seconds or more between syncs. Clockzilla measures this exact difference for you." },
                { q: "How does the sync work?", a: "Clockzilla sends requests to multiple time servers, measures the round-trip network latency, and calculates the difference between server time and your local clock. It uses statistical methods to filter outliers and weight results by accuracy." },
                { q: "What time sources does Clockzilla use?", a: "We use a backend proxy that fetches from 2 sources: Tier 1 is TimeAPI.io and Tier 2 is Cloudflare. The backend caches results for 3 seconds so external APIs are only called once per 3 seconds regardless of traffic. Your browser then measures round-trip latency to our server and computes your clock offset with statistical filtering." },
                { q: "Does Clockzilla work offline?", a: "Clockzilla requires an internet connection to synchronize with time servers. Without connectivity, it falls back to displaying your local system time." },
                { q: "How often does it re-sync?", a: "Clockzilla automatically re-synchronizes every 4 minutes. You can also trigger a manual re-sync by clicking the sync status badge in the header." },
                { q: "What do the accuracy ratings mean?", a: "Excellent (under 50ms offset), Good (under 500ms), Fair (under 2 seconds), and Poor (over 2 seconds). Most modern computers connected to the internet will show Excellent or Good." },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{item.q}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textSoft }}>{item.a}</p>
                </div>
              ))}
            </div>)}

            {footerPage === "how" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>How It Works</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              {[
                { title: "1. Multi-Source Sampling", desc: "Clockzilla sends concurrent requests to 3 time servers across different tiers. Each request records precise timestamps before and after the network round-trip." },
                { title: "2. RTT Measurement", desc: "For each response, we calculate the Round-Trip Time (RTT) \u2014 the total time the request took. The server's time is estimated at the midpoint: local_time + RTT/2." },
                { title: "3. Offset Calculation", desc: "The offset is computed as: server_time - (local_time + RTT/2). This tells us exactly how far ahead or behind your local clock is relative to the server." },
                { title: "4. Multiple Rounds", desc: "We repeat this process 3 times across all sources, collecting up to 9 samples total. More samples means better statistical confidence." },
                { title: "5. Outlier Removal", desc: "Using Median Absolute Deviation (MAD), we identify and discard samples that deviate significantly from the median. This eliminates results skewed by network congestion." },
                { title: "6. Weighted Average", desc: "The final offset is a weighted mean where lower-RTT samples receive more weight \u2014 because shorter round-trips produce more accurate measurements." },
              ].map((step, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.accent, marginBottom: 4 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textSoft }}>{step.desc}</p>
                </div>
              ))}
            </div>)}

            {footerPage === "contact" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Contact Us</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 24 }}>
                Have questions, feedback, or suggestions? We'd love to hear from you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "✉️", label: "General Inquiries", value: "hello@clockzilla.io", desc: "Questions, feedback, or suggestions" },
                  { icon: "🐛", label: "Bug Reports", value: "hello@clockzilla.io", desc: "Report issues or inaccuracies" },
                  { icon: "🤝", label: "Partnerships", value: "hello@clockzilla.io", desc: "Business and integration inquiries" },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                    background: t.bgSub, borderRadius: 14, border: `1px solid ${t.borderLight}`,
                  }}>
                    <div style={{ fontSize: 24 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: t.accent }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: t.textMuted }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>)}

            {footerPage === "privacy" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Privacy Policy</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Last updated: February 2026</p>
              {[
                { title: "Information We Collect", body: "Clockzilla operates entirely within your browser. We do not collect, store, or transmit any personal information. No accounts, cookies, or tracking mechanisms are used." },
                { title: "Time Synchronization Requests", body: "To provide accurate time, Clockzilla's backend server sends requests to third-party time servers (TimeAPI.io, Cloudflare) and caches the results. Your browser only communicates with our backend server for time sync. These requests contain only standard HTTP protocol data." },
                { title: "Local Data", body: "Your theme preference and settings are stored only in your browser's memory during the current session. No data persists after you close the page." },
                { title: "Third-Party Services", body: "The time servers we query have their own privacy policies. We encourage you to review them. This site uses Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings (adssettings.google.com)." },
                { title: "Children's Privacy", body: "Clockzilla does not knowingly collect information from children under 13. Our service is a general-purpose time tool with no age-restricted content." },
                { title: "Changes to This Policy", body: "We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated revision date." },
              ].map((section, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{section.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textSoft }}>{section.body}</p>
                </div>
              ))}
            </div>)}

            {footerPage === "terms" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Terms of Use</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Last updated: February 2026</p>
              {[
                { title: "Acceptance of Terms", body: "By accessing and using Clockzilla, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the service." },
                { title: "Service Description", body: "Clockzilla is a browser-based time synchronization tool that provides approximate accurate time by querying multiple time servers. The service is provided free of charge." },
                { title: "Accuracy Disclaimer", body: "While Clockzilla strives to provide the most accurate time possible, we cannot guarantee absolute precision. Time accuracy depends on network conditions, server availability, and other factors beyond our control. Do not rely on Clockzilla for safety-critical, legal, or financial timing requirements." },
                { title: "Acceptable Use", body: "You agree to use Clockzilla for lawful purposes only. You may not attempt to overload, hack, or reverse-engineer the service or the time servers it queries." },
                { title: "Intellectual Property", body: "All content, design, code, and branding associated with Clockzilla are protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without permission." },
                { title: "Limitation of Liability", body: "Clockzilla is provided \"as is\" without warranties of any kind. We shall not be liable for any damages arising from the use or inability to use the service." },
                { title: "Modifications", body: "We reserve the right to modify, suspend, or discontinue the service at any time without notice. We may also update these terms, and continued use constitutes acceptance." },
              ].map((section, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{section.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textSoft }}>{section.body}</p>
                </div>
              ))}
            </div>)}

            {footerPage === "cookies" && (<div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Cookie Policy</h2>
              <div style={{ width: 48, height: 3, background: t.accent, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 16 }}>
                Clockzilla does not use cookies, localStorage, or any persistent browser storage mechanisms. All preferences and settings exist only in memory during your current session and are discarded when you close the page.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: t.textSoft, marginBottom: 16 }}>
                The third-party time servers we query may set their own cookies as part of standard HTTP responses. Google AdSense and its partners may also use cookies and web beacons to serve and personalize advertisements. For more information on how Google uses data, visit google.com/policies/privacy/partners. We recommend reviewing the privacy policies of all third-party services.
              </p>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
}
