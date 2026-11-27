/* Przewodnik Łupawsko i okolice — logika strony.
   Dane: dane.js (wbudowane), i18n.js (języki), i18n-dane.js (tłumaczenia opisów), wpisy z panelu (Supabase). */
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};

/* ---------- Narzędzia ---------- */
var ORIGIN=HOME, ORIGIN_ME=false;
function dist(ll,from){from=from||ORIGIN;var R=6371,toR=Math.PI/180,dLa=(ll[0]-from[0])*toR,dLo=(ll[1]-from[1])*toR,
  a=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(from[0]*toR)*Math.cos(ll[0]*toR)*Math.sin(dLo/2)*Math.sin(dLo/2);
  return 2*R*Math.asin(Math.sqrt(a));}
function dOf(o){return o.ll?dist(o.ll):(ORIGIN_ME?null:(o.km==null?null:o.km));}
function km(o){var k=dOf(o); if(k==null)return null; return k<1.5?T("lt2"):T("ok")+Math.round(k)+" km";}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
function telFmt(t){return t.replace(/^\+48\s?/,"");}
function norm(s){return String(s||"").toLowerCase().replace(/ł/g,"l").normalize("NFD").replace(/[̀-ͯ]/g,"");}
function slug(s){return norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);}
/* identyfikator karty z nazwy oryginalnej – zmiana nazwy w panelu nie psuje ulubionych, linków i wyszukiwarki */
function oid(o){return slug((o&&(o._orig||o.n))||"");}
/* lekka wersja zdjęcia (WebP 640 px, foto/m/) – karty i kafle; zdjęcia spoza serwisu bez zmian */
/* zdjęcia jak na ekajaki.pl: AVIF (lżejszy), WebP jako zapas; foto/m/ = 640 px na telefon */
window.fotoM=function(src,fmt){src=String(src||"");if(/^https?:/i.test(src))return src;return (window.FOTO_BASE||"")+"m/"+src.replace(/\.(jpe?g|png)$/i,"."+(fmt||"webp"));};
/* tło CSS: AVIF z zapasem WebP (przeglądarka sama wybiera) */
window.fotoBg=function(src,full){src=String(src||"");if(/^https?:/i.test(src))return 'url("'+src+'")';var B=window.FOTO_BASE||"",a=full?B+src.replace(/\.(jpe?g|png)$/i,".avif"):window.fotoM(src,"avif"),b=full?B+src:window.fotoM(src,"webp");return 'image-set(url("'+a+'") type("image/avif"), url("'+b+'") type("'+(full?"image/jpeg":"image/webp")+'"))';};
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v));}catch(e){return null;}}
/* plaże i kąpieliska działają latem – poza sezonem (X–V) idą na koniec listy z dopiskiem */
var OFFSEASON=(function(){var m=new Date().getMonth()+1;return m>=10||m<=5;})();
function summerOnly(o){return !!o&&!o.pin&&(/^(Kąpielisko|Plaża|Miejsce (do kąpieli|plażowania))/.test(o.n||"")||/sezon letni|tylko latem|^latem|VII–VIII|kąpielisko strzeżone/i.test(o.h||""))&&!/cały rok|całodobow/i.test(o.h||"");}
function sortByDist(arr){return arr.slice().sort(function(a,b){var x=dOf(a),y=dOf(b);return (x==null?999:x)-(y==null?999:y)});}
function mapsUrl(o){
  if(o.ll)return "https://www.google.com/maps/dir/?api=1&destination="+o.ll[0]+","+o.ll[1];
  return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(o.n+", "+o.p);
}

