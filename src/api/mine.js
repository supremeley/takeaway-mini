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

