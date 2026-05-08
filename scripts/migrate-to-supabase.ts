/**
 * Script pour migrer les données existantes vers Supabase
 */
import { historicalDraws } from '../src/app/utils/euromillionData';
import jackpots from '../src/app/utils/jackpots.json';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c84ef972`;

async function migrateData() {
  console.log('🚀 Migrating data to Supabase...');
  console.log(`📊 Draws to migrate: ${historicalDraws.length}`);
  console.log(`💰 Jackpots to migrate: ${Object.keys(jackpots).length}`);

  try {
    const response = await fetch(`${SERVER_URL}/initialize-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        draws: historicalDraws,
        jackpots: jackpots
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Migration successful!');
    console.log(`   - Draws migrated: ${result.drawsCount}`);
    console.log(`   - Jackpots migrated: ${result.jackpotsCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateData();