/* ---------- Godziny otwarcia: oh = "Mo-Fr 08:00-16:00; Sa 09:00-14:00", sez = ["05-01","08-31"] ---------- */
var DN=["Su","Mo","Tu","We","Th","Fr","Sa"];
function ohRules(oh){
  return String(oh).split(";").map(function(r){r=r.trim();var m=r.match(/^([A-Za-z,\-]+)\s+(.+)$/);if(!m)return null;
    var days=[];m[1].split(",").forEach(function(p){var ab=p.split("-");var a=DN.indexOf(ab[0]),b=DN.indexOf(ab[1]||ab[0]);if(a<0||b<0)return;
      for(var i=a;;i=(i+1)%7){days.push(i);if(i===b)break;}});
    if(/off/i.test(m[2]))return {days:days,off:true};
    var spans=m[2].split(",").map(function(t){var x=t.trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);if(!x)return null;var s0=+x[1]*60+ +x[2],e0=+x[3]*60+ +x[4];if(e0<=s0)e0=1440;return [s0,e0]}).filter(Boolean);
    return {days:days,spans:spans};}).filter(Boolean);
}
function inSeason(sez,d){if(!sez)return true;var md=("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
  return sez[0]<=sez[1]?(md>=sez[0]&&md<=sez[1]):(md>=sez[0]||md<=sez[1]);}
function hhmm(m){return Math.floor(m/60)+":"+("0"+m%60).slice(-2);}
function openState(o){
  if(!o.oh)return null;
  var now=new Date(); if(!inSeason(o.sez,now))return {open:false,label:T("offSeason")};
  var rules=ohRules(o.oh), dow=now.getDay(), mins=now.getHours()*60+now.getMinutes();
  function spansFor(d){var s=null;rules.forEach(function(r){if(r.days.indexOf(d)>=0)s=r.off?[]:r.spans;});return s||[];}
  var today=spansFor(dow);
  for(var i=0;i<today.length;i++){if(mins>=today[i][0]&&mins<today[i][1])return {open:true,label:T("openTo")+hhmm(today[i][1])};}
  for(i=0;i<today.length;i++){if(mins<today[i][0])return {open:false,label:T("closedOpens")+hhmm(today[i][0])};}
  for(var k=1;k<=7;k++){var d=(dow+k)%7,s=spansFor(d);if(s.length){var dd=new Date(now.getTime()+k*864e5);if(!inSeason(o.sez,dd))break;
    return {open:false,label:(k===1?T("closedTomorrow"):T("closedDay")+T("days")[d]+" ")+hhmm(s[0][0])};}}
  return {open:false,label:T("closed")};
}

/* ---------- Ulubione ---------- */
var FAV_KEY="przewodnik.ulubione";
function favs(){return store(FAV_KEY)||[];}
function isFav(id){return favs().indexOf(id)>=0;}
function toggleFav(id){var f=favs(),i=f.indexOf(id);if(i>=0)f.splice(i,1);else f.push(id);store(FAV_KEY,f);}

/* ---------- Karta ---------- */
function card(o0,opts){
  opts=opts||{};
  var o=loc(o0), id=oid(o0), sec=opts.sec||"";
  var k=km(o0);
  var F=(window.FOTO||{})[o0.n];
  var h='<article class="card'+(F?' has-ph':'')+((o0.pin&&(opts.sec==="rozrywka"||opts.sec==="deszcz"))||opts.feat?' feat':'')+'" data-id="'+id+'">'+(F&&!opts.noPhoto?'<figure class="ph"><picture>'+(/^https?:/i.test(F.src)?'':'<source type="image/avif" srcset="'+esc(window.fotoM(F.src,"avif"))+'">')+'<img loading="lazy" decoding="async" src="'+esc(window.fotoM(F.src))+'" alt="'+esc(o.n)+'"></picture><figcaption>'+esc(F.credit||"")+'</figcaption></figure>':'')+'<div class="ch"><h3>'+esc(o.n)+'</h3>'+
    (opts.noFav?'':'<button class="fav'+(isFav(id)?' on':'')+'" data-fav="'+id+'" aria-pressed="'+isFav(id)+'" aria-label="'+esc(T("favA"))+'">'+(isFav(id)?ic('staron'):ic('star'))+'</button>')+'</div>'+
    '<p class="meta">'+ic('pin')+' '+esc(o.p)+(k&&!opts.noKm?' · '+k+(ORIGIN_ME?' '+T("fromMe"):''):'')+'</p>';
  if(opts.extra)h+=opts.extra;
  var st=openState(o0);
  if(st)h+='<p class="oh '+(st.open?'open':'shut')+'">'+(st.open?ic('open'):ic('closed'))+' '+esc(st.label)+'</p>';
  var tags=(o0.c||[]).filter(function(c){return CATN[c]}).map(function(c){return '<span class="tag '+c+'">'+esc(CATN[c])+'</span>'});
  if(opts.tag)tags.unshift(opts.tag);
  if(o0.pol)tags.unshift('<span class="tag pol">'+ic('tip')+' '+esc(T("pol"))+'</span>');
  if(o0.chk)tags.push('<span class="tag chk" title="'+esc(T("chkT"))+'">'+esc(T("chk"))+'</span>');
  if(o0.acc)tags.unshift('<span class="tag acc acc-'+o0.acc+'">'+ic(o0.acc==="zakaz"?"warn":"key")+' '+esc(T("acc_"+o0.acc))+'</span>');
  if(tags.length)h+='<div class="tags">'+tags.join("")+'</div>';
  if(o.d)h+='<p>'+esc(o.d)+(o._onlyPl&&T("onlyPl")?' <span class="small">'+esc(T("onlyPl"))+'</span>':'')+'</p>';
  var li=[];
  if(o.adr)li.push('<li><b>'+esc(T("adr"))+'</b> '+esc(o.adr)+'</li>');
  if(o.h)li.push('<li><b>'+esc(T("hrs"))+'</b> '+esc(o.h)+'</li>');
  if(li.length)h+='<ul class="info">'+li.join("")+'</ul>';
  if(o0.msze&&LANG==="pl")h+=mszeBox(o0.msze);
  if(o.cen&&o.cen.length)h+='<div class="cennik"><b>'+esc(T("cennik")||"Cennik")+'</b><ul>'+o.cen.map(function(r){return '<li><span class="cn">'+esc(r[0])+(r[2]?'<small>'+esc(r[2])+'</small>':'')+'</span><span class="cp">'+esc(r[1])+'</span></li>'}).join("")+'</ul></div>';
  h+='<div class="acts">'+(o0.acc==="zakaz"?'':'<a class="btn pri" target="_blank" rel="noopener" href="'+esc(mapsUrl(o0))+'">'+ic('route')+' '+esc(T("nav"))+'</a>');
  if(o0.t)h+='<a class="btn" href="tel:'+String(o0.t).replace(/[^\d+]/g,"")+'">'+ic('phone')+' '+esc(telFmt(o0.t))+'</a>';
  if(o0.w&&/^https?:\/\//i.test(o0.w))h+='<a class="btn" target="_blank" rel="noopener" href="'+esc(o0.w)+'">'+ic('web')+' '+esc(T("web"))+'</a>';
  if(!opts.noShare)h+='<button class="btn ghost" data-share="'+id+'" data-sec="'+sec+'" aria-label="'+esc(T("share"))+'">'+ic('share')+'</button>';
  h+='</div>';
  if(!opts.noReport)h+='<a class="report" href="mailto:info@ekajaki.pl?subject='+encodeURIComponent(T("repS")+o0.n)+'&body='+encodeURIComponent(T("repB"))+'">'+esc(T("rep"))+'</a>';
  return h+'</article>';
}
function planCard(p0,rain){var p=loc(p0);return '<div class="card plan'+(rain?' rain':'')+'"><h3>'+ic(p0.ico||'')+' '+esc(p.t)+'</h3><ol>'+(p.steps||[]).map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ol></div>';}
function chipRow(el,items,cur,attr){el.innerHTML=items.map(function(c){return '<button class="chip'+(c[0]===cur?" on":"")+'" data-'+attr+'="'+c[0]+'" aria-pressed="'+(c[0]===cur)+'">'+(c[2]?ic(c[2])+' ':'')+esc(c[1])+'</button>'}).join("");}

/* ---------- Sekcje ---------- */
function renderStatic(){
  $("plans").innerHTML=PLANS.map(function(p){return planCard(p)}).join("");
  $("rain-plans").innerHTML=RAINPLANS.map(function(p){return planCard(p,true)}).join("");
  $("it-list").innerHTML=IT.map(function(o){return card(o,{noKm:false,sec:"start"})}).join("");
  $("sleep-list").innerHTML=SLEEP.map(function(o){return card(o,{noKm:true,sec:"jedzenie"})}).join("");
  $("rain-list").innerHTML=(function(a){return a.filter(function(o){return o.pin}).concat(a.filter(function(o){return !o.pin}))})(sortByDist(RAIN)).map(function(o){return card(o,{sec:"deszcz"})}).join("");
  renderEvents(); renderShops(); renderFun(); renderAttr(); renderFood(); renderFavs(); renderStay(); renderBike(); szIdx=null; renderIdeas(); renderSearch(); mapAria();
}
/* Atrakcje */
var cat="all", query="";
function filtered(){
  var q=norm(query);
  return sortByDist(ATTR).filter(function(o){
    var d=dOf(o), okC=cat==="all"||(cat==="blisko"?(d!=null&&d<=10):(o.c||[]).indexOf(cat)>=0);
    var L=loc(o); return okC&&(!q||norm(o.n+" "+o.p+" "+o.d+" "+L.n+" "+L.d).indexOf(q)>=0);
  });
}
function renderAttr(){
  chipRow($("cat-chips"),[["all",T("all")],["przyroda",CATN.przyroda],["woda",CATN.woda],["zabytki",CATN.zabytki],["nietypowe",CATN.nietypowe],["blisko",T("near10")]],cat,"cat");
  var f=filtered();
  if(!f.length){$("attr-list").innerHTML='<p class="empty">'+esc(T("none"))+'</p>';}
  else if(cat==="all"&&!query&&!ORIGIN_ME){
    /* grupy według okolicy: Nad Jasieniem, Okolice Łupawska, Bytów, Dalsze wycieczki */
    var BYT=[54.1706,17.4919], G={jasien:[],okolice:[],bytow:[],dalej:[]};
    f.forEach(function(o){var d=dOf(o),db=o.ll?dist(o.ll,BYT):99;
      var z=(d!=null&&d<=5)?"jasien":(db<=4||/^Bytów/.test(o.p||""))?"bytow":(d!=null&&d<=15)?"okolice":"dalej"; G[z].push(o);});
    $("attr-list").innerHTML=["jasien","okolice","bytow","dalej"].filter(function(z){return G[z].length}).map(function(z){
      return '<h3 class="zone">'+esc(T("zone_"+z))+' <span class="zn">'+G[z].length+'</span></h3><p class="zone-l">'+esc(T("zoneL_"+z))+'</p>'+G[z].map(function(o){return card(o,{sec:"atrakcje"})}).join("");}).join("");
  } else $("attr-list").innerHTML=f.map(function(o){return card(o,{sec:"atrakcje"})}).join("");
  if(map)drawMarkers();
}
$("cat-chips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;cat=b.dataset.cat;renderAttr();});
$("q").addEventListener("input",function(e){query=e.target.value.trim();renderAttr();});
/* Jedzenie */
var foodCat="all";
function renderFood(){
  chipRow($("food-chips"),[["all",T("all")],["blisko",T("nearLup")],["bytow",T("bytow")]],foodCat,"cat");
  var f=sortByDist(FOOD).filter(function(o){return foodCat==="all"||(o.c||[]).indexOf(foodCat)>=0});
  $("food-list").innerHTML=f.map(function(o){return card(o,{sec:"jedzenie"})}).join("");
}
$("food-chips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;foodCat=b.dataset.cat;renderFood();});
/* Rozrywka */
var funK="all";
function funKat(o){return o.kat||((o.c||[]).filter(function(c){return FUNK[c]})[0])||"";}
function renderFun(){
  var ks=["all"].concat(Object.keys(FUNK).filter(function(k){return FUN.some(function(o){return funKat(o)===k})}));
  chipRow($("fun-chips"),ks.map(function(k){return [k,k==="all"?T("all"):FUNK[k],k==="all"?"":"fun-"+k]}),funK,"k");
  var f=sortByDist(FUN).filter(function(o){return funK==="all"||funKat(o)===funK});
  f=f.filter(function(o){return o.pin}).concat(f.filter(function(o){return !o.pin})); /* wyróżnione zawsze na początku */
  if(OFFSEASON)f=f.filter(function(o){return !summerOnly(o)}).concat(f.filter(summerOnly));
  $("fun-list").innerHTML=f.length?f.map(function(o){var k=funKat(o);return card(o,{sec:"rozrywka",tag:(k?'<span class="tag">'+ic('fun-'+k)+' '+esc(FUNK[k])+'</span>':'')+(OFFSEASON&&summerOnly(o)?'<span class="tag off">'+esc(OX().summer)+'</span>':'')});}).join(""):'<p class="empty">'+esc(T("noItems"))+'</p>';
}
$("fun-chips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;funK=b.dataset.k;renderFun();});
/* Imprezy */
function todayISO(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
function fmtDate(iso){var p=iso.split("-");return LANG==="en"?(MIES[+p[1]-1]+" "+(+p[2])+", "+p[0]):((+p[2])+(LANG==="de"?". ":" ")+MIES[+p[1]-1]+" "+p[0]);}
function fmtRange(a,b){
  if(!b||b===a)return fmtDate(a);
  var A=a.split("-"),B=b.split("-");
  if(A[0]===B[0]&&A[1]===B[1])return LANG==="en"?(MIES[+A[1]-1]+" "+(+A[2])+"–"+(+B[2])+", "+A[0]):((+A[2])+(LANG==="de"?".–":"–")+(+B[2])+(LANG==="de"?". ":" ")+MIES[+A[1]-1]+" "+A[0]);
  return fmtDate(a)+" – "+fmtDate(b);
}
function isNext(e){return !!e.od&&(e.do||e.od)>=todayISO();}
var evType="all";
function evCard(e){
  var L=loc(e);
  var when=isNext(e)?'<span class="when">'+ic('date')+' '+esc(fmtRange(e.od,e.do))+'</span>'
    :'<span class="when soft">'+ic('calendar')+' '+esc(e.mies?T("usually")+MIESW[e.mies-1]:T("tbc"))+(L.ost?esc(T("last")+L.ost):'')+'</span>';
  return card(e,{sec:"imprezy",extra:when,tag:EVT[e.typ]?'<span class="tag">'+esc(EVT[e.typ])+'</span>':''});
}
/* bieżący miesiąc na końcu: te imprezy w tym roku już się odbyły (nadchodzące z datą są wyżej) */
function monthDiff(m){var cm=new Date().getMonth()+1,d=(m-cm+12)%12;return d===0?12:d;}
function renderEvents(){
  var types=["all"].concat(Object.keys(EVT).filter(function(k){return EVENTS.some(function(e){return e.typ===k})}));
  chipRow($("ev-chips"),types.map(function(k){return [k,k==="all"?T("allEv"):EVT[k]]}),evType,"t");
  var list=EVENTS.filter(function(e){return evType==="all"||e.typ===evType});
  var nxt=list.filter(isNext).sort(function(a,b){return a.od<b.od?-1:1});
  $("ev-next").innerHTML=nxt.length?nxt.map(evCard).join(""):'<p class="empty">'+esc(T("noEvNext"))+'</p>';
  var cal=list.filter(function(e){return !isNext(e)&&e.mies}).sort(function(a,b){return monthDiff(a.mies)-monthDiff(b.mies)});
  var html="",last=0;
  cal.forEach(function(e){if(e.mies!==last){html+='<h3 class="month">'+esc(MIESM[e.mies-1])+'</h3>';last=e.mies;}html+=evCard(e);});
  var und=list.filter(function(e){return !isNext(e)&&!e.mies});
  if(und.length)html+='<h3 class="month">'+esc(T("tbcH"))+'</h3>'+und.map(evCard).join("");
  $("ev-cal").innerHTML=html||'<p class="empty">'+esc(T("noEv"))+'</p>';
  var start=EVENTS.filter(isNext).sort(function(a,b){return a.od<b.od?-1:1}).slice(0,3);
  if(start.length<3)start=start.concat(EVENTS.filter(function(e){return !isNext(e)&&e.mies}).sort(function(a,b){return monthDiff(a.mies)-monthDiff(b.mies)}).slice(0,3-start.length));
  $("next-events").innerHTML=start.map(evCard).join("");
}
$("ev-chips").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;evType=b.dataset.t;renderEvents();});
/* Sklepy i paliwo */
var shopKind="sklepy";
function renderShops(){
  document.querySelectorAll("#shop-toggle .chip").forEach(function(x){x.classList.toggle("on",x.dataset.k===shopKind);x.setAttribute("aria-pressed",x.dataset.k===shopKind);});
  var arr=shopKind==="sklepy"?SHOPS:FUEL;
  $("shop-lead").textContent=T(shopKind==="sklepy"?"shopsLead":"fuelLead");
  $("shop-list").innerHTML=arr.length?sortByDist(arr).map(function(o){return card(o,{sec:"sklepy"})}).join(""):'<p class="empty">'+esc(T("noData"))+'</p>';
}
$("shop-toggle").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;shopKind=b.dataset.k;renderShops();});

/* ---------- Ulubione / Mój plan ---------- */
function allItems(){
  var out=[];
  [["atrakcje",ATTR],["rozrywka",FUN],["jedzenie",FOOD],["imprezy",EVENTS],["sklepy",SHOPS],["sklepy",FUEL],["deszcz",RAIN],["start",IT],["jedzenie",SLEEP]].forEach(function(p){
    p[1].forEach(function(o){out.push({sec:p[0],o:o});});});
  return out;
}
function renderFavs(){
  var f=favs(), items=allItems(), seen={};
  var list=f.map(function(id){for(var i=0;i<items.length;i++)if(oid(items[i].o)===id&&!seen[id]){seen[id]=1;return items[i];}return null;}).filter(Boolean);
  $("fav-wrap").hidden=!list.length;
  $("fav-list").innerHTML=list.map(function(x){return card(x.o,{sec:x.sec,noReport:true})}).join("");
}

/* ---------- Wyszukiwarka globalna: intencje, synonimy PL/EN/DE, wiele słów, literówki ---------- */
var SZ=window.SZ||{tagi:{},slownik:{},stop:{}};
var SZT={
 pl:{now:"Na czasie",ideas:"Nie wiesz, czego szukać? Wybierz temat:",und:"Szukam:",more:"Pokaż więcej",part:"Nic nie pasuje do wszystkich słów naraz, więc pokazujemy najlepsze częściowe dopasowania.",none:"Nic nie znaleźliśmy dla „%q”. Spróbuj jednego z tematów:",sug:"Może chodzi o:",cnt:"Znaleziono: "},
 en:{now:"Right now",ideas:"Not sure what to look for? Pick a topic:",und:"Searching for:",more:"Show more",part:"Nothing matches all the words, so here are the closest matches.",none:"Nothing found for “%q”. Try one of these topics:",sug:"Did you mean:",cnt:"Found: "},
 de:{now:"Gerade aktuell",ideas:"Sie wissen nicht, wonach Sie suchen? Wählen Sie ein Thema:",und:"Gesucht:",more:"Mehr anzeigen",part:"Nichts passt zu allen Wörtern, hier die besten Teiltreffer.",none:"Nichts gefunden für „%q“. Versuchen Sie eines dieser Themen:",sug:"Meinten Sie:",cnt:"Gefunden: "}};
function szt(k){return (SZT[LANG]||SZT.pl)[k];}
var SZ_IDEAS=["dzieci","deszcz","relaks","kapiel","zamek","przyroda","rower","jedzenie","zakupy","woda","widok","darmowe","impreza"];
var SZ_SEC_ORDER=["atrakcje","rozrywka","deszcz","jedzenie","imprezy","sklepy","start","info"];
var SZ_CAT={woda:["woda"],przyroda:["przyroda"],zabytki:["historia"],nietypowe:["nietypowe"],deszcz:["deszcz"],spozywczy:["zakupy"],market:["zakupy"],piekarnia:["zakupy","kawa"],lokalne:["zakupy","lokalne"],drogeria:["zakupy"],wedkarski:["zakupy","woda"],sport:["zakupy"],niedziela:["niedziela","zakupy"],
 aquapark:["kapiel","deszcz","dzieci"],park:["dzieci","aktywnie"],zoo:["zwierzeta","dzieci"],aktywnie:["aktywnie"],kregle:["wieczor","deszcz"],
 dni:["impreza"],festyn:["impreza","dzieci"],jarmark:["impreza","zakupy","lokalne"],kultura:["impreza","kultura"],swieto:["impreza"],inne:["impreza"],
 blisko:["jedzenie"],bytow:["jedzenie"],"24h":["paliwo"],lpg:["paliwo"],sklep:["paliwo"],myjnia:["paliwo"],adblue:["paliwo"],ev:["paliwo"]};
var SZ_SRC_TAG={ATTR:[],FUN:["aktywnie"],FOOD:["jedzenie"],SLEEP:["nocleg"],IT:["informacja"],RAIN:["deszcz"],SHOPS:["zakupy"],FUEL:["paliwo"],EVENTS:["impreza"]};
function szn(s){return norm(String(s||"").replace(/ß/g,"ss")).replace(/[^a-z0-9]+/g," ").trim();}
function lev1(a,b,max){ /* odległość edycyjna z odcięciem */
  if(Math.abs(a.length-b.length)>max)return max+1; var p=[],i,j; for(j=0;j<=b.length;j++)p[j]=j;
  for(i=1;i<=a.length;i++){var c=[i],mn=i;for(j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<mn)mn=c[j];}if(mn>max)return max+1;p=c;}
  return p[b.length];}
function wordHit(t,w){ /* 2 = pełne/odmiana, 1 = literówka, 0 = brak */
  if(w===t)return 2; if(t.length>=3&&w.indexOf(t)===0)return 2;
  var n=0,L=Math.min(t.length,w.length); while(n<L&&t[n]===w[n])n++;
  var mL=Math.min(t.length,w.length); if((n>=4&&n>=mL-1)||(n>=5&&n>=mL-2))return 2; /* odmiana: dzieci/dziecmi, zamek/zamku */
  if(t.length>=5&&lev1(t,w,t.length>=8?2:1)<=(t.length>=8?2:1))return 1; return 0;}
/* dopowiedzenia słownika: słowa, które inaczej łapią zły temat (pieszy ≠ pies) */
var SZ_WORDS_EXTRA={pieszy:"spacer",piesza:"spacer",piesze:"spacer",pieszo:"spacer",pieszych:"spacer",msza:"kosciol",mszy:"kosciol",msze:"kosciol",nabozenstwo:"kosciol"};
/* ogólne tematy, przy których „Poleca gospodarz” nie wskakuje na górę */
var SZ_HOST_SKIP={aktywnie:1,sport:1,wieczor:1,nietypowe:1,lokalne:1,zima:1};
var SZ_STOP_EXTRA=["godziny","godzina","otwarcia","robic","zrobic","jechac","pojechac","isc","pojsc","mozna","fajne","fajnego","fahren","tun","unternehmen","gibt","es","kann","man","things","thing","stuff","nice","fun stuff"];
var szIdx=null;
function szIndex(){
  if(szIdx&&szIdx.lang===LANG)return szIdx;
  var words={},phrases=[],stop={},labels={},own={};
  ["pl","en","de"].forEach(function(l){
    if(l===LANG||l==="pl")(SZ.stop[l]||[]).forEach(function(w){stop[szn(w)]=1;}); /* puste słowa tylko z bieżącego języka (i PL) */
    var S=SZ.slownik[l]||{};
    Object.keys(S).forEach(function(tag){
      [S[tag].l].concat(S[tag].w||[]).forEach(function(w){w=szn(w);if(!w)return;
        if(w.indexOf(" ")>0)phrases.push([w,tag]);else{(words[w]=words[w]||{})[tag]=1;if(l===LANG)own[w]=1;}});});});
  Object.keys(SZ_WORDS_EXTRA).forEach(function(w){(words[w]=words[w]||{})[SZ_WORDS_EXTRA[w]]=1;own[w]=1;});
  SZ_STOP_EXTRA.forEach(function(w){stop[szn(w)]=1;});
  Object.keys(words).forEach(function(w){if(stop[w])delete stop[w];}); /* słowo-temat wygrywa z „pustym” (np. niem. See = jezioro) */
  var S=SZ.slownik[LANG]||SZ.slownik.pl||{}; Object.keys(S).forEach(function(t){labels[t]=S[t];});
  phrases.sort(function(a,b){return b[0].length-a[0].length});
  var items=[];
  [["atrakcje",ATTR,"ATTR"],["rozrywka",FUN,"FUN"],["jedzenie",FOOD,"FOOD"],["imprezy",EVENTS,"EVENTS"],["sklepy",SHOPS,"SHOPS"],["sklepy",FUEL,"FUEL"],["deszcz",RAIN,"RAIN"],["start",IT,"IT"],["jedzenie",SLEEP,"SLEEP"]].forEach(function(p){
    p[1].forEach(function(o){var L=loc(o),tg={};
      (SZ.tagi[o._orig||o.n]||[]).forEach(function(t,i){tg[t]=i<2?1.5:1;});
      (SZ_SRC_TAG[p[2]]||[]).forEach(function(t){tg[t]=tg[t]||1;});
      (o.c||[]).concat(o.kat?[o.kat]:[],o.typ?[o.typ]:[]).forEach(function(c){(SZ_CAT[c]||[]).forEach(function(t){tg[t]=Math.max(tg[t]||0,1.25);});});
      if(p[0]==='atrakcje'&&/^(Kościół|Cerkiew|Kaplica|Sanktuarium)/.test(o.n))tg.kosciol=1.5; /* każdy kościół równo – o kolejności decyduje odległość */
      var cats=(o.c||[]).map(function(c){return CATN[c]||c}).concat([FUNK[o.kat]||"",EVT[o.typ]||""]).join(" ");
      items.push({sec:p[0],o:o,tags:tg,host:/ekajaki/i.test(o.n)||!!o.pin,
        nm:(szn(o.n)+" "+szn(L.n)).split(" "),pl:szn(o.p).split(" "),tw:szn(String(o.p||"").split(",")[0].replace(/\(.*?\)/g," ")).split(" ").filter(function(w){return w.length>2}),gw:szn((String(o.p||"").match(/gm\.\s*([^),]+)/)||["",""])[1]).split(" ").filter(function(w){return w.length>2}),ct:szn(cats).split(" "),
        ds:(szn(o.d)+" "+szn(L.d)).split(" ").filter(function(w){return w.length>2})});});});
  /* karty z zakładki Info (apteki, szpital, policja, dojazd, zasady) – też do przeszukania */
  document.querySelectorAll("#v-info > .card").forEach(function(el){var h=el.querySelector("h2,h3");if(!h)return;
    var t=el.textContent||"";items.push({sec:"info",info:el,o:{n:h.textContent.trim()},tags:{informacja:1},
      nm:szn(h.textContent).split(" "),pl:[],ct:[],ds:szn(t).split(" ").filter(function(w){return w.length>2}),snip:t.replace(/\s+/g," ").trim().slice(h.textContent.trim().length,h.textContent.trim().length+150)});});
  /* nazwy miejscowości (Bytów, Łupawsko…) nigdy nie są „pustym” słowem */
  var plStop={};(SZ.stop.pl||[]).forEach(function(w){plStop[szn(w)]=1;});SZ_STOP_EXTRA.forEach(function(w){plStop[szn(w)]=1;});
  items.forEach(function(it){(it.tw||[]).concat(it.gw||[]).forEach(function(w){if(!plStop[w])delete stop[w];});});
  szIdx={lang:LANG,words:words,own:own,phrases:phrases,stop:stop,labels:labels,items:items}; return szIdx;}
function szParse(q){
  var X=szIndex(), s=" "+szn(q)+" ", tags={}, toks=[];
  s=s.replace(/ wc /g," toaleta ");
  X.phrases.forEach(function(p){var k=" "+p[0]+" ";if(s.indexOf(k)>=0){tags[p[1]]=1;s=s.replace(k," ");}});
  s.split(" ").forEach(function(t){if(!t||X.stop[t]||t.length<2)return;
    var tt={},w; if(X.words[t])tt=X.words[t];
    else if(t.length>=4)for(w in X.own){if(wordHit(t,w)===2){for(var k in X.words[w])tt[k]=1;}}
    toks.push({t:t,tags:Object.keys(tt)});});
  return {phraseTags:Object.keys(tags),toks:toks};}
var SZ_PREF={dzieci:"rozrywka",kapiel:"rozrywka",aktywnie:"rozrywka",zima:"rozrywka",wieczor:"rozrywka",zwierzeta:"rozrywka",deszcz:"deszcz",jedzenie:"jedzenie",ryba:"jedzenie",pizza:"jedzenie",kawa:"jedzenie",zakupy:"sklepy",paliwo:"sklepy",niedziela:"sklepy",impreza:"imprezy",muzyka:"imprezy",kultura:"imprezy",nocleg:"jedzenie",informacja:"start"};
function szScore(it,tok){
  var tg=0,tx=0,i,h;
  for(i=0;i<tok.tags.length;i++){var w=it.tags[tok.tags[i]];if(w){tg=Math.max(tg,4*w+(SZ_PREF[tok.tags[i]]===it.sec?1:0));if(w>=1.5&&!(it.host&&SZ_HOST_SKIP[tok.tags[i]]))it._tq=1;}}
  if(tg>0&&!it.host)it._tq=1;
  function f(arr,wt){for(var j=0;j<arr.length;j++){h=wordHit(tok.t,arr[j]);if(h){tx=Math.max(tx,h===2?wt:wt/2);if(h===2)return;}}}
  f(it.nm,6); if(tx>=6&&!tok.town)it._tq=1; f(it.pl,3); f(it.ct,3); if(tx<2)f(it.ds,tg?0.5:1.5); /* temat już trafiony – słowo w opisie tylko lekko podbija */
  /* nazwa miejscowości wpisana dokładnie (np. „Kartuzy”, „Ustka”) wygrywa z luźnym dopasowaniem tematu */
  function tw(arr,v){for(var k=0;k<(arr||[]).length;k++){var pw=arr[k];if(pw===tok.t||(tok.t.length>=4&&pw.indexOf(tok.t)===0)){tx=Math.max(tx,v);return;}}} tw(it.tw,9); tw(it.gw,7);
  return tg+tx;}
function szSearch(q){
  var X=szIndex(),P=szParse(q),all=[],part=false;
  if(!X.town){X.town={};X.items.forEach(function(it){(it.tw||[]).concat(it.gw||[]).forEach(function(w){X.town[w]=1;});});X.townL=Object.keys(X.town);}
  P.toks.forEach(function(tk){tk.town=X.town[tk.t]||X.townL.some(function(w){return wordHit(tk.t,w)===2;});}); /* słowo = miejscowość, nie temat */
  var wantSwim=P.phraseTags.indexOf("kapiel")>=0||P.toks.some(function(tk){return tk.tags.indexOf("kapiel")>=0;}); /* ktoś pyta o kąpiel – plaże normalnie, także poza sezonem */
  X.items.forEach(function(it){
    var tot=0,ok=true,hit=0;it._tq=0;
    P.phraseTags.forEach(function(t){if(it.tags[t]){if(!it.host||it.tags[t]>=1.5)it._tq=1;tot+=4*it.tags[t]+(SZ_PREF[t]===it.sec?1:0);hit++;}else ok=false;});
    P.toks.forEach(function(tk){var s=szScore(it,tk);if(s>0){tot+=s;if(s>=1.5)hit++;}else ok=false;}); /* literówka w samym opisie nie liczy się jako trafienie */
    if(it.sec==="imprezy"&&P.phraseTags.indexOf("impreza")<0&&!P.toks.some(function(tk){return tk.tags.indexOf("impreza")>=0}))tot*=0.8; /* imprezy niżej, chyba że ktoś ich szuka */
    if(OFFSEASON&&summerOnly(it.o)&&!wantSwim)tot-=3; /* poza sezonem plaże i kąpieliska niżej */
    it._s=tot;it._ok=ok;it._h=hit;});
  var need=P.phraseTags.length+P.toks.length; if(!need)return {res:[],P:P,part:false};
  X.items.forEach(function(it){if(it.host&&it._h>0&&it._tq)it._s+=6;});
  var maxH=0;X.items.forEach(function(it){if(it._h>maxH)maxH=it._h;});
  if(!maxH)return {res:[],P:P,part:false};
  var full=X.items.some(function(it){return it._ok;}); part=!full;
  var top=X.items.filter(function(it){return it._h===maxH;});
  /* kilka tematów naraz (np. „dzieci deszcz”) = wszystkie naraz; luźniej tylko gdy pełnych trafień jest bardzo mało */
  var res=maxH>=2&&top.length>=3?top:X.items.filter(function(it){return it._h>0&&it._h>=(maxH>=2?maxH-1:1);});
  function dd(o){var x=dOf(o);return x==null?999:x;}
  /* podobny wynik (np. wszystkie kościoły przy „msza”) = najbliższe pierwsze */
  /* bliżej = trochę wyżej (ok. 1 pkt na 20 km), żeby przy „msza” czy „kościół” najbliższe były pierwsze */
  function key(it){var x=dd(it.o);return it._s-(x>=999?2:Math.min(x,120)/20);}
  res.sort(function(a,b){return (b._h-a._h)||(key(b)-key(a));});
  /* kolejność grup = kolejność najlepszego wyniku w grupie; wynik płaski w tej samej kolejności co na ekranie */
  var gOrd=[];res.forEach(function(it){if(!it.host&&gOrd.indexOf(it.sec)<0)gOrd.push(it.sec);});res.forEach(function(it){if(gOrd.indexOf(it.sec)<0)gOrd.push(it.sec);}); /* grupa gospodarza i tak jest na górze */
  var flat=[];gOrd.forEach(function(sec){res.forEach(function(it){if(it.sec===sec)flat.push(it);});});
  /* baza eKajaki: każde dopasowanie trafia do grupy „Poleca gospodarz” na samej górze */
  var host=X.items.filter(function(it){return it.host&&it._h>0&&it._tq&&res.indexOf(it)>=0}).sort(function(a,b){return b._s-a._s});
  flat=host.concat(flat.filter(function(it){return host.indexOf(it)<0}));
  return {res:flat,P:P,part:part,order:gOrd,host:host};}
/* ikona i kolor tematu (zestaw ikon przewodnika zamiast emoji) */
var SZ_ICO={relaks:"moon",dzieci:"fun-park",deszcz:"rain",kapiel:"s-swim",woda:"s-kayak",przyroda:"s-tree",spacer:"s-hike",rower:"bike",widok:"sights",historia:"plan-castle",zamek:"s-castle",kosciol:"s-church",muzeum:"s-museum",zwierzeta:"fun-zoo",aktywnie:"fun-aktywnie",zima:"wx-snow",darmowe:"tip",wieczor:"moon",jedzenie:"food",ryba:"s-food",pizza:"food",kawa:"s-cafe",lokalne:"mushroom",zakupy:"shop",niedziela:"calendar",paliwo:"fuel",impreza:"events",nietypowe:"s-stone",informacja:"info",nocleg:"stay",muzyka:"events",sport:"fun-aktywnie",kultura:"s-museum"};
var SZ_COL={relaks:"#6b4fa0",kapiel:"#1d5aa6",woda:"#1d5aa6",ryba:"#1d5aa6",deszcz:"#3f6aa8",przyroda:"#2b7a30",spacer:"#2b7a30",rower:"#2b7a30",widok:"#2b7a30",zwierzeta:"#2b7a30",zamek:"#a8262f",historia:"#a8262f",kosciol:"#a8262f",muzeum:"#a8262f",kultura:"#a8262f",lokalne:"#8a5a2b",jedzenie:"#c2410c",pizza:"#c2410c",kawa:"#8a5a2b",dzieci:"#b07800",aktywnie:"#b07800",zima:"#3f6aa8",wieczor:"#3b3f8f",impreza:"#b07800",muzyka:"#b07800",sport:"#b07800",nietypowe:"#6b4fa0",darmowe:"#2b7a30",zakupy:"#0f2a52",paliwo:"#0f2a52",niedziela:"#0f2a52",informacja:"#0f2a52",nocleg:"#0f2a52"};
function szIco(tag){return '<span class="szi" style="background:'+(SZ_COL[tag]||"#0f2a52")+'">'+ic(SZ_ICO[tag]||"sights")+'</span>';}
function szChip(tag,on){var L=szIndex().labels[tag];if(!L)return "";return '<button type="button" class="szchip'+(on?" on":"")+'" data-sz="'+tag+'">'+szIco(tag)+'<span>'+esc(L.l)+'</span></button>';}
function szTile(tag){var L=szIndex().labels[tag];if(!L)return "";return '<button type="button" class="sztile" data-sz="'+tag+'">'+szIco(tag)+'<span class="szl">'+esc(L.l)+'</span></button>';}
/* „Na czasie”: propozycje wg pory roku, dnia, godziny, pogody i najbliższych imprez (bez statystyk odwiedzin) */
var SZ_SEASON={zima:{tags:["relaks","zima","deszcz","kapiel"],places:["Sauna fińska nad Jeziorem Jasień – eKajaki.pl","Kryte Lodowisko Bytów","Wyciąg narciarski Amalka","Park Wodny Trzy Fale"]},
 wiosna:{tags:["przyroda","rower","spacer"],places:["Spływy kajakami – eKajaki.pl","Sauna fińska nad Jeziorem Jasień – eKajaki.pl","Góra Siemierzycka","Zamek krzyżacki i Muzeum Zachodniokaszubskie"]},
 lato:{tags:["kapiel","woda","impreza"],places:["Spływy kajakami – eKajaki.pl","Sauna fińska nad Jeziorem Jasień – eKajaki.pl","Jezioro Jasień","Kolej Drezynowa w Bytowie"]},
 jesien:{tags:["relaks","przyroda","muzeum","deszcz"],places:["Sauna fińska nad Jeziorem Jasień – eKajaki.pl","Zamek krzyżacki i Muzeum Zachodniokaszubskie","Góra Siemierzycka"]}};
function szNow(){
  var d=new Date(),m=d.getMonth()+1,h=d.getHours(),out=[],seen={};
  function tag(t){if(!seen[t]&&szIndex().labels[t]){seen[t]=1;out.push({tag:t});}}
  function place(n,sec,extra){if(seen[n])return;var X=szIndex().items.filter(function(it){return it.o.n===n&&(!sec||it.sec===sec)})[0];if(X){seen[n]=1;out.push({it:X,extra:extra||""});}}
  var S=SZ_SEASON[m===12||m<=2?"zima":m<=5?"wiosna":m<=8?"lato":"jesien"]; place(S.places[0]); /* baza eKajaki zawsze na początku */
  if(WX&&WX.daily){var D=WX.daily;if(D.precipitation_probability_max[0]>=60)tag("deszcz");if(D.temperature_2m_max[0]>=25)tag("kapiel");if(D.temperature_2m_max[0]<=0)tag("zima");}
  var lim=new Date(d.getTime()+21*864e5),limISO=lim.getFullYear()+"-"+("0"+(lim.getMonth()+1)).slice(-2)+"-"+("0"+lim.getDate()).slice(-2);
  EVENTS.filter(function(e){return isNext(e)&&e.od<=limISO}).sort(function(a,b){return a.od<b.od?-1:1}).slice(0,2).forEach(function(e){place(e.n,"imprezy",fmtRange(e.od,e.do));});
  if(d.getDay()===0)tag("niedziela"); if(h>=17)tag("jedzenie");
  S.tags.forEach(tag); S.places.slice(1).forEach(function(n){place(n)});
  return out.slice(0,7);}
var SZ_NOWSUB={pl:{tag:"Temat",ev:"Impreza",pl:"Warto zobaczyć"},en:{tag:"Topic",ev:"Event",pl:"Worth a visit"},de:{tag:"Thema",ev:"Veranstaltung",pl:"Sehenswert"}};
function nowChip(x){
  var NS=SZ_NOWSUB[LANG]||SZ_NOWSUB.pl;
  if(x.tag){var Lt=szIndex().labels[x.tag];if(!Lt)return "";
    return '<button type="button" class="sznow" data-sz="'+x.tag+'">'+szIco(x.tag)+'<span class="szt"><b>'+esc(Lt.l)+'</b><small>'+esc(NS.tag)+'</small></span></button>';}
  var o=x.it.o,L=loc(o),id=x.it.sec+"/"+oid(o),ev=x.it.sec==="imprezy";
  var tg=ev?"impreza":((SZ.tagi[o._orig||o.n]||[])[0]||Object.keys(x.it.tags)[0]||"sights");
  return '<a class="sznow" href="#'+id+'" data-go="'+id+'">'+szIco(tg)+'<span class="szt"><b>'+esc(L.n||o.n)+'</b><small>'+esc(x.extra||(ev?NS.ev:NS.pl))+'</small></span></a>';}
function renderIdeas(){var el=$("sz-ideas");if(!el)return;
  var N=szNow();
  el.innerHTML=(N.length?'<p class="szh">'+ic("tip")+' '+esc(szt("now"))+'</p><div class="szrow">'+N.map(nowChip).join("")+'</div>':'')+
    '<p class="szh">'+esc(szt("ideas"))+'</p><div class="szrow sztiles">'+SZ_IDEAS.filter(function(t){return !N.some(function(x){return x.tag===t})}).concat(SZ_IDEAS.filter(function(t){return N.some(function(x){return x.tag===t})})).map(szTile).join("")+'</div>';}
var gq="", szOpen={};
function renderSearch(){
  var box=$("search-res"), q=gq.trim();
  if(szn(q).length<2){box.innerHTML="";box.hidden=true;return;}
  var R=szSearch(q), X=szIndex(), html="";
  var und={};R.P.phraseTags.forEach(function(t){und[t]=1});R.P.toks.forEach(function(tk){tk.tags.forEach(function(t){und[t]=1})});
  var undT=Object.keys(und).filter(function(t){return X.labels[t]}).slice(0,6);
  if(undT.length)html+='<p class="szh">'+esc(szt("und"))+'</p><div class="szrow">'+undT.map(function(t){return szChip(t,true)}).join("")+'</div>';
  if(!R.res.length){
    html+='<p class="empty">'+esc(szt("none").replace("%q",q))+'</p><div class="szrow">'+SZ_IDEAS.map(function(t){return szChip(t,false)}).join("")+'</div>';
    box.hidden=false;box.innerHTML=html;return;}
  if(LANG==="pl"&&(/\bmsz|nabożeńst|liturgi/i.test(q)||und.kosciol))html+='<a class="mszcta" href="#info/msze" data-go="info/msze">'+ic('s-church')+' <span><b>Godziny mszy w okolicy</b><small>wszystkie kościoły na jednej liście, od najbliższego</small></span></a>';
  if(R.part)html+='<p class="small">'+esc(szt("part"))+'</p>';
  html+='<p class="small">'+esc(szt("cnt"))+R.res.length+'</p>';
  var groups={};R.res.forEach(function(it){if(R.host&&R.host.indexOf(it)>=0)return;(groups[it.sec]=groups[it.sec]||[]).push(it);});
  if(R.host&&R.host.length)html+='<h3 class="szg szhost">'+ic('tip')+' '+esc(T("pol"))+' <span>'+R.host.length+'</span></h3>'+R.host.map(function(it){return card(it.o,{sec:it.sec,noReport:true,feat:true})}).join("");
  (R.order||SZ_SEC_ORDER).forEach(function(sec){var g=groups[sec];if(!g)return;
    var lim=szOpen[sec]?g.length:4;
    var nb=document.querySelector('nav.tabs [data-go="'+(sec==="start"?"info":sec)+'"] [data-i18n]');
    html+='<h3 class="szg">'+esc(nb?nb.textContent:sec)+' <span>'+g.length+'</span></h3>'+
      g.slice(0,lim).map(function(it){return it.info?'<article class="card"><h3>'+esc(it.o.n)+'</h3><p class="small">'+esc(it.snip)+'…</p><div class="acts"><a class="btn pri" href="#info" data-go="info">'+ic("info")+' '+esc(it.o.n)+'</a></div></article>':card(it.o,{sec:it.sec,noReport:true})}).join("")+
      (g.length>lim?'<button type="button" class="szmore" data-szmore="'+sec+'">'+esc(szt("more"))+' ('+(g.length-lim)+')</button>':'');});
  box.hidden=false;box.innerHTML=html;}
$("gsearch").addEventListener("input",function(e){gq=e.target.value;szOpen={};renderSearch();});
/* Enter / „Szukaj” na klawiaturze: chowamy klawiaturę i przewijamy do wyników */
$("gsearch").addEventListener("keydown",function(e){if(e.key!=="Enter")return;e.preventDefault();gq=e.target.value;renderSearch();e.target.blur();var r=$("search-res");if(r&&!r.hidden)setTimeout(function(){r.scrollIntoView({behavior:"smooth",block:"start"});},250);});
document.addEventListener("click",function(e){
  var c=e.target.closest("[data-sz]");
  if(c){var L=szIndex().labels[c.dataset.sz];if(!L)return;var g=$("gsearch");g.value=L.l;gq=L.l;szOpen={};renderSearch();
    var r=$("search-res");if(r&&!r.hidden)r.scrollIntoView({behavior:"smooth",block:"start"});return;}
  var m=e.target.closest("[data-szmore]"); if(m){szOpen[m.dataset.szmore]=1;renderSearch();}
});
window.__szSearch=szSearch;

/* ---------- Twój pobyt ---------- */
function renderStay(){
  var P=window.POBYT||{}, Lp=(P.i18n&&P.i18n[LANG])||{};
  var rows=[["wifi","wifi"],["meldunek","key"],["cisza","moon"],["smieci","recycle"],["inne","note"]].filter(function(r){return Lp[r[0]]||P[r[0]]}).map(function(r){
    return '<li>'+ic(r[1])+' <b>'+esc(T("stay_"+r[0]))+':</b> '+esc(Lp[r[0]]||P[r[0]])+'</li>';});
  var acts='<a class="btn pri" href="tel:'+P.tel+'">'+ic('phone')+' '+esc(T("callHost"))+'</a>'+
    '<a class="btn" href="sms:'+P.tel+'">'+ic('sms')+' SMS</a>'+
    (P.wa?'<a class="btn" target="_blank" rel="noopener" href="https://wa.me/'+P.wa+'">WhatsApp</a>':'');
  $("stay").innerHTML='<h3>'+ic('stay')+' '+esc(T("stayH"))+'</h3><p class="meta">'+esc(P.adres||"")+'</p>'+(rows.length?'<ul class="info">'+rows.join("")+'</ul>':'')+
    '<div class="acts">'+acts+'</div><div class="acts">'+(P.oferta||[]).map(function(x){var Lx=(x.i18n&&x.i18n[LANG])||{};
      return '<a class="btn" target="_blank" rel="noopener" href="'+esc(x.url)+'">'+ic(x.ico||'web')+' '+esc(Lx.n||x.n)+'</a>';}).join("")+'</div>';
}

/* ---------- Mini mapka: rowerem z Bytowa do bazy ---------- */
var bikeMap=null;
var BIKE_COL={ulice:"#7a8396",sciezka:"#2e8b3d",lokalna:"#e07856"};
function renderBike(){
  var R=window.TRASA_ROWER; if(!R||!$("stay"))return;
  var box=$("bike"); if(!box){$("stay").insertAdjacentHTML("afterend",'<div class="card bike" id="bike"></div>');box=$("bike");}
  var g=(window.FOTO_BASE||"").replace(/foto\/$/,"");
  var w=R.via.map(function(p){return p[0]+","+p[1]}).join("|");
  var gm="https://www.google.com/maps/dir/?api=1&origin="+R.start.join(",")+"&destination="+R.meta.join(",")+"&waypoints="+encodeURIComponent(w)+"&travelmode=bicycling";
  box.innerHTML='<h3>'+ic('bike')+' '+esc(T("bikeH"))+'</h3>'+
    '<p class="meta">'+esc(T("bikeSub").replace("{km}",String(R.km).replace(".",LANG==="en"?".":",")))+'</p>'+
    '<div class="bikewrap"><div id="bikemap" class="bikemap" aria-hidden="true"></div>'+
    '<button class="bikeopen" data-bikefs aria-label="'+esc(T("bikeOpen"))+'"><span class="btn pri">'+ic('pin')+' '+esc(T("bikeOpen"))+'</span></button></div>'+
    '<ul class="bikeleg">'+["sciezka","lokalna","ulice"].map(function(k){return '<li><span class="sw" style="background:'+BIKE_COL[k]+'"></span>'+esc(T("bike_"+k))+'</li>';}).join("")+'</ul>'+
    '<p class="small">'+esc(T("bikeNote"))+'</p>'+
    '<div class="acts"><a class="btn pri" target="_blank" rel="noopener" href="'+esc(gm)+'">'+ic('route')+' '+esc(T("bikeNav"))+'</a>'+
    '<a class="btn" href="'+esc(g+R.gpx)+'" download>'+ic('pin')+' GPX</a>'+
    '<a class="btn" target="_blank" rel="noopener" href="https://kaszubskierowery.pl/?utm_source=przewodnik&utm_medium=web&utm_campaign=rower-bytow">'+ic('bike')+' '+esc(T("bikeRent"))+'</a></div>';
  if(bikeMap){bikeMap.remove();bikeMap=null;}
  if(typeof L==="undefined"){$("bikemap").innerHTML='<p class="empty">'+esc(T("mapNet"))+'</p>';return;}
  var el=$("bikemap");
  var init=function(){
    /* podgląd: statyczny, nie przechwytuje przewijania strony; pełna interakcja w dużej mapie */
    bikeMap=L.map(el,{zoomControl:false,dragging:false,touchZoom:false,doubleClickZoom:false,scrollWheelZoom:false,boxZoom:false,keyboard:false,tap:false,attributionControl:true});
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(bikeMap);
    drawBikeRoute(bikeMap,R,true);
  };
  if("IntersectionObserver" in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();init();}},{rootMargin:"200px"});io.observe(el);}else init();
}
function drawBikeRoute(m,R,fit){
  var all=[];
  R.segs.forEach(function(s){all=all.concat(s.ll);
    L.polyline(s.ll,{color:"#fff",weight:9,opacity:.9,interactive:false}).addTo(m);
    L.polyline(s.ll,{color:BIKE_COL[s.typ]||"#333",weight:5,opacity:1,dashArray:s.typ==="ulice"?"2 8":null,lineCap:"round"})
     .bindPopup('<b>'+esc(T("bike_"+s.typ))+'</b>').addTo(m);});
  L.marker(R.start,{icon:pinIcon("bike","#1b3566"),title:T("bikeA")}).bindTooltip(T("bikeA"),{permanent:true,direction:"left",className:"bk-tip"})
   .bindPopup('<b>'+esc(T("bikeA"))+'</b><br><a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination='+R.start.join(",")+'&travelmode=bicycling">'+esc(T("route"))+'</a>').addTo(m);
  L.marker(R.meta,{icon:pinIcon("kayak","#c62f3b",true),zIndexOffset:1000,title:"ekajaki.pl"}).bindTooltip("ekajaki.pl",{permanent:true,direction:"right",className:"bk-tip"})
   .bindPopup('<b>ekajaki.pl</b><br>Łupawsko 12A<br><a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination='+R.meta.join(",")+'&travelmode=bicycling">'+esc(T("route"))+'</a>').addTo(m);
  if(fit)m.fitBounds(L.latLngBounds(all),{padding:[24,24]});
  return all;
}
/* duża, w pełni interaktywna mapa na cały ekran */
var bikeFS=null, fsMe=null, fsAcc=null;
function openBikeFS(){
  var R=window.TRASA_ROWER; if(!R||typeof L==="undefined")return;
  var ov=$("bikefs");
  if(!ov){document.body.insertAdjacentHTML("beforeend",'<div id="bikefs" class="bikefs" role="dialog" aria-modal="true" aria-labelledby="bikefs-t">'+
    '<div class="bikefs-bar"><b id="bikefs-t"></b><button class="btn" data-bikeclose></button></div><div id="bikefs-map" class="bikefs-map"></div></div>');ov=$("bikefs");}
  $("bikefs-t").innerHTML=ic('bike')+' '+esc(T("bikeH"));
  ov.querySelector("[data-bikeclose]").innerHTML='✕ '+esc(T("bikeClose"));
  ov.hidden=false; document.documentElement.classList.add("noscroll");
  if(!bikeFS){
    bikeFS=L.map("bikefs-map",{zoomControl:true,maxZoom:19,tap:true});
    var osm=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"});
    var cyc=L.tileLayer("https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",{subdomains:"abc",maxZoom:19,attribution:"© OpenStreetMap, CyclOSM"});
    osm.addTo(bikeFS);
    var trails=L.tileLayer("https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",{maxZoom:18,opacity:.85,attribution:"© waymarkedtrails.org"});
    trails.addTo(bikeFS);
    var lay={}; lay[T("layMap")]=osm; lay[T("layBike")]=cyc;
    var ovl={}; ovl[T("layTrails")]=trails;
    L.control.layers(lay,ovl,{collapsed:false,position:"topright"}).addTo(bikeFS);
    L.control.scale({imperial:false}).addTo(bikeFS);
    var Loc=L.Control.extend({options:{position:"topleft"},onAdd:function(){
      var b=L.DomUtil.create("button","leaflet-bar bk-loc");b.type="button";b.title=T("myPos");b.setAttribute("aria-label",T("myPos"));b.innerHTML=ic('pin');
      L.DomEvent.disableClickPropagation(b);
      L.DomEvent.on(b,"click",function(){b.classList.add("busy");getPos(function(ll,acc){b.classList.remove("busy");
        if(fsMe){fsMe.setLatLng(ll);fsAcc.setLatLng(ll).setRadius(acc);}else{fsAcc=L.circle(ll,{radius:acc,color:"#2a74c0",weight:1,fillOpacity:.12}).addTo(bikeFS);
          fsMe=L.circleMarker(ll,{radius:8,color:"#fff",weight:3,fillColor:"#2a74c0",fillOpacity:1}).bindTooltip(T("here")).addTo(bikeFS);}
        bikeFS.flyTo(ll,Math.max(bikeFS.getZoom(),15));},function(m){b.classList.remove("busy");alert(m);});});
      return b;}});
    new Loc().addTo(bikeFS);
    drawBikeRoute(bikeFS,R,true);
  }
  setTimeout(function(){bikeFS.invalidateSize();},60);
  try{history.pushState({bikefs:1},"");}catch(e){}
  ov.querySelector("[data-bikeclose]").focus();
}
function closeBikeFS(fromPop){
  var ov=$("bikefs"); if(!ov||ov.hidden)return;
  ov.hidden=true; document.documentElement.classList.remove("noscroll");
  if(!fromPop){try{if(history.state&&history.state.bikefs)history.back();}catch(e){}}
  var b=document.querySelector("[data-bikefs]"); if(b)b.focus();
}
document.addEventListener("click",function(e){
  if(e.target.closest("[data-bikefs]")){e.preventDefault();openBikeFS();}
  else if(e.target.closest("[data-bikeclose]")){e.preventDefault();closeBikeFS();}
});
window.addEventListener("popstate",function(){closeBikeFS(true);});
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeBikeFS();});

