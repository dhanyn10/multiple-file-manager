import { useState, useRef, useEffect, useMemo } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { detectMissingFiles, MissingSequence as IMissingSequence } from '../utils/fileUtils';
import { useResizableSidebar } from '../hooks/useResizableSidebar';
import RenameByNameForm from '../actions/RenameByNameForm';
import RenameByIndexForm from '../actions/RenameByIndexForm';
import InsertAtIndexForm from '../actions/InsertAtIndexForm';
import MissingFilesReport from '../actions/MissingFilesReport';
import ActionPreview from '../actions/ActionPreview';

export interface RenameOperation {
  originalName: string;
  newName: string;
  timestamp?: string;
}

interface FormattedMissingSequence extends IMissingSequence {
  start: string;
  end: string;
  missingCount: number;
}

interface BaseActionSidebarProps {
  selectedFiles: Set<string>;
  allFiles: { name: string; isDirectory: boolean; }[];
  onClose: () => void;
  onExecute: (operations: RenameOperation[]) => void;
  onExecuteDelete: (operations: { fileName: string; timestamp: string }[]) => void;
  otherSidebarOpen: boolean;
}

interface ActionSidebarProps extends BaseActionSidebarProps {
  selectedAction: string;
  onSelectedActionChange: (action: string) => void;
  startIndex: string;
  onStartIndexChange: (index: string) => void;
  endIndex: string;
  onEndIndexChange: (index: string) => void;
  setIndexOffset: (offset: number) => void;
}

const availableActions = [
  { value: 'rename', label: 'Rename by name' },
  { value: 'rename-by-index', label: 'Rename by index' },
  { value: 'insert-at-index', label: 'Insert text at index' },
  { value: 'delete-duplicated', label: 'Delete Duplicates' },
  { value: 'detect-missing', label: 'Detect Missing Files' }
];

