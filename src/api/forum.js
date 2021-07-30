import request from '@/utils/request.js'

export const WECHAT_LOGIN = (data) => request.post('wnh/authentication/uploadInfo', data, { type: 'forum' })

export const DECRYPT_PHONE = (data) => request.post('wnh/authentication/isApproved', data, { type: 'forum' })

export const GET_USER_BALANCE = (data) => request.get('wnh/authentication/CertificationList', data, { type: 'forum' })

export const GET_BILL_LIST = (data) => request.get('wnh/authentication/CertificationList', data, { type: 'forum' })
