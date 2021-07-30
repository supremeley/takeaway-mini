import request from '@/utils/request.js'

export const GET_RECHARGE_CONFIG = (data) => request.get('order/rechargeConfig', data)

export const SUBMIT_RECHARGE = (data) => request.post('order/rechargeOrder', data)

