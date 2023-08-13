import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import fs from 'fs'
import cac from 'cac'
import axios from 'axios'
import { loadConfig } from 'unconfig'
import fg from 'fast-glob'
import pkg from '../package.json'

const request = axios.create({

})
const cli = cac('megrez')
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const globalConfig = require('../assets/megrez.json')

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
      console.log(`exit when handling file--'${i}'`)
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
        await axios.post(config.baseUrl, ret, {
          headers: {
            Authorization: config.token,
          },
        })
        console.log('upload metadata successfully')
      }
      catch (e) {
        console.log(e)
        console.log('upload failed')
      }
    }
    else {
      console.log('no asset to handle')
    }
  })

cli.command('team <team>').action(async (team: string) => {
  const config = await getConfig()
  const { data } = await request.get(new URL('/teams', config.baseUrl).href)
  if (team) {

    const id= data.find((item: any) => item.name === team)?._id
   
    if (!id) {
      console.error()
      return
    }
    globalConfig.team={name:team,id}
    writeConfig()
  }
  console.table(data)
})

cli.command('namespace <namespace>').action(async (namespace: string) => {
  const config = await getConfig()
  const { data } = await request.get(new URL('/namespace', config.baseUrl).href)
  console.table(data)

  if (namespace) {
    globalConfig.namespace = data.find((item: any) => item.name === namespace)?._id
    if (!globalConfig.team) {
      console.error()
      return
    }
    writeConfig()
  }
})

cli.command('asset <asset>').action(async (asset: string) => {
  const config = await getConfig()
  const { data: assets } = await request.get(new URL('/asset', config.baseUrl).href)

  if (asset) {
    const id=
    const { data } = await request.get(new URL(`/asset?namespace=${namespace}`, config.baseUrl).href)
  }
  else {
    console.table(assets)
  }
})

cli.help()
cli.version(pkg.version)

cli.parse()
