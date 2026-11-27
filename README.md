# Przewodnik Łupawsko i okolice

Strona: https://przewodnik.lupawsko.com/ (GitHub Pages, gałąź main, katalog główny).
Panel redakcji: https://przewodnik.lupawsko.com/admin.html

## Zasada kolejności: od najbliższego wg trasy samochodem

Wszystkie listy przewodnika (atrakcje, rozrywka, jedzenie, noclegi, gdy pada, sklepy, informacja, strony miejsc) są ułożone **od najbliższego do najdalszego od bazy eKajaki (Łupawsko 12A) wg trasy samochodem** – jak w Google Maps.

- Trasy liczy `tools/drogi.js` (OSRM / OpenStreetMap) → `drogi.js`; nowe punkty doliczają się przy `node tools/build-miejsca.js` i w cotygodniowym automacie.
- Wyjątki: **ścieżki piesze i rowerowe** – linia prosta; widok „od mnie” (GPS) – linia prosta od telefonu; miejsce bez policzonej trasy – linia prosta × 1,3 do najbliższej przebudowy.
- Imprezy – według daty, nie odległości. Strefy w Atrakcjach to pasma trasy: do 5, 5–15, 15–25, ponad 25 km.

## Lista zadań – źródło prawdy

Wszystkie propozycje, zmiany niezrealizowane i zadania cykliczne przewodnika są w jednym miejscu:
**https://claude.ai/artifact/Aq3K5RzF6hr6FPkjVFBNks** (baza strony, kolekcja `pozycje`).

- Przed pracą nad przewodnikiem: przeczytaj listę (otwarte pozycje, priorytety, kto).
- Każda nowa propozycja (z audytu, rozmowy, raportu agenta) → nowa pozycja na liście.
- Po wdrożeniu → status „zrobione” (+ data). Nic nie kasujemy; nieaktualne → „odłożone”.

## Zdjęcia: zawsze AVIF

Każde zdjęcie wrzucane do `foto/` (JPG/PNG z `foto/foto.js`) przerabiamy na AVIF – tak jak na ekajaki.pl:

```bash
python3 tools/foto.py
```

Tworzy `foto/<nazwa>.avif` (pełny rozmiar), `foto/m/<nazwa>.avif` (640 px na telefon) i `foto/m/<nazwa>.webp` (zapas dla starszych przeglądarek). Przeglądarka sama wybiera AVIF. Skrypt uruchamia się też automatycznie przy `node tools/build-miejsca.js`. Po dodaniu zdjęć przebuduj też `offline-lista.json` (pliki `foto/m/*.avif`).
