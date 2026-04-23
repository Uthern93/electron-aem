const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadFile(
      path.join(__dirname, '../dist/angular-aem/index.html')
    );
  }
}

app.whenReady().then(createWindow);