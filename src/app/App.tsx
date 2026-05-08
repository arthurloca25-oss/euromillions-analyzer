import { useState } from 'react';
import { NumberPicker } from './components/NumberPicker';
import { ResultsPanel } from './components/ResultsPanel';
import { GainsChart } from './components/GainsChart';
import { WinningDrawsList } from './components/WinningDrawsList';
import { analyzeDraws, getGridCost } from './utils/calculateResults';
import { useEuromillionData } from './hooks/useEuromillionData';
import { InstallButton } from '../pwa-install';
import { Sparkles, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export default function App() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [statsOpen, setStatsOpen] = useState(false);

  const { draws: historicalDraws, jackpots, loading, error, lastUpdate } = useEuromillionData();

  const handleSelectNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const handleSelectStar = (num: number) => {
    if (selectedStars.includes(num)) {
      setSelectedStars(selectedStars.filter(n => n !== num));
    } else if (selectedStars.length < 2) {
      setSelectedStars([...selectedStars, num].sort((a, b) => a - b));
    }
  };

  const handleReset = () => {
    setSelectedNumbers([]);
    setSelectedStars([]);
  };

  const handleFlash = () => {
    // Générer 5 numéros aléatoires entre 1 et 50
    const randomNumbers: number[] = [];
    while (randomNumbers.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }

    // Générer 2 étoiles aléatoires entre 1 et 12
    const randomStars: number[] = [];
    while (randomStars.length < 2) {
      const star = Math.floor(Math.random() * 12) + 1;
      if (!randomStars.includes(star)) {
        randomStars.push(star);
      }
    }

    setSelectedNumbers(randomNumbers.sort((a, b) => a - b));
    setSelectedStars(randomStars.sort((a, b) => a - b));
  };

  const isComplete = selectedNumbers.length >= 5 && selectedNumbers.length <= 10 && selectedStars.length === 2;
  const gridCost = isComplete ? getGridCost(selectedNumbers.length) : 0;

  // Analyser automatiquement dès que la grille est complète
  const results = isComplete
    ? analyzeDraws(selectedNumbers, selectedStars, historicalDraws, jackpots)
    : null;

  return (
    <>
      <InstallButton />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pb-4 md:pb-8">
        {/* Effet de grille en arrière-plan */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <header className="text-center mb-6 md:mb-10">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 mb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="text-yellow-300 animate-pulse" size={32} />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Et si j'avais joué...
                </h1>
                <Sparkles className="text-pink-300 animate-pulse" size={32} />
              </div>
              <p className="text-sm md:text-base text-white/80">
                EuroMillions • 22 ans d'historique • {historicalDraws.length.toLocaleString('fr-FR')} tirages
                {lastUpdate && (
                  <span className="block text-xs mt-1 text-white/60">
                    Dernière mise à jour: {new Date(lastUpdate).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 md:p-8 mb-4 md:mb-6 hover:shadow-purple-500/20 transition-all duration-300">
          <NumberPicker
            selectedNumbers={selectedNumbers}
            onSelectNumber={handleSelectNumber}
            maxNumbers={10}
            range={50}
            label="Sélectionnez 5 à 10 numéros (1-50)"
          />

          {selectedNumbers.length >= 5 && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Coût de la grille</p>
                <p className="text-lg md:text-xl font-black text-green-700">
                  {getGridCost(selectedNumbers.length).toLocaleString('fr-FR')} € / tirage
                </p>
                {selectedNumbers.length > 5 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedNumbers.length} numéros = {(() => {
                      const n = selectedNumbers.length;
                      const k = 5;
                      const combinations = Array.from({length: k}, (_, i) => n - i).reduce((a, b) => a * b, 1) /
                                          Array.from({length: k}, (_, i) => k - i).reduce((a, b) => a * b, 1);
                      return combinations;
                    })()} combinaisons
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="my-4 md:my-6 border-t border-gray-200" />

          <NumberPicker
            selectedNumbers={selectedStars}
            onSelectNumber={handleSelectStar}
            maxNumbers={2}
            range={12}
            label="Sélectionnez 2 étoiles (1-12)"
          />

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleFlash}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 border-2 border-yellow-300 transition-all active:scale-95 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Zap size={20} className="animate-pulse" />
              Flash (5 numéros)
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-gray-300 hover:border-gray-400 transition-all active:scale-95 font-semibold"
            >
              Réinitialiser
            </button>
          </div>

          {isComplete && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Votre grille</p>
                <p className="text-sm md:text-base font-bold text-gray-800">
                  {selectedNumbers.join(' • ')} <span className="text-yellow-600">★</span> {selectedStars.join(' • ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {results && (
          <>
            <ResultsPanel
              exactMatch={results.exactMatch}
              bestRank={results.bestRank}
              totalGains={results.totalGains}
              totalLosses={results.totalLosses}
              winningDraws={results.winningDraws}
              totalDraws={results.totalDraws}
            />

            <div className="mt-6">
              <GainsChart data={results.cumulativeData} />
            </div>

            <div className="mt-6">
              <WinningDrawsList
                draws={results.winningDraws}
                userNumbers={selectedNumbers}
                userStars={selectedStars}
              />
            </div>

            <div className="mt-4 md:mt-6">
              <button
                onClick={() => setStatsOpen(!statsOpen)}
                className="w-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-2 border-indigo-300 rounded-xl p-4 md:p-5 text-left shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-base md:text-lg font-bold text-indigo-900">Statistiques détaillées</h3>
                </div>
                {statsOpen ? (
                  <ChevronUp className="text-indigo-600 group-hover:text-indigo-800 transition-colors" size={24} />
                ) : (
                  <ChevronDown className="text-indigo-600 group-hover:text-indigo-800 transition-colors" size={24} />
                )}
              </button>

              {statsOpen && (
                <div className="mt-3 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border-2 border-indigo-200 p-4 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">💰 Finances</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total investi:</span>
                          <span className="font-bold text-red-600">{results.totalLosses.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total gagné:</span>
                          <span className="font-bold text-green-600">{results.totalGains.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bilan net:</span>
                          <span className={`font-bold ${results.totalGains - results.totalLosses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(results.totalGains - results.totalLosses >= 0 ? '+' : '')}{(results.totalGains - results.totalLosses).toLocaleString('fr-FR')} €
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-blue-200">
                          <span className="text-gray-600">Moyenne par tirage:</span>
                          <span className={`font-bold ${((results.totalGains - results.totalLosses) / results.totalDraws) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((results.totalGains - results.totalLosses) / results.totalDraws).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">🎯 Tirages</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tirages analysés:</span>
                          <span className="font-bold text-purple-600">{results.totalDraws.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tirages gagnants:</span>
                          <span className="font-bold text-green-600">{results.winningDraws.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tirages perdants:</span>
                          <span className="font-bold text-red-600">{results.totalDraws - results.winningDraws.length}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-purple-200">
                          <span className="text-gray-600">Taux de réussite:</span>
                          <span className="font-bold text-purple-600">
                            {((results.winningDraws.length / results.totalDraws) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-900 mb-2">⚠️ Probabilités</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jackpot (5+2):</span>
                          <span className="font-bold text-orange-600">1 / 139 838 160</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rang 2 (5+1):</span>
                          <span className="font-bold text-orange-600">1 / 6 991 908</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rang 3 (5+0):</span>
                          <span className="font-bold text-orange-600">1 / 3 107 515</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-orange-200">
                          <span className="text-gray-600">N'importe quel gain:</span>
                          <span className="font-bold text-orange-600">1 / 13</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                      <h4 className="text-sm font-semibold text-pink-900 mb-2">📈 Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plus gros gain:</span>
                          <span className="font-bold text-pink-600">
                            {results.winningDraws.length > 0
                              ? `${results.winningDraws.reduce((max, draw) => draw.prize > max.prize ? draw : max, results.winningDraws[0]).prize.toLocaleString('fr-FR')} €`
                              : '0 €'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meilleur rang atteint:</span>
                          <span className="font-bold text-pink-600">
                            {results.bestRank ? `Rang ${results.bestRank}` : 'Aucun'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI (Retour sur investissement):</span>
                          <span className={`font-bold ${((results.totalGains / results.totalLosses - 1) * 100) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((results.totalGains / results.totalLosses - 1) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-pink-200">
                          <span className="text-gray-600">Période analysée:</span>
                          <span className="font-bold text-pink-600">
                            {new Date(historicalDraws[historicalDraws.length - 1].date).getFullYear()} - {new Date(historicalDraws[0].date).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border-2 border-yellow-300 mt-4">
                    <p className="text-xs md:text-sm text-amber-800 text-center">
                      ℹ️ Ces statistiques sont basées sur {historicalDraws.length.toLocaleString('fr-FR')} tirages EuroMillions de {new Date(historicalDraws[historicalDraws.length - 1].date).getFullYear()} à {new Date(historicalDraws[0].date).getFullYear()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <footer className="mt-8 pb-4 text-center">
          <a
            href="/privacy"
            className="text-sm text-white/70 hover:text-white/90 underline transition-colors"
          >
            Politique de confidentialité
          </a>
        </footer>
      </div>
    </div>
    </>
  );
}