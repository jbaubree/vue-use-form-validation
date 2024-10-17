import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  externals: [
    'joi',
    'superstruct',
    'valibot',
    'yup',
    'zod',
  ],
  rollup: {
    esbuild: {
      minify: true,
    },
    emitCJS: true,
  },
})
