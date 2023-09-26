import fs from 'fs'
import { join } from 'path'
import type { ServerCtx } from 'phecda-server'
import { Controller, Get, Middle, NotFoundException, Param, Post, UndefinedException } from 'phecda-server'
import unzipper from 'unzipper'
@Middle('upload')
@Controller('/file')
// @Middleware
export class FileController {
  context!: ServerCtx

  @Get('/:filename')
  async getFile(@Param('filename') filename: string) {
    const { response: res } = this.context
    const filePath = join(__dirname, 'uploads', filename)

    if (!fs.existsSync(filePath))
      throw new NotFoundException('')

    res.sendFile(filePath)
  }

  @Post('')
  async upload() {
    const { request: { file: { path, mimetype } } } = this.context as any
    if (path)
      return true
    // 判断上传的文件是否是zip压缩文件
    if (mimetype !== 'application/zip') {
      fs.unlinkSync(path) // 删除上传的文件
      throw new UndefinedException('')
    }

    // 解压缩上传的文件
    const targetFolder = 'target-folder' // 目标文件夹
    const extractStream = fs.createReadStream(path).pipe(unzipper.Extract({ path: targetFolder }))

    // 监听解压缩完成事件
    await new Promise<void>((resolve, reject) => {
      extractStream.on('close', () => {
        fs.unlinkSync(path) // 删除上传的文件
        resolve()
      })
      extractStream.on('error', (e: Error) => {
        fs.unlinkSync(path) // 删除上传的文件

        reject(new UndefinedException(e.message))
      })
    })

    return 'Upload and extract successfully'
  }
}
