import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// No build, base bate com o nome do repo pra funcionar no GitHub Pages de projeto
// (https://sousxa.github.io/linus-first/). Em dev fica na raiz pra facilitar o preview.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/linus-first/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
