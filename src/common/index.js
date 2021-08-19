import Taro from '@tarojs/taro'
import api from '@/api/index'

const getToken = async () => {
  try {
    const value = Taro.getStorageSync('token')
    // console.log(value, 'value')
    if (value) {
      return value
    } else {
      return await login()
    }
  } catch (e) {
    console.log(e, 'e')
    return ''
  }
}

const login = async (callback) => {
  const { code } = await Taro.login()

  const query = {
    code,
    userInfo: {},
    isUpdate: false
  }

  const {
    errno,
    data: { token, userInfo: user }
  } = await api.user.WECHAT_LOGIN(query)


  if (!errno) {

    Taro.setStorageSync('userInfo', user)
    Taro.setStorageSync('token', token)
    Taro.setStorageSync('openid', user.weixinOpenid)
    Taro.setStorageSync('userId', user.userId)

    const isLogin = Object.keys(user).length && user.nickName && user.avatarUrl

    if (!isLogin) {
      Taro.navigateTo({ url: `/pages/login/index` })
      return token
    }

    return callback && callback() || token
  }
}

const toast = (title, icon = 'none', duration = 2000) => {
  Taro.showToast({
    title,
    icon,
    duration
  })
}

const formatTimer = (time, fommat) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  switch (fommat) {
    case 'y-m-d h-m-s':
      return `${year}-${addZero(month)}-${addZero(
        day
      )} ${addZero(hour)}:${addZero(minute)}:${addZero(
        second
      )}`
    case 'y-m-d':
      return `${year}-${addZero(month)}-${addZero(day)}`
    case 'm-d h-m':
      return `${addZero(month)}-${addZero(
        day
      )} ${addZero(hour)}:${addZero(minute)}`
    case 'y-m-d h-m':
      return `${year}-${addZero(month)}-${addZero(
        day
      )} ${addZero(hour)}:${addZero(minute)}`
    default:
      return `${year}-${addZero(month)}-${addZero(
        day
      )} ${addZero(hour)}:${addZero(minute)}:${addZero(
        second
      )}`
  }
}

const addZero = (num) => {
  if (num < 10) return `0${num}`
  return num
}

const onJump = (type, url, id, path, h5Path) => {
  if (type === 'inApp') {
    Taro.navigateTo({ url })
  }

  if (type === 'outApp') {
    Taro.navigateToMiniProgram({
      appId: id,
      path,
      extraData: {},
      envVersion: 'release',
      success: () => { }
    })
  }

  // console.log(type, url, id, path, h5Path)
  if (type === 'h5') {
    Taro.navigateTo({ url: `/pages/event/web/index?src=${h5Path}` })
  }
}

export default { getToken, login, toast, formatTimer, addZero, onJump }
