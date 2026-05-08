import { DrawResult, CumulativeData } from '../types';
import { Draw, Jackpots } from '../hooks/useEuromillionData';

const COST_PER_DRAW = 2.5;

// Grille de coûts selon le nombre de numéros sélectionnés
const COST_TABLE: Record<number, number> = {
  5: 2.5,
  6: 15,
  7: 52.5,
  8: 140,
  9: 315,
  10: 630,
};

// Fonction pour générer toutes les combinaisons de k éléments parmi un tableau
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > arr.length) return [];

  const [first, ...rest] = arr;
  const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = getCombinations(rest, k);

  return [...withFirst, ...withoutFirst];
}

export function getGridCost(numberOfNumbers: number): number {
  return COST_TABLE[numberOfNumbers] || COST_PER_DRAW;
}

// Grille de gains moyenne Euromillion (utilisée comme fallback si pas de données réelles)
const FALLBACK_PRIZE_TABLE: Record<number, number> = {
  1: 17000000, // 5 numéros + 2 étoiles (jackpot moyen - fallback uniquement)
  2: 250000,   // 5 numéros + 1 étoile
  3: 25000,    // 5 numéros
  4: 2500,     // 4 numéros + 2 étoiles
  5: 150,      // 4 numéros + 1 étoile
  6: 50,       // 4 numéros
  7: 25,       // 3 numéros + 2 étoiles
  8: 12,       // 3 numéros + 1 étoile
  9: 10,       // 3 numéros
  10: 8,       // 2 numéros + 2 étoiles
  11: 4,       // 2 numéros + 1 étoile
  12: 3,       // 2 numéros
  13: 2.5,     // 1 numéro + 2 étoiles
};

function getPrizeForRank(draw: Draw, rank: number, jackpots?: Jackpots): number {
  // Pour le rang 1 (jackpot), utiliser les vrais jackpots
  if (rank === 1 && jackpots) {
    const jackpot = jackpots[draw.date];
    if (jackpot) {
      return jackpot;
    }
  }

  // Utiliser les vrais gains si disponibles dans les données CSV
  if (draw.prizes) {
    const prizeKey = `rank${rank}` as keyof typeof draw.prizes;
    const prize = draw.prizes[prizeKey];
    if (prize && prize > 0) {
      return prize;
    }
  }

  // Fallback vers la grille de gains moyenne
  return FALLBACK_PRIZE_TABLE[rank] || 0;
}

export function calculateRank(
  userNumbers: number[],
  userStars: number[],
  drawNumbers: number[],
  drawStars: number[]
): number | null {
  const matchedNumbers = userNumbers.filter(n => drawNumbers.includes(n)).length;
  const matchedStars = userStars.filter(s => drawStars.includes(s)).length;

  // Rang 1: 5 numéros + 2 étoiles
  if (matchedNumbers === 5 && matchedStars === 2) return 1;
  // Rang 2: 5 numéros + 1 étoile
  if (matchedNumbers === 5 && matchedStars === 1) return 2;
  // Rang 3: 5 numéros
  if (matchedNumbers === 5 && matchedStars === 0) return 3;
  // Rang 4: 4 numéros + 2 étoiles
  if (matchedNumbers === 4 && matchedStars === 2) return 4;
  // Rang 5: 4 numéros + 1 étoile
  if (matchedNumbers === 4 && matchedStars === 1) return 5;
  // Rang 6: 4 numéros
  if (matchedNumbers === 4 && matchedStars === 0) return 6;
  // Rang 7: 3 numéros + 2 étoiles
  if (matchedNumbers === 3 && matchedStars === 2) return 7;
  // Rang 8: 3 numéros + 1 étoile
  if (matchedNumbers === 3 && matchedStars === 1) return 8;
  // Rang 9: 3 numéros
  if (matchedNumbers === 3 && matchedStars === 0) return 9;
  // Rang 10: 2 numéros + 2 étoiles
  if (matchedNumbers === 2 && matchedStars === 2) return 10;
  // Rang 11: 2 numéros + 1 étoile
  if (matchedNumbers === 2 && matchedStars === 1) return 11;
  // Rang 12: 2 numéros
  if (matchedNumbers === 2 && matchedStars === 0) return 12;
  // Rang 13: 1 numéro + 2 étoiles
  if (matchedNumbers === 1 && matchedStars === 2) return 13;

  return null;
}

export function analyzeDraws(
  userNumbers: number[],
  userStars: number[],
  draws: Draw[],
  jackpots?: Jackpots
) {
  let exactMatch: DrawResult | null = null;
  let bestRank: number | null = null;
  const winningDrawsMap = new Map<string, DrawResult>(); // Utiliser une Map pour éviter les doublons
  const cumulativeData: CumulativeData[] = [];

  let totalGains = 0;
  let totalLosses = 0;
  let cumulative = 0;

  // Traiter les tirages du plus ancien au plus récent pour le calcul cumulatif
  const drawsChronological = [...draws].reverse();

  // Générer toutes les combinaisons de 5 numéros si plus de 5 numéros sélectionnés
  const numberCombinations = userNumbers.length === 5
    ? [userNumbers]
    : getCombinations(userNumbers, 5);

  // Coût de la grille selon le nombre de numéros
  const gridCost = getGridCost(userNumbers.length);

  drawsChronological.forEach((draw) => {
    // Coût du tirage
    totalLosses += gridCost;
    cumulative -= gridCost;

    let bestRankForThisDraw: number | null = null;
    let bestPrizeForThisDraw = 0;

    // Tester chaque combinaison de 5 numéros
    numberCombinations.forEach((combination) => {
      const rank = calculateRank(combination, userStars, draw.numbers, draw.stars);

      if (rank !== null) {
        const prize = getPrizeForRank(draw, rank, jackpots);

        if (rank === 1) {
          exactMatch = {
            date: draw.date,
            numbers: draw.numbers,
            stars: draw.stars,
            rank,
            prize,
          };
        }

        if (bestRank === null || rank < bestRank) {
          bestRank = rank;
        }

        // Pour ce tirage, garder le meilleur rang trouvé
        if (bestRankForThisDraw === null || rank < bestRankForThisDraw) {
          bestRankForThisDraw = rank;
          bestPrizeForThisDraw = prize;
        }
      }
    });

    // Si on a gagné quelque chose sur ce tirage
    if (bestRankForThisDraw !== null && bestPrizeForThisDraw > 0) {
      totalGains += bestPrizeForThisDraw;
      cumulative += bestPrizeForThisDraw;

      // Ajouter à la liste des tirages gagnants (un seul par date)
      winningDrawsMap.set(draw.date, {
        date: draw.date,
        numbers: draw.numbers,
        stars: draw.stars,
        rank: bestRankForThisDraw,
        prize: bestPrizeForThisDraw,
      });
    }

    // Ajouter le point cumulatif APRÈS avoir ajouté le gain
    cumulativeData.push({
      date: draw.date,
      cumulative: Math.round(cumulative * 100) / 100,
    });
  });

  // Convertir la Map en tableau et trier par gain décroissant
  const winningDraws = Array.from(winningDrawsMap.values())
    .sort((a, b) => b.prize - a.prize);

  return {
    exactMatch,
    bestRank,
    totalGains: Math.round(totalGains * 100) / 100,
    totalLosses: Math.round(totalLosses * 100) / 100,
    winningDraws,
    cumulativeData,
    totalDraws: drawsChronological.length,
  };
}
