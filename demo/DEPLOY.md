# Vercel 部署指南

本文档介绍如何将紫微斗数应用部署到 Vercel 平台。

## 📋 前置要求

- Node.js 16+ 已安装
- npm 或 yarn 包管理器
- Git 版本控制（用于 GitHub 集成部署）
- Vercel 账号（访问 [vercel.com](https://vercel.com) 注册）

## 🚀 部署方式

### 方式一：通过 Vercel CLI 部署（推荐用于快速测试）

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel 账号

```bash
vercel login
```

按提示完成登录流程。

#### 3. 部署到生产环境

在项目目录下执行：

```bash
cd d:\code\react-iztro\demo
vercel --prod
```

首次部署时，Vercel 会询问一些配置问题：
- **Set up and deploy?** → Yes
- **Which scope?** → 选择你的账号
- **Link to existing project?** → No (首次部署)
- **Project name?** → 输入项目名称（如：ziwei-astrolabe）
- **In which directory is your code located?** → `./` (当前目录)

部署完成后，CLI 会显示部署的 URL。

#### 4. 后续更新

每次代码更新后，只需再次运行：

```bash
vercel --prod
```

---

### 方式二：通过 GitHub 自动部署（推荐用于持续部署）

#### 1. 将代码推送到 GitHub

如果还没有 Git 仓库：

```bash
cd d:\code\react-iztro
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

#### 2. 在 Vercel 中导入项目

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击 **Import Git Repository**
3. 选择你的 GitHub 仓库（可能需要先授权 Vercel 访问 GitHub）
4. 配置项目设置：
   - **Root Directory**: `demo` （重要！指定项目根目录）
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. 点击 **Deploy**

#### 3. 自动部署

配置完成后，每次向 GitHub 推送代码时，Vercel 会自动：
- 检测到新的提交
- 拉取最新代码
- 执行构建
- 部署到生产环境

---

## 🔧 配置说明

### vercel.json

项目已配置 `vercel.json` 文件，包含以下设置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [...]  // SPA 路由支持
}
```

### 环境变量（如需要）

如果项目需要环境变量，可以在 Vercel 控制台配置：

1. 进入项目设置 → **Environment Variables**
2. 添加变量，例如：
   - `VITE_API_URL`: API 地址
   - `VITE_APP_TITLE`: 应用标题

3. 在代码中通过 `import.meta.env.VITE_变量名` 访问

---

## 📦 本地测试生产构建

在部署前，建议先在本地测试生产构建：

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

访问显示的本地 URL（通常是 http://localhost:4173），检查应用是否正常工作。

---

## 🌐 自定义域名

部署成功后，可以配置自定义域名：

1. 进入 Vercel 项目控制台
2. 点击 **Settings** → **Domains**
3. 添加你的域名
4. 按照提示配置 DNS 记录

---

## 🐛 常见问题

### 构建失败

**问题**：部署时提示构建错误

**解决方案**：
1. 检查本地 `npm run build` 是否成功
2. 查看 Vercel 构建日志，定位具体错误
3. 确保所有依赖都在 `package.json` 的 `dependencies` 中

### 路由 404 错误

**问题**：刷新页面时出现 404

**解决方案**：
- 确认 `vercel.json` 中的 `rewrites` 配置正确
- SPA 应用需要将所有路由重定向到 `index.html`

### 静态资源加载失败

**问题**：CSS、JS 文件 404

**解决方案**：
1. 检查 `vite.config.ts` 中的 `base` 配置
2. 如果使用自定义域名，确保 `base` 设置为 `/`

---

## 📊 性能优化

项目已配置以下优化：

✅ **代码分割**：React 和 iztro 库独立打包
✅ **静态资源缓存**：Assets 设置为 1 年缓存
✅ **esbuild 压缩**：快速高效的代码压缩
✅ **无 sourcemap**：减小生产包体积

---

## 📞 获取帮助

- Vercel 文档：https://vercel.com/docs
- Vite 文档：https://vitejs.dev/
- 项目问题：提交 GitHub Issue

---

**部署状态检查**

部署完成后，可以通过以下方式检查：

1. **功能测试**：输入生辰八字，生成紫微斗数图表
2. **性能测试**：使用 Lighthouse 检查性能得分
3. **移动端测试**：在不同设备上验证响应式布局

祝部署顺利！🎉