/* ---------- Ilustrowana mapa okolicy (Claude Design) na tle mapy całego regionu ----------
   Pinezki budowane są z danych (dane.js + wpisy z panelu) przy każdym otwarciu,
   więc każde nowe miejsce ze współrzędnymi pojawia się na mapie automatycznie. */
var MFS_T={pl:{t:"Mapa okolicy",c:"Zamknij",me:"Pokaż mnie",open:"Otwórz kartę",aria:"Powiększ mapę okolicy",near:"W pobliżu",in:"w promieniu",none:"Brak miejsc w pobliżu. Spróbuj kliknąć bliżej miejscowości.",all:"Cały region",ill:"Mapa ilustrowana",hint:"Dotknij dowolnego miejsca na mapie, a pokażemy atrakcje, jedzenie i inne miejsca w pobliżu.",route:"Prowadź",info:"Informacja"},
 en:{t:"Area map",c:"Close",me:"Show me",open:"Open card",aria:"Enlarge the area map",near:"Nearby",in:"within",none:"Nothing nearby. Try tapping closer to a village or town.",all:"Whole region",ill:"Illustrated map",hint:"Tap anywhere on the map to see sights, food and other places nearby.",route:"Directions",info:"Info"},
 de:{t:"Umgebungskarte",c:"Schließen",me:"Mein Standort",open:"Karte öffnen",aria:"Umgebungskarte vergrößern",near:"In der Nähe",in:"im Umkreis von",none:"Nichts in der Nähe. Tippen Sie näher an einen Ort.",all:"Ganze Region",ill:"Illustrierte Karte",hint:"Tippen Sie auf eine beliebige Stelle der Karte, um Sehenswertes, Essen und andere Orte in der Nähe zu sehen.",route:"Route",info:"Info"}};
