#!/usr/bin/env node
/* Generator statycznych stron miejsc (SEO) dla przewodnika „Łupawsko i okolice”.
   Uruchom z katalogu repozytorium:  node tools/build-miejsca.js
   Wynik: miejsca/*.html (strona na każde widoczne miejsce + strony działów) i sitemap.xml.
   Dane: dane.js, i18n.js, i18n-dane.js, foto/foto.js (wczytywane w vm) + wpisy z panelu (Supabase).
   Bez zależności npm, Node 18+ (globalny fetch). Gdy baza nie odpowie – przerywa (nie publikuje ukrytych miejsc). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "miejsca");
const SITE = "https://przewodnik.lupawsko.com";
const BASE_LL = [54.2755, 17.58905]; /* Łupawsko 12A */
const SECTION_FILES = ["index", "atrakcje", "rozrywka", "jedzenie", "imprezy", "sklepy", "deszcz"];
const today = (() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();

/* ---------- Dane w vm (jak w przeglądarce) ---------- */
const ctx = {
  console, navigator: { language: "pl", languages: ["pl"] },
  location: { search: "", hash: "", href: SITE + "/" },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  document: { currentScript: null, documentElement: { lang: "pl", setAttribute() {} }, addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
  addEventListener() {}
};
ctx.window = ctx; ctx.self = ctx;
vm.createContext(ctx);
/* najpierw zdjęcia: każde nowe/podmienione zdjęcie w foto/ dostaje wersje AVIF (i WebP jako zapas) */
try { require("child_process").execFileSync("python3", [path.join(__dirname, "foto.py")], { stdio: "inherit" }); }
catch (e) { console.error("UWAGA: konwersja zdjęć do AVIF nie powiodła się – sprawdź tools/foto.py"); process.exit(1); }
for (const f of ["dane.js", "i18n.js", "i18n-dane.js", "foto/foto.js", "config.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
}
ctx.LANG = "pl";
const T = k => { const v = ctx.T(k); return v == null ? "" : v; };
const CATN = ctx.CATN || {}, FUNK = ctx.FUNK || {}, EVT = ctx.EVT || {}, MIES = ctx.MIES || [], MIESW = ctx.MIESW || [];
const FOTO = Object.assign({}, ctx.FOTO || {});

/* ---------- Narzędzia skopiowane z app.js ---------- */
function norm(s) { return String(s || "").toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
function dist(ll, from) {
  const R = 6371, toR = Math.PI / 180, dLa = (ll[0] - from[0]) * toR, dLo = (ll[1] - from[1]) * toR,
    a = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(from[0] * toR) * Math.cos(ll[0] * toR) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}
function mapsUrl(o) {
  if (o.ll) return "https://www.google.com/maps/dir/?api=1&destination=" + o.ll[0] + "," + o.ll[1];
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.n + ", " + o.p);
}
function telFmt(t) { return String(t).replace(/^\+48\s?/, ""); }
function fmtDate(iso) { const p = iso.split("-"); return (+p[2]) + " " + MIES[+p[1] - 1] + " " + p[0]; }
function fmtRange(a, b) {
  if (!b || b === a) return fmtDate(a);
  const A = a.split("-"), B = b.split("-");
  if (A[0] === B[0] && A[1] === B[1]) return (+A[2]) + "–" + (+B[2]) + " " + MIES[+A[1] - 1] + " " + A[0];
  return fmtDate(a) + " – " + fmtDate(b);
}
function isNext(e) { return !!e.od && (e.do || e.od) >= today; }
function funKat(o) { return o.kat || ((o.c || []).filter(c => FUNK[c])[0]) || ""; }

/* ---------- Escapowanie ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const xesc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const jsonLd = o => JSON.stringify(o).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
function cut(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); if (s.length <= n) return s; let c = s.slice(0, n - 1); const i = c.lastIndexOf(" "); if (i > n * 0.6) c = c.slice(0, i); return c.replace(/[\s,.;:–-]+$/, "") + "…"; }
function locality(p) { return String(p || "").split(",")[0].replace(/\(.*?\)/g, "").replace(/\s+\d+[a-zA-Z]?\s*$/, "").replace(/\s+/g, " ").trim(); }
function kmTxt(d) { return d == null ? "" : d < 0.1 ? "< 100 m" : (d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)) + " km"; }

/* ---------- Wymiary zdjęć (JPEG/PNG/WebP) ---------- */
function imgSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1], len = b.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    } else if (b.toString("ascii", 1, 4) === "PNG") return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const f = b.toString("ascii", 12, 16);
      if (f === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      if (f === "VP8L") { const n = b.readUInt32LE(21); return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
      if (f === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    }
  } catch (e) { /* brak pliku */ }
  return null;
}

/* ---------- Wpisy z panelu (Supabase), jak applyRows() w app.js ---------- */
/* poprawka z panelu = oryginał + pola z panelu (jak mergeRow w app.js) */
const KEEP_FIELDS = ["msze", "cen", "sez", "pin", "ico", "nowe", "kat", "typ", "mies", "ost", "km", "oh", "acc"];
function mergeRow(o, it) {
  if (!it) return it;
  for (const k of KEEP_FIELDS) if ((it[k] == null || it[k] === "") && o[k] != null) it[k] = o[k];
  if (!(it.c && it.c.length) && o.c) it.c = o.c.slice();
  if (!it.ll && o.ll && it.km == null) it.ll = o.ll;
  it._orig = o.n; return it;
}
function rowToItem(r) {
  if (r.zdjecie_url && /^https:\/\//.test(r.zdjecie_url)) FOTO[r.nazwa] = { src: r.zdjecie_url, credit: r.zdjecie_autor || "" };
  else if (r.zastepuje && r.nazwa !== r.zastepuje && FOTO[r.zastepuje]) FOTO[r.nazwa] = FOTO[r.zastepuje];
  const it = { n: r.nazwa, p: r.miejsce || "", d: r.opis || "", c: (r.kategorie || []).slice(), t: r.telefon || "", w: r.www || "", adr: r.adres || "", h: r.godziny || "", chk: !!r.sprawdz, pol: !!r.polecane, _db: true };
  if (r.godziny_oh) it.oh = r.godziny_oh; if (r.dostep) it.acc = r.dostep;
  if (r.lat != null && r.lng != null) it.ll = [+r.lat, +r.lng]; else if (r.km != null) it.km = +r.km;
  if (r.sekcja === "imprezy") { it.typ = r.typ || "inne"; it.od = r.data_od || ""; it.do = r.data_do || ""; it.mies = r.miesiac || null; it.ost = r.ostatnio || ""; }
  if (r.sekcja === "rozrywka" && it.c.length) it.kat = it.c[0];
  if (r.sekcja === "jedzenie" && !it.c.length) { const d = it.ll ? dist(it.ll, ctx.HOME) : it.km; if (d != null && d <= 10) it.c.push("blisko"); }
  return it;
}
async function loadRows() {
  const c = ctx.PRZEWODNIK_SUPABASE;
  if (!c || !c.url || !c.key) throw new Error("Brak konfiguracji Supabase w config.js");
  const url = c.url.replace(/\/+$/, "") + "/rest/v1/przewodnik_wpisy?select=*&order=kolejnosc.asc,created_at.asc";
  const res = await fetch(url, { headers: { apikey: c.key, Authorization: "Bearer " + c.key } });
  if (!res.ok) throw new Error("Supabase HTTP " + res.status);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("Supabase: nieoczekiwana odpowiedź");
  return rows;
}

/* ---------- Działy ---------- */
const SECTIONS = {
  atrakcje: { t: "Atrakcje w okolicy Łupawska", name: "Atrakcje", h: "Co zobaczyć w okolicy Łupawska", lead: "Przyroda, zabytki, szlaki wodne i miejsca nietypowe wokół Jeziora Jasień, doliny Łupawy i Bytowa." },
  rozrywka: { t: "Rozrywka w okolicy Łupawska", name: "Rozrywka", h: "Rozrywka i rekreacja", lead: "Aquaparki, parki rozrywki, zoo, kąpieliska i aktywny wypoczynek w okolicy Łupawska." },
  jedzenie: { t: "Gdzie zjeść i spać – Łupawsko", name: "Jedzenie i noclegi", h: "Gdzie zjeść i gdzie spać", lead: "Restauracje, smażalnie i bary w okolicy oraz noclegi w Łupawsku nad Jeziorem Jasień." },
  imprezy: { t: "Imprezy i festyny – Bytów i okolice", name: "Imprezy", h: "Imprezy i festyny", lead: "Dni miast, festyny, jarmarki i wydarzenia kulturalne w Bytowie i okolicy." },
  sklepy: { t: "Sklepy i stacje paliw – Łupawsko", name: "Sklepy i stacje paliw", h: "Sklepy i stacje paliw", lead: "Sklepy spożywcze, lokalne produkty i stacje paliw najbliżej Łupawska." },
  deszcz: { t: "Co robić w deszczu – Łupawsko", name: "Na deszcz", h: "Gdy pada deszcz", lead: "Muzea, baseny i atrakcje pod dachem w okolicy Łupawska." }
};
const SUBS = [ /* [klucz bazy, dział strony, tablica w dane.js, podtytuł] */
  ["atrakcje", "atrakcje", "ATTR", ""], ["rozrywka", "rozrywka", "FUN", ""], ["deszcz", "deszcz", "RAIN", ""],
  ["jedzenie", "jedzenie", "FOOD", "Gdzie zjeść"], ["noclegi", "jedzenie", "SLEEP", "Noclegi"],
  ["imprezy", "imprezy", "EVENTS", ""], ["sklepy", "sklepy", "SHOPS", "Sklepy"], ["paliwo", "sklepy", "FUEL", "Stacje paliw"]
];

function schemaType(it) {
  const o = it.o, n = norm(o.n);
  switch (it.base) {
    case "jedzenie": return /kawiarn|cukiern|lodziarn|kawa/.test(n) ? "CafeOrCoffeeShop" : /piekarn/.test(n) ? "Bakery" : "Restaurant";
    case "noclegi": return /pole namiot|camping|kemping|biwak/.test(n) ? "Campground" : "LodgingBusiness";
    case "sklepy": return /piekarn/.test(n) ? "Bakery" : "Store";
    case "paliwo": return "GasStation";
    case "imprezy": return isNext(o) ? "Event" : null;
    default: return o.msze ? ["Church", "TouristAttraction"] : "TouristAttraction";
  }
}
function ohSchema(oh) {
  const out = [];
  String(oh).split(";").forEach(r => {
    r = r.trim(); const m = r.match(/^([A-Za-z,\-]+)\s+(.+)$/); if (!m || /off/i.test(m[2])) return;
    m[2].split(",").forEach(t => { const x = t.trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/); if (x) out.push(m[1] + " " + x[1].padStart(2, "0") + ":" + x[2] + "-" + (x[3] === "24" ? "23:59" : x[3].padStart(2, "0") + ":" + x[4])); });
  });
  return out;
}
const telDigits = t => String(t).replace(/[^\d+]/g, "");
const isUrl = w => !!w && /^https?:\/\//i.test(w);
function photoOf(o) {
  const F = FOTO[o.n]; if (!F || !F.src) return null;
  if (/^https:\/\//.test(F.src)) return { url: F.src, abs: F.src, credit: F.credit || "", size: null };
  const rel = "foto/" + F.src.replace(/^\/+/, "");
  if (!fs.existsSync(path.join(ROOT, rel))) return null;
  const relAvif = rel.replace(/\.(jpe?g|png)$/i, ".avif"); /* AVIF jak na ekajaki.pl (tools/foto.py) */
  const avif = relAvif !== rel && fs.existsSync(path.join(ROOT, relAvif)) ? "/" + relAvif.split("/").map(encodeURIComponent).join("/") : null;
  return { avif, url: "/" + rel.split("/").map(encodeURIComponent).join("/"), abs: SITE + "/" + rel.split("/").map(encodeURIComponent).join("/"), credit: F.credit || "", size: imgSize(path.join(ROOT, rel)) };
}

/* ---------- HTML ---------- */
const CSS = `:root{--bg:#fff;--bg2:#f3f6fa;--ink:#0f2342;--mut:#4a5a72;--line:#e1e7ef;--a:#1d5aa6;--on:#fff;--nav:#0f2a52;--chip:#e6f1fb;--warn:#fbf0d4;color-scheme:light}
@media(prefers-color-scheme:dark){:root{--bg:#0b1322;--bg2:#14203a;--ink:#e9eff8;--mut:#aab7cc;--line:#25334f;--a:#8cc4ea;--on:#0b1a30;--nav:#081326;--chip:#17294a;--warn:#3a3115;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--a)}.bar{background:var(--nav);padding:12px 16px}.bar a{color:#fff;text-decoration:none;font-weight:600}
main,footer{max-width:720px;margin:0 auto;padding:0 16px}h1,h2{font-family:Fraunces,Georgia,serif;line-height:1.2}h1{font-size:2rem;margin:.5em 0 .2em}h2{font-size:1.3rem;margin:1.6em 0 .5em}
.bc{font-size:.85rem;color:var(--mut);margin:12px 0 0}.bc a{color:var(--mut)}.pl{color:var(--mut);margin:0 0 12px}
figure{margin:12px 0}figure img{width:100%;height:auto;border-radius:12px;display:block;background:var(--bg2)}figcaption{font-size:.75rem;color:var(--mut);margin-top:4px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;padding:0;list-style:none}.chips li{background:var(--chip);border-radius:99px;padding:2px 10px;font-size:.85rem}.chips .w{background:var(--warn)}
dl.inf{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:16px 0}dl.inf dt{font-weight:700}dl.inf dd{margin:0;overflow-wrap:anywhere}
.box{background:var(--bg2);border-radius:12px;padding:12px 16px;margin:16px 0}.box p{margin:.3em 0}.box h2{margin:.2em 0 .4em}.sm{font-size:.85rem;color:var(--mut)}
.when{font-weight:700}.acts{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}.btn{display:inline-block;padding:10px 18px;border-radius:99px;border:2px solid var(--a);font-weight:700;text-decoration:none}.btn.p{background:var(--a);color:var(--on)}
ul.ls{list-style:none;padding:0;margin:0}ul.ls li{border-bottom:1px solid var(--line)}ul.ls a{display:flex;justify-content:space-between;gap:12px;padding:10px 0;text-decoration:none}ul.ls small{color:var(--mut);white-space:nowrap}ul.ls span small{display:block;white-space:normal}
footer{border-top:1px solid var(--line);margin-top:40px;padding:20px 16px 40px;font-size:.9rem;color:var(--mut)}footer a{color:var(--mut)}`;

function page({ title, desc, canonical, ogImage, ld, body }) {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#0f2a52">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="Łupawsko i okolice – przewodnik">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage || SITE + "/og.jpg")}">
<meta name="twitter:card" content="summary_large_image">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" href="/rozeta.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet">
<style>${CSS}</style>
${ld.map(x => `<script type="application/ld+json">${jsonLd(x)}</script>`).join("\n")}
</head>
<body>
<header class="bar"><a href="/">← Łupawsko i okolice</a></header>
<main>
${body}
</main>
<footer>Przewodnik przygotował <a href="https://ekajaki.pl/?utm_source=przewodnik&amp;utm_medium=referral&amp;utm_campaign=strony-miejsc">ekajaki.pl</a> · Łupawsko 12A</footer>
</body>
</html>
`;
}
function crumbs(list) {
  return {
    html: '<nav class="bc" aria-label="Okruszki">' + list.map((c, i) => i < list.length - 1 ? `<a href="${esc(c[1])}">${esc(c[0])}</a>` : `<span aria-current="page">${esc(c[0])}</span>`).join(" › ") + "</nav>",
    ld: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: SITE + c[1] })) }
  };
}
function mkTitle(name, place) {
  const sfx = " | Łupawsko i okolice";
  const np = norm(place), stem = np.slice(0, Math.max(4, np.length - 3));
  const loc = place && !norm(name).includes(stem) && place.length < 30 ? " – " + place : "";
  if ((name + loc + sfx).length <= 65) return name + loc + sfx;
  if ((name + loc).length <= 65) return name + loc;
  if ((name + sfx).length <= 65) return name + sfx;
  return cut(name, 65);
}
function placeChips(it) {
  const o = it.o, out = [];
  if (o.acc) out.push(['w', T("acc_" + o.acc)]);
  if (o.pol) out.push(['', T("pol")]);
  if (it.base === "rozrywka") { const k = funKat(o); if (k) out.push(['', FUNK[k]]); }
  if (it.base === "imprezy" && EVT[o.typ]) out.push(['', EVT[o.typ]]);
  (o.c || []).forEach(c => { if (CATN[c]) out.push(['', CATN[c]]); });
  if (o.chk) out.push(['w', T("chk")]);
  const seen = new Set();
  return out.filter(x => x[1] && !seen.has(x[1]) && seen.add(x[1]));
}
function whenTxt(o) {
  if (isNext(o)) return fmtRange(o.od, o.do);
  return (o.mies ? T("usually") + MIESW[o.mies - 1] : T("tbc")) + (o.ost ? T("last") + o.ost : "");
}
function mszeHtml(m) {
  const r = [];
  if (m.sob) r.push(["Sobota wieczorem", esc(m.sob) + " <small>(msza niedzielna)</small>"]);
  if (m.nd) r.push(["Niedziela", esc(m.nd)]);
  if (m.tyg) r.push(["Dni powszednie", esc(m.tyg)]);
  return '<section class="box"><h2>Msze święte <small class="sm">maj–sierpień</small></h2><dl class="inf">' + r.map(x => `<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join("") + "</dl>" +
    (m.uw ? `<p class="sm">${esc(m.uw)}</p>` : "") + '<p class="sm">Sprawdzone w listopadzie 2026. Godziny mogą się zmienić – przed przyjazdem zajrzyj do ogłoszeń parafii.</p></section>';
}

function placePage(it, all) {
  const o = it.o, S = SECTIONS[it.sec], url = SITE + "/miejsca/" + it.file + ".html";
  const loc = locality(o.p), ph = photoOf(o);
  const desc = o.d ? cut(o.d, 155) : cut(o.n + (o.p ? ", " + o.p : "") + ". " + S.name + " w przewodniku Łupawsko i okolice.", 155);
  const cr = crumbs([["Przewodnik", "/"], ["Miejsca", "/miejsca/index.html"], [S.name, "/miejsca/" + it.sec + ".html"], [o.n, "/miejsca/" + it.file + ".html"]]);
  /* JSON-LD */
  const ld = [];
  const type = schemaType(it);
  const addr = { "@type": "PostalAddress", addressCountry: "PL" };
  if (loc) addr.addressLocality = loc;
  if ((o.adr || o.p) && (o.adr || o.p) !== loc) addr.streetAddress = o.adr || o.p;
  const geo = o.ll ? { "@type": "GeoCoordinates", latitude: o.ll[0], longitude: o.ll[1] } : null;
  if (type === "Event") {
    const ev = { "@context": "https://schema.org", "@type": "Event", name: o.n, startDate: o.od, endDate: o.do || o.od, eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: Object.assign({ "@type": "Place", name: o.p || loc || o.n, address: addr }, geo ? { geo } : {}), url };
    if (o.d) ev.description = o.d; if (ph) ev.image = ph.abs; if (isUrl(o.w)) ev.sameAs = o.w;
    ld.push(ev);
  } else if (type) {
    const pl = { "@context": "https://schema.org", "@type": type, name: o.n, url, address: addr };
    if (o.d) pl.description = o.d; if (geo) pl.geo = geo; if (ph) pl.image = ph.abs; if (o.t) pl.telephone = telDigits(o.t);
    if (isUrl(o.w)) pl.sameAs = o.w;
    const ohs = o.oh && !o.sez ? ohSchema(o.oh) : [];
    if (ohs.length) pl.openingHours = ohs.length === 1 ? ohs[0] : ohs;
    else if (o.h) pl.additionalProperty = { "@type": "PropertyValue", name: "Godziny otwarcia", value: o.h };
    if (o.acc === "zakaz") pl.publicAccess = false;
    ld.push(pl);
  }
  ld.push({ "@context": "https://schema.org", "@type": "WebPage", name: o.n, url, inLanguage: "pl", description: desc, isPartOf: { "@type": "WebSite", name: "Łupawsko i okolice – przewodnik", url: SITE + "/" } });
  ld.push(cr.ld);
  /* treść */
  let b = cr.html + `\n<article>\n<h1>${esc(o.n)}</h1>\n`;
  if (o.p) b += `<p class="pl">${esc(o.p)}${o.ll ? " · " + esc(kmTxt(dist(o.ll, BASE_LL))) + " od Łupawska" : ""}</p>\n`;
  if (ph) b += `<figure>${ph.avif ? `<picture><source type="image/avif" srcset="${esc(ph.avif)}">` : ""}<img src="${esc(ph.url)}"${ph.size ? ` width="${ph.size.w}" height="${ph.size.h}"` : ""} alt="${esc(o.n)}" loading="eager" decoding="async">${ph.avif ? "</picture>" : ""}${ph.credit ? `<figcaption>${esc(ph.credit)}</figcaption>` : ""}</figure>\n`;
  const ch = placeChips(it);
  if (ch.length) b += '<ul class="chips">' + ch.map(c => `<li${c[0] ? ' class="w"' : ""}>${esc(c[1])}</li>`).join("") + "</ul>\n";
  if (it.base === "imprezy") b += `<p class="when">Termin: ${esc(whenTxt(o))}</p>\n`;
  if (o.d) b += `<p>${esc(o.d)}</p>\n`;
  const dl = [];
  if (o.h) dl.push(["Godziny", esc(o.h)]);
  if (o.t) dl.push(["Telefon", `<a href="tel:${esc(telDigits(o.t))}">${esc(telFmt(o.t))}</a>`]);
  if (isUrl(o.w)) dl.push(["Strona", `<a href="${esc(o.w)}" target="_blank" rel="noopener">${esc(o.w.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "").slice(0, 50))}</a>`]);
  if (o.adr || o.p) dl.push(["Adres", esc(o.adr || o.p)]);
  if (dl.length) b += '<dl class="inf">' + dl.map(x => `<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join("") + "</dl>\n";
  if (o.cen && o.cen.length) b += '<section class="box"><h2>Cennik</h2>' + o.cen.map(r => `<p><b>${esc(r[0])}</b> – ${esc(r[1])}${r[2] ? `<br><span class="sm">${esc(r[2])}</span>` : ""}</p>`).join("") + "</section>\n";
  if (o.msze) b += mszeHtml(o.msze) + "\n";
  b += '<div class="acts">' + (o.acc === "zakaz" ? "" : `<a class="btn p" href="${esc(mapsUrl(o))}" target="_blank" rel="noopener">Prowadź</a>`) +
    `<a class="btn" href="/#${esc(it.sec)}/${esc(slug(o._orig || o.n))}">Otwórz w przewodniku</a></div>\n</article>\n`;
  if (o.ll) {
    const near = all.filter(x => x !== it && x.o.ll && x.o.n !== o.n).map(x => ({ x, d: dist(o.ll, x.o.ll) })).sort((a, c) => a.d - c.d).slice(0, 6);
    if (near.length) b += '<section><h2>W pobliżu</h2><ul class="ls">' + near.map(n => `<li><a href="/miejsca/${esc(n.x.file)}.html"><span>${esc(n.x.o.n)}<small>${esc(SECTIONS[n.x.sec].name)}</small></span><small>${esc(kmTxt(n.d))}</small></a></li>`).join("") + "</ul></section>\n";
  }
  return page({ title: mkTitle(o.n, loc), desc, canonical: url, ogImage: ph && ph.abs, ld, body: b });
}

function listHtml(items) {
  return '<ul class="ls">' + items.map(it => `<li><a href="/miejsca/${esc(it.file)}.html"><span>${esc(it.o.n)}<small>${esc(it.o.p || "")}${it.base === "imprezy" ? " · " + esc(whenTxt(it.o)) : ""}</small></span><small>${esc(it.o.ll ? kmTxt(dist(it.o.ll, BASE_LL)) : "")}</small></a></li>`).join("") + "</ul>";
}
const byDist = arr => arr.slice().sort((a, b) => (a.o.ll ? dist(a.o.ll, BASE_LL) : 1e9) - (b.o.ll ? dist(b.o.ll, BASE_LL) : 1e9));

function sectionPage(sec, items) {
  const S = SECTIONS[sec], url = SITE + "/miejsca/" + sec + ".html";
  const cr = crumbs([["Przewodnik", "/"], ["Miejsca", "/miejsca/index.html"], [S.name, "/miejsca/" + sec + ".html"]]);
  const subs = SUBS.filter(s => s[1] === sec);
  let b = cr.html + `\n<h1>${esc(S.h)}</h1>\n<p class="pl">${esc(S.lead)} Odległości liczone od Łupawska 12A.</p>\n`;
  const ordered = [];
  subs.forEach(s => {
    const list = byDist(items.filter(i => i.base === s[0])); if (!list.length) return;
    if (subs.length > 1) b += `<h2>${esc(s[3])} <small class="sm">(${list.length})</small></h2>\n`;
    b += listHtml(list) + "\n"; ordered.push(...list);
  });
  b += `<div class="acts"><a class="btn p" href="/#${esc(sec)}">Otwórz dział w przewodniku</a></div>\n`;
  const ld = [{ "@context": "https://schema.org", "@type": "CollectionPage", name: S.h, url, inLanguage: "pl", description: S.lead,
    mainEntity: { "@type": "ItemList", numberOfItems: ordered.length, itemListElement: ordered.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + "/miejsca/" + it.file + ".html", name: it.o.n })) } }, cr.ld];
  return page({ title: S.t + " | Łupawsko i okolice", desc: cut(S.lead + " " + ordered.length + " miejsc z opisami, godzinami i nawigacją.", 155), canonical: url, ld, body: b });
}
function indexPage(bySec) {
  const url = SITE + "/miejsca/index.html";
  const cr = crumbs([["Przewodnik", "/"], ["Miejsca", "/miejsca/index.html"]]);
  const secs = Object.keys(SECTIONS).filter(s => bySec[s] && bySec[s].length);
  let b = cr.html + '\n<h1>Miejsca w okolicy Łupawska</h1>\n<p class="pl">Wszystkie miejsca z przewodnika po Łupawsku, Jeziorze Jasień, dolinie Łupawy i Bytowie – z opisami, godzinami otwarcia i nawigacją.</p>\n<ul class="ls">' +
    secs.map(s => `<li><a href="/miejsca/${s}.html"><span>${esc(SECTIONS[s].name)}<small>${esc(SECTIONS[s].lead)}</small></span><small>${bySec[s].length}</small></a></li>`).join("") + '</ul>\n<div class="acts"><a class="btn p" href="/">Otwórz przewodnik</a></div>\n';
  const ld = [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Miejsca w okolicy Łupawska", url, inLanguage: "pl",
    hasPart: secs.map(s => ({ "@type": "CollectionPage", name: SECTIONS[s].h, url: SITE + "/miejsca/" + s + ".html" })) }, cr.ld];
  return page({ title: "Miejsca w okolicy Łupawska | Łupawsko i okolice", desc: "Atrakcje, rozrywka, jedzenie, noclegi, imprezy, sklepy i plan na deszcz wokół Łupawska i Jeziora Jasień – lista wszystkich miejsc z przewodnika.", canonical: url, ld, body: b });
}

/* ---------- Budowa ---------- */
async function main() {
  let rows;
  try { rows = await loadRows(); } catch (e) { console.error("BŁĄD: nie udało się pobrać wpisów z Supabase (" + e.message + "). Przerywam – bez tego mogłyby się opublikować ukryte miejsca."); process.exit(1); }

  const items = [], skipped = [], hidden = [];
  for (const [base, sec, arr] of SUBS) {
    const mine = rows.filter(r => r.sekcja === base), hide = {}, repl = {};
    mine.forEach(r => { if (r.zastepuje) { if (r.ukryty) { if (!r.opis && !r.miejsce) hide[r.zastepuje] = 1; } else repl[r.zastepuje] = r; } });
    const list = [];
    (ctx[arr] || []).forEach(o => { if (hide[o.n]) { hidden.push(o.n); return; } list.push(repl[o.n] ? mergeRow(o, rowToItem(repl[o.n])) : o); });
    mine.forEach(r => { if (!r.zastepuje && !r.ukryty) list.push(rowToItem(r)); });
    for (const o of list) {
      if (!o || !o.n || o.ukryty) continue;
      if ((base === "sklepy" || base === "paliwo") && String(o.d || "").length <= 80) { skipped.push([base, o.n, "krótki opis"]); continue; }
      items.push({ o, base, sec });
    }
  }
  /* nazwy plików: slug, przy kolizji z sufiksem działu */
  const used = new Set(SECTION_FILES);
  for (const it of items) {
    let f = slug(it.o._orig || it.o.n) || "miejsce";
    if (used.has(f)) f = (f + "-" + it.base).slice(0, 72);
    let k = 2, f0 = f; while (used.has(f)) f = f0 + "-" + (k++);
    used.add(f); it.file = f;
  }
  /* czyszczenie starego wyniku */
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (f.endsWith(".html")) fs.unlinkSync(path.join(OUT, f));

  const bySec = {};
  for (const it of items) { (bySec[it.sec] = bySec[it.sec] || []).push(it); fs.writeFileSync(path.join(OUT, it.file + ".html"), placePage(it, items)); }
  for (const s of Object.keys(bySec)) fs.writeFileSync(path.join(OUT, s + ".html"), sectionPage(s, bySec[s]));
  fs.writeFileSync(path.join(OUT, "index.html"), indexPage(bySec));

  /* sitemap.xml */
  const u = (loc, extra = "", pr = "") => `  <url>\n    <loc>${xesc(loc)}</loc>\n    <lastmod>${today}</lastmod>${pr ? `\n    <priority>${pr}</priority>` : ""}${extra}\n  </url>`;
  const alts = [["pl", SITE + "/"], ["en", SITE + "/?lang=en"], ["de", SITE + "/?lang=de"], ["x-default", SITE + "/"]];
  const altXml = alts.map(a => `\n    <xhtml:link rel="alternate" hreflang="${a[0]}" href="${xesc(a[1])}"/>`).join("");
  const urls = [u(SITE + "/", altXml, "1.0"), u(SITE + "/?lang=en", altXml, "0.8"), u(SITE + "/?lang=de", altXml, "0.8"), u(SITE + "/miejsca/index.html", "", "0.8")];
  Object.keys(bySec).forEach(s => urls.push(u(SITE + "/miejsca/" + s + ".html", "", "0.7")));
  items.forEach(it => urls.push(u(SITE + "/miejsca/" + it.file + ".html", "", "0.6")));
  /* zapasowa lista ukryć dla aplikacji (gdy baza niedostępna) – tylko sekcja + nazwa */
  fs.writeFileSync(path.join(ROOT, "ukryte.json"), JSON.stringify(rows.filter(r => r.zastepuje && r.ukryty && !r.opis && !r.miejsce).map(r => ({ sekcja: r.sekcja, nazwa: r.zastepuje, zastepuje: r.zastepuje, ukryty: true }))));
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`);

  /* raport */
  const sz = fs.readdirSync(OUT).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
  console.log("Wpisy z bazy: " + rows.length + ", ukryte pozycje pominięte: " + hidden.length);
  Object.keys(bySec).forEach(s => {
    const per = {}; bySec[s].forEach(i => per[i.base] = (per[i.base] || 0) + 1);
    console.log("  " + s.padEnd(9) + bySec[s].length + "  " + JSON.stringify(per));
  });
  console.log("Strony miejsc: " + items.length + ", stron działów: " + Object.keys(bySec).length + " + index, URL w sitemap: " + urls.length);
  console.log("Pominięte sklepy/paliwo (opis ≤ 80 znaków): " + skipped.length);
  console.log("Rozmiar miejsca/: " + (sz / 1024 / 1024).toFixed(2) + " MB");
  if (process.argv.includes("--json")) fs.writeFileSync(process.argv[process.argv.indexOf("--json") + 1], JSON.stringify({ hidden, skipped, files: items.map(i => i.file) }, null, 1));
}
main().catch(e => { console.error(e); process.exit(1); });
