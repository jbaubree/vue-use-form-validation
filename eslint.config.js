// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
  },
  {
    files: ['**.config.ts'],
    rules: {
      'ts/no-require-imports': 'off',
    },
  },
)
