import request from '@/utils/request.js'

export const GET_GOODS_LIST = (data) => request.get('goods/list', data)

export const GET_GOODS_DETAIL = (data) => request.get('goods/detail', data)
