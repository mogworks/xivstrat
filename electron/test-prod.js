const { spawn } = require('node:child_process')
const path = require('node:path')

console.log('Building with Electron config...')

// 先构建
const buildProcess = spawn('pnpm', ['build:electron'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
})

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('Build failed')
    require('node:process').exit(1)
  }

  console.log('\nStarting Electron in production mode...')

  // 启动 Electron
  const electronProcess = spawn('electron', [path.join(__dirname, 'main.js')], {
    stdio: 'inherit',
    shell: true
  })

  electronProcess.on('close', () => {
    require('node:process').exit()
  })
})
