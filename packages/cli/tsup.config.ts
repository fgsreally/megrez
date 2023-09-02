import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,

}
