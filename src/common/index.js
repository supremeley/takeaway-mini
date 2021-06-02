import Taro from '@tarojs/taro'
import api from '@/api/index'

const getToken = (callback) => {
  try {
    const value = Taro.getStorageSync('token')
    if (value) {
      return value
    } else {
      // login(callback)
      return ''
    }
  } catch (e) {
    return ''
  }
}

const login = (callback) => {
  Taro.login({
    success: async (res) => {
      const query = { code: res.code }

      const {
        data: {
          code,
          data: { openId, userInfo, token }
        }
      } = await api.user.WECHAT_LOGIN(query)

      if (code === 200) {
        Taro.setStorageSync('openId', openId)
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', userInfo)

        // if (!userInfo) {
        //   Taro.navigateTo({ url: '/pages/login/index' })
        // } else {
        //   Taro.setStorageSync('token', token)
        // }
      }

      callback && callback()

      // if (extinfo && extinfo.tmplIds) {
      //   callback && callback(extinfo)
      // } else {
      //   callback && callback()
      // }
    },
    fail: (err) => {
      console.log(err)
    }
  })
}

const toast = (title, icon = 'none', duration = 2000) => {
  Taro.showToast({
    title,
    icon,
    duration
  })
}

export default { getToken, login, toast }
