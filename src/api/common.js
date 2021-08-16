import request from '@/utils/request.js'

export const UPLOAD_IMG = (filePath, data) =>
request.upload(`storage/upload`, filePath, data)
