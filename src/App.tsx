import { useState, useEffect, useRef } from 'react';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
import Modal from './components/Modal';
import './App.css';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

function App() {
  const [directory, setDirectory] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastSelectedFile, setLastSelectedFile] = useState<string | null>(null);
  const [showActionsInNavbar, setShowActionsInNavbar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actionsToolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        setDirectory(path);
        window.ipcRenderer.send('get-directory-contents', path);
        setSelectedFiles(new Set()); // Reset selection on directory change
        setLastSelectedFile(null);
      }
    };

    const handleDirectoryContents = (_event: any, fileList: FileEntry[]) => {
      // Filter out directories and only show files
      const onlyFiles = fileList.filter(file => !file.isDirectory);
      setFiles(onlyFiles);
      setCurrentPage(1); // Reset to the first page every time the directory changes
    };

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);
    window.ipcRenderer.on('directory-contents', handleDirectoryContents);

    return () => {
      window.ipcRenderer.off('directory-selected', handleDirectorySelected);
      window.ipcRenderer.off('directory-contents', handleDirectoryContents);
    };
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
    // Placeholder for execution logic
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const ActionButtons = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">{selectedFiles.size} file(s) selected</span>
      <button
        onClick={handleExecuteClick}
        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Execute
      </button>
    </div>
  );

  const pageCount = Math.ceil(files.length / itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <NavigationBar
        actionsSlot={showActionsInNavbar && selectedFiles.size > 0 ? <ActionButtons /> : null}
      />
      <main className="flex flex-col flex-grow p-4">
        <div className="flex-shrink-0">
          <label htmlFor="directory-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Directory:
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id="directory-input"
              value={directory}
              readOnly
              placeholder="No directory selected"
              className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleBrowseClick}
              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Browse...
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col flex-grow mt-4 min-h-0">
            {selectedFiles.size > 0 && (
              <div ref={actionsToolbarRef} className={`flex-shrink-0 mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-between ${showActionsInNavbar ? 'opacity-0' : 'opacity-100'}`}>
                <ActionButtons />
              </div>
            )}
            <div className={`flex-grow ${selectedFiles.size === 0 ? 'mt-3' : ''} min-h-0`}>
              <FileList
                currentFiles={currentFiles}
                selectedFiles={selectedFiles}
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
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Selected Files for Execution"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">File Name</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(selectedFiles).map(file => (
                  <tr key={file} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{file}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </main>
    </div>
  )
}

export default App
