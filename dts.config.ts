const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: './dist/index.mts',
      noCheck: true,
      libraries: {
        inlinedLibraries: [
          'joi',
          'superstruct',
          'valibot',
          'yup',
          'zod',
        ],
      },
      outFile: './dist/index.d.mts',
    },
  ],
}

module.exports = config
