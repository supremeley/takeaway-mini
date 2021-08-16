import request from '@/utils/request.js'

export const GET_ORDER_LIST = (data) => request.get('order/list', data)

export const GET_ORDER_DETAIL = (data) => request.get('order/detail', data)

export const SUBMIT_ORDER = (data) => request.post('order/submit', data)

export const SUBMIT_PREPAY = (data) => request.post('order/prepay', data)

export const ORDER_CONFIRM = (data) => request.post('order/confirm', data)

export const ORDER_CANCEL = (data) => request.post('order/cancel', data)

export const ORDER_REFUND = (data) => request.post('order/refund', data)

export const ORDER_REFUND_APPLY = (data) => request.post('order/refundApply', data)

export const GET_REFUND_ORDER_DETAIL = (data) => request.get('order/preOrderRefund', data)

