import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { pathToFileURL } from 'url'
import { createReadStream } from 'fs'
import { Readable } from 'stream'
import mime from 'mime-types'
import { registerMediaHandlers } from './infrastructure/ipc/MediaHandlers'
import { registerStoreHandlers } from './infrastructure/ipc/StoreHandlers'
import { setupAutoUpdater } from './infrastructure/updater/setupAutoUpdater'
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
    minWidth: 800,
    minHeight: 600,
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
    try {
      const url = new URL(request.url)
      let path = decodeURIComponent(url.pathname)
      if (url.host && url.host.length === 1) {
        path = `${url.host}:${path}`
      }
      if (path.startsWith('/')) path = path.slice(1)

      const rangeHeader = request.headers.get('Range')
      if (!rangeHeader) {
        return await net.fetch(pathToFileURL(path).toString())
      }

      const result = await resolveByteRange(path, rangeHeader)

      if (!result.ok) {
        return new Response(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${result.fileSize}` }
        })
      }

      const { start, end, fileSize } = result
      const contentType = mime.lookup(path) || 'application/octet-stream'

      const nodeStream = createReadStream(path, { start, end })
      nodeStream.on('error', () => nodeStream.destroy())
      const webStream = Readable.toWeb(nodeStream) as ReadableStream

      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(end - start + 1),
          'Content-Type': contentType
        }
      })
    } catch (error: unknown) {
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined
      if (code === 'ENOENT') {
        return new Response(null, { status: 404 })
      }
      return new Response(null, { status: 500 })
    }
  })

  registerMediaHandlers()
  registerStoreHandlers()

  createWindow()
  setupAutoUpdater()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
