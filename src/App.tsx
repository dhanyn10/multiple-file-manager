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
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
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

  const actionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setIsActionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
    setIsActionDropdownOpen(false); // Close dropdown as well
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

  const availableActions = [
    { value: 'rename', label: 'Rename by name' },
    // Anda bisa menambahkan aksi lain di sini di masa mendatang
  ];

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
                <div className="relative" ref={actionDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                    className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                        onClick={() => {
                          setSelectedAction('');
                          setIsActionDropdownOpen(false);
                        }}
                        className="text-slate-500 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                      >
                        <span className="font-normal block truncate">-- Select Action --</span>
                      </div>
                      {availableActions.map((action) => (
                        <div
                          key={action.value}
                          onClick={() => {
                            setSelectedAction(action.value);
                            setIsActionDropdownOpen(false);
                          }}
                          className="text-slate-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
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
                    <label htmlFor="action-from" className="block mb-2 text-sm font-medium text-slate-900">From</label>
                    <input
                      type="text"
                      id="action-from"
                      value={actionFrom}
                      onChange={(e) => setActionFrom(e.target.value)}
                      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                        <td className={`px-4 py-3 break-all ${newName !== file ? 'text-blue-500 font-semibold' : ''}`}>{newName}</td>
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
