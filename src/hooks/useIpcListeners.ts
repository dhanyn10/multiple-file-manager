import { useEffect } from 'react';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface UseIpcListenersParams {
  onDirectorySelected: (path: string) => void;
  onDirectoryContents: (files: FileEntry[]) => void;
}

export function useIpcListeners({ onDirectorySelected, onDirectoryContents }: UseIpcListenersParams) {
  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        onDirectorySelected(path);
      }
    };

    const handleDirectoryContents = (_event: any, fileList: FileEntry[]) => {
      onDirectoryContents(fileList);
    };

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);
    window.ipcRenderer.on('directory-contents', handleDirectoryContents);

    return () => {
      window.ipcRenderer.off('directory-selected', handleDirectorySelected);
      window.ipcRenderer.off('directory-contents', handleDirectoryContents);
    };
  }, [onDirectorySelected, onDirectoryContents]);
}