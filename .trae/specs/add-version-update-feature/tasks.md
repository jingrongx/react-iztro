# Tasks

- [x] Task 1: Vite 构建配置 - 注入版本号和类型声明
  - [x] SubTask 1.1: 修改 `demo/vite.config.ts`，添加 `define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0') }`
  - [x] SubTask 1.2: 创建 `demo/src/vite-env.d.ts`，声明 `declare const __APP_VERSION__: string`

- [x] Task 2: 创建下载链接工具函数
  - [x] SubTask 2.1: 创建 `demo/src/lib/downloadUtils.ts`，实现 APK/EXE 的 GitHub 直链和 ghproxy 镜像链接生成函数

- [x] Task 3: 创建 openUrl 工具函数
  - [x] SubTask 3.1: 创建 `demo/src/lib/openUrl.ts`，兼容 Tauri 和浏览器环境打开外部链接

- [x] Task 4: 创建 useTauriUpdater Hook
  - [x] SubTask 4.1: 创建 `demo/src/hooks/useTauriUpdater.ts`，实现 Tauri 桌面端更新检测、下载安装、进度跟踪、错误处理

- [x] Task 5: 创建 UpdateChecker 组件（Web/Android 端更新检查）
  - [x] SubTask 5.1: 创建 `demo/src/components/UpdateChecker.tsx`，通过 GitHub API 检查更新，显示更新横幅和版本信息

- [x] Task 6: 创建 TauriUpdateBanner 组件（Tauri 桌面端更新横幅）
  - [x] SubTask 6.1: 创建 `demo/src/components/TauriUpdateBanner.tsx`，使用 useTauriUpdater Hook，显示更新横幅和下载进度

- [x] Task 7: 修改 App.tsx 集成更新组件
  - [x] SubTask 7.1: 在 `demo/src/App.tsx` 中导入并添加 `TauriUpdateBanner` 和 `UpdateChecker` 组件

- [x] Task 8: 完善 Capacitor 配置
  - [x] SubTask 8.1: 修改 `demo/capacitor.config.ts`，增加 SplashScreen 配置和 `androidScheme: 'https'`
  - [x] SubTask 8.2: 修改 `demo/android/app/build.gradle`，增加签名配置、版本号同步、APK 文件名自定义

- [x] Task 9: 初始化 Tauri v2 桌面端项目
  - [x] SubTask 9.1: 创建 `demo/src-tauri/` 目录结构
  - [x] SubTask 9.2: 创建 `demo/src-tauri/tauri.conf.json`，配置窗口、打包、更新端点
  - [x] SubTask 9.3: 创建 `demo/src-tauri/Cargo.toml`，配置 Rust 依赖
  - [x] SubTask 9.4: 创建 `demo/src-tauri/src/main.rs` 和 `demo/src-tauri/src/lib.rs`
  - [x] SubTask 9.5: 创建 `demo/src-tauri/build.rs`
  - [x] SubTask 9.6: 创建 `demo/src-tauri/icons/` 目录及图标文件（使用 Tauri 默认图标）
  - [x] SubTask 9.7: 创建 `demo/nsis-simpchinese.nsh` NSIS 安装器中文化文件

- [x] Task 10: 更新 package.json 依赖和脚本
  - [x] SubTask 10.1: 在 `demo/package.json` 中添加 Tauri 相关依赖（@tauri-apps/api、@tauri-apps/cli、@tauri-apps/plugin-updater、@tauri-apps/plugin-opener）
  - [x] SubTask 10.2: 在 `demo/package.json` 中添加 tauri 相关脚本（tauri、tauri:dev、tauri:build）

- [x] Task 11: 创建 CI/CD 工作流
  - [x] SubTask 11.1: 创建 `.github/workflows/release.yml`，包含 Android APK 构建 Job 和 Windows Tauri 构建 Job

# Task Dependencies
- [Task 1] 是 [Task 5] 的前置依赖（UpdateChecker 使用 __APP_VERSION__）
- [Task 2] 是 [Task 5] 的前置依赖（UpdateChecker 可使用 downloadUtils）
- [Task 3] 是 [Task 5] 的前置依赖（UpdateChecker 使用 openUrl）
- [Task 4] 是 [Task 6] 的前置依赖（TauriUpdateBanner 使用 useTauriUpdater）
- [Task 4] 是 [Task 3] 的前置依赖（openUrl 使用 isTauri）
- [Task 5, Task 6] 是 [Task 7] 的前置依赖（App.tsx 集成更新组件）
- [Task 9] 是 [Task 10] 的前置依赖（Tauri 项目需要依赖声明）
- [Task 9, Task 10] 是 [Task 11] 的前置依赖（CI/CD 需要 Tauri 项目和依赖）
- [Task 1, Task 2, Task 3, Task 4] 可并行执行
