import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface GainsChartProps {
  data: Array<{
    date: string;
    cumulative: number;
  }>;
}

export function GainsChart({ data }: GainsChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
        Sélectionnez vos numéros pour voir le graphique
      </div>
    );
  }

  // Fonction pour formater les ticks de l'axe X
  // On veut afficher seulement quelques années espacées
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return date.getFullYear().toString();
  };

  // Filtrer les ticks pour n'afficher que certaines années
  const getYearTicks = () => {
    if (data.length === 0) return [];

    const yearToDate = new Map<number, string>();
    data.forEach(d => {
      const year = new Date(d.date).getFullYear();
      if (!yearToDate.has(year)) {
        yearToDate.set(year, d.date);
      }
    });

    const sortedYears = Array.from(yearToDate.keys()).sort((a, b) => a - b);

    // Afficher un tick tous les 2-3 ans selon le nombre d'années
    const yearCount = sortedYears.length;
    const interval = yearCount > 10 ? 3 : yearCount > 5 ? 2 : 1;

    return sortedYears
      .filter((_, index) => index % interval === 0)
      .map(year => yearToDate.get(year))
      .filter((d): d is string => d !== undefined);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 rounded-xl shadow-lg border-2 border-blue-200">
      <h3 className="mb-4 md:mb-5 text-center text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        📈 Évolution des gains/pertes cumulés
      </h3>
      <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            ticks={getYearTicks()}
            tickFormatter={formatXAxis}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickFormatter={(value) => `${value.toLocaleString('fr-FR')}€`}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Cumul']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
          />
          <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            fill="url(#colorCumulative)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
