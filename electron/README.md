# Electron 打包方案

这是 XivStrat 的 Electron 打包实现，所有 Electron 相关文件都在此目录中管理。

## 目录结构

```
electron/
├── main.js              # Electron 主进程
├── preload.js           # 预加载脚本
├── dev.js               # 开发模式启动脚本
├── generate-icons.js    # 图标生成脚本
├── electron-builder.json # Electron Builder 配置
├── build/               # 构建资源目录（图标等）
└── README.md           # 本文件
```

## 功能特性

1. **返回按钮**：在非首页时显示返回按钮（与 Tauri 版本一致）
2. **外链处理**：自动在系统默认浏览器中打开外部链接
3. **深色模式支持**：返回按钮会根据主题自动调整颜色
4. **开发模式**：支持连接到 Astro 开发服务器进行实时开发

## 使用方法

### 安装依赖

在项目根目录运行：

```bash
pnpm add -D electron electron-builder
```

### 开发模式

```bash
# 方法1：使用开发脚本
pnpm electron:dev

# 方法2：分别启动
pnpm dev                    # 启动 Astro 开发服务器
pnpm electron:start --dev   # 启动 Electron（开发模式）
```

### 构建应用

```bash
# 1. 生成图标（首次构建时需要）
pnpm electron:icons

# 2. 构建 Electron 应用（会自动构建前端资源）
pnpm electron:build
```

注意：`electron:build` 命令会自动执行 `build:electron`，使用专门的配置文件构建相对路径的资源。

### 打包配置

打包配置在 `electron-builder.json` 中，支持：

- **Windows**: NSIS 安装包和便携版
- **macOS**: DMG 安装包（支持 Intel 和 Apple Silicon）
- **Linux**: AppImage 和 DEB 包

## 图标准备

1. 运行 `pnpm electron:icons` 生成基础 PNG 文件
2. 使用以下工具转换为平台特定格式：
   - Windows: 使用 `png2ico` 生成 `icon.ico`
   - macOS: 使用 `png2icns` 生成 `icon.icns`
3. 将生成的图标放入 `electron/build/` 目录

## 与 Tauri 版本的差异

- Electron 版本使用 Node.js 运行时，体积较大但兼容性更好
- Tauri 版本使用系统 WebView，体积小但可能有平台差异
- 两个版本的用户体验和功能保持一致

## 调试工具

如果遇到页面加载问题，可以使用以下调试命令：

```bash
# 检查构建输出结构
pnpm electron:check

# 运行调试模式（详细日志输出）
pnpm electron:debug
```

调试模式会：

- 自动打开开发者工具
- 输出所有资源请求日志
- 显示文件路径解析过程
- 检查文件是否存在

## 注意事项

1. Electron 使用专门的构建配置 `astro.config.electron.mts`，生成相对路径的资源文件
2. 开发时确保 Astro 开发服务器在 4321 端口运行
3. 图标文件需要手动转换为平台特定格式
4. 生产构建会自动使用 `build:electron` 命令，无需手动运行
5. 在生产模式下可以按 `Ctrl+Shift+I` 打开开发者工具
