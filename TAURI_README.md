# XivStrat Desktop Application (Tauri)

## 概述

XivStrat 桌面应用使用 Tauri 框架构建，提供完全离线的攻略查看体验。

## 先决条件

### 所有平台
- Node.js (v16 或更高)
- Rust (通过 https://rustup.rs/ 安装)

### macOS
- Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```

### Windows
- Microsoft C++ Build Tools
- WebView2 (Windows 10+ 自带)

### Linux
- 系统依赖：
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```

## 开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行开发模式：
   ```bash
   npm run tauri:dev
   ```
   这将同时启动 Astro 开发服务器和 Tauri 窗口。

## 构建

### 为当前平台构建
```bash
npm run tauri:build
```

构建产物位置：
- Windows: `src-tauri/target/release/bundle/msi/` (.msi 安装包)
- macOS: `src-tauri/target/release/bundle/dmg/` (.dmg 安装包)
- Linux: `src-tauri/target/release/bundle/appimage/` (.AppImage)

### 生成图标
如果需要更新应用图标：
```bash
npm run tauri:icon
```

注意：生成的 .ico 和 .icns 文件是临时的，建议使用专业工具生成。

## 分发

### Windows
- MSI 安装包可直接分发
- 考虑代码签名以避免 SmartScreen 警告

### macOS
- DMG 文件需要公证 (notarization) 才能在其他 Mac 上运行
- 需要 Apple Developer 账号

### Linux
- AppImage 是最通用的格式
- 也可以构建 .deb 或 .rpm 包

## 常见问题

### Q: 构建失败，提示找不到 Rust
A: 确保已安装 Rust 并重启终端：
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Q: macOS 上提示"无法打开，因为它来自身份不明的开发者"
A: 这是因为应用未签名。用户可以右键点击应用，选择"打开"来绕过此限制。

### Q: Windows 上出现 WebView2 错误
A: 确保系统是 Windows 10 或更高版本，WebView2 应该已预装。

## 更新配置

主要配置文件：
- `src-tauri/tauri.conf.json` - Tauri 配置
- `src-tauri/Cargo.toml` - Rust 依赖

## 调试

开发模式下，可以：
- 使用浏览器开发者工具（右键 -> 检查）
- 查看 Rust 控制台输出
- 使用 `console.log()` 调试 JavaScript

## 性能优化

1. 确保先构建生产版本的网站：
   ```bash
   npm run build
   ```

2. Tauri 会自动使用构建后的静态文件

3. 考虑启用额外的 Tauri 优化选项

## 安全注意事项

- 默认配置已禁用大部分系统 API
- 仅启用了 `shell.open` 用于打开外部链接
- 不要在生产版本中启用不必要的权限