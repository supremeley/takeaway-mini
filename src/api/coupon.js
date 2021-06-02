import request from '@/utils/request.js'

export const RECEIVE_COUPON = (data) => request.post('coupon/receive', data)

export const GET_COUPON_LIST_BY_OWN = (data) => request.get('coupon/mylist', data)
