import request from '@/utils/request.js'

export const SUMBIT_PROVER = (data) => request.post('wnh/authentication/uploadInfo', data, {
  type: 'forum', header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
})

export const CHECK_PROVER = (data) => request.post('wnh/authentication/isApproved', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  needUserId: true,
  userIdName: "id"
})

export const GET_USER_BALANCE = (data) => request.get('wnh/authentication/CertificationList', data, { type: 'forum' })

// export const GET_BILL_LIST = (data) => request.get('wnh/authentication/CertificationList', data, { type: 'forum' })

export const GET_AGREEMENT = (data) => request.get('wnh/clause/selectInfo', data, { type: 'forum' })
