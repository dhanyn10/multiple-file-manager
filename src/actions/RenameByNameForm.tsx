interface RenameByNameFormProps {
  actionFrom: string;
  onActionFromChange: (value: string) => void;
  actionTo: string;
  onActionToChange: (value: string) => void;
}

const RenameByNameForm = ({ actionFrom, onActionFromChange, actionTo, onActionToChange }: RenameByNameFormProps) => (
  <>
    <div>
      <label htmlFor="action-from" className="block mb-1 text-sm font-medium text-slate-900">From</label>
      <input
        type="text"
        id="action-from"
        value={actionFrom}
        onChange={(e) => onActionFromChange(e.target.value)}
        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        placeholder="text to replace"
      />
    </div>
    <div>
      <label htmlFor="action-to" className="block mb-1 text-sm font-medium text-slate-900">To</label>
      <input
        type="text"
        id="action-to"
        value={actionTo}
        onChange={(e) => onActionToChange(e.target.value)}
        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        placeholder="new text"
      />
    </div>
  </>
);

export default RenameByNameForm;