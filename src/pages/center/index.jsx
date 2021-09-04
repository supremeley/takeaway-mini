import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

import addressIcon from '@/assets/imgs/address-icon.png'

import balanceIcon from '@/assets/imgs/balance-icon.png'
import integralIcon from '@/assets/imgs/center/integral.png'
// import MallIcon from '@/assets/imgs/center/mall.png'

import orderIcon from '@/assets/imgs/center/first-order.png'
import couponIcon from '@/assets/imgs/center/first-coupon.png'
// import exchangeIcon from '@/assets/imgs/center/first-exchange.png'
import joinIcon from '@/assets/imgs/center/first-join.png'

import mineIcon from '@/assets/imgs/center/wan-mine.png'
import commentIcon from '@/assets/imgs/center/wan-comment.png'
import likeIcon from '@/assets/imgs/center/wan-like.png'
import followIcon from '@/assets/imgs/center/wan-follow.png'
import fansIcon from '@/assets/imgs/center/wan-fans.png'

// import yiIcon from '@/assets/imgs/center/wei-yi.png'
// import formIcon from '@/assets/imgs/center/wei-form.png'
// import chenIcon from '@/assets/imgs/center/wei-chen.png'
import elementiIcon from '@/assets/imgs/center/element.png'
import meituanIcon from '@/assets/imgs/center/meituan.png'
import kfcIcon from '@/assets/imgs/center/wei-kfc.png'

import fabuIcon from '@/assets/imgs/center/fabu.png'
import jiedanIcon from '@/assets/imgs/center/jiedan.png'

import jiMineIcon from '@/assets/imgs/center/ji-mine.png'
import jiBalanceIcon from '@/assets/imgs/center/ji-balance.png'
// import liuIcon from '@/assets/imgs/center/ji-liu.png'
// import zhiIcon from '@/assets/imgs/center/ji-zhi.png'
import aboutIcon from '@/assets/imgs/center/ji-about.png'

import otherJoinIcon from '@/assets/imgs/center/other-join.png'
import guanIcon from '@/assets/imgs/center/other-guan.png'
import settingIcon from '@/assets/imgs/center/other-setting.png'

import renzhengtubiaoIcon from '@/assets/imgs/setting/renzhengtubiao.png'
import guifanIcon from '@/assets/imgs/setting/guifan.png'
import yinsiIcon from '@/assets/imgs/setting/yinsi.png'
import shezhiIcon from '@/assets/imgs/setting/shezhi.png'

import './index.scss'

