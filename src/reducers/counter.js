import { SET_COUPONLIST, SET_PROVE_INFO, SET_POSTS_INFO } from "@/constants/counter";

const INITIAL_STATE = {
  couponList: [],
  proveInfo: null,
  postsInfo: null

};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_COUPONLIST:
      return {
        ...state,
        couponList: action.list,
      };
    case SET_PROVE_INFO:
      return {
        ...state,
        proveInfo: action.info,
      };
    case SET_POSTS_INFO:
      return {
        ...state,
        postsInfo: action.info,
      };
    default:
      return state;
  }
}
