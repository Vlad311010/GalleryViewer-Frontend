import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/contract'),
      '@comp': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles')
    },
  }
})
