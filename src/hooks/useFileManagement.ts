import { useState, useCallback } from 'react';

export interface FileEntry {
  name: string;
  isDirectory: boolean;
}

export const useFileManagement = () => {
  const [directory, setDirectory] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastSelectedFile, setLastSelectedFile] = useState<string | null>(null);
  const [recentlyRenamed, setRecentlyRenamed] = useState<Set<string>>(new Set());

  const handleDirectorySelected = useCallback((path: string) => {
    setDirectory(path);
    window.ipcRenderer.send('get-directory-contents', path);
    setSelectedFiles(new Set());
    setLastSelectedFile(null);
  }, []);

  const handleDirectoryContents = useCallback((fileList: FileEntry[]) => {
    const onlyFiles = fileList.filter(file => !file.isDirectory);
    setFiles(onlyFiles);
    // After the file list is updated, clear the highlight after a delay
    setTimeout(() => {
      setRecentlyRenamed(new Set());
    }, 5000); // Highlight will last for 5 seconds
  }, []);

  const handleFileSelect = (fileName: string, isShiftClick: boolean) => {
    const newSelectedFiles = new Set(selectedFiles);

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
        if (newSelectedFiles.has(fileName)) {
          newSelectedFiles.delete(fileName);
        } else {
          newSelectedFiles.add(fileName);
        }
      }
    } else {
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
    setLastSelectedFile(null);
  };

  const handleDeselectAll = () => {
    setSelectedFiles(new Set());
    setLastSelectedFile(null);
  };

  return {
    directory, setDirectory,
    files, setFiles,
    selectedFiles, setSelectedFiles,
    lastSelectedFile, setLastSelectedFile,
    recentlyRenamed, setRecentlyRenamed,
    handleDirectorySelected, handleDirectoryContents,
    handleFileSelect, handleSelectAll, handleDeselectAll,
  };
};