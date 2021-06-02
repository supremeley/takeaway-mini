import request from '@/utils/request.js'

export const GET_AREA_LIST = () => request.get('address/area')

export const GET_SCHOOL_LIST = (data) => request.post('address/school', data)

export const GET_FLOOR_LIST = (data) => request.get('address/building', data)


