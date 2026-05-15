import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { pathToFileURL } from 'url'
import { createReadStream } from 'fs'
import { Readable } from 'stream'
import mime from 'mime-types'
import { registerMediaHandlers } from './infrastructure/ipc/MediaHandlers'
import { resolveByteRange } from './infrastructure/protocol/resolveByteRange'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'media',
    privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
])

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.handle('media', async (request) => {
    const url = new URL(request.url)
    let path = decodeURIComponent(url.pathname)
    if (url.host && url.host.length === 1) {
      path = `${url.host}:${path}`
    }
    if (path.startsWith('/')) path = path.slice(1)

    const rangeHeader = request.headers.get('Range')
    if (!rangeHeader) {
      return net.fetch(pathToFileURL(path).toString())
    }

    const { start, end, fileSize } = await resolveByteRange(path, rangeHeader)
    const contentType = mime.lookup(path) || 'application/octet-stream'

    const webStream = Readable.toWeb(createReadStream(path, { start, end })) as ReadableStream
    return new Response(webStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(end - start + 1),
        'Content-Type': contentType
      }
    })
  })

  registerMediaHandlers()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
