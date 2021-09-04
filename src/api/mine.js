import request from '@/utils/request.js'

export const GET_PERSON_INFO = (data) => request.get('wnh/me/personal', data, { type: 'forum' })

export const GET_PERSON_HISTORY = (data) => request.get('wnh/me/listhat', data, { type: 'forum' })

export const CHANGE_FOLLOW_PERSON = (data) => request.get('wnh/letter/changeFollow', data, {
  type: 'forum',

})

export const UPDATE_PERSON_SIGN = (data) => request.post('wnh/me/updateMySing', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})


export const UPDATE_PERSON_BG = (data) => request.post('wnh/me/chageBackgroundImg', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const CHECK_USER_IS_FOLLOW = (data) => request.get('wnh/letter/selectSimUser', data, { type: 'forum' })

export const GET_FOLLOW_LIST = (data) => request.get('wnh/me/myfollows', data, { type: 'forum' })

export const GET_FANS_LIST = (data) => request.get('wnh/me/myfans', data, { type: 'forum' })

export const GET_MINE_INTEGRAL = (data) => request.get('wnh/me/mypoint', data, { type: 'forum' })

export const GET_MINE_BALANCE = (data) => request.get('wnh/me/myamount', data, { type: 'forum' })

export const RECHARGE_INTEGRAL = (data) => request.post('wnh/startWXunifiedOrder', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const ORDER_QUERY_WXPAY = (data) => request.post('wnh/orderqueryWXpay', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_MINE_COMMENT = (data) => request.get('wnh/me/mycomments', data, { type: 'forum' })

export const GET_MINE_LIKE = (data) => request.get('wnh/me/myfabulous', data, { type: 'forum' })

export const GET_MINE_COMMENT_BY_USER = (data) => request.get('wnh/me/commentsmy', data, { type: 'forum' })

export const GET_MINE_LIKE_BY_USER = (data) => request.get('wnh/me/fabulousMy', data, { type: 'forum' })

export const SET_NODISTURB = (data) => request.get('wnh/blackList/noDisturb', data, { type: 'forum' })

export const GET_NODISTURB = (data) => request.get('wnh/blackList/isEnableDisturb', data, { type: 'forum' })

export const SET_SECRECY = (data) => request.get('wnh/me/setSecrecy', data, { type: 'forum' })

export const GET_SECRECY = (data) => request.get('wnh/me/getSecrecy', data, { type: 'forum' })

export const APPLY_FLOOR = (data) => request.post('wnh/authentication/applyFloor', data, {
  type: 'forum', header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
