import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'

import t1 from '@/assets/imgs/test1.png'

import './index.scss'

class Checkout extends Component {
  state = {
    goodsList: [
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      }
    ]
  }

  onConfirm = () => {
    Taro.navigateTo({ url: 'goods/list' })
  }

  render() {
    const { goodsList } = this.state

    return (
      <View className='index'>
        {/* <View className='header'>
          <View className='header-status'>已付款</View>
        </View> */}
        <View className='user-container'>
          <View className='user-option'>
            <View className='user-option__address'>上海市</View>
            <View className='user-option__info'>
              <View className='user-option__info-item'>13788954223</View>
              <View className='user-option__info-item'>13788954223</View>
            </View>
          </View>
          <View className='at-icon at-icon-chevron-right'></View>
        </View>
        <View className='goods-container'>
          <View className='goods-content'>
            {goodsList &&
              goodsList.map((goods) => {
                return (
                  <View key={goods.url} className='goods-item'>
                    <Image src={goods.pic} mode='aspectFill' className='goods-img'></Image>
                    <View className='goods-info'>
                      <View className='goods-info__title'>
                        {goods.title}
                        <Text className='goods-info__title-price'>￥{goods.price}</Text>
                      </View>
                      <View className='goods-info__detail'>
                        <View>
                          <Text className='goods-info__tag'>{goods.title}</Text>
                        </View>
                        <View>
                          <Text className='goods-info__num'>X1</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
        </View>
        <View className='detail-container'>
          <View className='detail-option'>
            <Text className='detail-option__item-title'>商品金额</Text>
            <Text className='detail-option__item-num'>￥32.00</Text>
          </View>
          <View className='detail-option'>
            <Text className='detail-option__item-title'>配送费</Text>
            <Text className='detail-option__item-num'>￥32.00</Text>
          </View>
        </View>
        <View className='footer'>
          <View className='footer-info'>
            <View className='footer-info__price'>
              待支付:
              <Text>￥{this.selectedPrice}</Text>
            </View>
            <View className='footer-info__explatin'>
              共优惠
              <Text> {this.selectedPrice}</Text>
            </View>
          </View>
          <View className='footer-btn'>下单</View>
        </View>
      </View>
    )
  }
}

export default Checkout
