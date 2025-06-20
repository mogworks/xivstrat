const { contextBridge, shell } = require('electron')

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 打开外部链接
  openExternal: (url) => {
    shell.openExternal(url)
  }
})
