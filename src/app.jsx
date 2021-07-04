import Taro from '@tarojs/taro'
import { Component } from 'react'
import { Provider } from 'react-redux'

import api from '@/api'
import configStore from '@/store'

import './app.scss'

const store = configStore()

class App extends Component {
  // onLoad() {}

  async componentDidMount() {
    this.handleUpdate()
    // this.handleLogin()
  }

  handleUpdate = () => {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (r) {
                if (r.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            Taro.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

  handleLogin = async () => {
    // const weixinOpenid = Taro.getStorageSync('openid')
    // const userInfo = Taro.getStorageSync('userInfo')

    const { code } = await Taro.login()

    // const isLogin = Object.keys(userInfo).length

    // let usr = {}

    // if (isLogin) {
    //   usr = {
    //     avatarUrl: userInfo.avatarUrl,
    //     city: userInfo.city,
    //     country: userInfo.country,
    //     gender: userInfo.gender,
    //     language: userInfo.language,
    //     nickName: userInfo.nickName,
    //     // phone: userInfo.phone,
    //     province: userInfo.province
    //   }
    // }

    const query = {
      code,
      userinfo: {}
      // userInfo: usr
    }

    // if (isLogin) query.userInfo = usr

    const {
      data: { token, userInfo: user }
    } = await api.user.WECHAT_LOGIN(query)

    Taro.setStorageSync('userInfo', user)
    Taro.setStorageSync('token', token)
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App
