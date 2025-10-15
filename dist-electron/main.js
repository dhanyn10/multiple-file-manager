import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  ipcMain.on("open-directory-dialog", (event) => {
    dialog.showOpenDialog({
      properties: ["openDirectory"]
    }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        event.sender.send("directory-selected", result.filePaths[0]);
      }
    }).catch((err) => {
      console.log(err);
    });
  });
  ipcMain.on("get-directory-contents", (event, dirPath) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
      if (err) {
        console.error("Failed to read directory:", err);
        event.sender.send("directory-contents", []);
        return;
      }
      const fileList = dirents.map((dirent) => ({
        name: dirent.name,
        isDirectory: dirent.isDirectory()
      }));
      fileList.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      event.sender.send("directory-contents", fileList);
    });
  });
  ipcMain.on("execute-rename", (event, dirPath, operations) => {
    const renamePromises = operations.map((op) => {
      const oldPath = path.join(dirPath, op.originalName);
      const newPath = path.join(dirPath, op.newName);
      return fs.promises.rename(oldPath, newPath);
    });
    Promise.all(renamePromises).then(() => {
      console.log("All files renamed successfully");
      event.sender.send("rename-complete");
    }).catch((err) => {
      console.error("An error occurred during rename:", err);
      event.sender.send("rename-complete");
    });
  });
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
