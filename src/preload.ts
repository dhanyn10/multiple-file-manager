import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface IpcRendererApi {
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  removeListener: (channel: string, listener: (...args: any[]) => void) => void;
}

const exposedIpcRenderer: IpcRendererApi = {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  // Tambahkan fungsi removeListener di sini
  removeListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },
};

contextBridge.exposeInMainWorld('ipcRenderer', exposedIpcRenderer);