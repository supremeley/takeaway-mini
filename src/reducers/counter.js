import { SET_COUPONLIST } from "@/constants/counter";

const INITIAL_STATE = {
  couponList: [],
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_COUPONLIST:
      return {
        ...state,
        couponList: action.list,
      };
    default:
      return state;
  }
}
