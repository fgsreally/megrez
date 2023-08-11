import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import cac from 'cac'
import axios from 'axios'
import { loadConfig } from 'unconfig'
import fg from 'fast-glob'
import pkg from '../package.json'

const cli = cac('megrez')
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const globalConfig = require('../assets/megrez.json')
async function getConfig(file = 'megrez') {
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

  return Object.assign(globalConfig, config)
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

cli.command('run <glob>', 'handle assets and store metadata').action(
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

cli.help()
cli.version(pkg.version)

cli.parse()
