const DEFAULT_CONFIG = {
  filePath: './dist/index.d.ts',
  noCheck: true,
  libraries: {
    inlinedLibraries: require('./constants.ts').EXTERNAL_LIBRARIES,
  },
}

const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    { ...DEFAULT_CONFIG, outFile: './dist/index.d.ts' },
    { ...DEFAULT_CONFIG, outFile: './dist/index.d.mts' },
    { ...DEFAULT_CONFIG, outFile: './dist/index.d.cts' },
  ],
}

module.exports = config
