#!/usr/bin/env python3
"""Adaugă <script type="module" src="./firebase-auth.js"> în toate paginile HTML."""
import os
import re

SCRIPT_TAG = '<script type="module" src="./firebase-auth.js"></script>'
ROOT = os.path.dirname(os.path.abspath(__file__))

updated = []
skipped = []

for fname in os.listdir(ROOT):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(ROOT, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'firebase-auth.js' in content:
        skipped.append(fname)
        continue
    # Inserează înaintea </body>
    new_content = content.replace('</body>', f'    {SCRIPT_TAG}\n</body>', 1)
    if new_content == content:
        skipped.append(fname)
        continue
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    updated.append(fname)

print(f"Actualizate: {len(updated)} fișiere")
for f in sorted(updated):
    print(f"  ✓ {f}")
if skipped:
    print(f"\nSărite (deja au tag-ul sau nu au </body>): {len(skipped)}")
