import {
  SET_COUPONLIST,
} from '@/constants/counter'

export const setCouponlist = (list) => {
  return {
    type: SET_COUPONLIST,
    list
  }
}