const ActionSidebar = ({
  selectedFiles,
  allFiles,
  onClose,
  onExecute,
  onExecuteDelete,
  otherSidebarOpen,
  selectedAction,
  onSelectedActionChange,
  startIndex,
  onStartIndexChange,
  endIndex,
  onEndIndexChange,
  setIndexOffset,
}: ActionSidebarProps) => {
  const [actionFrom, setActionFrom] = useState('');
  const [actionTo, setActionTo] = useState('');
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const [missingFilesReport, setMissingFilesReport] = useState<FormattedMissingSequence[] | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  
  const { sidebarWidth, handleMouseDown } = useResizableSidebar({
    initialWidth: 384,
    minWidth: 320,
    otherSidebarOpen,
  });

  const maxFileNameLength = useMemo(() => {
    if (selectedFiles.size === 0) {
      return 100; // Default max length
    }
    return Math.max(...Array.from(selectedFiles).map(name => name.length));
  }, [selectedFiles]);

  useClickOutside(actionDropdownRef, () => setIsActionDropdownOpen(false));

  // Effect to handle special actions from the dropdown
  useEffect(() => {
    if (selectedAction === 'detect-missing') {
      const rawReport = detectMissingFiles(allFiles.map(f => f.name));
      const report: FormattedMissingSequence[] = rawReport.map(seq => {
        const firstMissing = String(seq.missingNumbers[0]).padStart(seq.paddingLength, '0');
        const lastMissing = String(seq.missingNumbers[seq.missingNumbers.length - 1]).padStart(seq.paddingLength, '0');
        
        return {
          ...seq,
          start: `${seq.prefix}${firstMissing}${seq.suffix}`,
          end: `${seq.prefix}${lastMissing}${seq.suffix}`,
          missingCount: seq.missingNumbers.length,
        };
      });
      setMissingFilesReport(report);
    } else {
      setMissingFilesReport(null);
    }
  }, [selectedAction, allFiles, setMissingFilesReport]);

  const handleClose = () => {
    onClose();
    // Reset local state on close
    onSelectedActionChange('');
    setActionFrom('');
    setActionTo('');
    onStartIndexChange('');
    onEndIndexChange('');
    setIndexOffset(0); // Reset offset on close
    setIsActionDropdownOpen(false);
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
      const start = parseInt(startIndex, 10);
      // If endIndex is not provided, it means we replace only one character at startIndex.
      const end = endIndex !== '' ? parseInt(endIndex, 10) : start + 1;

      if (!isNaN(start) && !isNaN(end) && start < end) {
        Array.from(selectedFiles).forEach(file => {
          const lastDotIndex = file.lastIndexOf('.');
          // If there's an extension and the end goes beyond it, cap it at the dot.
          // Make sure the dot is after the startIndex.
          const effectiveEnd = (lastDotIndex > start && end > lastDotIndex)
            ? lastDotIndex
            : end;
          const newName = file.slice(0, start) + actionTo + file.slice(effectiveEnd);
          if (newName !== file) {
            operations.push({ originalName: file, newName });
          }
        });
      }
    } else if (selectedAction === 'insert-at-index' && startIndex !== '') {
      const insertIndex = parseInt(startIndex, 10);
      if (!isNaN(insertIndex)) {
        Array.from(selectedFiles).forEach(file => {
          const newName = file.slice(0, insertIndex) + actionTo + file.slice(insertIndex);
          operations.push({ originalName: file, newName: newName });
        });
      }
    }
    onExecute(operations);
  };

  const handleDeleteDuplicates = () => {
    const files = Array.from(selectedFiles);
    const baseFiles = new Map<string, string>();

    // Regex to match patterns like `_0`, `_1`, `_copy`, `(1)`
    const duplicatePattern = /(.+?)(?:_(\d+)|_copy|\s*\((\d+)\))?(\.\w+)$/;

    // First pass: identify base files
    files.forEach(file => {
      const match = file.match(duplicatePattern);
      if (match) {
        const baseName = match[1];
        const extension = match[4];
        const fullBaseName = `${baseName}${extension}`;

        // If the base file itself exists in the selection, mark it.
        if (files.includes(fullBaseName)) {
          if (!baseFiles.has(fullBaseName)) {
            baseFiles.set(fullBaseName, fullBaseName);
          }
        }
      }
    });

    // Second pass: identify duplicates to be deleted
    const operations: { fileName: string; timestamp: string }[] = [];
    files.forEach(file => {
      // A file is a duplicate if it's NOT a base file itself
      if (!baseFiles.has(file)) {
        const timestamp = new Date().toISOString();
        operations.push({ fileName: file, timestamp });
      }
    });

    onExecuteDelete(operations);
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-slate-50 border-l border-slate-200 flex flex-col h-full relative select-none"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 -ml-1 w-2 h-full cursor-col-resize z-30 group"
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
                  onClick={() => setIsActionDropdownOpen(prev => !prev)}
                  className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <span className="block truncate">
                    {selectedAction
                      ? [...availableActions].find(a => a.value === selectedAction)?.label
                      : '-- Select Action --'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2" >
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.7 9.2a.75.75 0 011.06-.02L10 15.148l2.64-2.968a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
                {isActionDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm max-h-60">
                    <div
                      key="default-action"
                      onClick={() => { onSelectedActionChange(''); setIsActionDropdownOpen(false); }}
                      className="text-slate-500 relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                    >
                      <span className="font-normal block truncate">-- Select Action --</span>
                    </div>
                    {availableActions.map((action) => (
                      <div
                        key={action.value}
                        onClick={() => { onSelectedActionChange(action.value); setIsActionDropdownOpen(false); }}
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
                <RenameByNameForm
                  actionFrom={actionFrom}
                  onActionFromChange={setActionFrom}
                  actionTo={actionTo}
                  onActionToChange={setActionTo}
                />
              </>
            )}
            {selectedAction === 'rename-by-index' && (
              <>
                <RenameByIndexForm
                  startIndex={startIndex}
                  onStartIndexChange={onStartIndexChange}
                  endIndex={endIndex}
                  onEndIndexChange={onEndIndexChange}
                  actionTo={actionTo}
                  onActionToChange={setActionTo}
                  maxFileNameLength={maxFileNameLength}
                  setIndexOffset={setIndexOffset}
                />
              </>
            )}
            {selectedAction === 'insert-at-index' && (
              <>
                <InsertAtIndexForm
                  startIndex={startIndex}
                  onStartIndexChange={onStartIndexChange}
                  actionTo={actionTo}
                  onActionToChange={setActionTo}
                  maxFileNameLength={maxFileNameLength}
                />
              </>
            )}
          </div>
        </div>

        {/* Files Table */}
        <div className="p-4 flex flex-col overflow-hidden flex-grow">
          <h4 className="text-md font-semibold text-slate-800 mb-2 flex-shrink-0">{selectedAction === 'detect-missing' ? 'Missing Files Report' : `Preview Changes (${selectedFiles.size} files)`}</h4>
          <div className="overflow-y-auto border-t border-slate-200">
            {selectedAction === 'detect-missing' ? (
              <MissingFilesReport report={missingFilesReport} />
            ) : (
              <ActionPreview
                selectedFiles={selectedFiles}
                selectedAction={selectedAction}
                actionFrom={actionFrom}
                actionTo={actionTo}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer with Execute Button */}
      <div className={`p-4 border-t border-slate-200 flex-shrink-0 ${selectedAction === 'detect-missing' ? 'hidden' : ''}`}>
        {selectedAction === 'delete-duplicated' ? (
          <button
            onClick={handleDeleteDuplicates}
            disabled={!selectedAction}
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Delete Duplicates
          </button>
        ) : (
          <button
            onClick={handleExecute}
            disabled={!selectedAction || (selectedAction === 'rename' && !actionFrom) || (selectedAction === 'rename-by-index' && startIndex === '') || (selectedAction === 'insert-at-index' && startIndex === '')}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Execute Rename
          </button>
        )}
      </div>
    </aside>
  );
};

export default ActionSidebar;