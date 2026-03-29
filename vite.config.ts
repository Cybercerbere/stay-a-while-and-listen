import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'POC_SPEECHIFY',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    outDir: 'dist',
  },
})
