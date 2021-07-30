import request from '@/utils/request.js'

export const WECHAT_LOGIN = (data) => request.post('auth/login_by_weixin', data, { noToken: true })

export const DECRYPT_PHONE = (data) => request.post('auth/decryptPhone', data)

export const GET_USER_BALANCE = (data) => request.get('user/main', data)

export const GET_BILL_LIST = (data) => request.get('user/getUserAccountTrace', data)

