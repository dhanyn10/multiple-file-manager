"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, ...args) => electron.ipcRenderer.send(channel, ...args),
  on: (channel, listener) => {
    electron.ipcRenderer.on(channel, listener);
  },
  removeListener: (channel, listener) => {
    electron.ipcRenderer.removeListener(channel, listener);
  }
});
