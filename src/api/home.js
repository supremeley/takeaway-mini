import request from '@/utils/request.js'

export const GET_AREA_LIST = () => request.get('address/allArea')

export const GET_SCHOOL_LIST = (data) => request.post('address/school', data)

export const GET_FLOOR_LIST = (data) => request.get('address/building', data)

export const GET_HOME_INDEX = (data) => request.get('home/index', data)

export const GET_HOME_BANNER = (data) => request.get('banner/getBannerConfig', data, { type: 'admin' },)
