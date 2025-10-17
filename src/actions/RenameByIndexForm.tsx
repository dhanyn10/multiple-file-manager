import RangeSlider from '../components/RangeSlider';

interface RenameByIndexFormProps {
  startIndex: string;
  onStartIndexChange: (value: string) => void;
  endIndex: string;
  onEndIndexChange: (value: string) => void;
  actionTo: string;
  onActionToChange: (value: string) => void;
  maxFileNameLength: number;
  setIndexOffset: (offset: number) => void;
}

const RenameByIndexForm = ({
  startIndex, onStartIndexChange, endIndex, onEndIndexChange,
  actionTo, onActionToChange, maxFileNameLength, setIndexOffset
}: RenameByIndexFormProps) => (
  <>
    <div>
      <label htmlFor="start-index" className="block mb-1 text-sm font-medium text-slate-900">Start Index</label>
      <RangeSlider
        id="start-index"
        min={0}
        max={maxFileNameLength}
        value={startIndex}
        onChange={(e) => onStartIndexChange(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="end-index" className="block mb-1 text-sm font-medium text-slate-900">End Index (optional)</label>
      <RangeSlider
        id="end-index"
        min={parseInt(startIndex, 10) || 0}
        max={maxFileNameLength + 1}
        value={endIndex}
        onChange={(e) => {
          const newEndValue = parseInt(e.target.value, 10);
          const startValue = parseInt(startIndex, 10) || 0;
          const newEndIndex = isNaN(newEndValue) ? startValue : Math.max(startValue, newEndValue);
          onEndIndexChange(String(newEndIndex));
          setIndexOffset(newEndIndex - startValue);
        }}
      />
    </div>
    <div>
      <label htmlFor="action-to-index" className="block mb-1 text-sm font-medium text-slate-900">To</label>
      <input type="text" id="action-to-index" value={actionTo} onChange={(e) => onActionToChange(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2" placeholder="new text" />
    </div>
  </>
);

export default RenameByIndexForm;