import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import headerBg from '@/assets/imgs/header-bg.png'
import exchangeIcon from '@/assets/imgs/center-exchange.png'
import usIcon from '@/assets/imgs/center-us.png'
// import settingIcon from '@/assets/imgs/center-setting.png'
import couponIcon from '@/assets/imgs/center-coupon.png'
import integralIcon from '@/assets/imgs/center-integral.png'

import './index.scss'

class Center extends Component {
  state = {
    userInfo: { nickName: '', avatarUrl: '' },
    isLogin: false,
    menuList: [
      {
        icon: exchangeIcon,
        title: '积分兑换'
      },
      {
        icon: usIcon,
        title: '联系我们'
      }
      // {
      //   icon: settingIcon,
      //   title: '设置'
      // }
    ]
  }

  componentDidShow() {
    const userInfo = Taro.getStorageSync('userInfo')

    const isLogin = Object.keys(userInfo).length

    this.setState({ userInfo, isLogin })

    console.log(userInfo, isLogin)
  }

  onJumpToLogin = () => {
    const { userInfo } = this.state

    if (!userInfo) {
      Taro.navigateTo({ url: `/pages/login/index` })
    }
  }

  onJumpToCoupon = () => {
    Taro.navigateTo({ url: `/pages/coupon/list/index` })
  }

  render() {
    const { userInfo, isLogin, menuList } = this.state

    const { nickName, avatarUrl } = userInfo

    return (
      <View className='index'>
        <View className='header'>
          <Image src={headerBg} mode='widthFix' className='header-bg'></Image>
          <View className='header-container'>
            <View className='header-title'>我的</View>
            <View className='header-info'>
              <View onClick={this.onJumpToLogin}>
                <View className='header-info__floor'>{isLogin ? nickName : '请登录'}</View>
                <View className='header-info__school'>今天也要记得吃饭鸭</View>
              </View>
              {avatarUrl && (
                <Image src={avatarUrl} mode='aspectFill' className='header-info__avatar'></Image>
              )}
            </View>
          </View>
        </View>
        <View className='content-container'>
          <View className='content-item'>
            <View className='content-item-info'>
              <View className='content-item-info-title'>积分</View>
              <View className='content-item-info-num'>999</View>
            </View>
            <Image src={integralIcon} mode='widthFix' className='content-item-icon'></Image>
          </View>
          <View className='content-item' onClick={this.onJumpToCoupon}>
            <View className='content-item-info'>
              <View className='content-item-info-title'>优惠券</View>
              <View className='content-item-info-num'>999</View>
            </View>
            <Image src={couponIcon} mode='widthFix' className='content-item-icon'></Image>
          </View>
        </View>
        <View className='menu-container'>
          {menuList &&
            menuList.map((item) => {
              return (
                <View key={item.url} className='menu-item'>
                  <Image src={item.icon} mode='widthFix' className='menu-item-icon'></Image>
                  <View className='menu-item-title'>{item.title}</View>
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

export default Center
