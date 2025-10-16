import { useState, useEffect, useRef, useCallback } from 'react';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
import ActionButtons from './components/ActionButtons';
import ActionSidebar, { RenameOperation } from './components/ActionSidebar';
import HistorySidebar from './components/HistorySidebar';
import { useIpcListeners } from './hooks/useIpcListeners';
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
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<RenameOperation[]>([]);
  const [redoStack, setRedoStack] = useState<RenameOperation[]>([]);
  const [recentlyRenamed, setRecentlyRenamed] = useState<Set<string>>(new Set());
  const actionsToolbarRef = useRef<HTMLDivElement>(null);

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
    setIsModalOpen(false);
  }, [directory]);

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
    onRenameComplete: handleRenameComplete, // onRenameComplete no longer reloads the history
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
    fetchHistory();
  }, []);

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


  const handleBrowseClick = () => {
    window.ipcRenderer.send('open-directory-dialog');
  };

  const handleExecuteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  const handleUndo = (operationToUndo: RenameOperation) => {
    // Remove the operation from the undoStack
    const newUndoStack = undoStack.filter(op => op.timestamp !== operationToUndo.timestamp);
    if (newUndoStack.length === undoStack.length) return; // Operation not found

    // Create the reverse operation
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
  };

  const handleRedo = (operationToRedo: RenameOperation) => {
    // Remove the operation from the redoStack
    const newRedoStack = redoStack.filter(op => op.timestamp !== operationToRedo.timestamp);
    if (newRedoStack.length === redoStack.length) return; // Operation not found

    // Re-execute the original operation
    window.ipcRenderer.send('execute-rename', directory, [operationToRedo]);
    setRedoStack(newRedoStack);
    setUndoStack(prev => [operationToRedo, ...prev]);
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(files.length / itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800">
      <NavigationBar
        actionsSlot={
          showActionsInNavbar && selectedFiles.size > 0 ? (
            <ActionButtons selectedFileCount={selectedFiles.size} onExecuteClick={handleExecuteClick} isNavbarVersion={true} />
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

          {files.length > 0 && (
            <div className="flex flex-col flex-grow mt-4 min-h-0 min-w-0">
              {selectedFiles.size > 0 && (
                <div ref={actionsToolbarRef} className={`flex-shrink-0 mb-2 p-2 bg-slate-200 rounded-md flex items-center justify-between ${showActionsInNavbar ? 'opacity-0' : 'opacity-100'}`}>
                  <ActionButtons selectedFileCount={selectedFiles.size} onExecuteClick={handleExecuteClick} />
                </div>
              )}
              <div className={`flex-grow ${selectedFiles.size === 0 ? 'mt-3' : ''} min-h-0 min-w-0`}>
                <FileList
                  currentFiles={currentFiles}
                  selectedFiles={selectedFiles}
                  highlightedFiles={recentlyRenamed}
                  onFileSelect={handleFileSelect}
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
            selectedFiles={selectedFiles}
            onClose={handleCloseModal}
            onExecute={handleExecuteRename}
            otherSidebarOpen={isHistorySidebarOpen}
          />
        )}
        {isHistorySidebarOpen && (
          <HistorySidebar
            undoStack={undoStack}
            redoStack={redoStack}
            onClose={() => setIsHistorySidebarOpen(false)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearHistory={handleClearHistory}
            otherSidebarOpen={isModalOpen}
          />
        )}
      </div>
    </div>
  )
}

export default App
