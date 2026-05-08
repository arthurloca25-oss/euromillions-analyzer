import { Trophy, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { DrawResult } from '../types';

interface ResultsPanelProps {
  exactMatch: DrawResult | null;
  bestRank: number | null;
  totalGains: number;
  totalLosses: number;
  winningDraws: DrawResult[];
  totalDraws: number;
}

const RANK_LABELS: Record<number, string> = {
  1: '5 numéros + 2 étoiles',
  2: '5 numéros + 1 étoile',
  3: '5 numéros',
  4: '4 numéros + 2 étoiles',
  5: '4 numéros + 1 étoile',
  6: '4 numéros',
  7: '3 numéros + 2 étoiles',
  8: '3 numéros + 1 étoile',
  9: '3 numéros',
  10: '2 numéros + 2 étoiles',
  11: '2 numéros + 1 étoile',
  12: '2 numéros',
  13: '1 numéro + 2 étoiles',
};

export function ResultsPanel({ exactMatch, bestRank, totalGains, totalLosses, winningDraws, totalDraws }: ResultsPanelProps) {
  const netResult = totalGains - totalLosses;
  const isProfit = netResult > 0;
  const averagePerDraw = totalDraws > 0 ? netResult / totalDraws : 0;

  // Trouver le meilleur gain
  const bestWin = winningDraws.length > 0
    ? winningDraws.reduce((max, draw) => draw.prize > max.prize ? draw : max, winningDraws[0])
    : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 md:space-y-4 p-3 md:p-4">
      {exactMatch && (
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-yellow-300 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSIyMCIgeT0iNDAiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSI+4py8PC90ZXh0Pjx0ZXh0IHg9IjEyMCIgeT0iMTIwIiBmb250LXNpemU9IjQwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiPuKcvDwvdGV4dD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-3 animate-bounce">
              <Trophy size={40} className="drop-shadow-lg" />
              <h2 className="text-2xl md:text-4xl font-black drop-shadow-lg">JACKPOT GAGNÉ !</h2>
              <Trophy size={40} className="drop-shadow-lg" />
            </div>
            <p className="text-center text-sm md:text-xl font-semibold drop-shadow-md">
              Le {new Date(exactMatch.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-center text-4xl md:text-6xl mt-4 font-black drop-shadow-2xl animate-pulse">
              {exactMatch.prize.toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-5 rounded-xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Zap size={20} className="text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-blue-900">Plus gros gain</h3>
          </div>
          <p className="text-2xl md:text-3xl font-black text-blue-600">
            {bestWin ? `${bestWin.prize.toLocaleString('fr-FR')} €` : 'Aucun'}
          </p>
          {bestWin && (
            <p className="text-xs md:text-sm text-blue-700 mt-2 font-medium">{RANK_LABELS[bestWin.rank]}</p>
          )}
        </div>

        <div className={`p-4 md:p-5 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all ${
          isProfit
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300'
            : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}>
              {isProfit ? <TrendingUp className="text-white" size={20} /> : <TrendingDown className="text-white" size={20} />}
            </div>
            <h3 className={`text-sm md:text-base font-bold ${isProfit ? 'text-green-900' : 'text-red-900'}`}>Bilan total</h3>
          </div>
          <p className={`text-2xl md:text-3xl font-black ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {netResult > 0 ? '+' : ''}{netResult.toLocaleString('fr-FR')} €
          </p>
          <p className={`text-xs md:text-sm mt-2 font-medium ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
            {averagePerDraw >= 0 ? '+' : ''}{averagePerDraw.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € / tirage
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-4 md:p-5 rounded-xl shadow-lg border-2 border-emerald-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Trophy size={20} className="text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-emerald-900">Tirages gagnants</h3>
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-600">
            {winningDraws.length}
          </p>
          <p className="text-xs md:text-sm text-emerald-700 mt-2 font-medium">
            {((winningDraws.length / totalDraws) * 100).toFixed(2)}% des tirages
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-5 rounded-xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-500 rounded-lg">
              <TrendingDown size={20} className="text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-900">Tirages perdants</h3>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-600">
            {totalDraws - winningDraws.length}
          </p>
          <p className="text-xs md:text-sm text-slate-700 mt-2 font-medium">
            {(((totalDraws - winningDraws.length) / totalDraws) * 100).toFixed(2)}% des tirages
          </p>
        </div>
      </div>
    </div>
  );
}
