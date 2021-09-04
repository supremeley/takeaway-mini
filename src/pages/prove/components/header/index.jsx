import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Header from '@/components/header'

import headerBg from '@/assets/imgs/prove/header-bg.png'

import './index.scss'

class ProveHeader extends Component {
  defaultProps = {
    title: null
  }

  render() {
    const { title } = this.props

    return (
      <View className='prove-header'>
        <Image src={headerBg} mode='aspectFill' className='header-bg'></Image>
        <Header title={title || '校园认证'} />
      </View>
    )
  }
}

export default ProveHeader
