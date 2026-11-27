/* Wersje językowe przewodnika: PL (źródło w HTML), EN, DE.
   Język wybierany automatycznie wg ustawień telefonu/przeglądarki:
   ?lang=xx w adresie > ręczny wybór (zapamiętany) > navigator.languages (pl/de/en) > EN dla pozostałych. */
(function(){
var UI={
 en:{
  "st.q":"What are you looking for? e.g. kids, castle, rainy day…","sos.h":"In an emergency","sos.l":"On the water or in the forest there is often no address. Get your position and give it to the 112 operator.","sos.b":"<i data-ic=\"pin\"></i> Show my position","sos.b2":"<i data-ic=\"pin\"></i> Show my position","st.fav":"My plan","st.favl":"Places you marked with a star <i data-ic=\"star\"></i>. Saved only on this phone.",
  "hdr.t":"Łupawsko &amp; surroundings",
  "hdr.s":"Pocket guide: Lake Jasień, the Łupawa valley, Bytów",
  "st.h":"Welcome to Łupawsko!",
  "st.l":"You are staying on Lake Jasień, inside the “Słupia Valley” Landscape Park. Here are the essentials. Everything else is in the menu at the bottom.",
  "t1.b":"What to see","t1.s":"Sights sorted by distance",
  "t2.b":"Where to eat","t2.s":"Jasień, Czarna Dąbrówka, Bytów",
  "t3.b":"Fun &amp; leisure","t3.s":"Water parks, zoo, parks, beaches",
  "t4.b":"Events","t4.s":"Festivals, town days, concerts",
  "t5.b":"Shops &amp; fuel","t5.s":"Nearest shops and petrol stations",
  "t6.b":"Rainy day","t6.s":"Plan B under a roof",
  "t7.b":"Emergency number","t7.s":"On the water: 601 100 100",
  "st.ev":"Upcoming events","st.evall":"All events and the year calendar →",
  "st.pl":"Day plans","st.pll":"Ready-made plans that combine places from this guide.",
  "st.it":"Tourist information","st.itl":"Maps, leaflets, souvenirs and answers to your questions.",
  "st.oth":"Other tourist info points in Bytów county",
  "st.othl":"Data from the Bytów County Office list, may be out of date. Please call before visiting.",
  "at.h":"What to see","at.l":"Sorted from nearest. Distances are straight-line from Łupawsko; by road it is usually 20–40% further.",
  "at.list":"List","at.map":"Map","at.q":"Search: lake, church, Kozin…",
  "fu.h":"Fun &amp; leisure","fu.l":"Water parks, amusement parks, animals, active attractions and beaches within a day trip, sorted from nearest. Check prices and opening hours on the venue’s website before you go.",
  "fo.h":"Where to eat","fo.l":"The nearest options are in Jasień (fish restaurant on the lake) and Czarna Dąbrówka. Bytów, about 15 km by road, has the widest choice. Many village places are seasonal, so outside the summer holidays call ahead.",
  "fo.note":"<b>Note:</b> the “Młyn” restaurant in Bytów (ul. Wolności 15) burned down on 25 Oct 2026 and is closed.",
  "sl.h":"Accommodation in Łupawsko","sl.l":"All places are on Lake Jasień, a few minutes’ walk from each other.",
  "ev.h":"Events &amp; festivals","ev.l":"First events with an announced date, then the year calendar showing when each event usually takes place. Summer dates are usually announced in spring, so check the organiser’s website before you travel.",
  "ev.next":"<i data-ic=\"date\"></i> Upcoming dates","ev.cal":"<i data-ic=\"calendar\"></i> Year calendar",
  "ev.src":"Current dates: <a href=\"https://czarnadabrowka.pl/kalendarz-wydarzen/\" target=\"_blank\" rel=\"noopener\">Czarna Dąbrówka municipality calendar</a>, <a href=\"https://bck-bytow.pl/\" target=\"_blank\" rel=\"noopener\">Bytów Cultural Centre</a>, <a href=\"https://kurierbytowski.com.pl/wydarzenia-imprezy\" target=\"_blank\" rel=\"noopener\">Kurier Bytowski</a> (in Polish).",
  "sh.h":"Shops &amp; petrol stations","sh.s":"<i data-ic=\"shop\"></i> Shops","sh.f":"<i data-ic=\"fuel\"></i> Petrol stations",
  "ra.h":"When it rains","ra.l":"Bytów is only about 20 minutes by car and has museums, a swimming pool and cafés. Below are ready-made plans and indoor places.",
  "ra.in":"Indoors nearby","ra.out":"Light rain? Go outside anyway",
  "ra.outl":"\n      <li><i data-ic=\"kayak\"></i> <b>Kayaking in drizzle</b> is perfectly fine: take a rain poncho and dry clothes in a dry bag. Always get off the water in a thunderstorm.</li>\n      <li><i data-ic=\"mushroom\"></i> <b>Mushrooms after rain.</b> Forests cover over 60% of Czarna Dąbrówka municipality, so the day after rain is the best time for mushroom picking (season: August–October). Do not enter nature reserves.</li>\n      <li><i data-ic=\"car\"></i> <b>Drive along the half-timbered churches:</b> Jasień (1699) and Mikorowo (18th c.). Admire them from outside with an umbrella and stay dry in the car in between.</li>\n    ",
  "in.h":"Practical info","in.sos":"Emergency numbers",
  "in.sost":"\n      <tbody><tr><td><a href=\"tel:112\">112</a></td><td>emergency number (all services, English spoken)</td></tr>\n      <tr><td><a href=\"tel:999\">999</a></td><td>ambulance</td></tr>\n      <tr><td><a href=\"tel:998\">998</a></td><td>fire brigade</td></tr>\n      <tr><td><a href=\"tel:997\">997</a></td><td>police</td></tr>\n      <tr><td><a href=\"tel:+48601100100\">601 100 100</a></td><td>water rescue (WOPR)</td></tr>\n    </tbody>",
  "in.hos":"Hospital &amp; police",
  "in.hosl":"\n      <li><b>Bytów County Hospital</b> (24-hour admissions): Bytów, ul. Lęborska 13, switchboard <a href=\"tel:+48598228500\">59 822 85 00</a>. In an emergency call 112.</li>\n      <li><b>County Police Headquarters:</b> Bytów, ul. Styp-Rekowskiego 2, <a href=\"tel:+48477438300\">47 74 38 300</a></li>\n      <li><b>Police station:</b> Czarna Dąbrówka, ul. Słupska 5, <a href=\"tel:+48477438441\">47 74 38 441</a>. Not open 24 hours; outside opening hours call the Bytów headquarters.</li>\n    ",
  "in.ph":"Pharmacies","in.phn":"Check opening hours before you go. Night-duty pharmacies are in Bytów.",
  "in.phl":"\n      <li><b>Czarna Dąbrówka, “Centrum Zdrowia”</b> (nearest, approx. 10 km): ul. Lęborska 9, <a href=\"tel:+48598212369\">59 821 23 69</a></li>\n      <li><b>Bytów, “Rodzinna”</b> (next to the hospital): ul. Lęborska 11, <a href=\"tel:+48598227202\">59 822 72 02</a></li>\n      <li><b>Bytów, “Centrum Zdrowia”:</b> ul. Ks. B. Sychty 3, <a href=\"tel:+48598226645\">59 822 66 45</a></li>\n      <li><b>Bytów, “Pod Aniołem”:</b> ul. Jana Pawła II 5/1, <a href=\"tel:+48598224343\">59 822 43 43</a></li>\n      <li><b>Bytów, “Helios”:</b> ul. Wojska Polskiego 36E, <a href=\"tel:+48598226668\">59 822 66 68</a></li>\n    ",
  "in.tr":"Getting around",
  "in.trl":"\n      <li><i data-ic=\"car\"></i> The area is best explored <b>by car or bike</b>. Bytów is about 15 km away.</li>\n      <li><i data-ic=\"train\"></i> <b>There are currently no passenger trains to Bytów.</b> The Kościerzyna–Lipusz–Bytów line is being rebuilt and trains are due back in December 2027. The nearest stations are Słupsk and Lębork.</li>\n      <li><i data-ic=\"bus\"></i> Bytów bus station: <a href=\"tel:+48598222238\">59 822 22 38</a> (number from the municipal list, may be outdated).</li>\n      <li><i data-ic=\"bike\"></i> Bikes and GPX routes are available at <a href=\"https://kaszubskierowery.pl\" target=\"_blank\" rel=\"noopener\">kaszubskierowery.pl</a>.</li>\n    ",
  "in.ru":"Local rules",
  "in.rul":"\n      <li><i data-ic=\"leaf\"></i> Łupawsko lies in the <b>“Słupia Valley” Landscape Park</b> next to the Natura 2000 site “Łupawa Valley”.</li>\n      <li><i data-ic=\"eagle\"></i> Entry to the <b>“White-tailed eagle nests” reserve</b> is prohibited (strict protection). Watch the eagles from the water, from a distance.</li>\n      <li><i data-ic=\"quiet\"></i> <b>Water birds nest on the islands of Lake Jasień,</b> including goldeneyes. In spring and early summer do not land on the islands and keep quiet.</li>\n      <li><i data-ic=\"sail\"></i> The bridge over the strait between North and South Jasień has only about 1 m of clearance: sailboats must lower their mast.</li>\n    ",
  "in.foot":"\n    <p><b>Data as of November 2026.</b> Information comes from the official websites of the municipalities, Bytów county, the West Kashubian Museum, pomorskie.travel, kajaki.pomorskie.eu, the Regional Directorate for Environmental Protection in Gdańsk, Wikipedia and the venues themselves. Items marked “check before visiting” were confirmed by only one or an older source. Opening hours and prices may change.</p>\n    <p>Guide prepared by <a href=\"https://ekajaki.pl\" target=\"_blank\" rel=\"noopener\">ekajaki.pl</a>, Łupawsko 12A. Found a mistake? Call: <a href=\"tel:+48510808333\">+48 510 808 333</a>.</p>\n    <p><a href=\"admin.html\" rel=\"nofollow\">Host panel</a></p>\n  ",
  "nav.start":"Home","nav.atrakcje":"Sights","nav.rozrywka":"Fun","nav.jedzenie":"Food","nav.imprezy":"Events","nav.sklepy":"Shops","nav.deszcz":"Rain","nav.info":"Info"
 },
 de:{
  "st.q":"Was suchen Sie? z. B. Kinder, Burg, Regenwetter…","sos.h":"Im Notfall","sos.l":"Auf dem Wasser oder im Wald gibt es oft keine Adresse. Ermitteln Sie Ihren Standort und nennen Sie ihn der Notrufzentrale 112.","sos.b":"<i data-ic=\"pin\"></i> Meinen Standort zeigen","sos.b2":"<i data-ic=\"pin\"></i> Meinen Standort zeigen","st.fav":"Mein Plan","st.favl":"Mit Stern <i data-ic=\"star\"></i> markierte Orte. Nur auf diesem Telefon gespeichert.",
  "hdr.t":"Łupawsko und Umgebung",
  "hdr.s":"Taschenführer: Jasień-See, Łupawa-Tal, Bytów",
  "st.h":"Willkommen in Łupawsko!",
  "st.l":"Sie wohnen am Jasień-See im Landschaftsschutzpark „Słupia-Tal“. Hier finden Sie das Wichtigste. Alles Weitere im Menü unten.",
  "t1.b":"Sehenswertes","t1.s":"Nach Entfernung sortiert",
  "t2.b":"Essen gehen","t2.s":"Jasień, Czarna Dąbrówka, Bytów",
  "t3.b":"Freizeit &amp; Spaß","t3.s":"Spaßbäder, Zoo, Parks, Badestellen",
  "t4.b":"Veranstaltungen","t4.s":"Feste, Stadtfeste, Konzerte",
  "t5.b":"Einkaufen &amp; Tanken","t5.s":"Nächste Läden und Tankstellen",
  "t6.b":"Bei Regen","t6.s":"Plan B unter Dach",
  "t7.b":"Notruf","t7.s":"Auf dem Wasser: 601 100 100",
  "st.ev":"Nächste Veranstaltungen","st.evall":"Alle Veranstaltungen und Jahreskalender →",
  "st.pl":"Tagespläne","st.pll":"Fertige Pläne, die Orte aus diesem Führer verbinden.",
  "st.it":"Touristeninformation","st.itl":"Karten, Prospekte, Souvenirs und Antworten auf Ihre Fragen.",
  "st.oth":"Weitere Infostellen im Kreis Bytów",
  "st.othl":"Daten aus der Liste des Landratsamts Bytów, möglicherweise veraltet. Bitte vorher anrufen.",
  "at.h":"Sehenswertes","at.l":"Sortiert nach Nähe. Entfernungen in Luftlinie ab Łupawsko; auf der Straße meist 20–40 % mehr.",
  "at.list":"Liste","at.map":"Karte","at.q":"Suche: See, Kirche, Kozin…",
  "fu.h":"Freizeit &amp; Spaß","fu.l":"Spaßbäder, Freizeitparks, Tiere, Aktivangebote und Badestellen für einen Tagesausflug, nach Nähe sortiert. Preise und Öffnungszeiten bitte vorher auf der Website prüfen.",
  "fo.h":"Essen gehen","fo.l":"Am nächsten liegen Jasień (Fischlokal am See) und Czarna Dąbrówka. Die größte Auswahl bietet Bytów, ca. 15 km entfernt. Viele Lokale auf dem Land sind saisonal geöffnet – außerhalb der Sommerferien bitte vorher anrufen.",
  "fo.note":"<b>Hinweis:</b> Das Restaurant „Młyn“ in Bytów (ul. Wolności 15) ist am 25.10.2026 abgebrannt und geschlossen.",
  "sl.h":"Unterkünfte in Łupawsko","sl.l":"Alle Unterkünfte liegen am Jasień-See, wenige Gehminuten voneinander entfernt.",
  "ev.h":"Veranstaltungen &amp; Feste","ev.l":"Zuerst Veranstaltungen mit festem Termin, darunter der Jahreskalender: wann jede Veranstaltung üblicherweise stattfindet. Sommertermine werden meist im Frühjahr bekannt gegeben – bitte vor der Reise beim Veranstalter prüfen.",
  "ev.next":"<i data-ic=\"date\"></i> Nächste Termine","ev.cal":"<i data-ic=\"calendar\"></i> Jahreskalender",
  "ev.src":"Aktuelle Termine: <a href=\"https://czarnadabrowka.pl/kalendarz-wydarzen/\" target=\"_blank\" rel=\"noopener\">Kalender der Gemeinde Czarna Dąbrówka</a>, <a href=\"https://bck-bytow.pl/\" target=\"_blank\" rel=\"noopener\">Kulturzentrum Bytów</a>, <a href=\"https://kurierbytowski.com.pl/wydarzenia-imprezy\" target=\"_blank\" rel=\"noopener\">Kurier Bytowski</a> (auf Polnisch).",
  "sh.h":"Läden &amp; Tankstellen","sh.s":"<i data-ic=\"shop\"></i> Läden","sh.f":"<i data-ic=\"fuel\"></i> Tankstellen",
  "ra.h":"Bei Regen","ra.l":"Bytów ist nur ca. 20 Autominuten entfernt – mit Museen, Hallenbad und Cafés. Unten fertige Pläne und Orte unter Dach.",
  "ra.in":"Unter Dach in der Nähe","ra.out":"Nur leichter Regen? Trotzdem raus!",
  "ra.outl":"\n      <li><i data-ic=\"kayak\"></i> <b>Kajakfahren bei Nieselregen</b> ist kein Problem: Regencape und trockene Kleidung im Packsack mitnehmen. Bei Gewitter immer sofort ans Ufer.</li>\n      <li><i data-ic=\"mushroom\"></i> <b>Pilze nach dem Regen.</b> Wälder bedecken über 60 % der Gemeinde Czarna Dąbrówka – der Tag nach dem Regen ist ideal zum Pilzesammeln (Saison: August–Oktober). Naturschutzgebiete nicht betreten.</li>\n      <li><i data-ic=\"car\"></i> <b>Rundfahrt zu den Fachwerkkirchen:</b> Jasień (1699) und Mikorowo (18. Jh.). Von außen mit Schirm ansehen, dazwischen bleibt man im Auto trocken.</li>\n    ",
  "in.h":"Praktisches","in.sos":"Notrufnummern",
  "in.sost":"\n      <tbody><tr><td><a href=\"tel:112\">112</a></td><td>Notruf (alle Dienste, auch auf Englisch)</td></tr>\n      <tr><td><a href=\"tel:999\">999</a></td><td>Rettungsdienst</td></tr>\n      <tr><td><a href=\"tel:998\">998</a></td><td>Feuerwehr</td></tr>\n      <tr><td><a href=\"tel:997\">997</a></td><td>Polizei</td></tr>\n      <tr><td><a href=\"tel:+48601100100\">601 100 100</a></td><td>Wasserrettung (WOPR)</td></tr>\n    </tbody>",
  "in.hos":"Krankenhaus &amp; Polizei",
  "in.hosl":"\n      <li><b>Kreiskrankenhaus Bytów</b> (Aufnahme rund um die Uhr): Bytów, ul. Lęborska 13, Zentrale <a href=\"tel:+48598228500\">59 822 85 00</a>. Im Notfall 112 anrufen.</li>\n      <li><b>Kreispolizei:</b> Bytów, ul. Styp-Rekowskiego 2, <a href=\"tel:+48477438300\">47 74 38 300</a></li>\n      <li><b>Polizeiposten:</b> Czarna Dąbrówka, ul. Słupska 5, <a href=\"tel:+48477438441\">47 74 38 441</a>. Nicht rund um die Uhr besetzt; sonst die Kreispolizei Bytów anrufen.</li>\n    ",
  "in.ph":"Apotheken","in.phn":"Öffnungszeiten bitte vorher prüfen. Nachtdienst-Apotheken gibt es in Bytów.",
  "in.phl":"\n      <li><b>Czarna Dąbrówka, „Centrum Zdrowia“</b> (am nächsten, ca. 10 km): ul. Lęborska 9, <a href=\"tel:+48598212369\">59 821 23 69</a></li>\n      <li><b>Bytów, „Rodzinna“</b> (am Krankenhaus): ul. Lęborska 11, <a href=\"tel:+48598227202\">59 822 72 02</a></li>\n      <li><b>Bytów, „Centrum Zdrowia“:</b> ul. Ks. B. Sychty 3, <a href=\"tel:+48598226645\">59 822 66 45</a></li>\n      <li><b>Bytów, „Pod Aniołem“:</b> ul. Jana Pawła II 5/1, <a href=\"tel:+48598224343\">59 822 43 43</a></li>\n      <li><b>Bytów, „Helios“:</b> ul. Wojska Polskiego 36E, <a href=\"tel:+48598226668\">59 822 66 68</a></li>\n    ",
  "in.tr":"Anreise &amp; unterwegs",
  "in.trl":"\n      <li><i data-ic=\"car\"></i> Die Gegend erkundet man am besten <b>mit dem Auto oder Fahrrad</b>. Bis Bytów sind es ca. 15 km.</li>\n      <li><i data-ic=\"train\"></i> <b>Nach Bytów fahren derzeit keine Personenzüge.</b> Die Strecke Kościerzyna–Lipusz–Bytów wird neu gebaut, Züge sollen ab Dezember 2027 wieder fahren. Nächste Bahnhöfe: Słupsk und Lębork.</li>\n      <li><i data-ic=\"bus\"></i> Busbahnhof Bytów: <a href=\"tel:+48598222238\">59 822 22 38</a> (Nummer aus der Gemeindeliste, evtl. veraltet).</li>\n      <li><i data-ic=\"bike\"></i> Fahrräder und GPX-Routen gibt es bei <a href=\"https://kaszubskierowery.pl\" target=\"_blank\" rel=\"noopener\">kaszubskierowery.pl</a>.</li>\n    ",
  "in.ru":"Regeln vor Ort",
  "in.rul":"\n      <li><i data-ic=\"leaf\"></i> Łupawsko liegt im <b>Landschaftsschutzpark „Słupia-Tal“</b> neben dem Natura-2000-Gebiet „Łupawa-Tal“.</li>\n      <li><i data-ic=\"eagle\"></i> Das Reservat <b>„Seeadlerhorste“</b> darf nicht betreten werden (strenger Schutz). Seeadler beobachtet man am besten vom Wasser aus, mit Abstand.</li>\n      <li><i data-ic=\"quiet\"></i> <b>Auf den Inseln des Jasień-Sees brüten Wasservögel,</b> u. a. Schellenten. Im Frühjahr und Frühsommer bitte nicht auf den Inseln anlegen und leise sein.</li>\n      <li><i data-ic=\"sail\"></i> Die Brücke über die Meerenge zwischen Nord- und Süd-Jasień hat nur ca. 1 m Durchfahrtshöhe: Segelboote müssen den Mast legen.</li>\n    ",
  "in.foot":"\n    <p><b>Stand der Daten: November 2026.</b> Quellen: offizielle Websites der Gemeinden, des Kreises Bytów, des Westkaschubischen Museums, pomorskie.travel, kajaki.pomorskie.eu, der Regionaldirektion für Umweltschutz Gdańsk, Wikipedia und der Betriebe selbst. Einträge mit „vor dem Besuch prüfen“ sind nur durch eine oder eine ältere Quelle bestätigt. Öffnungszeiten und Preise können sich ändern.</p>\n    <p>Erstellt von <a href=\"https://ekajaki.pl\" target=\"_blank\" rel=\"noopener\">ekajaki.pl</a>, Łupawsko 12A. Fehler gefunden? Anrufen: <a href=\"tel:+48510808333\">+48 510 808 333</a>.</p>\n    <p><a href=\"admin.html\" rel=\"nofollow\">Gastgeber-Bereich</a></p>\n  ",
  "nav.start":"Start","nav.atrakcje":"Sehen","nav.rozrywka":"Freizeit","nav.jedzenie":"Essen","nav.imprezy":"Events","nav.sklepy":"Läden","nav.deszcz":"Regen","nav.info":"Info"
 }
};
/* Napisy w kodzie JS */
var TXT={
 pl:{"acc_zakaz":"Zakaz wstępu – obserwuj z daleka","acc_umow":"Zwiedzanie po umówieniu","acc_prywatny":"Teren prywatny – oglądaj z drogi","zone_jasien":"Nad Jasieniem","zone_okolice":"Okolice Łupawska","zone_bytow":"Bytów","zone_dalej":"Dalsze wycieczki","zoneL_jasien":"Do ok. 5 km od bazy – pieszo, rowerem albo kajakiem.","zoneL_okolice":"5–15 km, krótki wypad autem lub rowerem.","zoneL_bytow":"Miasto ok. 15 km od bazy: zamek, muzea, zabytki.","zoneL_dalej":"Ponad 15 km – na wycieczkę na pół dnia lub cały dzień.","layTrails":"Szlaki rowerowe","bikeOpen":"Otwórz dużą mapę","bikeClose":"Zamknij","layMap":"Mapa","layBike":"Mapa rowerowa","myPos":"Moja pozycja","bikeH":"Rowerem z Bytowa do bazy ekajaki.pl","bikeSub":"ok. {km} km · ok. 1–1,5 h spokojnej jazdy · asfalt","bike_sciezka":"droga rowerowa Bytów – Pomysk Wielki","bike_lokalna":"spokojna droga lokalna (Pomysk Mały, Soszyca, Jaszewo)","bike_ulice":"ulice Bytowa","bikeNote":"Trasa omija ruchliwą drogę wojewódzką: z Bytowa prowadzi wydzieloną drogą rowerową, dalej lokalnymi drogami. Wyznaczona na mapie OpenStreetMap – na miejscu kieruj się też oznakowaniem.","bikeNav":"Prowadź rowerem","bikeRent":"Wypożycz rower","bikeA":"Bytów, rynek","favA":"Dodaj do mojego planu","fromMe":"od Ciebie","offSeason":"Poza sezonem","openTo":"Otwarte teraz, do ","closedOpens":"Zamknięte, otwarcie dziś o ","closedTomorrow":"Zamknięte, otwarcie jutro o ","closedDay":"Zamknięte, otwarcie: ","days":["nd", "pn", "wt", "śr", "czw", "pt", "sb"],"closed":"Zamknięte","share":"Udostępnij","shareTxt":"przewodnik Łupawsko i okolice","rep":"Zgłoś zmianę lub błąd","repS":"Przewodnik – zmiana: ","repB":"Co się zmieniło (np. zamknięte, inne godziny, nowy telefon)?\n\n","found":"Znaleziono: ","stayH":"Twój pobyt w Łupawsku","stay_wifi":"Wi-Fi","stay_meldunek":"Zameldowanie i wymeldowanie","stay_cisza":"Cisza nocna","stay_smieci":"Śmieci","stay_inne":"Ważne","callHost":"Zadzwoń do gospodarza","noGeo":"Ten telefon nie udostępnia lokalizacji.","geoDenied":"Brak zgody na lokalizację albo brak sygnału GPS. Włącz lokalizację w ustawieniach i spróbuj ponownie.","locating":"Ustalam pozycję…","sosMsg":"Potrzebuję pomocy. Moja pozycja: ","sendSms":"Wyślij SMS z pozycją","copy":"Kopiuj","copied":"Skopiowano","distFrom":"Odległość:","fromHome":"od Łupawska","fromMeB":"ode mnie","wxH":"Pogoda w Łupawsku","today":"Dziś","tomorrow":"Jutro","sunset":"Zachód słońca","wxSrc":"prognoza Open-Meteo","wxRain":"Zapowiadają deszcz – zobacz plan B","wxWind":"Silny wiatr: na otwartym jeziorze trzymaj się brzegu","wxUv":"Wysokie UV – krem z filtrem","lay_atrakcje":"Atrakcje","lay_rozrywka":"Rozrywka","lay_jedzenie":"Jedzenie","lay_sklepy":"Sklepy","lay_paliwo":"Paliwo","lay_deszcz":"Pod dachem",nav:"Prowadź",web:"Strona",chk:"sprawdź przed wizytą",chkT:"Potwierdzone w jednym lub starszym źródle",pol:"Poleca gospodarz",
  lt2:"< 2 km",ok:"ok. ",adr:"Adres:",hrs:"Godziny:",all:"Wszystko",allEv:"Wszystkie",near10:"Do 10 km",nearLup:"Blisko Łupawska",bytow:"Bytów",
  none:"Nic nie znaleziono. Zmień filtr.",cennik:"Cennik",noData:"Brak danych.",noItems:"Brak pozycji.",noEvNext:"Brak ogłoszonych terminów w tej kategorii. Zajrzyj do kalendarza poniżej.",
  noEv:"Brak imprez w tej kategorii.",usually:"zwykle ",last:" · ostatnio: ",tbc:"termin do potwierdzenia",tbcH:"Termin do potwierdzenia",
  mapNet:"Mapa wymaga internetu.",here:"tu jesteś",route:"Prowadź",onlyPl:"",
  shopsLead:"Najbliższe sklepy to małe wiejskie sklepy w Jasieniu i Soszycy, a większy wybór jest w Czarnej Dąbrówce (ok. 10 km). Markety znajdziesz w Bytowie. W niedziele niehandlowe otwarte są tylko małe sklepy i stacje paliw.",
  fuelLead:"Zatankuj zawczasu: najbliższe stacje są w miasteczkach dookoła, nie w samym Łupawsku. Całodobowe stacje są w Bytowie."},
 en:{"acc_zakaz":"No entry – watch from a distance","acc_umow":"Visits by appointment","acc_prywatny":"Private – view from the road","zone_jasien":"Around Lake Jasień","zone_okolice":"Around Łupawsko","zone_bytow":"Bytów","zone_dalej":"Day trips","zoneL_jasien":"Up to approx. 5 km from the base – on foot, by bike or by kayak.","zoneL_okolice":"5–15 km, a short trip by car or bike.","zoneL_bytow":"Town approx. 15 km from the base: castle, museums, heritage.","zoneL_dalej":"Over 15 km – for a half-day or full-day trip.","layTrails":"Signed cycle routes","bikeOpen":"Open full map","bikeClose":"Close","layMap":"Map","layBike":"Cycling map","myPos":"My location","bikeH":"By bike from Bytów to the ekajaki.pl base","bikeSub":"approx. {km} km · approx. 1–1.5 h of easy riding · tarmac","bike_sciezka":"Bytów – Pomysk Wielki cycle path","bike_lokalna":"quiet local road (Pomysk Mały, Soszyca, Jaszewo)","bike_ulice":"streets of Bytów","bikeNote":"The route avoids the busy regional road: from Bytów it follows a separate cycle path, then quiet local roads. Planned on OpenStreetMap data – also follow the signs on site.","bikeNav":"Navigate by bike","bikeRent":"Rent a bike","bikeA":"Bytów, Market Square","favA":"Add to my plan","fromMe":"from you","offSeason":"Out of season","openTo":"Open now, until ","closedOpens":"Closed, opens today at ","closedTomorrow":"Closed, opens tomorrow at ","closedDay":"Closed, opens: ","days":["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],"closed":"Closed","share":"Share","shareTxt":"Łupawsko & surroundings guide","rep":"Report a change or mistake","repS":"Guide – change: ","repB":"What has changed (e.g. closed, different hours, new phone)?\n\n","found":"Found: ","stayH":"Your stay in Łupawsko","stay_wifi":"Wi-Fi","stay_meldunek":"Check-in and check-out","stay_cisza":"Quiet hours","stay_smieci":"Rubbish","stay_inne":"Important","callHost":"Call your host","noGeo":"This phone does not provide location.","geoDenied":"Location permission denied or no GPS signal. Turn on location in settings and try again.","locating":"Getting your position…","sosMsg":"I need help. My position: ","sendSms":"Send position by SMS","copy":"Copy","copied":"Copied","distFrom":"Distance:","fromHome":"from Łupawsko","fromMeB":"from me","wxH":"Weather in Łupawsko","today":"Today","tomorrow":"Tomorrow","sunset":"Sunset","wxSrc":"forecast by Open-Meteo","wxRain":"Rain expected – see plan B","wxWind":"Strong wind: on the open lake stay close to the shore","wxUv":"High UV – use sunscreen","lay_atrakcje":"Sights","lay_rozrywka":"Fun","lay_jedzenie":"Food","lay_sklepy":"Shops","lay_paliwo":"Fuel","lay_deszcz":"Indoors",nav:"Directions",web:"Website",chk:"check before visiting",chkT:"Confirmed by only one or an older source",pol:"Host’s tip",
  lt2:"< 2 km",ok:"approx. ",adr:"Address:",hrs:"Hours:",all:"All",allEv:"All",near10:"Within 10 km",nearLup:"Near Łupawsko",bytow:"Bytów",
  none:"Nothing found. Change the filter.",cennik:"Prices",noData:"No data.",noItems:"No items.",noEvNext:"No announced dates in this category. See the calendar below.",
  noEv:"No events in this category.",usually:"usually ",last:" · last: ",tbc:"date to be confirmed",tbcH:"Date to be confirmed",
  mapNet:"The map needs an internet connection.",here:"you are here",route:"Directions",onlyPl:"(description in Polish)",
  shopsLead:"The nearest shops are small village shops in Jasień and Soszyca, with more choice in Czarna Dąbrówka (approx. 10 km). Supermarkets are in Bytów. Most shops in Poland are closed on Sundays – only small shops and petrol stations open.",
  fuelLead:"Fill up in advance: there is no petrol station in Łupawsko itself, the nearest are in the surrounding towns. 24-hour stations are in Bytów."},
 de:{"acc_zakaz":"Betreten verboten – aus der Ferne beobachten","acc_umow":"Besichtigung nach Vereinbarung","acc_prywatny":"Privatgelände – von der Straße ansehen","zone_jasien":"Am Jasień-See","zone_okolice":"Rund um Łupawsko","zone_bytow":"Bytów","zone_dalej":"Tagesausflüge","zoneL_jasien":"Bis ca. 5 km von der Basis – zu Fuß, mit dem Rad oder Kajak.","zoneL_okolice":"5–15 km, ein kurzer Ausflug mit Auto oder Rad.","zoneL_bytow":"Stadt ca. 15 km von der Basis: Burg, Museen, Sehenswürdigkeiten.","zoneL_dalej":"Über 15 km – für einen halben oder ganzen Tag.","layTrails":"Radwanderwege","bikeOpen":"Große Karte öffnen","bikeClose":"Schließen","layMap":"Karte","layBike":"Radkarte","myPos":"Mein Standort","bikeH":"Mit dem Rad von Bytów zur ekajaki.pl-Basis","bikeSub":"ca. {km} km · ca. 1–1,5 Std. gemütliche Fahrt · Asphalt","bike_sciezka":"Radweg Bytów – Pomysk Wielki","bike_lokalna":"ruhige Nebenstraße (Pomysk Mały, Soszyca, Jaszewo)","bike_ulice":"Straßen von Bytów","bikeNote":"Die Route meidet die verkehrsreiche Landesstraße: Ab Bytów auf einem separaten Radweg, danach auf ruhigen Nebenstraßen. Geplant mit OpenStreetMap-Daten – vor Ort bitte auch der Beschilderung folgen.","bikeNav":"Mit dem Rad navigieren","bikeRent":"Fahrrad mieten","bikeA":"Bytów, Marktplatz","favA":"Zu meinem Plan hinzufügen","fromMe":"von Ihnen","offSeason":"Außerhalb der Saison","openTo":"Jetzt geöffnet, bis ","closedOpens":"Geschlossen, öffnet heute um ","closedTomorrow":"Geschlossen, öffnet morgen um ","closedDay":"Geschlossen, öffnet: ","days":["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],"closed":"Geschlossen","share":"Teilen","shareTxt":"Reiseführer Łupawsko und Umgebung","rep":"Änderung oder Fehler melden","repS":"Reiseführer – Änderung: ","repB":"Was hat sich geändert (z. B. geschlossen, andere Zeiten, neue Telefonnummer)?\n\n","found":"Gefunden: ","stayH":"Ihr Aufenthalt in Łupawsko","stay_wifi":"WLAN","stay_meldunek":"An- und Abreise","stay_cisza":"Nachtruhe","stay_smieci":"Müll","stay_inne":"Wichtig","callHost":"Gastgeber anrufen","noGeo":"Dieses Telefon stellt keinen Standort bereit.","geoDenied":"Keine Standortfreigabe oder kein GPS-Signal. Standort in den Einstellungen einschalten und erneut versuchen.","locating":"Standort wird ermittelt…","sosMsg":"Ich brauche Hilfe. Mein Standort: ","sendSms":"Standort per SMS senden","copy":"Kopieren","copied":"Kopiert","distFrom":"Entfernung:","fromHome":"ab Łupawsko","fromMeB":"ab mir","wxH":"Wetter in Łupawsko","today":"Heute","tomorrow":"Morgen","sunset":"Sonnenuntergang","wxSrc":"Vorhersage von Open-Meteo","wxRain":"Regen erwartet – siehe Plan B","wxWind":"Starker Wind: auf dem offenen See in Ufernähe bleiben","wxUv":"Hoher UV-Index – Sonnencreme benutzen","lay_atrakcje":"Sehenswertes","lay_rozrywka":"Freizeit","lay_jedzenie":"Essen","lay_sklepy":"Läden","lay_paliwo":"Tanken","lay_deszcz":"Unter Dach",nav:"Route",web:"Website",chk:"vor dem Besuch prüfen",chkT:"Nur durch eine oder eine ältere Quelle bestätigt",pol:"Tipp des Gastgebers",
  lt2:"< 2 km",ok:"ca. ",adr:"Adresse:",hrs:"Öffnungszeiten:",all:"Alle",allEv:"Alle",near10:"Bis 10 km",nearLup:"Nahe Łupawsko",bytow:"Bytów",
  none:"Nichts gefunden. Filter ändern.",cennik:"Preise",noData:"Keine Daten.",noItems:"Keine Einträge.",noEvNext:"Keine angekündigten Termine in dieser Kategorie. Siehe Kalender unten.",
  noEv:"Keine Veranstaltungen in dieser Kategorie.",usually:"meist ",last:" · zuletzt: ",tbc:"Termin noch offen",tbcH:"Termin noch offen",
  mapNet:"Die Karte braucht eine Internetverbindung.",here:"Sie sind hier",route:"Route",onlyPl:"(Beschreibung auf Polnisch)",
  shopsLead:"Die nächsten Läden sind kleine Dorfläden in Jasień und Soszyca, mehr Auswahl gibt es in Czarna Dąbrówka (ca. 10 km). Supermärkte sind in Bytów. In Polen sind die meisten Geschäfte sonntags geschlossen – nur kleine Läden und Tankstellen haben offen.",
  fuelLead:"Rechtzeitig tanken: In Łupawsko selbst gibt es keine Tankstelle, die nächsten liegen in den Nachbarorten. Rund um die Uhr geöffnete Tankstellen gibt es in Bytów."}
};
var MAPS={
 pl:{CATN:{przyroda:"Przyroda",zabytki:"Zabytki",woda:"Woda i szlaki",nietypowe:"Nietypowe",deszcz:"Pod dachem","24h":"Całodobowa",lpg:"LPG",sklep:"Sklep",myjnia:"Myjnia",adblue:"AdBlue",ev:"Ładowarka EV",
   spozywczy:"Spożywczy",market:"Market",piekarnia:"Piekarnia",lokalne:"Lokalne produkty",drogeria:"Drogeria",wedkarski:"Wędkarski",sport:"Sport i rowery",niedziela:"Otwarte w niedziele"},
  EVT:{dni:"Dni miast i gmin",festyn:"Festyny",jarmark:"Jarmarki",kultura:"Kultura",sport:"Sport",swieto:"Święta",inne:"Inne"},
  FUNK:{aquapark:"Aquaparki i baseny",park:"Parki rozrywki",zoo:"Zoo i zwierzęta",aktywnie:"Aktywnie",woda:"Kąpieliska i sprzęt",kregle:"Kręgle i kino"},
  MIES:["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"],
  MIESM:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],
  MIESW:["w styczniu","w lutym","w marcu","w kwietniu","w maju","w czerwcu","w lipcu","w sierpniu","we wrześniu","w październiku","w listopadzie","w grudniu"]},
 en:{CATN:{przyroda:"Nature",zabytki:"Heritage",woda:"Water & trails",nietypowe:"Unusual",deszcz:"Indoors","24h":"24 hours",lpg:"LPG",sklep:"Shop",myjnia:"Car wash",adblue:"AdBlue",ev:"EV charger",
   spozywczy:"Grocery",market:"Supermarket",piekarnia:"Bakery",lokalne:"Local produce",drogeria:"Drugstore",wedkarski:"Fishing",sport:"Sport & bikes",niedziela:"Open on Sundays"},
  EVT:{dni:"Town & village days",festyn:"Fairs & fêtes",jarmark:"Markets",kultura:"Culture",sport:"Sport",swieto:"Holidays",inne:"Other"},
  FUNK:{aquapark:"Water parks & pools",park:"Amusement parks",zoo:"Zoo & animals",aktywnie:"Active",woda:"Beaches & rentals",kregle:"Bowling & cinema"},
  MIES:["January","February","March","April","May","June","July","August","September","October","November","December"],
  MIESM:["January","February","March","April","May","June","July","August","September","October","November","December"],
  MIESW:["in January","in February","in March","in April","in May","in June","in July","in August","in September","in October","in November","in December"]},
 de:{CATN:{przyroda:"Natur",zabytki:"Kulturerbe",woda:"Wasser & Wege",nietypowe:"Ungewöhnlich",deszcz:"Unter Dach","24h":"24 Stunden",lpg:"Autogas",sklep:"Shop",myjnia:"Waschanlage",adblue:"AdBlue",ev:"E-Ladesäule",
   spozywczy:"Lebensmittel",market:"Supermarkt",piekarnia:"Bäckerei",lokalne:"Regionales",drogeria:"Drogerie",wedkarski:"Angelbedarf",sport:"Sport & Rad",niedziela:"Sonntags offen"},
  EVT:{dni:"Stadt- & Gemeindefeste",festyn:"Volksfeste",jarmark:"Märkte",kultura:"Kultur",sport:"Sport",swieto:"Feiertage",inne:"Sonstiges"},
  FUNK:{aquapark:"Spaßbäder & Hallenbäder",park:"Freizeitparks",zoo:"Zoo & Tiere",aktywnie:"Aktiv",woda:"Badestellen & Verleih",kregle:"Bowling & Kino"},
  MIES:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
  MIESM:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
  MIESW:["im Januar","im Februar","im März","im April","im Mai","im Juni","im Juli","im August","im September","im Oktober","im November","im Dezember"]}
};
var SUP=["pl","en","de"], KEY="przewodnik.lang", PL_HTML={}, PL_PH={}, PL_MAPS=null;

function detect(){
  try{var q=new URLSearchParams(location.search).get("lang");if(q&&SUP.indexOf(q)>=0)return q;}catch(e){}
  try{var s=localStorage.getItem(KEY);if(s&&SUP.indexOf(s)>=0)return s;}catch(e){}
  /* bez wyboru: zawsze PL (tak samo widzi to Google); język przeglądarki tylko podpowiadamy paskiem */
  var langs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||"pl"]);
  for(var i=0;i<langs.length;i++){var l=String(langs[i]).toLowerCase().slice(0,2);if(l==="pl")break;if(l==="en"||l==="de"){window.LANG_SUGGEST=l;break;}}
  return "pl";
}
/* tłumaczenia danych (i18n-dane.js, ~170 kB) ładujemy tylko dla EN/DE */
window.ensureDane=function(cb){if(window.DANE_I18N){cb();return;}var s=document.createElement("script");s.src="i18n-dane.js?v="+(window.PRZ_V||"");s.onload=cb;s.onerror=cb;document.head.appendChild(s);};
var DESC={pl:"Kieszonkowy przewodnik dla gości w Łupawsku: atrakcje Jeziora Jasień, doliny Łupawy i Bytowa, gdzie zjeść, co robić w deszczu, imprezy, sklepy i numery alarmowe.",
 en:"Pocket guide to Łupawsko and Lake Jasień in Kashubia, Poland: sights, the Łupawa valley and Bytów, where to eat, rainy-day ideas, events, shops and emergency numbers.",
 de:"Taschen-Reiseführer für Łupawsko und den Jasień-See in der Kaschubei (Polen): Sehenswürdigkeiten, Łupawa-Tal und Bytów, Essen, Ideen für Regentage, Veranstaltungen, Läden und Notrufnummern."};
function seoLang(l){var base="https://przewodnik.lupawsko.com/",u=l==="pl"?base:base+"?lang="+l;
  var c=document.querySelector('link[rel="canonical"]');if(c)c.href=u;
  var d=document.querySelector('meta[name="description"]');if(d)d.content=DESC[l];
  var o=document.querySelector('meta[property="og:url"]');if(o)o.content=u;
  var od=document.querySelector('meta[property="og:description"]');if(od)od.content=DESC[l];}
window.LANG=detect();
for(var _n in MAPS.pl)window[_n]=MAPS[window.LANG][_n]||MAPS.pl[_n];
window.T=function(k){return (TXT[window.LANG]&&TXT[window.LANG][k]!=null)?TXT[window.LANG][k]:TXT.pl[k];};
/* tłumaczenie pozycji z danych: DANE_I18N[lang][nazwa] = {n,p,d,h,t(plan),steps}; wpisy z panelu mają własne pola i18n */
window.loc=function(o){
  var L=window.LANG; if(L==="pl"||!o)return o;
  var tr=(o.i18n&&o.i18n[L])||(window.DANE_I18N&&window.DANE_I18N[L]&&window.DANE_I18N[L][o.n||o.t])||null;
  var c={};for(var k in o)c[k]=o[k];
  if(tr){for(var j in tr){if(tr[j])c[j]=tr[j];else if(tr[j]==="")delete c[j];}} /* "" w tłumaczeniu = pole tylko po polsku (np. godziny mszy) */
  else if(o.d){c._onlyPl=true;}
  return c;
};
window.applyLang=function(l){
  if(SUP.indexOf(l)<0)l="pl";
  window.LANG=l; document.documentElement.lang=l; seoLang(l);
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var k=el.getAttribute("data-i18n"); if(!(k in PL_HTML))PL_HTML[k]=el.innerHTML;
    el.innerHTML=(l!=="pl"&&UI[l]&&UI[l][k]!=null)?UI[l][k]:PL_HTML[k];if(window.applyIcons)window.applyIcons(el);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
    var k=el.getAttribute("data-i18n-ph"); if(!(k in PL_PH))PL_PH[k]=el.getAttribute("placeholder");
    el.setAttribute("placeholder",(l!=="pl"&&UI[l][k])?UI[l][k]:PL_PH[k]);
  });
  var m=MAPS[l]; for(var n in MAPS.pl)window[n]=m[n]||MAPS.pl[n];
  document.querySelectorAll(".langs button").forEach(function(b){b.classList.toggle("on",b.dataset.lang===l);b.setAttribute("aria-pressed",b.dataset.lang===l);});
  var t={pl:"Łupawsko i okolice – przewodnik",en:"Łupawsko & surroundings – guide",de:"Łupawsko und Umgebung – Reiseführer"};document.title=t[l];
  if(typeof window.rerenderAll==="function")window.rerenderAll();
};
document.addEventListener("click",function(e){var b=e.target.closest(".langs button");if(!b)return;
  var l=b.dataset.lang;try{localStorage.setItem(KEY,l);}catch(err){} if(window.hideLangHint)window.hideLangHint();
  if(l==="pl")window.applyLang(l);else window.ensureDane(function(){window.applyLang(l);});});
})();
