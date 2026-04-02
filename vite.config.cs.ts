import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'STAY_A_WHILE_AND_LISTEN',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    outDir: 'dist',
  },
})
