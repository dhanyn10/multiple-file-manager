import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import { RenameOperation } from './ActionSidebar';

interface HistorySidebarProps {
  history: RenameOperation[];
  onClose: () => void;
  onUndo: (operation: RenameOperation) => void;
  onRedo: (operation: RenameOperation) => void;
}

const HistorySidebar = ({ history, onClose, onUndo, onRedo }: HistorySidebarProps) => {
  return (
    <aside
      className="bg-slate-100 border-l border-slate-200 flex flex-col h-full"
      style={{ width: '384px' }}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-900">Activity History</h3>
        <button
          onClick={onClose}
          className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          aria-label="Close history sidebar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {history.length === 0 ? (
          <p className="text-slate-500">No activities yet.</p>
        ) : (
          <div className="overflow-y-auto border-t border-slate-200">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2">Old Name</th>
                  <th scope="col" className="px-4 py-2">New Name</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((op, index) => (
                  <tr key={`${op.originalName}-${index}`} className="bg-white border-b border-slate-200/60 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900 break-all group/item relative">
                      <div className="flex items-center">
                        <span className="line-through">{op.originalName}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => onRedo(op)} className="text-slate-500 hover:text-red-600" title="Redo rename">
                          <FontAwesomeIcon icon={faRedo} size="lg" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 break-all text-green-600 font-semibold group/item relative">
                      <div className="flex items-center justify-between">
                        <span>{op.newName}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => onUndo(op)} className="text-slate-500 hover:text-blue-600" title="Undo rename">
                          <FontAwesomeIcon icon={faUndo} size="lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;