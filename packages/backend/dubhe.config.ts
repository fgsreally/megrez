import type { PubConfig } from 'dubhe-pub'
import pkg from './package.json'
export default {
  project: 'viteout',
  entry: {
    main: 'src/controller/index.ts'
  },
  types: true,
  // limit: 1000,
  externals: (id) => {
    if (id in pkg.dependencies)
      return true
  },
  app: false,
  HMR: [],
  outDir: '.dubhe',
  source: true,
} as PubConfig

