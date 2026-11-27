#!/usr/bin/env python3
"""Konwersja zdjęć przewodnika do AVIF (jak na ekajaki.pl), z WebP jako zapasem dla starszych przeglądarek.

Dla każdego zdjęcia foto/<nazwa>.jpg|jpeg|png tworzy (tylko gdy brak albo źródło jest nowsze):
  foto/<nazwa>.avif       – pełny rozmiar (komputer, banery, strony miejsc)
  foto/m/<nazwa>.avif     – 640 px (telefon: karty, kafle, offline)
  foto/m/<nazwa>.webp     – 640 px, zapas dla przeglądarek bez AVIF

Uruchamiaj po każdym dodaniu lub podmianie zdjęcia:  python3 tools/foto.py
Wymaga Pillow z obsługą AVIF (Pillow 11.2+).
"""
import glob, os, re, sys
from PIL import Image, features

if not features.check("avif"):
    sys.exit("Pillow bez obsługi AVIF – zaktualizuj Pillow (pip install -U pillow)")

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FOTO = os.path.join(R, "foto")
M = os.path.join(FOTO, "m")
os.makedirs(M, exist_ok=True)

def stale(out, src):
    return not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src)

zrobione = 0
for src in sorted(glob.glob(os.path.join(FOTO, "*"))):
    if not re.search(r"\.(jpe?g|png)$", src, re.I):
        continue
    base = re.sub(r"\.(jpe?g|png)$", "", os.path.basename(src), flags=re.I)
    full, mav, mwe = os.path.join(FOTO, base + ".avif"), os.path.join(M, base + ".avif"), os.path.join(M, base + ".webp")
    if not (stale(full, src) or stale(mav, src) or stale(mwe, src)):
        continue
    im = Image.open(src).convert("RGB")
    if stale(full, src):
        im.save(full, "AVIF", quality=55, speed=6)
    small = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS) if im.width > 640 else im
    if stale(mav, src):
        small.save(mav, "AVIF", quality=55, speed=6)
    if stale(mwe, src):
        small.save(mwe, "WEBP", quality=72, method=6)
    zrobione += 1
    print("AVIF:", base)
print(f"Gotowe – przerobiono {zrobione} zdjęć.")
