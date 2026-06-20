import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

export function setupAutoUpdater(): void {
  if (process.platform === 'darwin') return
  if (!app.isPackaged) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', async () => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of Mnemora is available. Download now?',
      buttons: ['Download', 'Later']
    })
    if (response === 0) {
      autoUpdater.downloadUpdate()
    }
  })

  autoUpdater.on('update-downloaded', async () => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'The update has been downloaded. Restart now to install?',
      buttons: ['Restart', 'Later']
    })
    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto-update error:', err)
  })

  autoUpdater.checkForUpdates()
}
