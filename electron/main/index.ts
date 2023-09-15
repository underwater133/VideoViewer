import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { getDirTree, getDirFiles } from '../util/node-api.js'
import { play } from '../util/video.js'
import Store from '../util/store'
import Remote from '@electron/remote/main'
Remote.initialize()

let rootPath = Store.get('rootPath') || ''
// let rootPath = 'D:/图片/'
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1000,
    height: 600,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 30
    // },
    frame: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  Remote.enable(win.webContents)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 窗口最小化
ipcMain.on('window-min',function(){ // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
  win.minimize();
})
// 窗口 最大化、恢复
ipcMain.on('window-max',function () {
  if(win.isMaximized()){ // 为true表示窗口已最大化
    win.restore();// 将窗口恢复为之前的状态.
  }else{
    win.maximize();
  }
})

// 关闭窗口
ipcMain.on('window-close',function (){
  win.close();
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('getDirTree', async (event, refresh) => await getDirTree(rootPath, refresh).catch(e => {console.log(e)}))

ipcMain.handle('getDirFiles', (event, path, refresh) => {
  getDirFiles(path, refresh).then(res => {
    event.sender.send('dirFiles', res)
  }).catch(e => {
    event.sender.send('dirFiles', [])
    if (e.message.includes('no such file or directory')) {
      event.sender.send('errorTips', '该文件夹已不存在，是否刷新目录？')
    } else if (e.message.includes('ffmpeg')) {
      event.sender.send('errorTips', '未检测到ffmpeg插件，请检查是否下载并且正确配置环境。是否打开ffmpeg下载页面？')
    }
  })
})

ipcMain.handle('clearStore', (event) => { 
  // 除了根目录，其他都清除
  const keys = Object.keys(Store.store)
  const excludeKeys = ['rootPath', 'defaultPalyer']
  keys.forEach(key => {
    if (excludeKeys.indexOf(key) === -1) {
      Store.delete(key)
    }
  })
})

ipcMain.handle('playVideo', (event, path) => { play(path) })

ipcMain.handle('setRootPath', (event, path) => {
  rootPath = path;
  event.sender.send('changeRootPath')
})