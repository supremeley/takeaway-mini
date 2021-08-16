import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

import headerBg from '@/assets/imgs/prove/header-bg.png'

import './index.scss'

class ProveHeader extends Component {
  defaultProps = {
    title: null
  }

  state = {}

  goBack = () => {
    Taro.navigateBack()
  }

  render() {
    const { title } = this.props

    return (
      <View className='prove-header'>
        <Image src={headerBg} mode='aspectFill' className='header-bg'></Image>
        <View className='header-container'>
          <View className='header-title'>{title || '校园认证'}</View>
          <View className='at-icon at-icon-chevron-left' onClick={this.goBack}></View>
        </View>
      </View>
    )
  }
}

export default ProveHeader
