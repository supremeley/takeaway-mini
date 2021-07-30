import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'

import api from '@/api'

import 'taro-ui/dist/style/components/curtain.scss'
import './index.scss'

class Center extends Component {
  state = {
    showProveModal: true,
    userInfo: { nickName: '', avatarUrl: '' },
    isLogin: false
  }

  componentDidShow() {
    // this.fetchData()
    // const userInfo = Taro.getStorageSync('userInfo')
    // // console.log(userInfo)
    // const isLogin = Object.keys(userInfo).length && userInfo.nickName && userInfo.avatarUrl
    // this.setState({ userInfo, isLogin })
  }

  fetchData = () => {
    this.getUserBalance()
  }

  closeProveModal = () => {
    this.setState({ showProveModal: false })
  }

  onJump = (url) => () => {
    Taro.navigateTo({ url })
  }

  onJumpToLogin = () => {
    const { isLogin } = this.state

    if (!isLogin) {
      Taro.navigateTo({ url: `/pages/login/index` })
    }
  }

  onJumpToBalance = () => {
    Taro.navigateTo({ url: `/pages/balance/detail/index` })
  }

  // getUserBalance = async () => {
  //   const {
  //     data: { remainAmount }
  //   } = await api.user.GET_USER_BALANCE()

  //   this.setState({ balance: remainAmount })
  // }

  render() {
    const { showProveModal } = this.state

    return (
      <View className='index'>
        <AtCurtain isOpened={showProveModal} onClose={this.closeProveModal}></AtCurtain>
      </View>
    )
  }
}

export default Center
