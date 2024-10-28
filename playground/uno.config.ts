import { defineConfig, presetIcons, presetUno } from 'unocss'
import { presetUnuse } from 'unuse-ui'

export default defineConfig({
  presets: [
    presetIcons({
      prefix: 'icon-',
      scale: 1,
      warn: true,
    }),
    presetUno(),
    presetUnuse(),
  ],
  content: {
    pipeline: {
      include: [/.*\/unuse-ui\.js(.*)$/, './**/*.vue'],
    },
  },
})
