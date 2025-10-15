import { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
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

  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        setDirectory(path);
        window.ipcRenderer.send('get-directory-contents', path);
        setSelectedFiles(new Set()); // Reset seleksi saat ganti direktori
        setLastSelectedFile(null);
      }
    };

    const handleDirectoryContents = (_event: any, fileList: FileEntry[]) => {
      setFiles(fileList);
      setCurrentPage(1); // Reset to the first page every time the directory changes
    };

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);
    window.ipcRenderer.on('directory-contents', handleDirectoryContents);

    return () => {
      window.ipcRenderer.off('directory-selected', handleDirectorySelected);
      window.ipcRenderer.off('directory-contents', handleDirectoryContents);
    };
  }, []);

  const handleBrowseClick = () => {
    window.ipcRenderer.send('open-directory-dialog');
  };

  const handleFileSelect = (fileName: string, isShiftClick: boolean) => {
    const newSelectedFiles = new Set(selectedFiles);

    // Logika untuk Shift-klik
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
        // Fallback jika salah satu file tidak ditemukan (misal beda halaman)
        if (newSelectedFiles.has(fileName)) {
          newSelectedFiles.delete(fileName);
        } else {
          newSelectedFiles.add(fileName);
        }
      }
    } else {
      // Logika untuk klik biasa (toggle)
      if (newSelectedFiles.has(fileName)) {
        newSelectedFiles.delete(fileName);
      } else {
        newSelectedFiles.add(fileName);
      }
    }
    setSelectedFiles(newSelectedFiles);
    setLastSelectedFile(fileName);
  };

  // Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(files.length / itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <NavigationBar />
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
              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Browse...
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col flex-grow mt-4 min-h-0">
            <div className="flex-grow mt-3 min-h-0">
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
      </main>
    </div>
  )
}

export default App
