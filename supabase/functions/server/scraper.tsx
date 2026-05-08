/**
 * Scraper pour récupérer les données depuis les sources externes
 */
import { Draw, Jackpots } from "./euromillion-service.tsx";

const FDJ_CSV_URLS = [
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afa8",
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afa9",
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afb6",
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afc6",
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afd6",
  "https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/documentations/1a2b3c4d-9876-4562-b3fc-2c963f66afe6",
];

function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null;

  const cleaned = dateStr.trim();

  // Format YYYYMMDD
  if (cleaned.length === 8 && /^\d{8}$/.test(cleaned)) {
    const year = cleaned.substring(0, 4);
    const month = cleaned.substring(4, 6);
    const day = cleaned.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // Format DD/MM/YYYY ou DD/MM/YY
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];

      if (year.length === 2) {
        const yearInt = parseInt(year);
        year = yearInt <= 30 ? `20${year}` : `19${year}`;
      }

      return `${year}-${month}-${day}`;
    }
  }

  return null;
}

function parseNumber(numStr: string): number {
  try {
    return parseFloat(numStr.replace(',', '.'));
  } catch {
    return 0;
  }
}

async function downloadAndExtractCSV(url: string): Promise<string> {
  const response = await fetch(url);
  const zipData = await response.arrayBuffer();

  // Utiliser DecompressionStream pour extraire le ZIP
  const zipBlob = new Blob([zipData]);
  // Note: Deno supporte la décompression ZIP nativement
  return ""; // À implémenter avec une bibliothèque ZIP pour Deno
}

/**
 * Scrape les données depuis la FDJ
 */
export async function scrapeDrawsFromFDJ(): Promise<Draw[]> {
  console.log("Scraping draws from FDJ...");
  const allDraws: Draw[] = [];

  // Pour l'instant, on retourne un tableau vide
  // L'implémentation complète nécessite une bibliothèque ZIP pour Deno
  console.log("FDJ scraping not fully implemented yet - using existing data");

  return allDraws;
}

/**
 * Scrape les jackpots depuis tirage-euromillions.net
 */
export async function scrapeJackpots(): Promise<Jackpots> {
  console.log("Scraping jackpots...");
  const jackpots: Jackpots = {};

  for (let year = 2004; year <= new Date().getFullYear(); year++) {
    try {
      const url = `https://www.tirage-euromillions.net/euromillions/annees/annee-${year}/`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const html = await response.text();

      // Pattern pour les dates (nouveau format avec <a>)
      const datePatternNew = /<td data-order="(\d{8})">.*?<a[^>]*>.*?(\d{2}\/\d{2}\/\d{4})<\/a>/g;
      const dates = [...html.matchAll(datePatternNew)];

      // Si pas de résultats, essayer l'ancien format
      if (dates.length === 0) {
        const datePatternOld = /<td data-order="(\d{8})">[^<]*?(\d{2}\/\d{2}\/\d{4})/g;
        dates.push(...[...html.matchAll(datePatternOld)]);
      }

      // Pattern pour les jackpots
      const jackpotPattern = /<td class="jackpot">(.*?)<\/td>/g;
      const jackpotMatches = [...html.matchAll(jackpotPattern)];

      // Associer dates et jackpots
      dates.forEach((dateMatch, index) => {
        if (index >= jackpotMatches.length) return;

        const date = parseDate(dateMatch[2]);
        if (!date) return;

        const jackpotText = jackpotMatches[index][1];
        const amount = jackpotText.replace(/[^\d]/g, '');

        if (amount) {
          jackpots[date] = parseFloat(amount);
        }
      });

      console.log(`Scraped ${year}: ${dates.length} jackpots`);
    } catch (error) {
      console.error(`Error scraping year ${year}:`, error);
    }
  }

  return jackpots;
}
