import { useEffect } from 'react';
import { IpcRendererEvent } from 'electron';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface IpcListeners {
  onDirectorySelected: (path: string) => void;
  onDirectoryContents: (files: FileEntry[]) => void;
  onRenameComplete: () => void;
}

export const useIpcListeners = ({
  onDirectorySelected,
  onDirectoryContents,
  onRenameComplete,
}: IpcListeners) => {
  useEffect(() => {
    const handleDirectorySelected = (_event: IpcRendererEvent, path: string) => onDirectorySelected(path);
    const handleDirectoryContents = (_event: IpcRendererEvent, files: FileEntry[]) => onDirectoryContents(files);
    const handleRenameComplete = () => onRenameComplete();

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);
    window.ipcRenderer.on('directory-contents', handleDirectoryContents);
    window.ipcRenderer.on('rename-complete', handleRenameComplete);

    return () => {
      window.ipcRenderer.removeListener('directory-selected', handleDirectorySelected);
      window.ipcRenderer.removeListener('directory-contents', handleDirectoryContents);
      window.ipcRenderer.removeListener('rename-complete', handleRenameComplete);
    };
  }, [onDirectorySelected, onDirectoryContents, onRenameComplete]);
};