function mft(k){return (MFS_T[LANG]||MFS_T.pl)[k];}
/* granice obrazu mapy dopasowane do współrzędnych (odwzorowanie Merkatora, odchyłka ~100–300 m) */
var MAP_IMG_B=[[54.09676,17.21896],[54.37444,17.79787]];
var MAP_REG_B=[[53.95,16.84],[54.79,18.30]], MAP_DET_B=[[54.03359,17.09473],[54.44449,17.92969]];
/* warstwy pinezek: [klucz, kolor, dane, widok z kartą, domyślnie włączona] */
function mfsCats(){return [
  ["atrakcje","#1e4f96",ATTR,"atrakcje",true],["rozrywka","#3f9a45",FUN,"rozrywka",true],["jedzenie","#d8333f",FOOD,"jedzenie",true],
  ["noclegi","#6b4fa0",SLEEP,"jedzenie",true],["deszcz","#2a74c0",RAIN,"deszcz",true],["imprezy","#b07800",EVENTS,"imprezy",true],
  ["sklepy","#b8860b",SHOPS,"sklepy",true],["paliwo","#7a4a2a",FUEL,"sklepy",true],["info","#0f2a52",IT,"start",true]];}
var MFS_ICO={noclegi:"stay",imprezy:"events",info:"info"};
function mfsLabel(k){if(k==="noclegi")return LANG==="en"?"Stay":LANG==="de"?"Unterkunft":"Noclegi";if(k==="paliwo")return LANG==="en"?"Fuel":LANG==="de"?"Tanken":"Paliwo";if(k==="info")return mft("info");
  var nb=document.querySelector('nav.tabs [data-go="'+k+'"] [data-i18n]');return nb?nb.textContent:k;}
