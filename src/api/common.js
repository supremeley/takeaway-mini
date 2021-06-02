import request from '@/utils/request.js'

export const UPLOAD_IMG = (filePath, data) =>
request.upload(`storage/create`, filePath, data)
