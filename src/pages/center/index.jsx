import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

// import api from '@/api'
import addressIcon from '@/assets/imgs/address-icon.png'

import balanceIcon from '@/assets/imgs/balance-icon.png'
import integralIcon from '@/assets/imgs/center/integral.png'
import MallIcon from '@/assets/imgs/center/mall.png'

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
// import liuIcon from '@/assets/imgs/center/ji-liu.png'
// import zhiIcon from '@/assets/imgs/center/ji-zhi.png'
import aboutIcon from '@/assets/imgs/center/ji-about.png'

import otherJoinIcon from '@/assets/imgs/center/other-join.png'
import guanIcon from '@/assets/imgs/center/other-guan.png'
import settingIcon from '@/assets/imgs/center/other-setting.png'

import './index.scss'

class Center extends Component {
  state = {
    safeTop: 0,
    schoolName: Taro.getStorageSync('schoolName'),
    userInfo: { nickName: '', avatarUrl: '' },
    isLogin: false,
    // balance: 0,
    titleList: [
      {
        icon: balanceIcon,
        title: '余额',
        url: '/pages/balance/detail/index'
      },
      {
        icon: integralIcon,
        title: '盒盒币',
        url: ''
      },
      {
        icon: MallIcon,
        title: '优选商城',
        url: '',
        type: 'outApp',
        id: 'wx4fb572b4acc3f929',
        path: '/views/home/index'
      }
    ],
    menuList: [
      {
        title: '早餐到寝',
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
            title: '盒盒币兑换',
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
        title: '校内论坛',
        children: [
          {
            icon: mineIcon,
            title: '主页',
            url: '/pages/wnh/mine/index?id=mine'
          },
          {
            icon: commentIcon,
            title: '评论/点赞',
            url: '/pages/wnh/comment/index'
          },
          {
            icon: likeIcon,
            title: '私聊',
            url: '/pages/wnh/person/index'
          },
          {
            icon: followIcon,
            title: '关注/粉丝',
            url: '/pages/wnh/comment/index'
          },
          {
            icon: fansIcon,
            title: '官方号入驻',
            url: '/pages/wnh/list/index'
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
            title: '我的爱心',
            url: '/pages/order/index'
          },
          {
            icon: jiBalanceIcon,
            title: '本校爱心',
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
            title: '合作',
            url: '/pages/order/index'
          },
          {
            icon: guanIcon,
            title: '新手引导',
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

  async componentDidMount() {
    const info = await Taro.getMenuButtonBoundingClientRect()

    this.setState({ safeTop: info.top })
  }

  componentDidShow() {
    const userInfo = Taro.getStorageSync('userInfo')

    const isLogin = Object.keys(userInfo).length && userInfo.nickName && userInfo.avatarUrl

    this.setState({ userInfo, isLogin })
  }

  fetchData = () => {
    // this.getUserBalance()
  }

  onJump =
    (type = 'inApp', url, id, path, h5Path) =>
    () => {
      if (type === 'inApp') {
        Taro.navigateTo({ url })
      }

      if (type === 'outApp') {
        Taro.navigateToMiniProgram({
          appId: id,
          path,
          extraData: {},
          envVersion: 'release',
          success: () => {}
        })
      }

      // console.log(type, url, id, path, h5Path)
      if (type === 'h5') {
        Taro.navigateTo({ url: `/pages/event/web/index?src=${h5Path}` })
      }
    }

  onJumpToLogin = () => {
    const { isLogin } = this.state

    if (!isLogin) {
      Taro.navigateTo({ url: `/pages/login/index` })
    }
  }

  onJumpToProve = () => {
    const { schoolName } = this.state

    if (schoolName) {
      return
    }

    Taro.navigateTo({ url: `/pages/prove/school/index` })
  }

  render() {
    const { schoolName, safeTop, userInfo, isLogin, titleList, menuList } = this.state

    const { nickName, avatarUrl } = userInfo

    return (
      <View className='center'>
        <View className='header'>
          <View className='header-bg'></View>
          {/* <Image src={headerBg} mode='widthFix' className='header-bg'></Image> */}
          <View style={{ top: safeTop + 'px' }} className='header-container'>
            <View className='header-title'>盒盒超级大学</View>
            <View className='header-info'>
              {avatarUrl && (
                <Image src={avatarUrl} mode='aspectFill' className='header-info__avatar'></Image>
              )}
              <View onClick={this.onJumpToLogin} className='header-info-detail'>
                <View className='header-info__floor'>{isLogin ? nickName : '请登录'}</View>
                <View className='header-info__school'>
                  <Image
                    src={addressIcon}
                    mode='aspectFill'
                    className='header-info__school-icon'
                  ></Image>
                  <View onClick={this.onJumpToProve}>{schoolName || '点击认证（游客）'}</View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className='content'>
          {titleList &&
            titleList.map((item) => {
              return (
                <View
                  key={item.url}
                  className='content-item'
                  onClick={this.onJump(item.type, item.url, item.id, item.path, item.h5Path)}
                >
                  <Image src={item.icon} mode='aspectFill' className='content-item__icon'></Image>
                  <View className='content-item__text'>{item.title}</View>
                </View>
              )
            })}
        </View>
        <View className='menu'>
          {menuList &&
            menuList.map((item) => {
              return (
                <View key={item.title} className='menu-list'>
                  <View className='menu-title'>{item.title}</View>
                  <View className='menu-container'>
                    {item.children &&
                      item.children.map((info) => {
                        return (
                          <View
                            key={info.url}
                            className='menu-item'
                            onClick={this.onJump(
                              info.type,
                              info.url,
                              info.id,
                              info.path,
                              info.h5Path
                            )}
                          >
                            <Image
                              src={info.icon}
                              mode='aspectFit'
                              className='menu-item-icon'
                            ></Image>
                            <View className='menu-item-title'>{info.title}</View>
                          </View>
                        )
                      })}
                  </View>
                </View>
              )
            })}
        </View>
        <View className='center-explain'>
          <View>盒盒超级大学™</View>
          <View>中国高校领先的校园生活服务平台</View>
        </View>
      </View>
    )
  }
}

export default Center
