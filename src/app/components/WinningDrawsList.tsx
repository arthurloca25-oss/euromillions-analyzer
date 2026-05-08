import { Trophy, Sparkles, TrendingDown, Calendar } from 'lucide-react';
import { DrawResult } from '../types';
import { useState } from 'react';

interface WinningDrawsListProps {
  draws: DrawResult[];
  userNumbers: number[];
  userStars: number[];
}

type SortMode = 'gains' | 'date';

export function WinningDrawsList({ draws, userNumbers, userStars }: WinningDrawsListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('gains');

  if (draws.length === 0) {
    return null;
  }

  // Trier selon le mode sélectionné
  const sortedDraws = [...draws].sort((a, b) => {
    if (sortMode === 'gains') {
      return b.prize - a.prize; // Du plus gros au plus petit
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Du plus récent au plus ancien
    }
  });

  const getDrawStyle = (draw: DrawResult) => {
    const isJackpot = draw.rank === 1;
    const prize = draw.prize;

    if (isJackpot) {
      return {
        container: 'relative bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-4 border-yellow-500 shadow-2xl',
        showJackpot: true,
        prizeClass: 'text-yellow-700 text-xl font-bold'
      };
    } else if (prize > 10000) {
      return {
        container: 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 shadow-lg',
        showJackpot: false,
        prizeClass: 'text-orange-700 text-lg font-bold'
      };
    } else if (prize > 1000) {
      return {
        container: 'bg-blue-50 border-2 border-blue-300 shadow-md',
        showJackpot: false,
        prizeClass: 'text-blue-700 font-semibold'
      };
    } else {
      return {
        container: 'bg-gray-50 border border-gray-200',
        showJackpot: false,
        prizeClass: 'text-green-600 font-semibold'
      };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg border-2 border-yellow-300 p-4 md:p-6">
      <div className="text-center mb-4 md:mb-5">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
            <Trophy size={24} className="text-white" />
          </div>
          <h3 className="text-base md:text-xl font-bold bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
            🎯 Tirages gagnants ({draws.length})
          </h3>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSortMode('gains')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs md:text-sm font-semibold ${
              sortMode === 'gains'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-300'
            }`}
          >
            <TrendingDown size={16} />
            Par gains
          </button>
          <button
            onClick={() => setSortMode('date')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs md:text-sm font-semibold ${
              sortMode === 'date'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-300'
            }`}
          >
            <Calendar size={16} />
            Par date
          </button>
        </div>
      </div>
      <div className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-yellow-100">
        {sortedDraws.map((draw, index) => {
          const style = getDrawStyle(draw);

          return (
            <div
              key={`${draw.date}-${index}`}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 md:p-3 rounded-lg gap-2 ${style.container}`}
            >
              {style.showJackpot && (
                <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-white px-3 md:px-4 py-0.5 md:py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles size={14} className="animate-pulse md:w-4 md:h-4" />
                  <span className="font-bold text-xs md:text-sm">JACKPOT</span>
                  <Sparkles size={14} className="animate-pulse md:w-4 md:h-4" />
                </div>
              )}
              <div className="flex-shrink-0">
                <p className="text-xs md:text-sm font-medium">
                  {new Date(draw.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-xs text-gray-600">Rang {draw.rank}</p>
              </div>
              <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex gap-0.5 md:gap-1 flex-wrap">
                  {draw.numbers.map((num, i) => {
                    const isMatch = userNumbers.includes(num);
                    return (
                      <span
                        key={i}
                        className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[10px] md:text-xs transition-all ${
                          isMatch
                            ? 'bg-blue-600 text-white font-bold shadow-lg scale-110'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {num}
                      </span>
                    );
                  })}
                  {draw.stars.map((star, i) => {
                    const isMatch = userStars.includes(star);
                    return (
                      <span
                        key={i}
                        className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[10px] md:text-xs transition-all ${
                          isMatch
                            ? 'bg-yellow-600 text-white font-bold shadow-lg scale-110'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {star}
                      </span>
                    );
                  })}
                </div>
                <p className={`ml-0 sm:ml-2 text-sm md:text-base whitespace-nowrap ${style.prizeClass}`}>
                  +{draw.prize.toLocaleString('fr-FR')}€
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
