import request from '@/utils/request.js'

export const GET_CHAT_LIST = (data) => request.get('wnh/chat/selectChatList', data, { type: 'forum' })

export const GET_CHAT_LIST_BY_USER = (data) => request.get('wnh/chat/findByUserAndReceive', data, {
  type: 'forum',

})

export const SEND_CHAT = (data) => request.post('wnh/chat/sendMsg', data, {
  type: 'forum', header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})


export const CLEAR_CHAT = (data) => request.get('wnh/chat/clearChat', data, { type: 'forum' })

export const SELECT_NEW_CHAT = (data) => request.get('wnh/chat/selectNews', data, { type: 'forum' })

