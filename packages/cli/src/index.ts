import { PassThrough } from 'stream'
import archiver from 'archiver'
import axios from 'axios'
export async function uploadFilesAsZip(sourceFiles: string[], targetFileName: string, uploadUrl: string): Promise<void> {
  const output =new PassThrough()
  const archive = archiver('zip', { zlib: { level: 9 } })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  for (const file of sourceFiles)
    archive.file(file, { name: file })

  archive.finalize()

  const data = new FormData()
  data.append('file', output.read(), targetFileName)

  try {
    const response = await axios.post(uploadUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Upload successful!')
    console.log(response.data)
  }
  catch (error) {
    console.error('Upload failed:', error)
  }
}

// 调用示例
// const sourceFiles = ['/path/to/file1', '/path/to/file2', '/path/to/file3'] // 指定要压缩的文件数组
// const targetFileName = 'output.zip' // 指定目标压缩文件名
// const uploadUrl = 'http://your-express-route-url' // 指定Express路由的URL

// uploadFilesAsZip(sourceFiles, targetFileName, uploadUrl)
//   .then(() => console.log('Done'))
//   .catch(err => console.error(err))
