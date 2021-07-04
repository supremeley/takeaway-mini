import request from '@/utils/request.js'

export const APPLY_WITH_DRAWAL = (data) => request.post('brokerage/applyWithdrawal', data)

