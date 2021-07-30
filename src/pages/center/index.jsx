import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

import api from '@/api'

import headerBg from '@/assets/imgs/header-bg.png'
import balanceIcon from '@/assets/imgs/center/balance.png'
import integralIcon from '@/assets/imgs/center/integral.png'

import orderIcon from '@/assets/imgs/center/first-order.png'
import couponIcon from '@/assets/imgs/center/first-coupon.png'
import exchangeIcon from '@/assets/imgs/center/first-exchange.png'
import joinIcon from '@/assets/imgs/center/first-join.png'

import mineIcon from '@/assets/imgs/center/wan-mine.png'
import commentIcon from '@/assets/imgs/center/wan-comment.png'
import likeIcon from '@/assets/imgs/center/wan-like.png'
import followIcon from '@/assets/imgs/center/wan-follow.png'
import fansIcon from '@/assets/imgs/center/wan-fans.png'

import yiIcon from '@/assets/imgs/center/wei-yi.png'
import formIcon from '@/assets/imgs/center/wei-form.png'
import chenIcon from '@/assets/imgs/center/wei-chen.png'
import waiIcon from '@/assets/imgs/center/wei-wai.png'
import kfcIcon from '@/assets/imgs/center/wei-kfc.png'

import jiMineIcon from '@/assets/imgs/center/ji-mine.png'
import jiBalanceIcon from '@/assets/imgs/center/ji-balance.png'
import liuIcon from '@/assets/imgs/center/ji-liu.png'
import zhiIcon from '@/assets/imgs/center/ji-zhi.png'
import aboutIcon from '@/assets/imgs/center/ji-about.png'

import otherJoinIcon from '@/assets/imgs/center/other-join.png'
import guanIcon from '@/assets/imgs/center/other-guan.png'
import settingIcon from '@/assets/imgs/center/other-setting.png'

import './index.scss'

class Center extends Component {
  state = {
    userInfo: { nickName: '', avatarUrl: '' },
    isLogin: false,
    balance: 0,
    menuList: [
      {
        title: '吃饭鸭',
        children: [
          {
            icon: orderIcon,
            title: '我的订单',
            url: '/pages/order/list/index?status=0'
          },
          {
            icon: couponIcon,
            title: '优惠券',
            url: '/pages/coupon/list/index'
          },
          {
            icon: exchangeIcon,
            title: '积分兑换',
            url: '/pages/coupon/list/index'
          },
          {
            icon: joinIcon,
            title: '成为楼长',
            url: '/pages/coupon/list/index'
          }
        ]
      },
      {
        title: '万能盒',
        children: [
          {
            icon: mineIcon,
            title: '我的主页',
            url: '/pages/order/index'
          },
          {
            icon: commentIcon,
            title: '评论',
            url: '/pages/coupon/list/index'
          },
          {
            icon: likeIcon,
            title: '点赞',
            url: '/pages/coupon/list/index'
          },
          {
            icon: followIcon,
            title: '关注',
            url: '/pages/coupon/list/index'
          },
          {
            icon: fansIcon,
            title: '粉丝',
            url: '/pages/coupon/list/index'
          }
        ]
      },
      {
        title: '微服务',
        children: [
          {
            icon: yiIcon,
            title: '充一卡通',
            url: '/pages/order/index'
          },
          {
            icon: formIcon,
            title: '课表查询',
            url: '/pages/coupon/list/index'
          },
          {
            icon: chenIcon,
            title: '成绩查询',
            url: '/pages/coupon/list/index'
          },
          {
            icon: waiIcon,
            title: '外卖神券',
            url: '/pages/coupon/list/index'
          },
          {
            icon: kfcIcon,
            title: 'KFC六折',
            url: '/pages/coupon/list/index'
          }
        ]
      },
      {
        title: '流浪宝贝',
        children: [
          {
            icon: jiMineIcon,
            title: '我的捐赠',
            url: '/pages/order/index'
          },
          {
            icon: jiBalanceIcon,
            title: '基金会余额',
            url: '/pages/coupon/list/index'
          },
          {
            icon: liuIcon,
            title: '基金流向',
            url: '/pages/coupon/list/index'
          },
          {
            icon: zhiIcon,
            title: '志愿者',
            url: '/pages/coupon/list/index'
          },
          {
            icon: aboutIcon,
            title: '关于我们',
            url: '/pages/coupon/list/index'
          }
        ]
      },
      {
        title: '其他服务',
        children: [
          {
            icon: otherJoinIcon,
            title: '商务合作',
            url: '/pages/order/index'
          },
          {
            icon: guanIcon,
            title: '官方号入驻',
            url: '/pages/coupon/list/index'
          },
          {
            icon: settingIcon,
            title: '设置',
            url: '/pages/coupon/list/index'
          }
        ]
      }
    ]
  }

  componentDidShow() {
    this.fetchData()

    const userInfo = Taro.getStorageSync('userInfo')
    // console.log(userInfo)
    const isLogin = Object.keys(userInfo).length && userInfo.nickName && userInfo.avatarUrl

    this.setState({ userInfo, isLogin })
  }

  fetchData = () => {
    this.getUserBalance()
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

  getUserBalance = async () => {
    const {
      data: { remainAmount }
    } = await api.user.GET_USER_BALANCE()

    this.setState({ balance: remainAmount })
  }

  render() {
    const { userInfo, isLogin, balance, menuList } = this.state

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
              <View className='content-item-info-num'>0</View>
            </View>
            <Image src={integralIcon} mode='widthFix' className='content-item-icon'></Image>
          </View>
          <View className='content-item' onClick={this.onJumpToBalance}>
            <View className='content-item-info'>
              <View className='content-item-info-title'>余额</View>
              <View className='content-item-info-num'>{balance || 0}</View>
            </View>
            <Image src={balanceIcon} mode='widthFix' className='content-item-icon'></Image>
          </View>
        </View>
        {menuList &&
          menuList.map((item) => {
            return (
              <View key={item.title} className='menu'>
                <View className='menu-title'>{item.title}</View>
                <View className='menu-container'>
                  {item.children &&
                    item.children.map((info) => {
                      return (
                        <View key={info.url} className='menu-item' onClick={this.onJump(info.url)}>
                          <Image src={info.icon} mode='widthFix' className='menu-item-icon'></Image>
                          <View className='menu-item-title'>{info.title}</View>
                        </View>
                      )
                    })}
                </View>
              </View>
            )
          })}
      </View>
    )
  }
}

export default Center
