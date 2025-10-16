import { useState, useRef, useCallback, useEffect } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

export interface RenameOperation {
  originalName: string;
  newName: string;
  timestamp?: string;
}

interface ActionSidebarProps {
  selectedFiles: Set<string>;
  onClose: () => void;
  onExecute: (operations: RenameOperation[]) => void;
}

const availableActions = [
  { value: 'rename', label: 'Rename by name' },
  { value: 'rename-by-index', label: 'Rename by index' },
  // You can add other actions here
];

const ActionSidebar = ({ selectedFiles, onClose, onExecute }: ActionSidebarProps) => {
  const [actionFrom, setActionFrom] = useState('');
  const [actionTo, setActionTo] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(384); // Corresponds to w-96

  useClickOutside(actionDropdownRef, () => setIsActionDropdownOpen(false));

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < window.innerWidth * 0.75) { // Min 320px, Max 75% of window
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleClose = () => {
    onClose();
    // Reset form on close
    setActionFrom('');
    setActionTo('');
    setStartIndex('');
    setEndIndex('');
    setIsActionDropdownOpen(false);
    setSelectedAction('');
  };

  const handleExecute = () => {
    if (!selectedAction) return;

    const operations: RenameOperation[] = [];
    if (selectedAction === 'rename' && actionFrom) {
      Array.from(selectedFiles).forEach(file => {
        // Replace only the first occurrence by not using a global regex
        const newName = file.replace(actionFrom, actionTo);
        if (newName !== file) {
          operations.push({ originalName: file, newName });
        }
      });
    } else if (selectedAction === 'rename-by-index' && startIndex !== '') {
      // Convert 1-based index from user to 0-based for JS
      const start = parseInt(startIndex, 10) - 1;
      // If endIndex is not provided, it means we replace only one character at startIndex.
      // So, the 0-based end index will be `start + 1`.
      const end = endIndex ? parseInt(endIndex, 10) : start + 2;

      if (!isNaN(start) && !isNaN(end) && start < end) {
        Array.from(selectedFiles).forEach(file => {
          const newName = file.slice(0, start) + actionTo + file.slice(end);
          if (newName !== file) {
            operations.push({ originalName: file, newName });
          }
        });
      }
    }
    onExecute(operations);
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-slate-50 border-l border-slate-200 flex flex-col h-full relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 -ml-1 w-2 h-full cursor-col-resize z-30"
        title="Resize sidebar"
      />

      <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-900">Actions</h3>
        <button
          onClick={handleClose}
          className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto">
        {/* Action Form */}
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-1 gap-4 items-end">
            <div>
              <div className="relative" ref={actionDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                  className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <span className="block truncate">
                    {selectedAction
                      ? availableActions.find(a => a.value === selectedAction)?.label
                      : '-- Select Action --'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.7 9.2a.75.75 0 011.06-.02L10 15.148l2.64-2.968a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
                {isActionDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm max-h-60">
                    <div
                      key="default-action"
                      onClick={() => { setSelectedAction(''); setIsActionDropdownOpen(false); }}
                      className="text-slate-500 relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                    >
                      <span className="font-normal block truncate">-- Select Action --</span>
                    </div>
                    {availableActions.map((action) => (
                      <div
                        key={action.value}
                        onClick={() => { setSelectedAction(action.value); setIsActionDropdownOpen(false); }}
                        className="text-slate-900 relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                      >
                        <span className="font-normal block truncate">{action.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {selectedAction === 'rename' && (
              <>
                <div>
                  <label htmlFor="action-from" className="block mb-1 text-sm font-medium text-slate-900">From</label>
                  <input
                    type="text"
                    id="action-from"
                    value={actionFrom}
                    onChange={(e) => setActionFrom(e.target.value)}
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
                    onChange={(e) => setActionTo(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    placeholder="new text"
                  />
                </div>
              </>
            )}
            {selectedAction === 'rename-by-index' && (
              <>
                <div>
                  <label htmlFor="start-index" className="block mb-1 text-sm font-medium text-slate-900">Start Index</label>
                  <input
                    type="number"
                    id="start-index"
                    value={startIndex}
                    onChange={(e) => setStartIndex(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    placeholder="e.g., 0"
                  />
                </div>
                <div>
                  <label htmlFor="end-index" className="block mb-1 text-sm font-medium text-slate-900">End Index (optional)</label>
                  <input
                    type="number"
                    id="end-index"
                    value={endIndex}
                    onChange={(e) => setEndIndex(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    placeholder="replace up to this index"
                  />
                </div>
                <div>
                  <label htmlFor="action-to-index" className="block mb-1 text-sm font-medium text-slate-900">To</label>
                  <input
                    type="text"
                    id="action-to-index"
                    value={actionTo}
                    onChange={(e) => setActionTo(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    placeholder="new text"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Files Table */}
        <div className="p-4 flex flex-col overflow-hidden flex-grow">
          <h4 className="text-md font-semibold text-slate-800 mb-2 flex-shrink-0">Preview Changes ({selectedFiles.size} files)</h4>
          <div className="overflow-y-auto border-t border-slate-200">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2">Original Name</th>
                  <th scope="col" className="px-4 py-2">New Name</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(selectedFiles).map(file => {
                  let newName = file;
                  if (selectedAction === 'rename' && actionFrom) {
                    newName = file.replace(actionFrom, actionTo);
                  } else if (selectedAction === 'rename-by-index' && startIndex !== '') {
                    const start = parseInt(startIndex, 10) - 1;
                    const end = endIndex ? parseInt(endIndex, 10) : start + 2;
                    if (!isNaN(start) && !isNaN(end) && start < end) {
                      newName = file.slice(0, start) + actionTo + file.slice(end);
                    }
                  }
                  return (
                    <tr key={file} className="bg-white border-b border-slate-200/60 hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-900 break-all">{file}</td>
                      <td className={`px-4 py-2 break-all ${newName !== file ? 'text-blue-500 font-semibold' : ''}`}>{newName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer with Execute Button */}
      <div className="p-4 border-t border-slate-200 flex-shrink-0">
        <button
          onClick={handleExecute}
          disabled={!selectedAction || (selectedAction === 'rename' && !actionFrom) || (selectedAction === 'rename-by-index' && startIndex === '')}
          className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Execute Rename
        </button>
      </div>
    </aside>
  );
};

export default ActionSidebar;