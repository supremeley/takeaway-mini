import request from '@/utils/request.js'

export const GET_BRAND_LIST = (data) => request.get('brand/list', data)

export const GET_BRAND_DETAIL = (data) => request.get('brand/detail', data)
