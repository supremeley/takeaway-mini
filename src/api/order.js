import request from '@/utils/request.js'

export const GET_ORDER_LIST = (data) => request.get('order/list', data)

export const GET_ORDER_DETAIL = (data) => request.get('order/detail', data)

export const SUBMIT_ORDER = (data) => request.post('order/submit', data)

// export const get_school_list = (data) => request.post('address/school', data)


