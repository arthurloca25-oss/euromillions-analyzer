import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Import des données statiques comme fallback
import { historicalDraws as staticDraws } from '../utils/euromillionData';
import staticJackpots from '../utils/jackpots.json';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c84ef972`;

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

export function useEuromillionData() {
  const [draws, setDraws] = useState<Draw[]>(staticDraws);
  const [jackpots, setJackpots] = useState<Jackpots>(staticJackpots as Jackpots);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Charger les tirages
      const drawsResponse = await fetch(`${SERVER_URL}/draws`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      // Charger les jackpots
      const jackpotsResponse = await fetch(`${SERVER_URL}/jackpots`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      // Charger la date de dernière mise à jour
      const updateResponse = await fetch(`${SERVER_URL}/last-update`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (drawsResponse.ok) {
        const drawsData = await drawsResponse.json();
        if (drawsData.draws && drawsData.draws.length > 0) {
          setDraws(drawsData.draws);
          console.log(`✅ Loaded ${drawsData.draws.length} draws from Supabase`);
        }
      }

      if (jackpotsResponse.ok) {
        const jackpotsData = await jackpotsResponse.json();
        if (jackpotsData.jackpots && Object.keys(jackpotsData.jackpots).length > 0) {
          setJackpots(jackpotsData.jackpots);
          console.log(`✅ Loaded ${Object.keys(jackpotsData.jackpots).length} jackpots from Supabase`);
        }
      }

      if (updateResponse.ok) {
        const updateData = await updateResponse.json();
        setLastUpdate(updateData.lastUpdate);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading data from Supabase:', err);
      setError('Utilisation des données locales');
      // Continuer avec les données statiques en fallback
    } finally {
      setLoading(false);
    }
  }

  return {
    draws,
    jackpots,
    loading,
    error,
    lastUpdate,
    reload: loadData
  };
}
