import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This captures any request starting with /api
        target: 'http://localhost:5000', // This sends it to your Node server
        changeOrigin: true,
        secure: false,
      }
    }
  }
})