var mapFS=null,mfsOn={},mfsGroups={},mfsImg=null,mfsMe=null,mfsCircle=null;
function mfsPin(name,color){return L.divIcon({className:"poi",html:'<span class="poi-pin" style="--c:'+color+'"><span class="poi-ic">'+(window.ICONS[name]||window.ICONS.pin||"")+'</span></span>',iconSize:[28,32],iconAnchor:[14,31],popupAnchor:[0,-28],tooltipAnchor:[14,-14]});}
function mfsItems(){var out=[];mfsCats().forEach(function(c){(c[2]||[]).forEach(function(o){if(o.ll&&!o.ukryty)out.push({cat:c[0],col:c[1],view:c[3],o:o});});});return out;}
function mfsGo(x){
  closeMapFS(true);
  if(x.cat==="paliwo"){var t=document.querySelector('#shop-toggle [data-k="paliwo"]');if(t&&!t.classList.contains("on"))t.click();}
  else if(x.cat==="sklepy"){var t2=document.querySelector('#shop-toggle [data-k="sklepy"]');if(t2&&!t2.classList.contains("on"))t2.click();}
  var h=x.view+"/"+oid(x.o);try{history.replaceState(null,"","#"+h);}catch(e){} go(h);}
function mfsTown(o){var t=String(o.p||"").split(/[,(]/)[0].replace(/^gm\.\s*/,"").trim();return /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(t)&&t.split(" ").length<=3&&!/\d/.test(t)?t:"";}
function mfsRow(x,d){var L0=loc(x.o);
  return '<button type="button" class="mfs-row" data-mfsi="'+x.i+'"><span class="mfs-dot" style="background:'+x.col+'">'+ic(MFS_ICO[x.cat]||poiIco(x.cat,x.o))+'</span>'+
    '<span class="mfs-tx"><b>'+esc(L0.n||x.o.n)+'</b><small>'+esc(mfsLabel(x.cat))+(d!=null?' · '+(d<1?Math.round(d*1000)+" m":d.toFixed(1).replace(".",LANG==="en"?".":",")+" km"):'')+'</small></span>'+ic('chev')+'</button>';}
var MFS_CUR=[];
function mfsSheet(title,sub,list){
  var sh=$("mfs-sheet");MFS_CUR=list.map(function(r){return r.x});
  sh.querySelector(".mfs-sh-t").innerHTML='<b>'+esc(title)+'</b><small>'+esc(sub)+'</small>';
  sh.querySelector(".mfs-list").innerHTML=list.length?list.map(function(r,i){r.x.i=i;return mfsRow(r.x,r.d);}).join(""):'<p class="small">'+esc(mft("none"))+'</p>';
  sh.hidden=false;}
function mfsNear(ll){
  mfsLast=ll;if(mfsDot)mfsDot.setLatLng(ll);else mfsDot=L.circleMarker(ll,{radius:7,color:"#fff",weight:3,fillColor:"#a8462e",fillOpacity:1,interactive:false}).addTo(mapFS);
  var on=mfsItems().filter(function(x){return mfsOn[x.cat]}),R=4;
  var list=on.map(function(x){return {x:x,d:dist(x.o.ll,ll)}}).filter(function(r){return r.d<=R});
  if(list.length<3){R=8;list=on.map(function(x){return {x:x,d:dist(x.o.ll,ll)}}).filter(function(r){return r.d<=R});}
  list.sort(function(a,b){return a.d-b.d});
  var near=on.map(function(x){return {t:mfsTown(x.o),d:dist(x.o.ll,ll)}}).filter(function(r){return r.t}).sort(function(a,b){return a.d-b.d})[0];
  if(mfsCircle)mfsCircle.setLatLng(ll).setRadius(R*1000);else mfsCircle=L.circle(ll,{radius:R*1000,color:"#a8462e",weight:2,dashArray:"6 6",fillOpacity:.06,interactive:false}).addTo(mapFS);
  mfsSheet(mft("near")+(near&&near.d<6?": "+near.t:""),list.length+" · "+mft("in")+" "+R+" km",list.slice(0,40));
  /* minimalistyczne pinezki tylko dla miejsc z listy */
  if(!mfsPins)mfsPins=L.layerGroup().addTo(mapFS);mfsPins.clearLayers();
  list.slice(0,40).forEach(function(r){var L0=loc(r.x.o);
    L.circleMarker(r.x.o.ll,{radius:6,color:"#fff",weight:2,fillColor:r.x.col,fillOpacity:1}).bindTooltip(esc(L0.n||r.x.o.n),{direction:"top",offset:[0,-6]})
     .on("click",function(ev){L.DomEvent.stopPropagation(ev);var row=document.querySelector('.mfs-row[data-mfsi="'+r.x.i+'"]');if(row){row.scrollIntoView({block:"nearest",behavior:"smooth"});row.classList.add("hl");setTimeout(function(){row.classList.remove("hl")},1600);}})
     .addTo(mfsPins);});}
/* mapa bez pinezek na starcie: po dotknięciu mapy pojawia się lista „W pobliżu” i małe kropki tych miejsc */
var mfsLast=null,mfsDot=null,mfsPins=null;
function mfsDraw(){if(mfsLast&&!$("mfs-sheet").hidden)mfsNear(mfsLast);}
function mfsChips(){var el=$("mfs-chips");
  el.innerHTML=mfsCats().map(function(c){return '<button type="button" class="mfs-chip'+(mfsOn[c[0]]?" on":"")+'" data-mfsc="'+c[0]+'" aria-pressed="'+(mfsOn[c[0]]?"true":"false")+'"><span class="mfs-cd" style="background:'+c[1]+'"></span>'+esc(mfsLabel(c[0]))+'</button>';}).join("");}
function openMapFS(){
  if(typeof L==="undefined")return;
  var ov=$("mapfs");
  if(!ov){document.body.insertAdjacentHTML("beforeend",'<div id="mapfs" class="bikefs" role="dialog" aria-modal="true" aria-labelledby="mapfs-t">'+
    '<div class="bikefs-bar"><b id="mapfs-t"></b><button class="btn" data-mapclose></button></div><div id="mfs-chips" class="mfs-chips"></div>'+
    '<div class="mfs-wrap"><div id="mapfs-map" class="bikefs-map mapfs-map"></div><p class="mfs-hint" id="mfs-hint"></p>'+
    '<div id="mfs-sheet" class="mfs-sheet" hidden><div class="mfs-sh-h"><span class="mfs-sh-t"></span><button type="button" class="mfs-x" data-mfsx aria-label="✕">✕</button></div><div class="mfs-list"></div></div></div></div>');ov=$("mapfs");
    if(!Object.keys(mfsOn).length)mfsCats().forEach(function(c){mfsOn[c[0]]=c[4];});}
  $("mapfs-t").innerHTML=ic('pin')+' '+esc(mft("t"));
  ov.querySelector("[data-mapclose]").innerHTML='✕ '+esc(mft("c"));
  $("mfs-hint").textContent=mft("hint");$("mfs-hint").hidden=!!mfsLast;
  ov.hidden=false; document.documentElement.classList.add("noscroll");
  if(!mapFS){
    mapFS=L.map("mapfs-map",{minZoom:9,maxZoom:15,zoomSnap:0.25,tap:true,maxBounds:L.latLngBounds(MAP_REG_B).pad(0.04),maxBoundsViscosity:0.9});window.__mfs=mapFS;
    mapFS.attributionControl.setPrefix(false);
    L.tileLayer("mapa/kafle/{z}/{x}/{y}.webp",{minZoom:9,maxNativeZoom:12,maxZoom:15,bounds:MAP_REG_B,noWrap:true,attribution:"Mapa: eKajaki.pl · © autorzy OpenStreetMap (ODbL), © OpenMapTiles, OpenFreeMap"}).addTo(mapFS);
    L.tileLayer("mapa/kafle/{z}/{x}/{y}.webp",{minZoom:(window.devicePixelRatio||1)>1.4?11:12.5,minNativeZoom:13,maxNativeZoom:13,maxZoom:15,bounds:MAP_DET_B,noWrap:true}).addTo(mapFS);
    mapFS.on("click",function(e){mfsNear([e.latlng.lat,e.latlng.lng]);$("mfs-hint").hidden=true;});
    L.control.scale({imperial:false}).addTo(mapFS);
    var Ctl=L.Control.extend({options:{position:"topleft"},onAdd:function(){
      var w=L.DomUtil.create("div","leaflet-bar mfs-ctl");
      var b=L.DomUtil.create("button","bk-loc",w);b.type="button";b.title=mft("me");b.setAttribute("aria-label",mft("me"));b.innerHTML=ic('pin');
      var a=L.DomUtil.create("button","bk-loc",w);a.type="button";a.title=mft("all");a.setAttribute("aria-label",mft("all"));a.innerHTML=ic('sights');
      L.DomEvent.disableClickPropagation(w);
      L.DomEvent.on(a,"click",function(){mapFS.fitBounds(MAP_DET_B,{padding:[10,10]});});
      L.DomEvent.on(b,"click",function(){b.classList.add("busy");getPos(function(ll,acc){b.classList.remove("busy");
        if(mfsMe)mfsMe.setLatLng(ll);else mfsMe=L.circleMarker(ll,{radius:8,color:"#fff",weight:3,fillColor:"#2a74c0",fillOpacity:1}).bindTooltip(T("here")).addTo(mapFS);
        mapFS.flyTo(ll,Math.max(mapFS.getZoom(),13));mfsNear(ll);},function(m){b.classList.remove("busy");alert(m);});});
      return w;}});
    new Ctl().addTo(mapFS);
    setTimeout(function(){mapFS.invalidateSize();var cz=mapFS.getBoundsZoom(MAP_IMG_B,true);mapFS.setView([54.235,17.53],Math.min(Math.max(cz,10.5),12.5));},60);
  } else setTimeout(function(){mapFS.invalidateSize();},60);
  mfsChips(); mfsDraw();
  try{history.pushState({mapfs:1},"");}catch(e){}
  ov.querySelector("[data-mapclose]").focus();
}
function closeMapFS(fromPop){
  var ov=$("mapfs"); if(!ov||ov.hidden)return;
  ov.hidden=true; document.documentElement.classList.remove("noscroll");
  if(!fromPop){try{if(history.state&&history.state.mapfs)history.back();}catch(e){}}
  var b=document.querySelector("[data-mapfs]"); if(b)b.focus({preventScroll:true});
}
document.addEventListener("click",function(e){
  if(e.target.closest("[data-mapfs]")){e.preventDefault();openMapFS();return;}
  if(e.target.closest("[data-mapclose]")){e.preventDefault();closeMapFS();return;}
  var c=e.target.closest("[data-mfsc]");if(c){mfsOn[c.dataset.mfsc]=!mfsOn[c.dataset.mfsc];mfsChips();mfsDraw();return;}
  if(e.target.closest("[data-mfsx]")){$("mfs-sheet").hidden=true;if(mfsCircle){mapFS.removeLayer(mfsCircle);mfsCircle=null;}if(mfsDot){mapFS.removeLayer(mfsDot);mfsDot=null;}if(mfsPins)mfsPins.clearLayers();mfsLast=null;$("mfs-hint").hidden=false;return;}
  var r=e.target.closest("[data-mfsi]");if(r){var x=MFS_CUR[+r.dataset.mfsi];if(x)mfsGo(x);}
});
window.addEventListener("popstate",function(){closeMapFS(true);});
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMapFS();});
function mapAria(){var b=document.querySelector("[data-mapfs]");if(b)b.setAttribute("aria-label",mft("aria"));}


