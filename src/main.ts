import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron'
import * as path from 'path'
import Elgato from './elgato.js'

class GelatoApp {
  private tray: Tray | null = null
  private window: BrowserWindow | null = null

  public constructor() {
    this.init()
  }

  private createWindow(): void {
    this.window = new BrowserWindow({
      show: false,
      frame: false,
      useContentSize: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    this.window.loadFile(path.join(__dirname, 'index.html'))
    let window = this.window
    this.window.webContents.on('did-finish-load', () => {
      window.webContents.executeJavaScript(`
        const body = document.body
        const html = document.documentElement
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        )
        const width = Math.max(
          body.scrollWidth,
          body.offsetWidth,
          html.clientWidth,
          html.scrollWidth,
          html.offsetWidth
        )
        require('electron').ipcRenderer.send('resize-window', { width, height })
      `)
    })
  }

  private createTray(): void {
    try {
      const iconPath = path.join(__dirname, 'icon-32.png')
      const icon = nativeImage.createFromPath(iconPath)
      if (icon.isEmpty()) {
        console.error('Failed to load icon')
        return
      }

      this.tray = new Tray(icon)
      this.tray.setTitle('Gelato')
      this.tray.setToolTip('Gelato App')
      this.tray.setIgnoreDoubleClickEvents(true)

      // tray position
      console.log('Tray position:', this.tray.getBounds())

      this.tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: 'Gelato',
          click: () => {
            if (this.window) {
              this.window.show()
            }
          }
        },
        {
          label: 'Quit',
          click: () => {
            app.quit()
          }
        }
      ]))

    } catch (error) {
      console.error('Failed to create tray:', error)
    }
  }

  public init(): void {
    app.whenReady().then(() => {
      console.log('App is ready')
      this.createWindow()
      this.createTray()
    })

    ipcMain.on('resize-window', (_, dimensions) => {
      this.window?.setSize(dimensions.width, dimensions.height);
      console.log('Resized window to:', dimensions)
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

const gelatoApp = new GelatoApp()
const elgato = Elgato.get()


