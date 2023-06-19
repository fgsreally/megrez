import type { PluginOption } from 'vite'

export function createMegrezPlugin(): PluginOption {
  return {
    name: 'megrez',
    configureServer(server) {
      const {
        ws,
        printUrls,
        config: {
          server: { https, port },
        },
      } = server

      server.printUrls = () => {
        const colorUrl = (url: string) =>
          colors.green(
            url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`),
          )
        const host
        = server.resolvedUrls?.local[0].replace(/\/$/, '')
        || `${https ? 'https' : 'http'}://localhost:${port || '5173'}`

        printUrls()
        console.log(
        `  ${colors.green('➜')}  ${colors.bold('Dubhe')}: ${colorUrl(
          `${host}/__dubhe/`,
        )}`,
        )
      }
    },
  }
}
