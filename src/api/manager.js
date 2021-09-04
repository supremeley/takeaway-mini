import request from '@/utils/request.js'

export const SET_REFINED_POSTS = (data) => request.get('wnh/hot/refinedPaste', data, { type: 'forum' })

export const SET_TOP_POSTS = (data) => request.get('wnh/hot/beTop', data, { type: 'forum' })

export const SET_HOT_POSTS = (data) => request.get('wnh/hot/beHot', data, { type: 'forum' })

export const ADD_ACCOUNT = (data) => request.post('wnh/authentication/addVirtualAccount', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_ACCOUNT_LIST = (data) => request.get('wnh/authentication/selectVirAccount', data, { type: 'forum' })

export const CHANGE_ACCOUNT = (data) => request.get('wnh/authentication/changeVirAccount', data, { type: 'forum' })

export const BE_BAN_USER = (data) => request.get('wnh/me/banAccount', data, { type: 'forum' })