/* ---------- Moja pozycja (112) i „ode mnie” ---------- */
function getPos(cb,err){
  if(!navigator.geolocation){err(T("noGeo"));return;}
  navigator.geolocation.getCurrentPosition(function(p){cb([p.coords.latitude,p.coords.longitude],p.coords.accuracy);},function(){err(T("geoDenied"));},{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
}
function dms(v,pos,neg){var a=Math.abs(v),d=Math.floor(a),m=Math.floor((a-d)*60),s=((a-d)*60-m)*60;return d+"°"+m+"′"+s.toFixed(1)+"″"+(v>=0?pos:neg);}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-mypos]"); if(!b)return;
  var out=b.parentNode.querySelector(".posout"); out.hidden=false; out.textContent=T("locating");
  getPos(function(ll,acc){
    var txt=ll[0].toFixed(5)+", "+ll[1].toFixed(5);
    var msg=T("sosMsg")+txt+" https://maps.google.com/?q="+txt;
    out.innerHTML='<b>'+esc(txt)+'</b><br><span class="small">'+esc(dms(ll[0],"N","S")+" "+dms(ll[1],"E","W"))+' · ±'+Math.round(acc)+' m</span>'+
      '<div class="acts"><a class="btn pri" href="tel:112">112</a><a class="btn" href="sms:?body='+encodeURIComponent(msg)+'">'+esc(T("sendSms"))+'</a>'+
      '<button class="btn" data-copy="'+esc(txt)+'">'+esc(T("copy"))+'</button></div>';
  },function(m){out.textContent=m;});
});
document.addEventListener("click",function(e){var b=e.target.closest("[data-copy]");if(!b)return;
  if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.copy).then(function(){b.innerHTML=ic('check')+' '+esc(T("copied"));});});
function originBar(){
  return '<div class="origin" role="group" aria-label="'+esc(T("distFrom"))+'"><span>'+esc(T("distFrom"))+'</span>'+
    '<button class="chip sm'+(!ORIGIN_ME?" on":"")+'" data-origin="home" aria-pressed="'+!ORIGIN_ME+'">'+esc(T("fromHome"))+'</button>'+
    '<button class="chip sm'+(ORIGIN_ME?" on":"")+'" data-origin="me" aria-pressed="'+ORIGIN_ME+'">'+ic('pin')+' '+esc(T("fromMeB"))+'</button></div>';
}
function renderOrigin(){document.querySelectorAll(".origin-slot").forEach(function(el){el.innerHTML=originBar();});}
document.addEventListener("click",function(e){var b=e.target.closest("[data-origin]");if(!b)return;
  if(b.dataset.origin==="home"){ORIGIN=HOME;ORIGIN_ME=false;renderOrigin();renderStatic();return;}
  b.textContent=T("locating");
  getPos(function(ll){ORIGIN=ll;ORIGIN_ME=true;renderOrigin();renderStatic();if(map&&meMark){meMark.setLatLng(ll);}else if(map){meMark=L.circleMarker(ll,{radius:8,color:"#fff",weight:3,fillColor:"#2a74c0",fillOpacity:1}).addTo(map);}},
    function(m){alert(m);renderOrigin();});
});

/* ---------- Udostępnianie i ulubione ---------- */
document.addEventListener("click",function(e){
  var f=e.target.closest("[data-fav]");
  if(f){toggleFav(f.dataset.fav);var on=isFav(f.dataset.fav);
    document.querySelectorAll('[data-fav="'+f.dataset.fav+'"]').forEach(function(x){x.classList.toggle("on",on);x.innerHTML=on?ic('staron'):ic('star');x.setAttribute("aria-pressed",on);});
    renderFavs();return;}
  var s=e.target.closest("[data-share]"); if(!s)return;
  var art=s.closest("article"), name=art.querySelector("h3").textContent;
  var url=location.origin+location.pathname+(LANG!=="pl"?"?lang="+LANG:"")+"#"+(s.dataset.sec||"atrakcje")+"/"+s.dataset.share;
  if(navigator.share)navigator.share({title:name,text:name+" – "+T("shareTxt"),url:url}).catch(function(){});
  else if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){s.innerHTML=ic('check');setTimeout(function(){s.innerHTML=ic('share')},1500);});
});

