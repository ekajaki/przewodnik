/* Odległości TRASĄ SAMOCHODEM z bazy eKajaki (Łupawsko 12A) do każdego miejsca przewodnika.
   Zasada przewodnika: listy są od najbliższego do najdalszego wg trasy samochodem (jak w Google Maps);
   wyjątek – ścieżki piesze i rowerowe liczone w linii prostej (decyduje app.js).
   Źródło: publiczny serwer tras OSRM (OpenStreetMap). Wyniki w tools/drogi-cache.json (pytamy tylko o nowe punkty).
   Wynik dla aplikacji: /drogi.js → window.DROGI = {"lat,lng": [km, minuty]}. */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(__dirname, "drogi-cache.json");
const BAZA = [54.2755, 17.58905]; // Łupawsko 12A
const key = ll => (+ll[0]).toFixed(5) + "," + (+ll[1]).toFixed(5);

async function table(points) {
  const coords = [BAZA, ...points].map(p => (+p[1]).toFixed(5) + "," + (+p[0]).toFixed(5)).join(";");
  const url = "https://router.project-osrm.org/table/v1/driving/" + coords + "?sources=0&annotations=distance,duration";
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "przewodnik-lupawsko/1.0" } });
      if (r.ok) { const j = await r.json(); if (j.code === "Ok") return j; }
    } catch (e) { /* ponów */ }
    await new Promise(res => setTimeout(res, 3000 * (i + 1)));
  }
  throw new Error("OSRM nie odpowiada");
}

async function drogi(lls) {
  let cache = {};
  try { cache = JSON.parse(fs.readFileSync(CACHE, "utf8")); } catch (e) {}
  const nowe = [...new Set(lls.filter(Boolean).map(key))].filter(k => !cache[k]);
  for (let i = 0; i < nowe.length; i += 80) {
    const part = nowe.slice(i, i + 80), pts = part.map(k => k.split(",").map(Number));
    const j = await table(pts);
    part.forEach((k, n) => {
      const d = j.distances[0][n + 1], t = j.durations[0][n + 1];
      if (d != null) cache[k] = [Math.round(d / 100) / 10, Math.round(t / 60)];
    });
    await new Promise(res => setTimeout(res, 1200));
  }
  /* tylko punkty, które są dziś w przewodniku */
  const out = {};
  for (const ll of lls) { if (!ll) continue; const k = key(ll); if (cache[k]) out[k] = cache[k]; }
  fs.writeFileSync(CACHE, JSON.stringify(cache));
  fs.writeFileSync(path.join(ROOT, "drogi.js"),
    "/* Odległości trasą samochodem z bazy eKajaki (Łupawsko 12A) – generuje tools/drogi.js (OSRM). Nie edytuj ręcznie. */\n" +
    "window.DROGI=" + JSON.stringify(out) + ";\n");
  return { out, nowe: nowe.length, razem: Object.keys(out).length };
}
module.exports = { drogi, key, BAZA };