class Center extends Component {
  state = {
    showRightMenu: false,
    safeTop: 0,
    schoolName: Taro.getStorageSync('schoolName'),
    forumUser: Taro.getStorageSync('forumUser'),
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
        url: '/pages/integral/index'
      },
      {
        icon: couponIcon,
        title: '优惠券',
        url: '/pages/coupon/list/index'
      }
      // {
      //   icon: MallIcon,
      //   title: '优选商城',
      //   url: '',
      //   type: 'outApp',
      //   id: 'wx4fb572b4acc3f929',
      //   path: '/views/home/index'
      // },
    ],
    menuList: [
      {
        title: '一日三餐',
        children: [
          {
            icon: orderIcon,
            title: '早餐订单',
            url: '/pages/order/list/index?status=0'
          },
          {
            icon: elementiIcon,
            title: '饿了么神券',
            url: '',
            type: 'outApp',
            id: 'wxece3a9a4c82f58c9',
            path: 'ele-recommend-price/pages/guest/index?inviterId=68724bb&chInfo=ch_wechat_chsub_CopyLink&_ltracker_f=tjyj1_wx_jgw'
          },
          {
            icon: meituanIcon,
            title: '美团神券',
            url: '',
            type: 'outApp',
            id: 'wxde8ac0a21135c07d',
            path: 'waimaiunion/pages/union/index?scene=1!p2hXVr5zsZM2!1!2!sVdWvg'
          },
          {
            icon: kfcIcon,
            title: 'KFC六折',
            url: '',
            type: 'outApp',
            id: 'wx4fb572b4acc3f929',
            path: 'views/kfc/index.html'
          }
          // {
          //   icon: exchangeIcon,
          //   title: '盒盒币兑换',
          //   url: '/pages/integral/exchange/index'
          // },
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
            url: '/pages/wnh/all/index'
          },
          {
            icon: likeIcon,
            title: '私聊',
            url: '/pages/wnh/person/index'
          },
          {
            icon: followIcon,
            title: '关注/粉丝',
            url: '/pages/wnh/follow/index'
          },
          {
            icon: fansIcon,
            title: '官方号入驻',
            url: '/pages/event/settled/index'
          }
        ]
      },
      // {
      //   title: '微服务',
      //   children: [
      //     {
      //       icon: yiIcon,
      //       title: '充一卡通',
      //       h5Path: 'http://pay.huilan-online.com/index.php/epay/pay/xybrecharge',
      //       type: 'h5',
      //       id: 'wx4fb572b4acc3f929',
      //       path: 'http://pay.huilan-online.com/index.php/epay/pay/xybrecharge',
      //     },
      //     {
      //       icon: formIcon,
      //       title: '课表查询',
      //       url: ''
      //     },
      //     {
      //       icon: chenIcon,
      //       title: '成绩查询',
      //       url: ''
      //     },
      //     {
      //       icon: waiIcon,
      //       title: '外卖神券',
      //       url: ''
      //     },
      //     {
      //       icon: kfcIcon,
      //       title: 'KFC六折',
      //       url: ''
      //     }
      //   ]
      // },
      {
        title: '校内跑腿',
        children: [
          {
            icon: fabuIcon,
            title: '我的发布',
            url: ''
          },
          {
            icon: jiedanIcon,
            title: '我的接单',
            url: ''
          }
        ]
      },
      {
        title: '流浪宝贝',
        children: [
          {
            icon: jiMineIcon,
            title: '我的爱心',
            url: '/pages/fund/mine/index'
          },
          {
            icon: jiBalanceIcon,
            title: '本校爱心',
            url: '/pages/fund/school/index'
          },
          {
            icon: aboutIcon,
            title: '关于我们',
            url: '/pages/fund/about/index'
          }
        ]
      },
      {
        title: '其他服务',
        children: [
          {
            icon: otherJoinIcon,
            title: '合作',
            url: '/pages/event/cooperation/index'
          },
          {
            icon: guanIcon,
            title: '新手引导',
            url: '/pages/event/guide/index'
          },
          {
            icon: joinIcon,
            title: '成为楼长',
            url: '/pages/event/join/index'
          },
          {
            icon: settingIcon,
            title: '设置',
            type: 'setting',
            url: '/pages/event/setting/index'
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

  openPopup = () => {
    this.setState({ showRightMenu: true })
  }

  closePopup = (e) => {
    e.stopPropagation()

    this.setState({ showRightMenu: false })
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

      if (type === 'setting') {
        this.openPopup()
      }
    }

  onJumpToLogin = () => {
    const { isLogin } = this.state

    if (!isLogin) {
      Taro.navigateTo({ url: `/pages/login/index` })
    }
  }

  onJumpToAccount = () => {
    const { forumUser } = this.state

    if (forumUser == 'manager') {
      Taro.navigateTo({ url: `/pages/wnh/account/index` })
    }
  }

  onJumpToProve = (e) => {
    e.stopPropagation()

    const { schoolName } = this.state

    if (schoolName) {
      return
    }

    Taro.navigateTo({ url: `/pages/prove/school/index` })
  }

  onJumpToAgreement = (e, type) => {
    e.stopPropagation()

    Taro.navigateTo({ url: `/pages/wnh/agreement/index?type=${type}` })
  }

  onJumpToSetting = (e) => {
    e.stopPropagation()

    Taro.navigateTo({ url: `/pages/event/setting/index` })
  }

  render() {
    const {
      forumUser,
      showRightMenu,
      schoolName,
      safeTop,
      userInfo,
      isLogin,
      titleList,
      menuList
    } = this.state

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
                  <Image src={item.icon} mode='aspectFit' className='content-item__icon'></Image>
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
        {forumUser == 'manager' && (
          <View className='page-btn' onClick={this.onJumpToAccount}>
            切换账户
          </View>
        )}
        {showRightMenu && (
          <View className='mask' onClick={this.closePopup}>
            <View className='right-menu'>
              <View className='right-menu__item' onClick={this.onJumpToProve}>
                <Image
                  src={renzhengtubiaoIcon}
                  mode='aspectFit'
                  className='right-menu__item-icon'
                ></Image>
                <View>校园认证</View>
              </View>
              <View className='right-menu__item' onClick={(e) => this.onJumpToAgreement(e, 1)}>
                <Image src={guifanIcon} mode='aspectFit' className='right-menu__item-icon'></Image>
                <View>社区规范</View>
              </View>
              <View className='right-menu__item' onClick={(e) => this.onJumpToAgreement(e, 0)}>
                <Image src={yinsiIcon} mode='aspectFit' className='right-menu__item-icon'></Image>
                <View>隐私保护指引</View>
              </View>
              <View className='right-menu__item' onClick={this.onJumpToSetting}>
                <Image src={shezhiIcon} mode='aspectFit' className='right-menu__item-icon'></Image>
                <View>隐私设置</View>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default Center
