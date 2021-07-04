import request from '@/utils/request.js'

// export function login(data) {
//   return request.post('/auth/login_by_weixin', data)
// }
export const WECHAT_LOGIN = (data) => request.post('auth/login_by_weixin', data, { noToken: true })

export const DECRYPT_PHONE = (data) => request.post('auth/decryptPhone', data)

// // 获取用户手册/声明
// const GET_AGREEMENT = (type) =>
//   fetch.get(`api_v1/edu/educonfig/detail/${type}`)


//   const WX_LOGIN = (date, header) =>
//   fetch.main('api_v1/wechat/auth/login', 'POST', date, header)

//   // 上传头像
// const UPLOAD_IMG = (filePath, data) =>
// fetch.upload(`api_v1/edu/profile/upload`, filePath, data)
