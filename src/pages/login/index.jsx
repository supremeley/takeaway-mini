import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Header from '@/components/header'

import api from '@/api'
import D from '@/common'

import headerBg from '@/assets/imgs/header-bg.png'

import './index.scss'

class Login extends Component {
  state = { phone: '', code: '' }

  async componentDidShow() {
    const { code } = await Taro.login()
    this.setState({ code })
  }

  getUserInfo = async () => {
    try {
      const e = await Taro.getUserProfile({
        desc: '用于完善会员资料'
      })

      // console.log(e)

      const { errMsg, ...params } = e

      const { userInfo } = params

      this.login(userInfo)
    } catch (e) {
      console.log(e)
    }
  }

  handleGetPhoneNumber = async (e) => {
    const { code } = this.state
    // console.log(userInfo)
    // if (!userInfo) {
    //   D.toast('请先授权微信登录')
    //   return
    // }

    const { errMsg, ...params } = e.detail

    if (errMsg === 'getPhoneNumber:ok') {
      // const { code } = await Taro.login()
      const { encryptedData, iv } = params
      // const { code } = await Taro.login()

      const query = {
        code,
        encryptedData,
        iv
      }

      const {
        data: { phone }
      } = await api.user.DECRYPT_PHONE(query)

      this.setState({ phone })

      // if (phone) {
      //   D.toast('绑定成功')
      //   Taro.switchTab({ url: '/pages/home/index' })
      // }
    }
  }

  login = async (userInfo) => {
    const { phone } = this.state

    if (!phone) {
      D.toast('请先获取手机号')
      return
    }

    const { code } = await Taro.login()

    const query = {
      code,
      userInfo: { ...userInfo, phone },
      isUpdate: true
    }

    const {
      errno,
      data: { token, userInfo: user }
    } = await api.user.WECHAT_LOGIN(query)

    if (!errno) {
      D.toast('登录成功')

      Taro.setStorageSync('userInfo', user)
      Taro.setStorageSync('token', token)
      Taro.setStorageSync('userId', user.userId)
      Taro.setStorageSync('forumStatus', user.status)

      setTimeout(() => Taro.switchTab({ url: '/pages/home/index' }), 1000)
    }
  }

  render() {
    const { phone } = this.state

    return (
      <View className='login'>
        <View className='header'>
          <Image src={headerBg} mode='aspectFill' className='header-bg'></Image>
          <Header />
          <View class='title'>
            <View class='title-name'>吃饭鸭</View>
            <View class='title-explain'>今天也要记得吃饭鸭~</View>
          </View>
        </View>
        <View className='content'>
          <View className='content-opt'>
            <View className='content-opt-info'>{phone}</View>
            <Button
              lang='zh_CN'
              openType='getPhoneNumber'
              onGetPhoneNumber={this.handleGetPhoneNumber}
              class='content-btn'
            >
              获取手机号
            </Button>
          </View>
          <Button lang='zh_CN' class='login-btn' onClick={this.getUserInfo}>
            授权微信登录
          </Button>
          {/* <Button
            lang='zh_CN'
            openType='getPhoneNumber'
            onGetPhoneNumber={this.handleGetPhoneNumber}
            class='login-btn'
          >
            绑定手机号
          </Button> */}
        </View>
      </View>
    )
  }
}

export default Login
