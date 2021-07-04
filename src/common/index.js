import Taro from '@tarojs/taro'
import api from '@/api/index'

const getToken = async () => {
  try {
    const value = Taro.getStorageSync('token')

    if (value) {
      return value
    } else {
      return await login()
    }
  } catch (e) {
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

    return callback && callback()
  }
}

const toast = (title, icon = 'none', duration = 2000) => {
  Taro.showToast({
    title,
    icon,
    duration
  })
}

export default { getToken, login, toast }
