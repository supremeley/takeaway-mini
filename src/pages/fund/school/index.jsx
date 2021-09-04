import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'

// import api from '@/api'

import './index.scss'

class About extends Component {
  state = {}

  async componentDidMount() {}

  render() {
    const {} = this.state

    return (
      <View className='school'>
        <View className='title'>
          <View className='title-info'>
            爱心池
            <View className='title-num'>2000</View>元
          </View>
        </View>
        <View className='content'>
          <View className='content-title'>关于爱心资金的说明</View>
          <View className='content-desc'>
            本校流浪宝贝爱心池资金的使用情况，由本校流浪宝贝官 方号在“万能盒—本校”板块中公示。
            关于资金更新：在每日00:00更新总资金
          </View>
        </View>
      </View>
    )
  }
}

export default About
