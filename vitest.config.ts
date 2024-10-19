import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: [
        'coverage/**',
        'dist/**',
        '**\/*.d.ts',
        'test?(s)/**',
        '**/*.config.?(c|m)[jt]s?(x)',
        'playground',
      ],
      enabled: true,
      reporter: ['json-summary', 'text'],
    },
  },
})
