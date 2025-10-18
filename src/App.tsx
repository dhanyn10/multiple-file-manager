import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
import ActionButtons from './components/ActionButtons';
import ActionSidebar, { RenameOperation, ActionSidebarRef } from './components/ActionSidebar';
import HistorySidebar, { HistorySidebarRef } from './components/HistorySidebar';
import { useIpcListeners } from './hooks/useIpcListeners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootState } from './store/store';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';
 
interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface ClearHistoryResult {
  success: boolean;
  error?: string;
}

function App() {
  const [directory, setDirectory] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastSelectedFile, setLastSelectedFile] = useState<string | null>(null);
  const [showActionsInNavbar, setShowActionsInNavbar] = useState(false); // This state can be repurposed or removed if sidebar is always open when files are selected
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showResizeButtons, setShowResizeButtons] = useState(false);
  const [isCloseResizeButtonHovered, setIsCloseResizeButtonHovered] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'left' | 'right' | null>(null);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<RenameOperation[]>([]);
  const [redoStack, setRedoStack] = useState<RenameOperation[]>([]);
  const [recentlyRenamed, setRecentlyRenamed] = useState<Set<string>>(new Set());
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [indexOffset, setIndexOffset] = useState<number>(0);

  // Use the selectedAction from Redux store as the single source of truth
  const selectedAction = useSelector((state: RootState) => state.actions.selectedAction);
  const actionsToolbarRef = useRef<HTMLDivElement>(null);
  const actionSidebarRef = useRef<ActionSidebarRef>(null);
  const historySidebarRef = useRef<HistorySidebarRef>(null);
  const resizeIntervalRef = useRef<number | null>(null);

  const handleDirectorySelected = useCallback((path: string) => {
    setDirectory(path);
    window.ipcRenderer.send('get-directory-contents', path);
    setSelectedFiles(new Set()); // Reset selection on directory change
    setLastSelectedFile(null);
  }, []);
  
  const handleRenameComplete = useCallback(() => {
    // Refresh directory contents after rename
    if (directory) {
      window.ipcRenderer.send('get-directory-contents', directory);
    }
    // Clear selection and modal state, but keep recentlyRenamed for highlighting
    setSelectedFiles(new Set());
    setLastSelectedFile(null);
    setIsModalOpen(false); // Also reset modal state
  }, [directory, setIsModalOpen]);

  // Ref to hold the latest handleRenameComplete function
  // This solves the stale closure issue when the directory changes while the sidebar is open.
  const renameCompleteHandlerRef = useRef<() => void>();
  useEffect(() => {
    renameCompleteHandlerRef.current = handleRenameComplete;
  }, [handleRenameComplete]);

  const handleDirectoryContents = useCallback((fileList: FileEntry[]) => {
    // Filter out directories and only show files
    const onlyFiles = fileList.filter(file => !file.isDirectory);
    setFiles(onlyFiles);
    setCurrentPage(1); // Reset to the first page every time the directory changes
    // After the file list is updated, clear the highlight after a delay
    setTimeout(() => {
      setRecentlyRenamed(new Set());
    }, 5000); // Highlight will last for 5 seconds
  }, []);

  // Define the actual rename complete handler separately
  useIpcListeners({
    onDirectorySelected: handleDirectorySelected,
    onDirectoryContents: handleDirectoryContents,
    // Use the ref to ensure the latest version of the handler is always called
    onRenameComplete: () => {
      renameCompleteHandlerRef.current?.();
    },
  });

  useEffect(() => {
    const fetchHistory = async () => {
      const savedHistory = await window.ipcRenderer.invoke('get-rename-history');
      // When the app loads, all history is considered "undoable"
      if (Array.isArray(savedHistory)) {
        setUndoStack(savedHistory as RenameOperation[]);
        setRedoStack([]); // Ensure the redo stack is empty at the start
      }
    };
    void fetchHistory();
  }, [setUndoStack, setRedoStack]);

  // Effect to sync endIndex with startIndex
  useEffect(() => {
    if (startIndex === '' || selectedAction !== 'rename-by-index') {
      setEndIndex('');
      return;
    }
    const startNum = parseInt(startIndex, 10);
    if (!isNaN(startNum)) {
      setEndIndex(String(startNum + indexOffset));
    }
  }, [startIndex, indexOffset, selectedAction]);

  // Add a class to the body while resizing to prevent unwanted interactions
  useEffect(() => {
    if (isResizing) {
      document.body.classList.add('resizing-sidebar');
    } else {
      document.body.classList.remove('resizing-sidebar');
    }
  }, [isResizing]);

  // Show resize buttons when resizing starts, and hide them when both sidebars are closed.
  useEffect(() => {
    if (isResizing) {
      setShowResizeButtons(true);
    }
  }, [isResizing]);

  useEffect(() => {
    if (!isModalOpen && !isHistorySidebarOpen) {
      setShowResizeButtons(false);
    }
  }, [isModalOpen, isHistorySidebarOpen]);

  useEffect(() => {
    if (!isResizing) {
      setResizeDirection(null);
    }
  }, [isResizing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the toolbar is not visible (isIntersecting is false), show it in the navbar
        setShowActionsInNavbar(!entry.isIntersecting);
      },
      {
        root: null, // relative to the viewport
        rootMargin: '-60px 0px 0px 0px', // ~60px is the estimated navbar height
        threshold: 1.0,
      }
    );

    if (actionsToolbarRef.current) {
      observer.observe(actionsToolbarRef.current);
    }

    return () => observer.disconnect();
  }, [selectedFiles.size]); // Re-observe if the toolbar appears/disappears

  const handleResizeClick = (direction: 'left' | 'right') => {
    const step = 10; // Smaller step for smoother continuous resize
    const multiplier = direction === 'left' ? 1 : -1;
    const change = step * multiplier;

    if (isModalOpen && actionSidebarRef.current) {
      const currentWidth = actionSidebarRef.current.getWidth();
      actionSidebarRef.current.setWidth(currentWidth + change);
    }

    if (isHistorySidebarOpen && historySidebarRef.current) {
      const currentWidth = historySidebarRef.current.getWidth();
      historySidebarRef.current.setWidth(currentWidth + change);
    }
  };

  const handleResizeMouseDown = (direction: 'left' | 'right') => {
    // Clear any existing interval first
    if (resizeIntervalRef.current) {
      clearInterval(resizeIntervalRef.current);
    }
    // Immediately resize once
    handleResizeClick(direction);
    // Then start resizing continuously
    resizeIntervalRef.current = window.setInterval(() => {
      handleResizeClick(direction);
    }, 50); // Adjust interval for speed, e.g., 50ms
  };

  const handleResizeMouseUp = () => {
    if (resizeIntervalRef.current) {
      clearInterval(resizeIntervalRef.current);
      resizeIntervalRef.current = null;
    }
  };

  const handleCloseResizeButtons = () => {
    setShowResizeButtons(false);
  };

  const handleBrowseClick = () => {
    window.ipcRenderer.send('open-directory-dialog');
  };

  const handleExecuteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Reset action-specific state when closing the sidebar
    setStartIndex('');
    setEndIndex('');
    setIndexOffset(0);
  }, [setIsModalOpen, setStartIndex, setEndIndex, setIndexOffset]);

  const handleExecuteRename = (operations: RenameOperation[]) => {
    if (operations.length > 0) {
      window.ipcRenderer.send('execute-rename', directory, operations);
      // Add to undo stack and clear redo stack
      setUndoStack(prev => [...operations, ...prev]);
      setRedoStack([]); // A new action will clear the redo possibility
      const newNames = new Set(operations.map(op => op.newName));
      setRecentlyRenamed(newNames);
      setIsHistorySidebarOpen(true);
    }
  };

  const handleExecuteDelete = (operations: { fileName: string; timestamp: string }[]) => {
    if (operations.length > 0) {
      const filesToDelete = operations.map(op => op.fileName);
      window.ipcRenderer.send('execute-delete', directory, filesToDelete);

      // Adapt delete operations to look like rename operations for the undo stack
      const undoOps: RenameOperation[] = operations.map(op => ({
        originalName: op.fileName,
        newName: `DELETED_${op.timestamp}`, // Placeholder for deleted state
        timestamp: op.timestamp,
      }));

      setUndoStack(prev => [...undoOps, ...prev]);
      setRedoStack([]);

      // No need to highlight deleted files, so we can clear recent changes
      setRecentlyRenamed(new Set());
      setIsHistorySidebarOpen(true);

      // We also need to clear the selection as the files are gone
      const newSelectedFiles = new Set(selectedFiles);
      filesToDelete.forEach(file => newSelectedFiles.delete(file));
      setSelectedFiles(newSelectedFiles);
      setLastSelectedFile(null);
    }
  };

  const handleUndo = (operationToUndo: RenameOperation) => {
    // Remove the operation from the undoStack
    const newUndoStack = undoStack.filter(op => op.timestamp !== operationToUndo.timestamp);
    if (newUndoStack.length === undoStack.length) return; // Operation not found

    // Create the reverse operation
    if (operationToUndo.newName.startsWith('DELETED_')) {
      // This is an undo for a delete operation. We pass the directory.
      window.ipcRenderer.send('execute-restore', directory, [operationToUndo.originalName]);
      // Move the undone operation to the redoStack
      setUndoStack(newUndoStack);
      setRedoStack(prev => [operationToUndo, ...prev]);
    } else {
      // This is an undo for a rename operation
      const reversedOp: RenameOperation = {
        originalName: operationToUndo.newName,
        newName: operationToUndo.originalName,
        timestamp: new Date().toISOString() // Give a new timestamp for this reverse operation
      };

      // Execute the reverse operation
      window.ipcRenderer.send('execute-rename', directory, [reversedOp]);

      // Move the undone operation to the redoStack
      setUndoStack(newUndoStack);
      setRedoStack(prev => [operationToUndo, ...prev]);
    }
  };

  const handleRedo = (operationToRedo: RenameOperation) => {
    // Remove the operation from the redoStack
    const newRedoStack = redoStack.filter(op => op.timestamp !== operationToRedo.timestamp);
    if (newRedoStack.length === redoStack.length) return; // Operation not found

    if (operationToRedo.newName.startsWith('DELETED_')) {
      // This is a redo for a delete operation
      window.ipcRenderer.send('execute-delete', directory, [operationToRedo.originalName]);
      setRedoStack(newRedoStack);
      setUndoStack(prev => [operationToRedo, ...prev]);
    } else {
      // Re-execute the original rename operation
      window.ipcRenderer.send('execute-rename', directory, [operationToRedo]);
      setRedoStack(newRedoStack);
      setUndoStack(prev => [operationToRedo, ...prev]);
    }
  };

  const handleClearHistory = async () => {
    const result: ClearHistoryResult = await window.ipcRenderer.invoke('clear-rename-history');
    if (result.success) {
      setUndoStack([]);
      setRedoStack([]);
      // Optionally, close the history sidebar after clearing
      // setIsHistorySidebarOpen(false);
    }
  };

  const handleFileSelect = (fileName: string, isShiftClick: boolean) => {
    const newSelectedFiles = new Set(selectedFiles);

    // Logic for Shift-click
    if (isShiftClick && lastSelectedFile) {
      const lastIndex = files.findIndex(f => f.name === lastSelectedFile);
      const currentIndex = files.findIndex(f => f.name === fileName);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);

        for (let i = start; i <= end; i++) {
          if (!files[i].isDirectory) {
            newSelectedFiles.add(files[i].name);
          }
        }
      } else {
        // Fallback if one of the files is not found (e.g., on a different page)
        if (newSelectedFiles.has(fileName)) {
          newSelectedFiles.delete(fileName);
        } else {
          newSelectedFiles.add(fileName);
        }
      }
    } else {
      // Logic for single click (toggle)
      if (newSelectedFiles.has(fileName)) {
        newSelectedFiles.delete(fileName);
      } else {
        newSelectedFiles.add(fileName);
      }
    }
    setSelectedFiles(newSelectedFiles);
    setLastSelectedFile(fileName);
  };

  const handleSelectAll = () => {
    const allFileNames = new Set(files.map(f => f.name));
    setSelectedFiles(allFileNames);
    setLastSelectedFile(null); // Reset last selected after bulk action
  };

  const handleDeselectAll = () => {
    setSelectedFiles(new Set());
    setLastSelectedFile(null);
  };
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(files.length / itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800">
      <NavigationBar
        isHistorySidebarOpen={isHistorySidebarOpen}
        showResizeButtons={showResizeButtons}
        onResizeMouseDown={handleResizeMouseDown}
        onResizeMouseUp={handleResizeMouseUp}
        resizeDirection={resizeDirection} 
        isCloseResizeButtonHovered={isCloseResizeButtonHovered}
        actionsSlot={
          showActionsInNavbar && selectedFiles.size > 0 ? ( // This logic seems to be for the navbar version
            <ActionButtons
              selectedFileCount={selectedFiles.size}
              onExecuteClick={handleExecuteClick}
              isNavbarVersion={true}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          ) : null
        }
        onHistoryClick={() => setIsHistorySidebarOpen(prevState => !prevState)}
      />
      <div className="flex flex-row flex-grow overflow-hidden">
        <main className="flex flex-col flex-grow p-4 min-w-0">
          <div className="flex-shrink-0">
            <label htmlFor="directory-input" className="block text-sm font-medium text-slate-700 mb-1">
              Select Directory:
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="directory-input"
                value={directory}
                readOnly
                placeholder="No directory selected"
                className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-slate-300 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleBrowseClick}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-slate-300 rounded-r-md bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                Browse...
              </button>
            </div>
          </div>

          {files.length === 0 && directory === '' ? (
            <div 
              className="flex-grow flex flex-col items-center justify-center text-center p-4 mt-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={handleBrowseClick}
            >
              <FontAwesomeIcon icon={faFolderPlus} className="text-5xl text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-600">Select a folder to get started</h2>
              <p className="text-slate-500 mt-1">Click here to browse for a folder on your computer.</p>
            </div>
          ) : files.length === 0 && directory !== '' ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 mt-4 border-2 border-dashed border-slate-300 rounded-lg">
              <h2 className="text-xl font-semibold text-slate-600">This folder is empty</h2>
              <p className="text-slate-500 mt-1">There are no files to display in this directory.</p>
            </div>
          ) : (
            <div className="flex flex-col flex-grow mt-4 min-h-0 min-w-0">
              {selectedFiles.size > 0 && (
                <div ref={actionsToolbarRef} className={`flex-shrink-0 mb-2 p-2 bg-slate-200 rounded-md flex items-center justify-between ${showActionsInNavbar ? 'opacity-0' : 'opacity-100'}`}>
                  <ActionButtons
                    selectedFileCount={selectedFiles.size}
                    onExecuteClick={handleExecuteClick}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                  />
                </div>
              )}
              <div className={`flex-grow ${selectedFiles.size === 0 ? 'mt-3' : ''} min-h-0 min-w-0`}>
                <FileList
                  currentFiles={currentFiles}
                  selectedFiles={selectedFiles}
                  highlightedFiles={recentlyRenamed}
                  onFileSelect={handleFileSelect}
                  activeAction={selectedAction}
                  startIndex={parseInt(startIndex, 10)}
                  endIndex={parseInt(endIndex, 10)}
                />
              </div>
              <FilePagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setCurrentPage={setCurrentPage}
                pageCount={pageCount}
                totalItems={files.length}
                currentPage={currentPage}
              />
            </div>
          )}
        </main>
        {isModalOpen && (
          <ActionSidebar
            ref={actionSidebarRef}
            selectedFiles={selectedFiles}
            allFiles={files}
            onClose={handleCloseModal}
            onExecute={handleExecuteRename}
            onExecuteDelete={handleExecuteDelete}
            otherSidebarOpen={isHistorySidebarOpen}
            startIndex={startIndex}
            onStartIndexChange={setStartIndex}
            endIndex={endIndex}
            onEndIndexChange={setEndIndex}
            setIndexOffset={setIndexOffset}
            onResizeStart={() => setIsResizing(true)}
            onResizeMove={setResizeDirection}
            onResizeEnd={() => setIsResizing(false)}
            showResizeButtons={showResizeButtons}
            onCloseResizeButtons={handleCloseResizeButtons}
            onResizeCloseHover={setIsCloseResizeButtonHovered}
          />
        )}
        {isHistorySidebarOpen && (
          <HistorySidebar
            ref={historySidebarRef}
            undoStack={undoStack}
            redoStack={redoStack}
            onClose={() => setIsHistorySidebarOpen(false)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearHistory={handleClearHistory}
            otherSidebarOpen={isModalOpen}
            onResizeMove={setResizeDirection}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={() => setIsResizing(false)}
            showResizeButtons={showResizeButtons}
            onCloseResizeButtons={handleCloseResizeButtons}
            onResizeCloseHover={setIsCloseResizeButtonHovered}
          />
        )}
      </div>
    </div>
  )
}

export default App
