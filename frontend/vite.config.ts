import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-server proxy only. It is not part of the production build, so this
// localhost target never ships. The app itself talks to the backend via
// API_BASE_URL (src/config.ts), so this proxy is a local-dev convenience.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        changeOrigin: true,
      }
    }
  }
})
