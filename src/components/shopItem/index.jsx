import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import './index.scss'

class ShopItem extends Component {
  defaultProps = {
    info: null,
    onClick: () => {}
  }

  state = {}

  handleClick = () => {
    const { onClick, info } = this.props
    // debugger
    onClick && onClick(info.merchant.id, info.merchant.floorPrice)
  }

  render() {
    const { info } = this.props

    if (!info) return null

    let { goodsList, merchant } = info

    goodsList = goodsList ? goodsList.slice(0, 3) : []
    // debugger
    return (
      <View key={merchant.id} className='shop-item' onClick={this.handleClick}>
        <View className='shop-top'>
          <Image src={merchant.iconUrl} mode='aspectFill' className='shop-top-avator'></Image>
          <View className='shop-top__title'>
            <View className='shop-top__title-info'>
              {/* <Text className='shop-top__title-info-tag'>新品特价</Text> */}
              <Text className='shop-top__title-info-name'>{merchant.name}</Text>
            </View>
            <View className='shop-top__title-address'>{merchant.address}</View>
          </View>
        </View>
        <View className='shop-content'>
          {goodsList.length > 0 &&
            goodsList.map((goods) => {
              return (
                <View key={goods.id} className='shop-content__item'>
                  <Image
                    src={goods.picUrl}
                    mode='aspectFill'
                    className='shop-content__item-img'
                  ></Image>
                  <View className='shop-content__item-name'>{goods.name}</View>
                  <View className='shop-content__item-sale'>已售{goods.sales}</View>
                  <View className='shop-content__item-price'>￥{goods.retailPrice}</View>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

export default ShopItem
