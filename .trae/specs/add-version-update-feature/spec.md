# 版本更新提示功能 Spec

## Why
react-iztro 项目的 Demo 应用已支持 Android（Capacitor）和 Web（Vercel）发布，但缺少版本更新提示机制，用户无法感知新版本发布。参考 liuren 项目的成熟实践，需要为 Demo 应用添加版本更新提示功能，同时新增 Windows 桌面端（Tauri v2）支持，并建立完整的 CI/CD 自动打包发布流水线。

## What Changes
- 新增 Tauri v2 桌面端项目配置（`src-tauri/` 目录），支持 Windows NSIS 安装包打包
- 新增 `useTauriUpdater` Hook，用于 Tauri 桌面端自动更新检测与安装
- 新增 `UpdateChecker` 组件，用于 Web/Android 端通过 GitHub API 检查更新并提示下载
- 新增 `TauriUpdateBanner` 组件，用于 Tauri 桌面端显示更新横幅
- 新增 `downloadUtils.ts` 下载链接工具函数，支持 GitHub 直链和 ghproxy 镜像加速
- 新增 `openUrl.ts` 工具函数，兼容 Tauri 和浏览器环境打开外部链接
- 修改 `vite.config.ts`，注入 `__APP_VERSION__` 全局常量
- 新增 `vite-env.d.ts` 类型声明文件
- 修改 `App.tsx`，集成更新检查组件
- 修改 `capacitor.config.ts`，增加 SplashScreen 和 androidScheme 配置
- 修改 `android/app/build.gradle`，增加签名配置、版本号同步、APK 文件名自定义
- 新增 `.github/workflows/release.yml` CI/CD 流水线，自动构建 APK + Windows EXE 并发布到 GitHub Release
- 新增 `nsis-simpchinese.nsh` NSIS 安装器中文化文件
- 修改 `package.json`，增加 Tauri 相关依赖和脚本

## Impact
- Affected specs: Demo 应用的发布流程、版本管理、用户体验
- Affected code:
  - `demo/src/App.tsx` - 集成更新组件
  - `demo/vite.config.ts` - 注入版本号
  - `demo/capacitor.config.ts` - 完善配置
  - `demo/android/app/build.gradle` - 签名和版本管理
  - `demo/package.json` - 新增依赖
  - 新增 `demo/src-tauri/` 目录及全部文件
  - 新增 `demo/src/hooks/useTauriUpdater.ts`
  - 新增 `demo/src/components/UpdateChecker.tsx`
  - 新增 `demo/src/components/TauriUpdateBanner.tsx`
  - 新增 `demo/src/lib/downloadUtils.ts`
  - 新增 `demo/src/lib/openUrl.ts`
  - 新增 `demo/src/vite-env.d.ts`
  - 新增 `demo/nsis-simpchinese.nsh`
  - 新增 `.github/workflows/release.yml`

## ADDED Requirements

### Requirement: Tauri v2 桌面端支持
系统 SHALL 提供 Tauri v2 桌面端项目配置，支持构建 Windows NSIS 安装包。

#### Scenario: Tauri 项目初始化
- **WHEN** 开发者在 demo 目录下运行 `npm run tauri:dev`
- **THEN** Tauri 应用启动，加载前端页面，窗口初始隐藏避免白屏闪烁

#### Scenario: Tauri 桌面端构建
- **WHEN** 开发者运行 `npm run tauri:build`
- **THEN** 生成 NSIS 安装包 EXE 文件，包含更新签名文件（latest.json）

### Requirement: 版本更新提示 - Tauri 桌面端
系统 SHALL 在 Tauri 桌面端通过 `@tauri-apps/plugin-updater` 检查更新，并在发现新版本时显示更新横幅。

#### Scenario: 检测到新版本
- **WHEN** Tauri 桌面端启动或每4小时自动检查时发现新版本
- **THEN** 在页面顶部显示蓝色渐变更新横幅，包含"发现新版本 vX.X.X"文字和"立即更新"按钮

#### Scenario: 用户点击立即更新
- **WHEN** 用户点击"立即更新"按钮
- **THEN** 开始下载更新包，显示模拟进度条，下载完成后自动重启应用

#### Scenario: 更新检查失败
- **WHEN** 更新检查或下载过程中发生错误
- **THEN** 在横幅中显示黄色错误提示文字

### Requirement: 版本更新提示 - Web/Android 端
系统 SHALL 在 Web 和 Android 端通过 GitHub Releases API 检查更新，并在发现新版本时显示更新横幅。

#### Scenario: 检测到新版本
- **WHEN** Web/Android 端检查发现 GitHub Release 版本号大于当前版本
- **THEN** 在页面顶部显示蓝色渐变更新横幅，包含"国内下载"（ghproxy 镜像）和"GitHub"两个下载按钮

