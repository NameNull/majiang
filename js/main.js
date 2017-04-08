const {app,BrowserWindow,globalShortcut,ipcMain,dialog} = require('electron');
const path = require('path');
const url = require('url');
//require ("./walletcheck");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width:1920, height:900, minWidth:1020, minHeight:640,icon:'build/images/favicon.ico'});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../tpl/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  require('./menu')(mainWindow);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
