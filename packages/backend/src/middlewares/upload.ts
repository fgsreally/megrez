import multer from 'multer'
export const uploadMiddleware = multer({ dest: 'uploads/' }).single('file')
// 定义上传文件的路由
