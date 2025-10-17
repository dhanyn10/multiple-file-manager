import RangeSlider from '../components/RangeSlider';

interface InsertAtIndexFormProps {
  startIndex: string;
  onStartIndexChange: (value: string) => void;
  actionTo: string;
  onActionToChange: (value: string) => void;
  maxFileNameLength: number;
}

const InsertAtIndexForm = ({ startIndex, onStartIndexChange, actionTo, onActionToChange, maxFileNameLength }: InsertAtIndexFormProps) => (
  <>
    <div>
      <label htmlFor="insert-index" className="block mb-1 text-sm font-medium text-slate-900">Insertion Index</label>
      <RangeSlider
        id="insert-index"
        min={0}
        max={maxFileNameLength}
        value={startIndex}
        onChange={(e) => onStartIndexChange(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="action-to-insert" className="block mb-1 text-sm font-medium text-slate-900">Text to Insert</label>
      <input type="text" id="action-to-insert" value={actionTo} onChange={(e) => onActionToChange(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2" placeholder="e.g., _copy" />
    </div>
  </>
);

export default InsertAtIndexForm;