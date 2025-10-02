import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/teenfin-mockup/', // <- dôležité pre GitHub Pages
  plugins: [react()],
})
