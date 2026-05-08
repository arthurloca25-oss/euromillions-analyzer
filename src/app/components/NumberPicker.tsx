interface NumberPickerProps {
  selectedNumbers: number[];
  onSelectNumber: (num: number) => void;
  maxNumbers: number;
  range: number;
  label: string;
}

export function NumberPicker({ selectedNumbers, onSelectNumber, maxNumbers, range, label }: NumberPickerProps) {
  const isStars = range <= 12;

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className={`h-1 flex-1 rounded-full ${
          isStars ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
        }`}></div>
        <h3 className="text-sm md:text-lg font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {label}
        </h3>
        <div className={`h-1 flex-1 rounded-full ${
          isStars ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500'
        }`}></div>
      </div>
      <div className={`grid gap-2 md:gap-3 max-w-3xl mx-auto ${
        isStars ? 'grid-cols-6' : 'grid-cols-5 sm:grid-cols-7 md:grid-cols-10'
      }`}>
        {Array.from({ length: range }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedNumbers.includes(num);
          const isDisabled = !isSelected && selectedNumbers.length >= maxNumbers;

          return (
            <button
              key={num}
              onClick={() => onSelectNumber(num)}
              disabled={isDisabled}
              className={`
                aspect-square rounded-xl transition-all duration-300 text-sm md:text-lg font-bold
                min-h-[44px] relative overflow-hidden group
                ${isSelected
                  ? isStars
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-2xl shadow-orange-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-2xl shadow-blue-500/50'
                  : isDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-br from-white to-gray-50 text-gray-800 hover:from-blue-50 hover:to-indigo-50 border-2 border-gray-200 hover:border-blue-400 hover:scale-105 active:scale-95 shadow-md'
                }
              `}
            >
              {!isDisabled && !isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
              )}
              <span className="relative z-10">{num}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-center">
        <span className="text-xs md:text-sm text-gray-600">
          {selectedNumbers.length} / {maxNumbers} sélectionné{selectedNumbers.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
