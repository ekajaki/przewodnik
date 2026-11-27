# Przewodnik Łupawsko i okolice

Strona: https://przewodnik.lupawsko.com/ (GitHub Pages, gałąź main, katalog główny).
Panel redakcji: https://przewodnik.lupawsko.com/admin.html

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
