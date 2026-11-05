import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Important: Ensures assets load correctly on GitHub Pages (sub-paths)
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: false
  }
})
