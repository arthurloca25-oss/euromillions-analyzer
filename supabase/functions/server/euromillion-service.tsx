/**
 * Service pour gérer les données EuroMillions
 */
import * as kv from "./kv_store.tsx";

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

export interface Jackpots {
  [date: string]: number;
}

const DRAWS_KEY = "euromillion:draws";
const JACKPOTS_KEY = "euromillion:jackpots";
const LAST_UPDATE_KEY = "euromillion:last_update";

/**
 * Récupère tous les tirages
 */
export async function getDraws(): Promise<Draw[]> {
  const data = await kv.get(DRAWS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

/**
 * Récupère tous les jackpots
 */
export async function getJackpots(): Promise<Jackpots> {
  const data = await kv.get(JACKPOTS_KEY);
  if (!data) return {};
  return JSON.parse(data);
}

/**
 * Sauvegarde les tirages
 */
export async function saveDraws(draws: Draw[]): Promise<void> {
  await kv.set(DRAWS_KEY, JSON.stringify(draws));
  await kv.set(LAST_UPDATE_KEY, new Date().toISOString());
}

/**
 * Sauvegarde les jackpots
 */
export async function saveJackpots(jackpots: Jackpots): Promise<void> {
  await kv.set(JACKPOTS_KEY, JSON.stringify(jackpots));
  await kv.set(LAST_UPDATE_KEY, new Date().toISOString());
}

/**
 * Récupère la date de dernière mise à jour
 */
export async function getLastUpdate(): Promise<string | null> {
  return await kv.get(LAST_UPDATE_KEY);
}
