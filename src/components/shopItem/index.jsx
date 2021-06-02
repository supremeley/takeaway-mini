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
    onClick && onClick(info.id)
  }

  render() {
    const { info } = this.props

    if (!info) return null

    return (
      <View key={info.url} className='shop-item' onClick={this.handleClick}>
        <View className='shop-top'>
          <Image src={info.picUrl} mode='aspectFill' className='shop-top-avator'></Image>
          <View className='shop-top__title'>
            <View className='shop-top__title-info'>
              {/* <Text className='shop-top__title-info-tag'>新品特价</Text> */}
              <Text className='shop-top__title-info-name'>{info.name}</Text>
            </View>
            <View className='shop-top__title-address'>上海市松江区文汇路樱花广场</View>
          </View>
        </View>
        <View className='shop-content'>
          <View className='shop-content__item'>
            <Image src={info.picUrl} mode='aspectFill' className='shop-content__item-img'></Image>
            <View className='shop-content__item-name'>香蕉玉米三明治</View>
            <View className='shop-content__item-sale'>已售4</View>
            <View className='shop-content__item-price'>$5.9</View>
          </View>
          <View className='shop-content__item'>
            <Image src={info.picUrl} mode='aspectFill' className='shop-content__item-img'></Image>
            <View className='shop-content__item-name'>香蕉玉米三明治</View>
            <View className='shop-content__item-sale'>已售4</View>
            <View className='shop-content__item-price'>$5.9</View>
          </View>
          <View className='shop-content__item'>
            <Image src={info.picUrl} mode='aspectFill' className='shop-content__item-img'></Image>
            <View className='shop-content__item-name'>香蕉玉米三明治</View>
            <View className='shop-content__item-sale'>已售4</View>
            <View className='shop-content__item-price'>$5.9</View>
          </View>
        </View>
      </View>
    )
  }
}

export default ShopItem
