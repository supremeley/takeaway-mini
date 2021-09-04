import request from '@/utils/request.js'

export const GET_ERRANDS_LIST = (data) => request.get('wnh/run/selectAll', data, { type: 'forum' })

export const CREATE_ERRANDS = (data) => request.post('wnh/run/addRunErrands', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
})

