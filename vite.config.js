import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 开发服务器配置（解决跨域）
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://8.148.217.172:8080', // 移除末尾 /
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/club': {
        target: 'http://8.148.217.172:8080/api', 
        changeOrigin: true,
        timeout: 15000 // 进一步延长公网请求超时时间
      },
      '/activity': {
        target: 'http://8.148.217.172:8080/api', 
        changeOrigin: true,
        timeout: 15000
      }
    }
  }
})
