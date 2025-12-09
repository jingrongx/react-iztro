import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 优化构建输出
    outDir: 'dist',
    sourcemap: false,
    // 分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'iztro-vendor': ['iztro', 'react-iztro'],
        },
      },
    },
    // 压缩配置
    minify: 'esbuild',
    // 资源文件大小警告阈值（KB）
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
  },
})
