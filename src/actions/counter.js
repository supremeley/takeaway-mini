import {
  SET_COUPONLIST,
  SET_PROVE_INFO,
  SET_POSTS_INFO
} from '@/constants/counter'

export const setCouponlist = (list) => {
  return {
    type: SET_COUPONLIST,
    list
  }
}

export const setProveInfo = (info) => {
  return {
    type: SET_PROVE_INFO,
    info
  }
}


export const setPostsInfo = (info) => {
  return {
    type: SET_POSTS_INFO,
    info
  }
}
