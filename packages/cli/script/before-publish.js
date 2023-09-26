const { join } = require('path')
const fs = require('fs-extra')
const { init, parse } = require('es-module-lexer')

async function getModules(path) {
  const items = await fs.readdir(path)
  const folders = []

  for (const item of items) {
    const itemPath = `${path}/${item}`
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      // 如果是文件夹，则将文件夹名添加到数组中
      folders.push(item)
    }
  }

  return folders
}

async function getFiles(path) {
  const items = await fs.readdir(path)
  const files = []

  for (const item of items) {
    const itemPath = `${path}/${item}`
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      for (const i of await getFiles(itemPath))
        files.push(i)
    }

    if (stats.isFile() && item.endsWith('.ts')
    ) {
      // 如果是文件夹，则将文件夹名添加到数组中
      files.push(item)
    }
  }

  return files
}

async function analyse(path, set) {
  await init
  set.add(path)

  const content = (await fs.readFile(path)).toString()
  const [imports] = parse(content, 'optional-sourcename')
  for (const i of imports) {
    if (i.n && i.n.startsWith('.')) {
      const importPath = join(path, '../', i.n.endsWith('.ts') ? i.n : `${i.n}.ts`)
      await analyse(importPath, set)
    }
  }
  return set
}

async function copyAndAnalysePkg(modulesDir) {
  const modules = await getModules(modulesDir)
  const copiedFiles = new Set()
  const dependences = {}
  for (const module of modules) {
    dependences[module] = []
    const moduleDir = join(modulesDir, module)
    const files = await getFiles(moduleDir)
    const set = new Set()
    for (const file of files)
      await analyse(join(moduleDir, file), set)

    for (const i of set.values()) {
      if (!copiedFiles.has(i)) {
        copiedFiles.add(i)
        const filePath = i.slice(6)
        dependences[module].push(filePath)
        fs.copy(i, join('../template', filePath))
      }
    }
  }
  return dependences
}
async function start(pkgs) {
  await fs.remove('../template')
  const ret = { graph: {} }
  for (const pkg of pkgs) {
    const dependences = await copyAndAnalysePkg(`../../${pkg}/src/modules`)
    ret.graph[pkg] = dependences
  }
  await fs.writeJSON('../template/data.json', ret)
  // eslint-disable-next-line no-console
  console.log('success!!')
}

start(['backend'])
