import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import DefaultIcon from '@/assets/imgs/default-icon.png'
import './index.scss'

class Default extends Component {
  defaultProps = {
    text: null
  }

  state = {}

  render() {
    const { text } = this.props

    return (
      <View className='default-container'>
        <Image src={DefaultIcon} className='default-icon' />
        <View className='default-text'>{text || '暂无相关数据'}</View>
      </View>
    )
  }
}

export default Default
