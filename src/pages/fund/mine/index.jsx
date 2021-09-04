import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

import balanceIcon from '@/assets/imgs/balance-icon.png'

// import api from '@/api'

import './index.scss'

class About extends Component {
  state = {}

  async componentDidMount() {}

  render() {
    const {} = this.state

    return (
      <View className='school'>
        <View className='content'>
          <View className='content-title'>
            累计金额
            <View className='content-title-num'>12.35</View>元
          </View>
          <View className='item'>
            <Image src={balanceIcon} className='item-avatar' />
            <View className='item-info'>
              <View className='item-info__title'>早餐</View>
              <View className='item-info__date'>8月11日 12：52</View>
            </View>
            <View className='item-right'>+0.05</View>
          </View>
          <View className='item'>
            <Image src={balanceIcon} className='item-avatar' />
            <View className='item-info'>
              <View className='item-info__title'>早餐</View>
              <View className='item-info__date'>8月11日 12：52</View>
            </View>
            <View className='item-right'>+0.05</View>
          </View>
          <View className='item'>
            <Image src={balanceIcon} className='item-avatar' />
            <View className='item-info'>
              <View className='item-info__title'>早餐</View>
              <View className='item-info__date'>8月11日 12：52</View>
            </View>
            <View className='item-right'>+0.05</View>
          </View>
        </View>
      </View>
    )
  }
}

export default About
