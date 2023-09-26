import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import fs from 'fs-extra'
import cac from 'cac'
import axios from 'axios'
import { loadConfig } from 'unconfig'
import fg from 'fast-glob'
import pkg from '../package.json'
import { log } from './utils'

const cli = cac('megrez')
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const globalConfig = require('./assets/megrez.json')

const request = axios.create({
  baseURL: globalConfig.baseUrl,
})
request.interceptors.request.use((config) => {
  if (globalConfig.token)
    config.headers.Authorization = globalConfig.token
  return config
})

function writeConfig() {
  fs.writeFileSync(resolve(__dirname, '../assets/megrez.json'), JSON.stringify(globalConfig))
}

async function getConfig(file = 'megrez') {
  try {
    const { config } = await loadConfig({
      sources: [
        {
          files: file,
          // default extensions
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'],
        },

      ],

      merge: false,
    })
    return {
      ...globalConfig, ...(config as any),
    }
  }
  catch (e) {
    return globalConfig
  }
}

async function handleAssets(files: string[], cb?: (...args: any) => any) {
  const ret: any = []
  for (const i of files) {
    try {
      if (cb)
        ret.push(await cb(i))
    }
    catch (e) {
      console.log(e)
      log(`exit when handling file--'${i}'`, 'red')
    }
  }
  return ret
}

cli.command('upload <glob>', 'handle assets and store metadata').action(
  async (glob = '*') => {
    const config = await getConfig()
    const files = await fg(glob)
    const ret = await handleAssets(files, config.handleAsset)
    if (ret.length) {
      try {
        await request.post('/asset', ret)
        log('upload metadata successfully')
      }
      catch (e) {
        console.log(e)
        log('upload failed', 'red')
      }
    }
    else {
      log('no asset to handle', 'grey')
    }
  })

cli.command('team', 'select team')
  .option('-t,--team <team>', 'select team')

  .action(async ({ team }: { team: string }) => {
    const { data: teams } = await request.get('/team')
    if (team) {
      const id = teams.find((item: any) => item.name === team || item.id === team)?._id
      if (!id) {
        log('不存在对应的team', 'red')
        return
      }
      if (globalConfig.team?.id !== id) {
        globalConfig.team = { name: team, id }
        globalConfig.namespace = undefined
        writeConfig()
      }
      log(`选中team--${team} (id:${id})`)
    }
    else {
      log('以下为所有team')
      console.table(teams.map(({ name, _id }: any) => {
        return {
          name,
          id: _id,
        }
      }))
    }
  })

cli.command('namespace', 'select namespace')
  .option('-n,--namespace <namespace>', 'select namespace')
  .action(async ({ namespace }: { namespace: string }) => {
    if (!globalConfig.team) {
      log('未选中team', 'red')
      return
    }
    const { data: namespaces } = await request.get(`/namespace/team?team=${globalConfig.team.id}`)

    if (namespace) {
      const id = namespaces.find((item: any) => item.name === namespace || item.id === namespace)?._id
      if (!id) {
        log('不存在对应的namespace', 'red')

        return
      }
      if (globalConfig.namespace?.id !== id) {
        globalConfig.namespace = { name: namespace, id }
        writeConfig()
      }
      log(`选中team--${namespace} (id:${id})`)
    }
    else {
      log(`以下为命名空间${globalConfig.team.name}的所有资产`)
      console.table(namespaces.map(({ description, name, _id }: any) => {
        return {
          name,
          id: _id,
          description,

        }
      }))
    }
  })

cli.command('asset')
  .option('-a,--asset <asset>', 'select asset')

  .action(async ({ asset }: {
    asset: string
  }) => {
    if (!globalConfig.namespace) {
      log('未选中命名空间', 'red')
      return
    }
    const { data: assets } = await request.get(`/asset/${globalConfig.namespace.id}`)

    if (asset) {
      const item = assets.find((item: any) => item.name === asset || item._id === asset)
      if (!item) {
        log(`不存在资产--${asset}`)
        process.exit(0)
      }
      item.invoker = [{
        a: 'fgs',
      }]
      console.table(item)
    }
    else {
      log(`以下为命名空间${globalConfig.namespace.name}的所有资产`)
      console.table(assets.map(({ description, name, category, _id }: any) => {
        return {
          category,
          name,
          description,
          id: _id,
        }
      }))
    }
  })

cli.command('generate <module>')
  .alias('g')
  .option('-p,--pkg <pkg>', '', { default: 'typegoose' })
  .option('-d,--dir <dir>', '', { default: '' }).action((module, { pkg, dir }) => {
    const { graph } = require(resolve(__dirname, '../template/data.json'))
    for (const path of graph[pkg][module]) {
      const dest = resolve(process.cwd(), dir, path)
      if (!fs.existsSync(dest))
        fs.copy(resolve(__dirname, '../template', path), dest)
    }
    log(`生成${pkg}下的${module}模块`)
  })
cli.help()
cli.version(pkg.version)

cli.parse()
