import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    Unocss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'unuse-ui': ['unuse-ui'],
        },
      },
    },
  },
})
