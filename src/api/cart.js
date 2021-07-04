import request from '@/utils/request.js'

export const GET_CART_DETAIL = (data) => request.get('cart/index', data)

export const GET_GOODS_COUNT_IN_CART = (data) => request.get('cart/goodscount', data)

// export const UPDATE_GOODS_COUNT_IN_CART = (data) => request.post('cart/goodscount', data)

export const ADD_TO_CART = (data) => request.post('cart/add', data)

export const UPDATE_CART = (data) => request.post('cart/update', data)

export const CHECK_GOODS_IN_CART = (data) => request.post('cart/checked', data)

export const DEL_TO_CART = (data) => request.post('cart/delete', data)

export const CHECKOUT_BY_CART = (data) => request.get('cart/checkout', data)
