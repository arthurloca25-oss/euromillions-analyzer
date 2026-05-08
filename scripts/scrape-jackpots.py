#!/usr/bin/env python3
"""
Script pour scraper les jackpots depuis tirage-euromillions.net
"""

import re
import json
import urllib.request
from datetime import datetime
from pathlib import Path

BASE_URL = "https://www.tirage-euromillions.net/euromillions/annees/annee-{year}/"

def parse_jackpot_amount(jackpot_str):
    """Extrait le montant du jackpot depuis une chaîne comme '30 547 317 €'"""
    # Nettoyer en gardant seulement les chiffres
    amount_str = re.sub(r'[^\d]', '', jackpot_str)
    try:
        return float(amount_str) if amount_str else None
    except:
        return None

def parse_date_french(date_str):
    """Convertit 'Vendredi 29/12/2023' en '2023-12-29'"""
    # Extraire la partie date DD/MM/YYYY
    match = re.search(r'(\d{2})/(\d{2})/(\d{4})', date_str)
    if match:
        day, month, year = match.groups()
        return f"{year}-{month}-{day}"
    return None

def scrape_year(year):
    """Scrape les jackpots pour une année donnée"""
    url = BASE_URL.format(year=year)
    print(f"Scraping {year}...", end=" ")

    try:
        # Ajouter un User-Agent pour éviter le blocage
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')

        # Extraire les dates et jackpots séparément
        # Pattern pour les dates avec leur data-order
        # Deux formats possibles:
        # 1. Ancien format (2004-2006): <td data-order="20041231">Vendredi 31/12/2004</td>
        # 2. Nouveau format (2007+): <td data-order="20231229"><a ...>Vendredi 29/12/2023</a></td>

        # Essayer le nouveau format d'abord
        date_pattern_new = r'<td data-order="(\d{8})">.*?<a[^>]*>.*?(\d{2}/\d{2}/\d{4})</a>'
        dates = re.findall(date_pattern_new, html, re.DOTALL)

        # Si pas de résultats, essayer l'ancien format
        if not dates:
            date_pattern_old = r'<td data-order="(\d{8})">[^<]*?(\d{2}/\d{2}/\d{4})'
            dates = re.findall(date_pattern_old, html, re.DOTALL)

        # Pattern pour les jackpots
        jackpot_pattern = r'<td class="jackpot">(.*?)</td>'
        jackpot_texts = re.findall(jackpot_pattern, html)

        jackpots = {}
        # Associer dates et jackpots (ils doivent être dans le même ordre)
        for i, (data_order, date_text) in enumerate(dates):
            if i >= len(jackpot_texts):
                break

            # Convertir la date
            date = parse_date_french(date_text)
            if not date:
                continue

            # Parser le jackpot
            amount = parse_jackpot_amount(jackpot_texts[i])
            if amount:
                jackpots[date] = amount

        print(f"✓ {len(jackpots)} tirages")
        return jackpots

    except Exception as e:
        print(f"✗ Erreur: {e}")
        return {}

def main():
    """Fonction principale"""
    all_jackpots = {}

    # Scraper toutes les années de 2004 à 2026
    for year in range(2004, 2027):
        year_data = scrape_year(year)
        all_jackpots.update(year_data)

    # Sauvegarder en JSON
    output_path = Path(__file__).parent.parent / 'src' / 'app' / 'utils' / 'jackpots.json'
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open('w', encoding='utf-8') as f:
        json.dump(all_jackpots, f, indent=2, ensure_ascii=False, sort_keys=True)

    print(f"\n✓ Fichier généré: {output_path}")
    print(f"✓ Total: {len(all_jackpots)} jackpots")

    if all_jackpots:
        dates = sorted(all_jackpots.keys())
        print(f"✓ Période: {dates[0]} à {dates[-1]}")

        # Statistiques
        amounts = list(all_jackpots.values())
        print(f"\nStatistiques:")
        print(f"  - Jackpot min: {min(amounts):,.0f} €")
        print(f"  - Jackpot max: {max(amounts):,.0f} €")
        print(f"  - Jackpot moyen: {sum(amounts)/len(amounts):,.0f} €")

if __name__ == '__main__':
    main()