/* ---------- Pogoda (Open-Meteo, bez klucza) ---------- */
function wmo(c){if(c===0)return "wx-sun";if(c<=2)return "wx-partly";if(c===3)return "wx-cloud";if(c<=48)return "wx-fog";if(c<=57)return "wx-drizzle";if(c<=67||(c>=80&&c<=82))return "wx-rain";if(c<=86)return "wx-snow";return "wx-storm";}
var WX=null;
function renderWeather(){
  var el=$("wx"); try{renderIdeas();}catch(e){} if(!WX||!WX.daily){el.hidden=true;return;}
  /* prognoza z pamięci telefonu: „Dziś” tylko jeśli naprawdę jest na dziś (bez zasięgu nie pokazujemy wczorajszej) */
  var d=WX.daily, now=new Date(), iso=now.getFullYear()+"-"+("0"+(now.getMonth()+1)).slice(-2)+"-"+("0"+now.getDate()).slice(-2), i=(d.time||[]).indexOf(iso);
  if(i<0){el.hidden=true;return;} el.hidden=false;
  function day(j,lab){return '<div class="wxd"><span class="wxi">'+ic(wmo(d.weather_code[j]))+'</span><b>'+esc(lab)+'</b><span>'+Math.round(d.temperature_2m_max[j])+'° / '+Math.round(d.temperature_2m_min[j])+'°</span>'+
    '<span>'+ic('drop')+' '+(d.precipitation_probability_max[j]==null?"–":d.precipitation_probability_max[j])+'%</span><span>'+ic('wind')+' '+Math.round(d.wind_speed_10m_max[j])+' km/h</span></div>';}
  var sunset=(d.sunset[i]||"").slice(11,16), rain=d.precipitation_probability_max[i]>=60, wind=d.wind_gusts_10m_max[i]>=40;
  var tips=[];
  if(rain)tips.push('<a href="#deszcz" data-go="deszcz">'+ic('rain')+' '+esc(T("wxRain"))+'</a>');
  if(wind)tips.push('<span>'+ic('warn')+' '+esc(T("wxWind"))+'</span>');
  if(d.uv_index_max[i]>=6)tips.push('<span>'+ic('uv')+' '+esc(T("wxUv"))+'</span>');
  el.innerHTML='<h3>'+ic('weather')+' '+esc(T("wxH"))+'</h3><div class="wxrow">'+day(i,T("today"))+(d.time[i+1]?day(i+1,T("tomorrow")):'')+'</div>'+
    '<p class="small">'+ic('sunset')+' '+esc(T("sunset"))+' '+sunset+' · '+esc(T("wxSrc"))+'</p>'+(tips.length?'<p class="wxtips">'+tips.join(" ")+'</p>':'');
}
(function loadWeather(){
  var c=store("przewodnik.pogoda"); if(c&&Date.now()-c.t<3*3600e3){WX=c.d;renderWeather();return;} if(c){WX=c.d;}
  fetch("https://api.open-meteo.com/v1/forecast?latitude="+HOME[0]+"&longitude="+HOME[1]+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunset&timezone=Europe%2FWarsaw&forecast_days=3")
   .then(function(r){return r.json()}).then(function(j){if(j&&j.daily){WX=j;store("przewodnik.pogoda",{t:Date.now(),d:j});}renderWeather();})
   .catch(function(){renderWeather();});
})();

/* ---------- Mapa: wszystkie kategorie ---------- */
var map=null, layers={}, meMark=null;
var LAY=[["atrakcje","#1e4f96",function(){return filtered()}],["rozrywka","#3f9a45",function(){return FUN}],["jedzenie","#d8333f",function(){return FOOD}],
  ["sklepy","#b8860b",function(){return SHOPS}],["paliwo","#7a4a2a",function(){return FUEL}],["deszcz","#2a74c0",function(){return RAIN}]];
/* pinezki z piktogramem zamiast kropek */
var LAYICO={atrakcje:"sights",rozrywka:"fun",jedzenie:"food",sklepy:"shop",paliwo:"fuel",deszcz:"rain"};
function poiIco(sec,o){
  if(sec==="atrakcje"){var c=o.c||[];return c.indexOf("woda")>=0?"kayak":c.indexOf("zabytki")>=0?"plan-castle":c.indexOf("przyroda")>=0?"sights":c.indexOf("nietypowe")>=0?"plan-stone":"sights";}
  if(sec==="rozrywka"){var k=o.kat||"";return window.ICONS["fun-"+k]?"fun-"+k:"fun";}
  return LAYICO[sec]||"pin";
}
function pinIcon(name,color,big){
  var s=big?44:36;
  return L.divIcon({className:"poi",html:'<span class="poi-pin'+(big?' big':'')+'" style="--c:'+color+'"><span class="poi-ic">'+(window.ICONS[name]||window.ICONS.pin||"")+'</span></span>',
    iconSize:[s,s+6],iconAnchor:[s/2,s+4],popupAnchor:[0,-s],tooltipAnchor:[s/2,-s/2]});
}
function drawMarkers(){
  LAY.forEach(function(l){var g=layers[l[0]]; if(!g)return; g.clearLayers();
    l[2]().forEach(function(o0){if(!o0.ll)return;var o=loc(o0);
      L.marker(o0.ll,{icon:pinIcon(poiIco(l[0],o0),l[1]),title:o.n,alt:o.n,riseOnHover:true})
       .bindPopup("<b>"+esc(o.n)+"</b><br>"+esc(o.p)+"<br><a target='_blank' rel='noopener' href='"+esc(mapsUrl(o0))+"'>"+esc(T("route"))+"</a>").addTo(g);});});
}
function initMap(){
  if(map)return;
  if(typeof L==="undefined"){$("map").innerHTML='<p class="empty">'+esc(T("mapNet"))+'</p>';return;}
  map=L.map("map").setView(HOME,10);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}).addTo(map);
  L.marker([54.2755,17.58905],{icon:pinIcon("kayak","#c62f3b",true),zIndexOffset:1000,title:"ekajaki.pl"}).bindPopup("<b>ekajaki.pl</b> · Łupawsko 12A<br>"+esc(T("here"))).addTo(map);
  var ov={};
  LAY.forEach(function(l){layers[l[0]]=L.layerGroup();if(l[0]==="atrakcje")layers[l[0]].addTo(map);
    ov['<span class="lay-ic" style="--c:'+l[1]+'">'+(window.ICONS[LAYICO[l[0]]]||"")+'</span> '+esc(T("lay_"+l[0]))]=layers[l[0]];});
  L.control.layers(null,ov,{collapsed:false}).addTo(map);
  if(ORIGIN_ME)meMark=L.circleMarker(ORIGIN,{radius:8,color:"#fff",weight:3,fillColor:"#2a74c0",fillOpacity:1}).addTo(map);
  drawMarkers();
}
document.querySelector("#v-atrakcje .toggle").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;
  var m=b.dataset.mode==="mapa";
  this.querySelectorAll(".chip").forEach(function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b);});
  $("map").hidden=!m; $("attr-list").hidden=m;
  if(m){initMap(); setTimeout(function(){map&&map.invalidateSize()},50);}
});

/* ---------- Własne wpisy z panelu (Supabase) ---------- */
var BASE={atrakcje:ATTR.slice(),jedzenie:FOOD.slice(),noclegi:SLEEP.slice(),deszcz:RAIN.slice(),it:IT.slice(),plany:PLANS.slice(),plany_deszcz:RAINPLANS.slice(),
  sklepy:SHOPS.slice(),paliwo:FUEL.slice(),imprezy:EVENTS.slice(),rozrywka:FUN.slice()};
