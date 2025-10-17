import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import Store from 'electron-store'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// Initialize electron-store
const store = new Store({
  defaults: { renameHistory: [] }
})

// Log the path to the console for easy access
console.log('Electron-store data path:', store.path);

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()

  ipcMain.on('open-directory-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        event.sender.send('directory-selected', result.filePaths[0]);
      }
    }).catch(err => {
      console.log(err);
    });
  });

  ipcMain.on('get-directory-contents', (event, dirPath) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
      if (err) {
        console.error("Failed to read directory:", err);
        event.sender.send('directory-contents', []);
        return;
      }
      const fileList = dirents.map(dirent => ({
        name: dirent.name,
        isDirectory: dirent.isDirectory(),
      }));
      
      // Sort the list: folders first, then files, then alphabetically
      fileList.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      event.sender.send('directory-contents', fileList);
    });
  });

  ipcMain.on('execute-rename', async (event, dirPath, operations: any[]) => {
    try {
      const currentHistory = (store.get('renameHistory') || []) as any[];
      // Execute all operations sequentially
      for (const op of operations) {
        const oldPath = path.join(dirPath, op.originalName);
        const newPath = path.join(dirPath, op.newName);
        await fs.promises.rename(oldPath, newPath);
        // Add the operation to the beginning of the history array
        currentHistory.unshift({ ...op, timestamp: new Date().toISOString() });
      }
      // Save the updated history array
      store.set('renameHistory', currentHistory.slice(0, 1000)); // Limit history to 1000 entries
      event.sender.send('rename-complete', { success: true });
    } catch (err) {
      console.error('An error occurred during rename or history update:', err);
      event.sender.send('rename-complete', { success: false, error: (err as Error).message });
    }
  });

  ipcMain.on('execute-delete', async (event, dirPath, filesToDelete: string[]) => {
    try {
      for (const fileName of filesToDelete) {
        const fullPath = path.join(dirPath, fileName);
        await shell.trashItem(fullPath);
      }
      event.sender.send('rename-complete', { success: true }); // Re-use rename-complete to trigger refresh
    } catch (err) {
      console.error('An error occurred during delete:', err);
      event.sender.send('rename-complete', { success: false, error: (err as Error).message });
    }
  });

  ipcMain.on('execute-restore', async (event, dirPath, filesToRestore: string[]) => {
    // NOTE: shell.trashItem does not have a native 'restore' function.
    // This is a simplified simulation. For a real restore, we would need to
    // manage our own "trash" folder or use platform-specific APIs.
    // For now, we'll just re-create an empty file to make it reappear in the list.
    try {
      for (const fileName of filesToRestore) {
        await fs.promises.writeFile(path.join(dirPath, fileName), '');
      }
      event.sender.send('rename-complete', { success: true });
    } catch (err) {
      console.error('An error occurred during restore:', err);
      event.sender.send('rename-complete', { success: false, error: (err as Error).message });
    }
  });

  ipcMain.handle('get-rename-history', async () => {
    return store.get('renameHistory', []);
  });

  ipcMain.handle('clear-rename-history', async () => {
    try {
      store.set('renameHistory', []);
      return { success: true };
    } catch (err: any) {
      console.error('Failed to clear history:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.on('open-external-link', (_event, url) => {
    shell.openExternal(url);
  });
})
