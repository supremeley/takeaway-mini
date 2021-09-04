import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Header from '@/components/header'

import api from '@/api'
// import D from '@/common'

import integralIcon from '@/assets/imgs/center/integral.png'

// import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'
class Intergral extends Component {
  state = {
    inetgral: 0
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.getUserBalance()
  }

  onJumpToBill = () => {
    // Taro.navigateTo({ url: `/pages/balance/bill/index` })
  }

  onJumpToRecharge = () => {
    Taro.navigateTo({ url: `/pages/integral/recharge/index` })
  }

  onJumpToWithdrawal = () => {
    Taro.navigateTo({ url: `/pages/integral/withdrawal/index` })
  }

  onJumpToExchange = () => {
    Taro.navigateTo({ url: `/pages/integral/exchange/index` })
  }

  getUserBalance = async () => {
    const { data } = await api.mine.GET_MINE_INTEGRAL()

    this.setState({ inetgral: data })
  }

  render() {
    const { inetgral } = this.state

    return (
      <View className='integral'>
        <Header />
        <View className='header'>
          <Image src={integralIcon} className='header-icon' />
          <View className='header-name'>我的盒盒币</View>
          <View className='header-desc'>
            <Text className='header-desc-text'>{inetgral}</Text>
            <Text>币</Text>
          </View>
        </View>
        <View className='header-more' onClick={this.onJumpToBill}>
          盒盒币明细
        </View>
        <View className='btn-content'>
          <View className='btn-content__item green-btn' onClick={this.onJumpToRecharge}>
            充值
          </View>
          <View className='btn-content__item' onClick={this.onJumpToWithdrawal}>
            提现
          </View>
          <View className='btn-content__item' onClick={this.onJumpToExchange}>
            兑换
          </View>
        </View>
      </View>
    )
  }
}

export default Intergral
