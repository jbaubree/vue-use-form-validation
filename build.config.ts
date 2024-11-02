import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  rollup: {
    esbuild: {
      minify: true,
    },
    emitCJS: true,
  },
  failOnWarn: false,
})
