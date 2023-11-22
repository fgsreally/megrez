import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/bridge.ts', 'src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,

}
