import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import t1 from '@/assets/imgs/coupon-used.png'

import './index.scss'

class CouponList extends Component {
  state = {
    currentIndex: 0,
    navList: [
      { title: '未使用', status: 0 },
      { title: '已使用', status: 0 },
      { title: '已取消', status: 0 }
    ],
    couponList: [
      {
        price: 1,
        pic: t1,
        title: '蔬菜',
        selected: false,
        num: 1
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜',
        selected: false,
        num: 1
      },
      {
        price: 1,
        pic: t1,
        selected: false,
        title: '蔬菜',
        num: 1
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜',
        selected: false,
        num: 1
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜',
        selected: false,
        num: 1
      }
    ]
  }

  onJump = (id) => () => {
    Taro.navigateTo({ url: `/pages/address/editor/index?=${id}` })
  }

  checkTab = (index) => () => {
    this.setState({ currentIndex: index })
  }

  render() {
    const { currentIndex, navList, couponList } = this.state

    return (
      <View className='index'>
        <View className='nav'>
          {navList &&
            navList.map((item, index) => {
              return (
                <View
                  key={index}
                  className={`nav-item ${index === currentIndex ? 'active-item' : ''}`}
                  onClick={this.checkTab(index)}
                >
                  {item.title}
                </View>
              )
            })}
        </View>
        <View className='list-container'>
          {couponList &&
            couponList.map((item, index) => {
              return (
                <View key={item.id} className='list-item' onClick={this.onJump(item.id)}>
                  <View className='circle circle-left'></View>
                  <View className='circle circle-right'></View>
                  <View className='list-item-top'>
                    <View className='list-item-top__info'>
                      <View className='list-item-top__info-title'>早餐补偿券</View>
                      <View className='list-item-top__info-date'>2021/05/08</View>
                    </View>
                    <View className='list-item-top__price'>
                      <View className='list-item-top__price-text'>￥5</View>
                      <View className='list-item-top__price-explain'>满15可用</View>
                    </View>
                  </View>
                  <View className='list-item-bottom'>
                    <Text className='list-item-bottom__title'>全部店铺可用</Text>
                    <View className='list-item-bottom__btn'>去使用</View>
                  </View>
                  {/* <Image src={t1} className='list-item-icon' /> */}
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

export default CouponList
