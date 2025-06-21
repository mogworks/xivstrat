const { spawn } = require('node:child_process')
const path = require('node:path')
const process = require('node:process')

// 设置环境变量
process.env.NODE_ENV = 'development'

// 启动 Astro 开发服务器
console.log('Starting Astro dev server...')
const astroProcess = spawn('pnpm', ['dev'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
})

// 等待一段时间让 Astro 启动
setTimeout(() => {
  console.log('Starting Electron...')

  // 启动 Electron
  const electronProcess = spawn('electron', [path.join(__dirname, 'main.js'), '--dev'], {
    stdio: 'inherit',
    shell: true,
  })

  electronProcess.on('close', () => {
    astroProcess.kill()
    process.exit()
  })
}, 5000)

// 处理退出
process.on('SIGINT', () => {
  astroProcess.kill()
  process.exit()
})
