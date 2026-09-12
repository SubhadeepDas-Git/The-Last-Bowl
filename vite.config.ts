import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/The-Last-Bowl/', // Ensures assets resolve properly on GitHub Pages sub-paths
  plugins: [
    tailwindcss(),
    react(),
  ],
})