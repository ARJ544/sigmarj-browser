console.log('Hello from Electron 👋')
const { app, BrowserWindow, Menu } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    minimizable: true,
    maximizable: true,
    movable: true,
    fullscreenable: true,
    roundedCorners: true,
    titleBarOverlay: false,
    titleBarStyle:'hidden',
    closable: true,
    backgroundColor: '#1e1e1e'
  })
  const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' },
    { role: 'toggleDevTools' }
  ])
  win.webContents.on('context-menu', (_event, params) => {
    // only show the context menu if the element is editable
    // if (params.isEditable) {
      menu.popup()
    // }
  })
  win.loadURL('http://google.com')
}


app.whenReady().then(() => {
  createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})