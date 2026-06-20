import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base precisa bater com o nome do repo pra funcionar no GitHub Pages de projeto:
// https://sousxa.github.io/linus-first/
export default defineConfig({
  base: '/linus-first/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
