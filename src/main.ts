import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import * as path from 'path'

class GelatoApp {
  private tray: Tray | null = null
  private window: BrowserWindow | null = null

  private createWindow(): void {
    this.window = new BrowserWindow({
      width: 300,
      height: 400,
      show: false,
      frame: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    this.window.loadFile(path.join(__dirname, 'index.html'))
  }

  private createTray(): void {
    try {
      const iconPath = path.join(__dirname, 'icon-32.png')
      const icon = nativeImage.createFromPath(iconPath)
      if (icon.isEmpty()) {
        console.error('Failed to load icon')
        return
      }
      console.log('Loading icon :', icon)
      this.tray = new Tray(icon)
      this.tray.setToolTip('Gelato App')
      this.tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: 'Quit',
          click: () => {
            app.quit()
          }
        }
      ]))
      this.tray.setTitle('Gelato App')

      this.tray.on('click', (event, bounds) => {
        if (!this.window) return

        const { x, y } = bounds
        
        if (this.window.isVisible()) {
          this.window.hide()
        } else {
          this.window.setPosition(x - 150, y)
          this.window.show()
        }
      })
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

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

const gelatoApp = new GelatoApp()
gelatoApp.init()
