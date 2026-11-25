/* Service worker przewodnika: działa bez zasięgu (nad jeziorem, w lesie).
   - pliki przewodnika: najpierw sieć, w razie braku – kopia z pamięci,
   - Leaflet i fonty: z pamięci,
   - kafelki mapy OSM: raz obejrzane zostają w pamięci (limit 1500),
   - pogoda i baza wpisów: sieć, a bez zasięgu ostatnia kopia. */
var V="przewodnik-20261125b", CORE=["./","index.html","app.js","dane.js","i18n.js","i18n-dane.js","szukaj-dane.js","mapa/mapa-region-800.webp","mapa/mapa-region-1600.webp","icons.js","config.js","manifest.webmanifest","vendor/leaflet.js","rozeta.svg","haft.svg","ornament.svg","wzor.svg","rozeta-linia.svg","vendor/leaflet.css","vendor/images/layers.png","vendor/images/layers-2x.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf("przewodnik-")===0&&k!==V&&k!=="przewodnik-tiles"&&k!=="przewodnik-ext"}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));});
function trim(name,max){caches.open(name).then(function(c){c.keys().then(function(k){if(k.length>max)Promise.all(k.slice(0,k.length-max).map(function(r){return c.delete(r)}));});});}
self.addEventListener("fetch",function(e){
  var r=e.request; if(r.method!=="GET")return;
  var u=new URL(r.url);
  if(u.hostname.endsWith("tile.openstreetmap.org")||u.hostname.endsWith("tile-cyclosm.openstreetmap.fr")||u.hostname==="tile.waymarkedtrails.org"){
    e.respondWith(caches.open("przewodnik-tiles").then(function(c){return c.match(r).then(function(hit){
      return hit||fetch(r).then(function(res){if(res.ok||res.type==="opaque"){c.put(r,res.clone());trim("przewodnik-tiles",1500);}return res;});});}));
    return;
  }
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("przewodnik-ext").then(function(c){return c.match(r).then(function(hit){return hit||fetch(r).then(function(res){c.put(r,res.clone());return res;});});}));
    return;
  }
  /* własne pliki, pogoda i baza: sieć najpierw, potem pamięć */
  var same=u.origin===location.origin;
  e.respondWith((same?fetch(r.url,{cache:"no-cache",credentials:"same-origin"}):fetch(r)).then(function(res){
    if(res.ok&&(u.origin===location.origin||u.hostname==="api.open-meteo.com"||u.hostname.endsWith(".supabase.co"))){var cp=res.clone();caches.open(u.origin===location.origin?V:"przewodnik-ext").then(function(c){c.put(r,cp)});}
    return res;
  }).catch(function(){return caches.match(r,{ignoreSearch:u.origin===location.origin}).then(function(hit){return hit||caches.match("index.html");});}));
});
