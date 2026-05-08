#!/usr/bin/env python3
"""
Script pour télécharger et convertir les données historiques Euromillion en TypeScript.
Les données proviennent de la FDJ.
"""

import csv
import json
import re
from datetime import datetime
from pathlib import Path
import urllib.request
import zipfile
import io

# URLs des fichiers CSV historiques (extraits de la page FDJ)
CSV_URLS = [
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afa8",
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afa9",
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afb6",
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afc6",
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afd6",
    "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afe6",
]

def download_and_extract_csv(url):
    """Télécharge un fichier ZIP et extrait le CSV."""
    print(f"Téléchargement de {url}...")
    with urllib.request.urlopen(url) as response:
        zip_data = response.read()

    with zipfile.ZipFile(io.BytesIO(zip_data)) as zip_file:
        csv_filename = zip_file.namelist()[0]
        csv_bytes = zip_file.read(csv_filename)

        # Essayer différents encodages
        for encoding in ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']:
            try:
                csv_data = csv_bytes.decode(encoding)
                return csv_data
            except UnicodeDecodeError:
                continue

        raise Exception(f"Impossible de décoder le fichier {csv_filename}")

def parse_date(date_str):
    """Convertit une date en format ISO YYYY-MM-DD.
    Gère les formats:
    - DD/MM/YYYY ou DD/MM/YY (ex: 05/03/2004 ou 05/03/04)
    - YYYYMMDD (ex: 20040305)
    """
    if not date_str or date_str.strip() == '':
        return None

    date_str = date_str.strip()

    try:
        # Format YYYYMMDD (8 chiffres collés)
        if len(date_str) == 8 and date_str.isdigit():
            year = date_str[0:4]
            month = date_str[4:6]
            day = date_str[6:8]
            return f"{year}-{month}-{day}"

        # Format DD/MM/YYYY ou DD/MM/YY
        if '/' in date_str:
            day, month, year = date_str.split('/')
            # Gérer les années à 2 chiffres (00-99)
            if len(year) == 2:
                year_int = int(year)
                # Si l'année est entre 00 et 30, c'est 2000-2030, sinon 1900-1999
                if year_int <= 30:
                    year = f"20{year}"
                else:
                    year = f"19{year}"
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}"

        return None
    except:
        return None

def parse_number(num_str):
    """Convertit une chaîne en nombre, retourne 0 si impossible."""
    try:
        return float(num_str.replace(',', '.'))
    except:
        return 0

def process_csv_data(csv_data):
    """Parse les données CSV et retourne une liste de tirages."""
    draws = []
    reader = csv.DictReader(io.StringIO(csv_data), delimiter=';')

    for row in reader:
        date = parse_date(row.get('date_de_tirage', ''))
        if not date:
            continue

        draw = {
            'date': date,
            'numbers': sorted([
                int(row['boule_1']),
                int(row['boule_2']),
                int(row['boule_3']),
                int(row['boule_4']),
                int(row['boule_5'])
            ]),
            'stars': sorted([
                int(row['etoile_1']),
                int(row['etoile_2'])
            ]),
            'prizes': {
                'rank1': parse_number(row.get('rapport_du_rang1_Euro_Millions', '0')),
                'rank2': parse_number(row.get('rapport_du_rang2_Euro_Millions', '0')),
                'rank3': parse_number(row.get('rapport_du_rang3_Euro_Millions', '0')),
                'rank4': parse_number(row.get('rapport_du_rang4_Euro_Millions', '0')),
                'rank5': parse_number(row.get('rapport_du_rang5_Euro_Millions', '0')),
                'rank6': parse_number(row.get('rapport_du_rang6_Euro_Millions', '0')),
                'rank7': parse_number(row.get('rapport_du_rang7_Euro_Millions', '0')),
                'rank8': parse_number(row.get('rapport_du_rang8_Euro_Millions', '0')),
                'rank9': parse_number(row.get('rapport_du_rang9_Euro_Millions', '0')),
                'rank10': parse_number(row.get('rapport_du_rang10_Euro_Millions', '0')),
                'rank11': parse_number(row.get('rapport_du_rang11_Euro_Millions', '0')),
                'rank12': parse_number(row.get('rapport_du_rang12_Euro_Millions', '0')),
                'rank13': parse_number(row.get('rapport_du_rang13_Euro_Millions', '0')),
            }
        }
        draws.append(draw)

    return draws

def generate_typescript_file(draws, output_path):
    """Génère le fichier TypeScript avec les données."""
    # Trier par date décroissante (plus récent en premier)
    draws_sorted = sorted(draws, key=lambda x: x['date'], reverse=True)

    # Créer le contenu TypeScript
    ts_content = """// Données historiques Euromillion depuis 2004
// Source: FDJ (https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/historique)
// Généré automatiquement - Ne pas modifier manuellement

export interface Draw {
  date: string;
  numbers: number[];
  stars: number[];
  prizes?: {
    rank1?: number;
    rank2?: number;
    rank3?: number;
    rank4?: number;
    rank5?: number;
    rank6?: number;
    rank7?: number;
    rank8?: number;
    rank9?: number;
    rank10?: number;
    rank11?: number;
    rank12?: number;
    rank13?: number;
  };
}

export const historicalDraws: Draw[] = """

    ts_content += json.dumps(draws_sorted, indent=2, ensure_ascii=False)
    ts_content += ";\n"

    # Écrire le fichier
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(ts_content, encoding='utf-8')

    print(f"✓ Fichier généré: {output_path}")
    print(f"✓ Nombre de tirages: {len(draws_sorted)}")
    if draws_sorted:
        print(f"✓ Période: {draws_sorted[-1]['date']} à {draws_sorted[0]['date']}")

def main():
    """Fonction principale."""
    all_draws = []

    # Télécharger et traiter chaque fichier CSV
    for url in CSV_URLS:
        try:
            csv_data = download_and_extract_csv(url)
            draws = process_csv_data(csv_data)
            all_draws.extend(draws)
            print(f"✓ {len(draws)} tirages importés")
        except Exception as e:
            print(f"✗ Erreur lors du traitement de {url}: {e}")

    # Générer le fichier TypeScript
    output_path = Path(__file__).parent.parent / 'src' / 'app' / 'utils' / 'euromillionData.ts'
    generate_typescript_file(all_draws, output_path)

if __name__ == '__main__':
    main()
