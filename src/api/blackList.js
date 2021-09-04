import request from '@/utils/request.js'

export const GET_BLACKLIST = (data) => request.get('wnh/blackList/myblack', data, { type: 'forum' })

export const CHANGE_BLACK = (data) => request.get('wnh/blackList/changeFollow', data, { type: 'forum' })