#### Scenario: 用户关闭更新提示
- **WHEN** 用户点击更新横幅的关闭按钮
- **THEN** 横幅消失，同一版本号不再重复提示（缓存到 localStorage）

#### Scenario: 版本检查频率控制
- **WHEN** 距离上次检查不到4小时
- **THEN** 使用 localStorage 缓存的版本信息，不发起 API 请求

#### Scenario: GitHub API 速率限制
- **WHEN** GitHub API 请求因速率限制返回 403
- **THEN** 静默失败，不显示错误提示，下次检查时重试

### Requirement: 版本信息展示
系统 SHALL 在页面底部始终显示当前版本号和最新版本号信息。

#### Scenario: 版本信息正常显示
- **WHEN** 页面加载完成
- **THEN** 底部显示"v当前版本 / 最新 v最新版本"文字，以及手动刷新按钮

#### Scenario: 版本已是最新
- **WHEN** 当前版本等于最新版本
- **THEN** 最新版本文字显示为绿色"（已是最新）"

#### Scenario: 有可用更新
- **WHEN** 当前版本小于最新版本
- **THEN** 最新版本文字显示为蓝色"（可更新）"

### Requirement: 下载链接工具
系统 SHALL 提供下载链接工具函数，支持 GitHub 直链和 ghproxy 镜像加速。

#### Scenario: 生成 APK 下载链接
- **WHEN** 调用 `getApkDownloadUrl()`
- **THEN** 返回 `https://github.com/jingrongx/react-iztro/releases/download/v{version}/react-iztro_v{version}.apk`

#### Scenario: 生成 ghproxy 镜像链接
- **WHEN** 调用 `getGhproxyApkDownloadUrl()`
- **THEN** 返回 `https://ghproxy.net/https://github.com/jingrongx/react-iztro/releases/download/v{version}/react-iztro_v{version}.apk`

#### Scenario: 生成 EXE 下载链接
- **WHEN** 调用 `getExeDownloadUrl()`
- **THEN** 返回 `https://github.com/jingrongx/react-iztro/releases/download/v{version}/react-iztro_{version}_x64-setup.exe`

### Requirement: CI/CD 自动打包发布
系统 SHALL 提供 GitHub Actions 工作流，在推送到 main 分支时自动构建 Android APK 和 Windows EXE 并发布到 GitHub Release。

#### Scenario: 推送到 main 分支触发构建
- **WHEN** 代码推送到 main 分支
- **THEN** 自动递增 patch 版本号，构建 APK 和 EXE，创建 GitHub Release 并上传产物

#### Scenario: 手动触发构建
- **WHEN** 通过 workflow_dispatch 手动触发
- **THEN** 可选指定版本号，执行同样的构建和发布流程

#### Scenario: Release Notes 自动生成
- **WHEN** 构建完成创建 Release
- **THEN** Release Notes 包含 git log 中的 feat/fix/refactor 提交记录，以及 Android 和 Windows 的下载链接（含 ghproxy 镜像）

### Requirement: Android APK 签名和版本管理
系统 SHALL 为 Android APK 配置 Release 签名和自动版本号同步。

#### Scenario: APK 签名
- **WHEN** CI 构建 Release APK
- **THEN** 使用 keystore 签名，APK 文件名包含版本号（如 `react-iztro_v1.0.0.apk`）

#### Scenario: 版本号同步
- **WHEN** CI 递增 package.json 版本号
- **THEN** 同步更新 Android build.gradle 中的 versionCode 和 versionName

### Requirement: NSIS 安装器中文化
系统 SHALL 为 Windows NSIS 安装器提供中文语言支持。

#### Scenario: 安装器语言选择
- **WHEN** 用户运行 NSIS 安装程序
- **THEN** 显示语言选择器，支持简体中文和英文

### Requirement: Tauri 更新端点加速
系统 SHALL 为 Tauri Updater 配置 ghproxy 镜像加速端点。

#### Scenario: 更新端点配置
- **WHEN** Tauri 桌面端检查更新
- **THEN** 优先访问 ghproxy 镜像端点，失败后回退到 GitHub 直连端点

## MODIFIED Requirements

### Requirement: Demo 应用入口集成更新检查
Demo 应用的 `App.tsx` SHALL 在页面顶部集成 `TauriUpdateBanner` 和 `UpdateChecker` 组件，实现多平台版本更新提示。

### Requirement: Vite 构建注入版本号
Demo 应用的 `vite.config.ts` SHALL 通过 `define` 选项注入 `__APP_VERSION__` 全局常量，值为 `package.json` 中的版本号。

### Requirement: Capacitor 配置完善
Demo 应用的 `capacitor.config.ts` SHALL 增加 SplashScreen 配置和 `androidScheme: 'https'` 设置。

## REMOVED Requirements
无
