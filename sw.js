/* Service worker przewodnika: działa bez zasięgu i przy słabym zasięgu (nad jeziorem, w lesie).
   - strona i skrypty: od razu z pamięci telefonu, nowa wersja pobierana w tle (przy słabym zasięgu nic nie czeka),
   - zdjęcia i kafle mapy: osobna, trwała pamięć – NIE kasuje się przy aktualizacji przewodnika,
   - kafle mapy 9–11 (cały region) zapisują się same po instalacji; „Zapisz na offline” dociąga resztę (offline-lista.json),
   - pogoda, IMGW i baza wpisów: sieć z limitem czasu, a bez zasięgu ostatnia kopia. */
var V="przewodnik-20261127e", MEDIA="przewodnik-media",
CORE=["./","index.html","app.js","dane.js","i18n.js","i18n-dane.js","szukaj-dane.js","foto/foto.js","mapa/mapa-region-800.webp","mapa/mapa-region-1600.webp","icons.js","config.js","manifest.webmanifest","vendor/leaflet.js","rozeta.svg","haft.svg","ornament.svg","wzor.svg","rozeta-linia.svg","vendor/leaflet.css","vendor/images/layers.png","vendor/images/layers-2x.png"];
var KEEP={"przewodnik-tiles":1,"przewodnik-ext":1};KEEP[MEDIA]=1;
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(new Request(u,{cache:"reload"})).catch(function(){})}))}).then(function(){return self.skipWaiting()}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf("przewodnik-")===0&&k!==V&&!KEEP[k]}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}).then(function(){zapiszLista(function(p){return /mapa\/kafle\/(9|10|11)\//.test(p)},null);}));});

function trim(name,max){caches.open(name).then(function(c){c.keys().then(function(k){if(k.length>max)Promise.all(k.slice(0,k.length-max).map(function(r){return c.delete(r)}));});});}
function zTimeout(p,ms){return new Promise(function(ok,no){var t=setTimeout(function(){no(new Error("timeout"))},ms);p.then(function(v){clearTimeout(t);ok(v)},function(er){clearTimeout(t);no(er)});});}
function isMedia(u){return u.origin===location.origin&&/\/(foto\/[^/]+\.(jpe?g|png|webp)|mapa\/kafle\/)/i.test(u.pathname);}

/* „Zapisz na offline”: dociąga pliki z listy po kolei, raportuje postęp do strony */
var zapisTrwa=false;
function zapiszLista(filtr,klient){
  if(zapisTrwa)return Promise.resolve();zapisTrwa=true;
  return fetch("offline-lista.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(j){
    var L=j.pliki.filter(filtr),i=0,ok=0;
    return caches.open(MEDIA).then(function(c){
      function dalej(){
        if(i>=L.length){if(klient)klient.postMessage({offline:"koniec",ok:ok,razem:L.length});return;}
        var u=L[i++];
        return c.match(u).then(function(hit){if(hit){ok++;return;}return fetch(u).then(function(res){if(res.ok){ok++;return c.put(u,res);}}).catch(function(){});})
          .then(function(){if(klient&&i%10===0)klient.postMessage({offline:"postep",i:i,razem:L.length});return dalej();});
      }
      return dalej();
    });
  }).catch(function(){if(klient)klient.postMessage({offline:"blad"});}).then(function(){zapisTrwa=false;});
}
self.addEventListener("message",function(e){
  if(e.data==="zapisz-offline")e.waitUntil(zapiszLista(function(){return true},e.source));
  if(e.data==="stan-offline")e.waitUntil(Promise.all([fetch("offline-lista.json").then(function(r){return r.json()}).catch(function(){return {pliki:[]}}),caches.open(MEDIA).then(function(c){return c.keys()})]).then(function(a){e.source.postMessage({offline:"stan",zapisane:a[1].length,razem:a[0].pliki.length});}));
});

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
  /* zdjęcia i kafle własnej mapy: najpierw pamięć (trwała), potem sieć */
  if(isMedia(u)){
    e.respondWith(caches.open(MEDIA).then(function(c){return c.match(u.pathname.replace(/^\//,"")).then(function(h){return h||c.match(r);}).then(function(hit){
      return hit||fetch(r).then(function(res){if(res.ok)c.put(u.pathname.replace(/^\//,""),res.clone());return res;});});}));
    return;
  }
  var same=u.origin===location.origin;
  if(same){
    /* strona i skrypty: od razu z pamięci, w tle odświeżenie; bez kopii – sieć (max 8 s), potem strona główna */
    var net=fetch(r.url,{cache:"no-cache",credentials:"same-origin"}).then(function(res){if(res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});}return res;});
    e.respondWith(caches.open(V).then(function(c){return c.match(r,{ignoreSearch:true});}).then(function(hit){
      if(hit){e.waitUntil(net.catch(function(){}));return hit;}
      return zTimeout(net,8000).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(h){return h||caches.match("index.html");});});
    }));
    return;
  }
  /* pogoda, IMGW, baza: sieć z limitem 6 s, potem ostatnia kopia */
  var api=u.hostname==="api.open-meteo.com"||u.hostname.endsWith(".supabase.co")||u.hostname==="danepubliczne.imgw.pl";
  e.respondWith(zTimeout(fetch(r),6000).then(function(res){
    if(res.ok&&api){var cp=res.clone();caches.open("przewodnik-ext").then(function(c){c.put(r,cp)});}
    return res;
  }).catch(function(){return caches.match(r).then(function(hit){return hit||Response.error();});}));
});
