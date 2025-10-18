import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
import ActionButtons from './components/ActionButtons';
import ActionSidebar, { ActionSidebarRef } from './components/ActionSidebar';
import HistorySidebar, { HistorySidebarRef } from './components/HistorySidebar';
import { useIpcListeners } from './hooks/useIpcListeners';
import { useFileManagement, FileEntry } from './hooks/useFileManagement';
import { useSidebarState } from './hooks/useSidebarState';
import { useResize } from './hooks/useResize';
import { useOperationHistory } from './hooks/useOperationHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootState } from './store/store';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';
 
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showActionsInNavbar, setShowActionsInNavbar] = useState(false); // This state can be repurposed or removed if sidebar is always open when files are selected
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [indexOffset, setIndexOffset] = useState<number>(0);

  const {
    directory,
    files,
    selectedFiles,
    recentlyRenamed,
    handleDirectorySelected,
    handleDirectoryContents,
    handleFileSelect,
    handleSelectAll,
    handleDeselectAll,
    setSelectedFiles,
    setLastSelectedFile,
    setRecentlyRenamed,
  } = useFileManagement();

  const {
    isModalOpen,
    isHistorySidebarOpen,
    setIsHistorySidebarOpen,
    handleExecuteClick,
    handleCloseModal,
    handleHistoryClick
  } = useSidebarState(setStartIndex, setEndIndex, setIndexOffset);

  // Use the selectedAction from Redux store as the single source of truth
  const selectedAction = useSelector((state: RootState) => state.actions.selectedAction);
  const actionsToolbarRef = useRef<HTMLDivElement>(null);
  const actionSidebarRef = useRef<ActionSidebarRef>(null);
  const historySidebarRef = useRef<HistorySidebarRef>(null);
  
  const handleLocalDirectoryContents = useCallback((fileList: FileEntry[]) => {
    handleDirectoryContents(fileList);
    setCurrentPage(1); // Reset to the first page every time the directory changes
  }, [handleDirectoryContents]);

  const handleRenameComplete = useCallback(() => {
    if (directory) {
      window.ipcRenderer.send('get-directory-contents', directory);
    }
    setSelectedFiles(new Set());
    setLastSelectedFile(null);
    handleCloseModal();
  }, [directory, setSelectedFiles, setLastSelectedFile, handleCloseModal]);

  useIpcListeners({
    onDirectorySelected: handleDirectorySelected,
    onDirectoryContents: handleLocalDirectoryContents,
    onRenameComplete: handleRenameComplete,
  });

  const {
    setIsResizing, showResizeButtons, isCloseResizeButtonHovered, setIsCloseResizeButtonHovered, resizeDirection, setResizeDirection, handleResizeMouseDown, handleResizeMouseUp, handleCloseResizeButtons
  } = useResize(isModalOpen, isHistorySidebarOpen, actionSidebarRef, historySidebarRef);

  const {
    undoStack,
    redoStack,
    handleExecuteRename,
    handleExecuteDelete,
    handleUndo,
    handleRedo,
    handleClearHistory,
  } = useOperationHistory(
    directory,
    selectedFiles, setSelectedFiles,
    setLastSelectedFile, setRecentlyRenamed,
    setIsHistorySidebarOpen
  );

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
        onHistoryClick={handleHistoryClick}
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
