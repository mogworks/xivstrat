const { app, dialog, protocol, shell, BrowserWindow, Menu } = require('electron')
const mime = require('mime-types')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const { compareVersion, getVersionFrom } = require('./version')

// 判断是否是开发模式
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev')

// 保持窗口引用，防止被垃圾回收
let mainWindow = null

// 注册自定义协议（必须在 app.ready 之前）
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, corsEnabled: true, supportFetchAPI: true } },
])

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    title: 'XivStrat',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 开发模式下连接到 Astro 开发服务器
  if (isDev) {
    mainWindow.loadURL('http://localhost:4321')
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境下禁用菜单栏
    Menu.setApplicationMenu(null)
    mainWindow.loadURL('app://localhost/index.html')

    // 生产环境下也可以通过快捷键打开开发工具（用于调试）
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.shift && input.key.toLowerCase() === 'i') {
        mainWindow.webContents.openDevTools()
      }
    })

    // 第一次加载页面完成后检查更新
    mainWindow.webContents.once('did-finish-load', checkUpdate)
  }

  // 设置 CSP
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          'default-src \'self\' app: \'unsafe-inline\' \'unsafe-eval\'; img-src \'self\' app: data: blob:; style-src \'self\' app: \'unsafe-inline\'; script-src \'self\' app: \'unsafe-inline\' \'unsafe-eval\';',
        ],
      },
    })
  })

  // 拦截导航请求
  mainWindow.webContents.on('will-navigate', (event, url) => {
    console.log('Navigation to:', url)
    // 如果是本地导航，阻止默认行为并使用自定义协议
    if (url.startsWith('file://')) {
      event.preventDefault()
      const pathname = new URL(url).pathname
      mainWindow.loadURL(`app://localhost${pathname}`)
    }
  })

  // 外链使用浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 注入脚本（与 Tauri 相同的功能）
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      (function() {
        // 创建返回按钮
        function createBackButton() {
          const button = document.createElement('button');
          button.innerHTML = '←';
          button.style.cssText = \`
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: #1a1a1a;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.2s;
          \`;
          
          // 深色模式适配
          button.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#1a1a1a' : '#ffffff';
          button.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a1a1a';
          
          button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
          });
          
          button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
          });
          
          button.addEventListener('click', () => {
            window.history.back();
          });
          
          return button;
        }
        
        // 检查是否在首页
        function isHomePage() {
          const path = window.location.pathname;
          return path === '/' || path === '/index.html' || path === '';
        }
        
        // 更新返回按钮的显示状态
        function updateBackButton() {
          const existingButton = document.getElementById('electron-back-button');
          
          if (isHomePage()) {
            if (existingButton) {
              existingButton.remove();
            }
          } else {
            if (!existingButton) {
              const button = createBackButton();
              button.id = 'electron-back-button';
              document.body.appendChild(button);
            }
          }
        }
        
        // 监听主题变化
        const themeObserver = new MutationObserver(() => {
          const button = document.getElementById('electron-back-button');
          if (button) {
            button.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#1a1a1a' : '#ffffff';
            button.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a1a1a';
          }
        });
        
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        });
        
        // 监听路由变化
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
          if (location.href !== lastUrl) {
            lastUrl = location.href;
            updateBackButton();
          }
        });
        
        urlObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // 监听浏览器返回事件
        window.addEventListener('popstate', updateBackButton);
        
        // 初始化
        updateBackButton();
      })();
    `)
  })

  // 窗口关闭时清理
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 注册自定义协议处理
function registerProtocol() {
  protocol.handle('app', async (request) => {
    let url = request.url.replace('app://localhost/', '')

    // 解码 URL
    url = decodeURIComponent(url)

    // 处理根路径
    if (url === '' || url === 'index.html') {
      url = 'index.html'
    } else if (url.startsWith('/.')) {
      // 处理以 /. 开头的路径（如 /./_astro/...）
      url = url.substring(1) // 移除开头的 /
    } else if (url.startsWith('/')) {
      // 处理其他路径
      url = url.substring(1) // 移除开头的 /
    }

    // 检查是否是目录路径（不包含文件扩展名）
    if (!path.extname(url) && url !== 'index.html') {
      // 对于目录路径，添加 /index.html
      // 使用字符串拼接而不是 path.join，避免 Windows 路径问题
      url = `${url}/index.html`
    }

    // 规范化路径，确保跨平台兼容
    const normalizedUrl = url.replace(/\\/g, '/')
    const filePath = path.join(__dirname, '../dist', ...normalizedUrl.split('/'))

    // 调试输出
    console.log('Request URL:', request.url)
    console.log('Processed URL:', normalizedUrl)
    console.log('Resolved path:', filePath)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath)
      // 尝试返回 404 页面或首页
      const fallbackPath = path.join(__dirname, '../dist/404.html')
      if (fs.existsSync(fallbackPath)) {
        return new Response(fs.readFileSync(fallbackPath), {
          headers: { 'Content-Type': 'text/html' },
        })
      }
      return new Response('Not Found', { status: 404 })
    }

    // 获取文件MIME
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'
    return new Response(fs.readFileSync(filePath), {
      headers: { 'Content-Type': mimeType },
    })
  })
}

async function checkUpdate() {
  // 服务器地址
  const server = ''
  if (server === '') {
    return
  }

  try {
    const { version, timestamp, update_info, download_url } = await getVersionFrom(server)
    // BUG: 为啥这里 app.getVersion() 返回的是 electron 的版本？
    if (compareVersion(version, app.getVersion())) {
      const ret = await dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '发现更新',
        message: `新版本： XivStrat ${version} - ${timestamp}`,
        detail: `更新内容： \n${update_info}\n要前往下载吗？`,
        buttons: ['是', '否'],
        defaultId: 0,
        cancelId: 1,
      })
      // 用户点击确认
      if (ret.response === 0) {
        shell.openExternal(download_url)
      }
    }
  } catch (err) {
    console.error('Error:', err)
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: '错误',
      message: '检查更新时出现错误',
      detail: `详细信息： ${err}`,
      buttons: ['确定'],
      cancelId: 0,
    })
  }
}

// 应用准备就绪
app.whenReady().then(() => {
  if (!isDev) {
    registerProtocol()
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 所有窗口关闭时退出应用（Windows 和 Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 处理协议（用于生产环境的深链接）
app.setAsDefaultProtocolClient('xivstrat')
