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
  const [actionFrom, setActionFrom] = useState('');
  const [actionTo, setActionTo] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActionFrom(''); // Reset form on close
    setActionTo('');   // Reset form on close
    setSelectedAction(''); // Reset selected action
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
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800">
      <NavigationBar
        actionsSlot={showActionsInNavbar && selectedFiles.size > 0 ? <ActionButtons /> : null}
      />
      <main className="flex flex-col flex-grow p-4">
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
          <div className="flex flex-col flex-grow mt-4 min-h-0">
            {selectedFiles.size > 0 && (
              <div ref={actionsToolbarRef} className={`flex-shrink-0 mb-2 p-2 bg-slate-200 rounded-md flex items-center justify-between ${showActionsInNavbar ? 'opacity-0' : 'opacity-100'}`}>
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
          {/* Action Form */}
          <div className="p-4 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <select
                  id="action-select"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none bg-no-repeat bg-right pr-8 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')]"
                >
                  <option value="">-- Select --</option>
                  <option value="rename">Rename by name</option>
                </select>
              </div>
              {selectedAction === 'rename' && (
                <>
                  <div>
                    <label htmlFor="action-from" className="block mb-2 text-sm font-medium text-slate-900">From</label>
                    <input
                      type="text"
                      id="action-from"
                      value={actionFrom}
                      onChange={(e) => setActionFrom(e.target.value)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="text to replace"
                    />
                  </div>
                  <div>
                    <label htmlFor="action-to" className="block mb-2 text-sm font-medium text-slate-900">To</label>
                    <input
                      type="text"
                      id="action-to"
                      value={actionTo}
                      onChange={(e) => setActionTo(e.target.value)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="new text"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Files Table */}
          <div className="p-4 flex flex-col overflow-hidden">
            <div className="relative overflow-x-auto flex-shrink-0">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                  <tr>
                    <th scope="col" className="px-4 py-3">Original Name</th>
                    <th scope="col" className="px-4 py-3">New Name (Preview)</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="overflow-y-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <tbody>
                  {Array.from(selectedFiles).map(file => {
                    const newName = selectedAction === 'rename' && actionFrom ? file.replace(new RegExp(actionFrom, 'g'), actionTo) : file;
                    return (
                      <tr key={file} className="bg-white border-b border-slate-200/60 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900 break-all">{file}</td>
                        <td className={`px-4 py-3 break-all ${newName !== file ? 'text-green-400 font-semibold' : ''}`}>{newName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}

export default App