function dbCfg(){
  var c=window.PRZEWODNIK_SUPABASE; if(c&&c.url&&c.key)return c;
  var l=store("ekajaki.supabase.config"); if(l&&l.url&&l.key)return l;
  return null;
}
function rowToItem(r){
  /* tłumaczenia: najpierw wersja z pliku (dla poprawianej pozycji), potem pola z panelu */
  var i18n={en:{},de:{}},base=window.DANE_I18N||{};
  ["en","de"].forEach(function(L){var b=(base[L]||{})[r.zastepuje||r.nazwa];if(b)for(var k in b)i18n[L][k]=b[k];});
  if(r.opis_en)i18n.en.d=r.opis_en; if(r.opis_de)i18n.de.d=r.opis_de;
  if(r.nazwa_en)i18n.en.n=r.nazwa_en; if(r.nazwa_de)i18n.de.n=r.nazwa_de;
  if(r.zastepuje&&r.nazwa!==r.zastepuje){if(!r.nazwa_en)delete i18n.en.n;if(!r.nazwa_de)delete i18n.de.n;}
  if(r.zdjecie_url&&/^https:\/\//.test(r.zdjecie_url)){window.FOTO=window.FOTO||{};window.FOTO[r.nazwa]={src:r.zdjecie_url,credit:r.zdjecie_autor||""};}
  else if(r.zastepuje&&r.nazwa!==r.zastepuje&&window.FOTO&&window.FOTO[r.zastepuje]){window.FOTO[r.nazwa]=window.FOTO[r.zastepuje];}
  if(r.sekcja==="plany"||r.sekcja==="plany_deszcz")
    return {t:r.nazwa,steps:String(r.kroki||"").split("\n").map(function(s){return s.trim()}).filter(Boolean)};
  var it={n:r.nazwa,p:r.miejsce||"",d:r.opis||"",c:(r.kategorie||[]).slice(),t:r.telefon||"",w:r.www||"",adr:r.adres||"",h:r.godziny||"",chk:!!r.sprawdz,pol:!!r.polecane,i18n:i18n};
  if(r.godziny_oh)it.oh=r.godziny_oh; if(r.dostep)it.acc=r.dostep;
  if(r.lat!=null&&r.lng!=null)it.ll=[+r.lat,+r.lng]; else if(r.km!=null)it.km=+r.km;
  if(r.sekcja==="imprezy"){it.typ=r.typ||null;it.od=r.data_od||"";it.do=r.data_do||"";it.mies=r.miesiac||null;it.ost=r.ostatnio||null;}
  if(r.sekcja==="rozrywka"&&it.c.length)it.kat=it.c[0];
  if(r.sekcja==="jedzenie"&&!it.c.length){var d=it.ll?dist(it.ll,HOME):it.km; if(d!=null&&d<=10)it.c.push("blisko");}
  return it;
}
/* poprawka z panelu nadpisuje tylko pola z panelu; to, czego panel nie edytuje (msze, cennik, sezon, wyróżnienie, ikony), zostaje z pliku */
var KEEP_FIELDS=["msze","cen","sez","pin","ico","nowe","kat","typ","mies","ost","km","oh","acc"];
function mergeRow(o,it){if(!it||it.steps)return it;KEEP_FIELDS.forEach(function(k){if(it[k]==null&&o[k]!=null)it[k]=o[k];});
  if(!(it.c&&it.c.length)&&o.c)it.c=o.c.slice(); if(!it.ll&&o.ll&&it.km==null)it.ll=o.ll; it._orig=o.n||o.t; return it;}
function fixEv(list){(list||[]).forEach(function(e){if(!e.typ)e.typ="inne";if(e.ost==null)e.ost="";});}
function applyRows(rows){
  var out={};
  Object.keys(BASE).forEach(function(sec){
    var mine=rows.filter(function(r){return r.sekcja===sec}), hide={}, repl={};
    /* ukrycie = wiersz bez treści; szkic poprawki (ukryty z treścią) nie zmienia strony */
    mine.forEach(function(r){if(r.zastepuje){if(r.ukryty){if(!r.opis&&!r.miejsce)hide[r.zastepuje]=1;}else repl[r.zastepuje]=r;}});
    var list=[];
    BASE[sec].forEach(function(o){var key=o.n||o.t; if(hide[key])return; list.push(repl[key]?mergeRow(o,rowToItem(repl[key])):o);});
    mine.forEach(function(r){if(!r.zastepuje&&!r.ukryty)list.push(rowToItem(r));});
    out[sec]=list;
  });
  fixEv(out.imprezy);
  ATTR=out.atrakcje;FOOD=out.jedzenie;SLEEP=out.noclegi;RAIN=out.deszcz;IT=out.it;PLANS=out.plany;RAINPLANS=out.plany_deszcz;SHOPS=out.sklepy;FUEL=out.paliwo;EVENTS=out.imprezy;FUN=out.rozrywka;
  renderStatic();
}
function loadDb(){
  var CK="przewodnik.wpisy.cache", cached=store(CK); if(cached)applyRows(cached);
  var c=dbCfg(); if(!c)return;
  fetch(c.url.replace(/\/+$/,"")+"/rest/v1/przewodnik_wpisy?select=*&order=kolejnosc.asc,created_at.asc",{headers:{apikey:c.key,Authorization:"Bearer "+c.key}})
   .then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
   .then(function(rows){store(CK,rows);applyRows(rows);})
   .catch(function(){ /* baza niedostępna i brak kopii w telefonie: przynajmniej ukrycia z pliku (tools/build-miejsca.js) */
     if(!cached)fetch("ukryte.json").then(function(r){return r.json()}).then(function(u){if(Array.isArray(u))applyRows(u);}).catch(function(){});});
}

/* ---------- Nawigacja zakładek, deep linki, dostępność ---------- */
var VIEWS=["start","atrakcje","rozrywka","jedzenie","imprezy","sklepy","deszcz","info"];
function go(hash,focus){
  var parts=String(hash||"").split("/"), v=parts[0], id=parts[1];
  if(VIEWS.indexOf(v)<0)v="start";
  VIEWS.forEach(function(x){$("v-"+x).classList.toggle("on",x===v)});
  document.querySelectorAll("nav.tabs button").forEach(function(b){var on=b.dataset.go===v;b.classList.toggle("on",on);if(on)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  if(id){var el=$("v-"+v).querySelector('[data-id="'+id.replace(/[^a-z0-9-]/g,"")+'"]'); if(el){el.scrollIntoView({block:el.offsetHeight>innerHeight*0.8?"start":"center"});el.classList.add("hl");setTimeout(function(){el.classList.remove("hl")},2500);return;}}
  window.scrollTo(0,0);
  if(focus){var h=$("v-"+v).querySelector("h2");if(h){h.setAttribute("tabindex","-1");h.focus({preventScroll:true});}}
}
document.addEventListener("click",function(e){var b=e.target.closest("[data-go]");if(!b)return;e.preventDefault();
  if(location.hash!=="#"+b.dataset.go)location.hash=b.dataset.go; else go(b.dataset.go,true);});
window.addEventListener("hashchange",function(){go(location.hash.slice(1),true)});

/* ---------- Msze święte (tylko wersja PL): ramka w karcie kościoła, zbiorcza lista w Info, skrót na starcie ---------- */
function mszeBox(m){
  var r=[];if(m.sob)r.push(['Sobota wieczorem',m.sob+' <small>(msza niedzielna)</small>']);if(m.nd)r.push(['Niedziela',esc(m.nd)]);if(m.tyg)r.push(['Dni powszednie',esc(m.tyg)]);
  return '<div class="msze"><p class="mszh">'+ic('s-church')+' Msze święte <span>maj–sierpień</span></p><dl>'+r.map(function(x){return '<dt>'+x[0]+'</dt><dd>'+(x[0]==='Sobota wieczorem'?esc(m.sob)+' <small>(msza niedzielna)</small>':x[1])+'</dd>'}).join("")+'</dl>'+
    (m.uw?'<p class="small">'+esc(m.uw)+'</p>':'')+'<p class="small mszs">Sprawdzone w listopadzie 2026. Godziny mogą się zmienić – przed przyjazdem zajrzyj do ogłoszeń parafii.</p></div>';}
function mszeList(){return ATTR.filter(function(o){return o.msze}).map(function(o){return {o:o,d:dOf(o)}}).sort(function(a,b){return (a.d==null?999:a.d)-(b.d==null?999:b.d)});}
function renderMsze(){
  var el=$("msze-info");if(el){
    if(LANG!=="pl"){el.hidden=true;}else{el.hidden=false;
    el.innerHTML='<h3>'+ic('s-church')+' Msze święte w okolicy</h3><p class="small">Godziny w sezonie (maj–sierpień), od najbliższego kościoła. Dotknij kościoła, żeby zobaczyć adres, nawigację i szczegóły.</p><ul class="mszl">'+
      mszeList().map(function(x){var o=x.o,m=o.msze,id="atrakcje/"+oid(o),k=x.d!=null?Math.round(x.d)+' km':'';
        var nazwa=o.n.replace(/^(Kościół|Cerkiew)\s+/,function(a){return a}).replace(/ w ([A-ZŁŚŻŹĆ][^,]*)$/,"");
        var miejsc=String(o.p||"").split(",")[0].replace(/\(.*?\)/g,"").replace(/\s+\d+[a-zA-Z]?\s*$/,"").trim();
        return '<li><a href="#'+id+'" data-go="'+id+'"><span class="mszt"><b>'+esc(miejsc)+'</b><small>'+esc(k)+'</small></span><span class="mszn">'+esc(nazwa)+'</span>'+
          '<span class="mszg">'+(m.sob?'<span>sob. '+esc(m.sob)+'</span>':'')+'<span>nd '+esc(m.nd)+'</span></span></a></li>';}).join("")+
      '</ul><p class="small mszs">Sprawdzone w listopadzie 2026 na stronach parafii i diecezji. Godziny mogą się zmienić – przed przyjazdem zajrzyj do ogłoszeń parafii.</p>';}}
  var q=$("msze-quick");if(q)q.hidden=LANG!=="pl";
}

/* ---------- Teksty nowych kart (PL/EN/DE) ---------- */
var OXT={pl:{summer:"tylko latem",offH:"Bez zasięgu nad wodą?",offL:"Zapisz przewodnik w telefonie, póki masz Wi-Fi: mapę okolicy i zdjęcia (ok. 14 MB). Potem działa także w lesie i na jeziorze.",offB:"Zapisz na offline",offP:"Zapisuję… %n z %r",offK:"Gotowe – przewodnik działa bez zasięgu.",offE:"Nie udało się. Spróbuj ponownie na Wi-Fi.",offS:"Zapisane w telefonie: %n z %r plików.",inst:"Dodaj do ekranu głównego",ios:"Na iPhonie: przycisk Udostępnij, potem „Do ekranu początkowego”.",net:"Brak zasięgu – pokazujemy to, co zapisane w telefonie.",rzH:"Łupawa dziś",rzS:"stan wody w Obrowie",rzQ:"przepływ",rzL:"Ostrzeżenia IMGW dla powiatu bytowskiego",rzN:"Brak ostrzeżeń IMGW dla powiatu bytowskiego.",rzSrc:"Dane: IMGW-PIB, pomiar",rzT:"woda"},
 en:{summer:"summer only",offH:"No signal by the water?",offL:"Save the guide on your phone while you have Wi-Fi: the area map and photos (about 14 MB). Then it works in the forest and on the lake too.",offB:"Save for offline",offP:"Saving… %n of %r",offK:"Done – the guide works without signal.",offE:"That didn't work. Try again on Wi-Fi.",offS:"Saved on this phone: %n of %r files.",inst:"Add to home screen",ios:"On iPhone: tap Share, then “Add to Home Screen”.",net:"No signal – showing what is saved on your phone.",rzH:"The Łupawa today",rzS:"water level at Obrowo",rzQ:"flow",rzL:"IMGW weather warnings for Bytów county",rzN:"No IMGW warnings for Bytów county.",rzSrc:"Data: IMGW-PIB, measured",rzT:"water"},
 de:{summer:"nur im Sommer",offH:"Kein Netz am Wasser?",offL:"Speichern Sie den Führer im WLAN auf dem Handy: Umgebungskarte und Fotos (ca. 14 MB). Dann funktioniert er auch im Wald und auf dem See.",offB:"Offline speichern",offP:"Speichere… %n von %r",offK:"Fertig – der Führer funktioniert ohne Netz.",offE:"Hat nicht geklappt. Bitte im WLAN erneut versuchen.",offS:"Auf dem Handy gespeichert: %n von %r Dateien.",inst:"Zum Startbildschirm hinzufügen",ios:"Auf dem iPhone: Teilen, dann „Zum Home-Bildschirm“.",net:"Kein Netz – wir zeigen, was auf dem Handy gespeichert ist.",rzH:"Die Łupawa heute",rzS:"Wasserstand in Obrowo",rzQ:"Abfluss",rzL:"IMGW-Wetterwarnungen für den Kreis Bytów",rzN:"Keine IMGW-Warnungen für den Kreis Bytów.",rzSrc:"Daten: IMGW-PIB, gemessen",rzT:"Wasser"}};
function OX(){return OXT[LANG]||OXT.pl;}

/* ---------- Linki do ekajaki.pl, kaszubskierowery.pl, lupawsko.com: oznaczenie, że gość przyszedł z przewodnika ---------- */
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;
  var h=a.getAttribute("href");if(!/^https?:\/\/(www\.)?(ekajaki\.pl|kaszubskierowery\.pl|lupawsko\.com)(\/|$|\?|#)/i.test(h)||/utm_source=/.test(h))return;
  try{var u=new URL(h);u.searchParams.set("utm_source","przewodnik");u.searchParams.set("utm_medium","referral");u.searchParams.set("utm_campaign","przewodnik-lupawsko");a.href=u.toString();}catch(er){}
},true);

/* ---------- Offline: przycisk „Zapisz na offline”, dodanie do ekranu, pasek „brak zasięgu” ---------- */
var instEv=null, offSt=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();instEv=e;renderOffline();});
function swPost(m){if(navigator.serviceWorker&&navigator.serviceWorker.controller)navigator.serviceWorker.controller.postMessage(m);}
function renderOffline(){var el=$("offl");if(!el)return;var O=OX();
  var sa=window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!sa;
  var st=offSt?(offSt.offline==="postep"?O.offP.replace("%n",offSt.i).replace("%r",offSt.razem):offSt.offline==="koniec"?O.offK:offSt.offline==="blad"?O.offE:offSt.offline==="stan"&&offSt.zapisane>=offSt.razem*0.9?O.offS.replace("%n",Math.min(offSt.zapisane,offSt.razem)).replace("%r",offSt.razem):""):"";
  var busy=offSt&&offSt.offline==="postep";
  el.hidden=!("serviceWorker" in navigator);
  var done=offSt&&(offSt.offline==="koniec"||(offSt.offline==="stan"&&offSt.zapisane>=offSt.razem*0.9));el.classList.toggle("done",!!done);
  el.innerHTML='<h3>'+ic('wifi')+' '+esc(O.offH)+'</h3><p class="small">'+esc(O.offL)+'</p><div class="acts">'+
    '<button type="button" class="btn pri" data-offsave'+(busy?' disabled':'')+'>'+ic('wifi')+' '+esc(O.offB)+'</button>'+
    (instEv&&!sa?'<button type="button" class="btn" data-install>'+ic('star')+' '+esc(O.inst)+'</button>':'')+'</div>'+
    (st?'<p class="small offst" role="status">'+esc(st)+'</p>':'')+(ios?'<p class="small">'+esc(O.ios)+'</p>':'');}
document.addEventListener("click",function(e){
  if(e.target.closest("[data-offsave]")){try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(er){}if(!navigator.serviceWorker.controller){offSt={offline:"blad"};renderOffline();return;}offSt={offline:"postep",i:0,razem:"…"};renderOffline();swPost("zapisz-offline");return;}
  if(e.target.closest("[data-install]")&&instEv){instEv.prompt();instEv.userChoice.then(function(){instEv=null;renderOffline();});}
});
if(navigator.serviceWorker){navigator.serviceWorker.addEventListener("message",function(e){var d=e.data||{};if(!d.offline)return;
  if(d.offline==="koniec")d.offline=d.ok>=d.razem*0.9?"koniec":"blad";offSt=d;renderOffline();});
  navigator.serviceWorker.ready.then(function(){setTimeout(function(){swPost("stan-offline");},1500);});}
/* gość z przeglądarką po angielsku/niemiecku: propozycja zmiany języka (strona domyślnie po polsku) */
window.hideLangHint=function(){var h=$("langhint");if(h)h.hidden=true;try{localStorage.setItem("przewodnik.langhint","1");}catch(e){}};
function langHint(){var h=$("langhint"),l=window.LANG_SUGGEST;if(!h||!l||LANG!=="pl")return;try{if(localStorage.getItem("przewodnik.langhint"))return;}catch(e){}
  var t={en:["This guide is also available in English.","Switch to English","No, thanks"],de:["Dieser Reiseführer ist auch auf Deutsch verfügbar.","Auf Deutsch lesen","Nein, danke"]}[l];
  h.innerHTML='<span>'+esc(t[0])+'</span><button type="button" data-lh="'+l+'">'+esc(t[1])+'</button><button type="button" class="x" data-lh="">'+esc(t[2])+'</button>';h.hidden=false;}
document.addEventListener("click",function(e){var b=e.target.closest("[data-lh]");if(!b)return;var l=b.dataset.lh;window.hideLangHint();
  if(l){try{localStorage.setItem("przewodnik.lang",l);}catch(er){}window.ensureDane(function(){window.applyLang(l);});}});
function netBar(){var b=$("netbar");if(!b)return;b.textContent=OX().net;b.hidden=navigator.onLine!==false;}
window.addEventListener("online",netBar);window.addEventListener("offline",netBar);

/* ---------- Łupawa dziś: stan wody (IMGW, Obrowo – najbliższy wodowskaz) i ostrzeżenia dla powiatu bytowskiego ---------- */
var RZ=null;
function renderRiver(){var el=$("rzeka");if(!el)return;if(!RZ||!RZ.h){el.hidden=true;return;}var O=OX(),h=RZ.h;el.hidden=false;
  var wl=(RZ.w||[]).map(function(w){return '<li><b>'+esc(w.nazwa_zdarzenia)+'</b> ('+esc(w.stopien)+'°) · '+esc(String(w.obowiazuje_od).slice(5,16))+' – '+esc(String(w.obowiazuje_do).slice(5,16))+'<br><span>'+esc(w.tresc)+'</span></li>';}).join("");
  el.innerHTML='<h3>'+ic('drop')+' '+esc(O.rzH)+'</h3><p class="rzv"><b>'+esc(h.stan_wody)+' cm</b> <span>'+esc(O.rzS)+'</span>'+(h.przeplyw?' · <b>'+esc(String(h.przeplyw).replace(".",","))+' m³/s</b> <span>'+esc(O.rzQ)+'</span>':'')+'</p>'+
    (wl?'<p class="small"><b>'+ic('warn')+' '+esc(O.rzL)+'</b></p><ul class="rzw">'+wl+'</ul>':'<p class="small">'+esc(O.rzN)+'</p>')+
    '<p class="small">'+esc(O.rzSrc)+' '+esc(String(h.stan_wody_data_pomiaru||"").slice(0,16))+'</p>';}
(function loadRiver(){
  var c=store("przewodnik.rzeka");if(c){RZ=c.d;renderRiver();if(Date.now()-c.t<3600e3)return;}
  var b="https://danepubliczne.imgw.pl/api/data/";
  Promise.all([fetch(b+"hydro/id/154170230").then(function(r){return r.json()}),fetch(b+"warningsmeteo").then(function(r){return r.json()}).catch(function(){return []})])
   .then(function(a){var h=Array.isArray(a[0])?a[0][0]:a[0];if(!h||!h.stan_wody)return;var now=new Date().toISOString().replace("T"," ").slice(0,19);
     var w=(a[1]||[]).filter(function(x){return (x.teryt||[]).indexOf("2201")>=0&&String(x.obowiazuje_do)>=now;});
     RZ={h:h,w:w};store("przewodnik.rzeka",{t:Date.now(),d:RZ});renderRiver();}).catch(function(){});
})();

/* ---------- Start ---------- */
window.rerenderAll=function(){renderMsze();renderOrigin();renderStatic();renderWeather();renderOffline();renderRiver();netBar();if(map){drawMarkers();}};
applyIcons();
renderMsze();
applyLang(LANG);
loadDb();
go(location.hash.slice(1));
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){
  var hadSW=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js",{scope:"./"}).then(function(reg){
    /* nowa wersja przewodnika zainstalowana w tle → pasek „Odśwież” (tylko gdy strona działała już na starej) */
    reg.addEventListener("updatefound",function(){var w=reg.installing;if(!w)return;w.addEventListener("statechange",function(){if(w.state==="activated"&&hadSW)updBar();});});
  }).catch(function(){});
  /* mapa regionu (1,4 MB) do pamięci dopiero po załadowaniu strony i nie przy oszczędzaniu danych / słabej sieci */
  window.addEventListener("load",function(){setTimeout(function(){var c=navigator.connection||{};if(c.saveData||/(^|-)2g|3g/.test(c.effectiveType||""))return;
    navigator.serviceWorker.ready.then(function(r){if(r.active)r.active.postMessage("kafle-start");});},5000);});
}
function updBar(){var b=$("netbar");if(!b||!b.hidden)return;var t={pl:["Jest nowa wersja przewodnika.","Odśwież"],en:["A new version of the guide is ready.","Reload"],de:["Eine neue Version des Reiseführers ist da.","Neu laden"]}[LANG]||["",""];
  b.innerHTML='<span>'+esc(t[0])+'</span> <button type="button" onclick="location.reload()" style="margin-left:8px;font:700 .85rem var(--sans);border:0;border-radius:99px;padding:6px 14px;background:#fff;color:#0f2a52;cursor:pointer">'+esc(t[1])+'</button>';b.style.background="#0f2a52";b.hidden=false;}
renderOffline();netBar();renderMsze();langHint();
})();
