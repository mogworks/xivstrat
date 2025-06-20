const { app, BrowserWindow, protocol } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

let mainWindow = null

// 注册自定义协议
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, corsEnabled: true, supportFetchAPI: true } }
])

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    title: 'XivStrat - Debug Mode',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // 临时关闭安全限制用于调试
    }
  })

  // 始终打开开发者工具
  mainWindow.webContents.openDevTools()

  // 监听所有请求
  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    console.log('[Request]', details.method, details.url)
    callback({})
  })

  // 监听控制台消息
  mainWindow.webContents.on('console-message', (_event, _level, message) => {
    console.log('[Console]', message)
  })

  // 拦截导航
  mainWindow.webContents.on('will-navigate', (event, url) => {
    console.log('[Navigate] Will navigate to:', url)
  })

  mainWindow.webContents.on('did-navigate', (event, url) => {
    console.log('[Navigate] Did navigate to:', url)
  })

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[Load Error]', errorCode, errorDescription, validatedURL)
  })

  // 加载应用
  mainWindow.loadURL('app://localhost/index.html')
}

// 注册协议处理
function registerProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    console.log('\n[Protocol] Handling request:', request.url)

    let url = request.url.replace('app://localhost/', '')
    url = decodeURIComponent(url)

    console.log('[Protocol] After decode:', url)

    // 处理根路径
    if (url === '' || url === 'index.html') {
      url = 'index.html'
    } else if (url.startsWith('/.')) {
      // 处理 /. 开头的资源
      url = url.substring(1)
      console.log('[Protocol] Removed /. prefix:', url)
    } else if (url.startsWith('/')) {
      // 处理其他路径
      url = url.substring(1)
    }

    // 检查是否需要添加 index.html
    if (!path.extname(url) && url !== 'index.html') {
      const originalUrl = url
      url = `${url}/index.html`
      console.log('[Protocol] Added index.html:', originalUrl, '->', url)
    }

    const filePath = path.join(__dirname, '../dist', ...url.split('/'))
    console.log('[Protocol] Final file path:', filePath)

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      console.log('[Protocol] File exists ✓')
      const stats = fs.statSync(filePath)
      console.log('[Protocol] File size:', stats.size, 'bytes')
    } else {
      console.error('[Protocol] File NOT found ✗')

      // 列出目录内容帮助调试
      const dir = path.dirname(filePath)
      if (fs.existsSync(dir)) {
        console.log('[Protocol] Directory contents of', dir)
        const files = fs.readdirSync(dir)
        files.forEach(file => console.log('  -', file))
      }
    }

    callback({ path: filePath })
  })
}

app.whenReady().then(() => {
  registerProtocol()
  createWindow()
})

app.on('window-all-closed', () => {
  if (require('node:process').platform !== 'darwin') {
    app.quit()
  }
})

console.log('Debug mode started. Check console for detailed logs.')
