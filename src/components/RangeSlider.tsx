interface RangeSliderProps {
  id: string;
  min: number;
  max: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RangeSlider = ({ id, min, max, value, onChange }: RangeSliderProps) => {
  const numValue = value === '' ? min : parseInt(value, 10);

  return (
    <div className="flex items-center gap-4">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={numValue}
        onChange={onChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer flex-grow"
      />
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 w-20 text-center"
      />
    </div>
  );
};

export default RangeSlider;