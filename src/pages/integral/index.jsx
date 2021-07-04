import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'

import Default from '@/components/default'
import BottomText from '@/components/bottomText'
// import api from '@/api'

import './index.scss'

class Event extends Component {
  state = {}

  async componentDidMount() {}

  get src() {
    return this.route.params.src
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {} = this.state

    return (
      <View className='index'>
        <Default msg='功能即将上线敬请期待' />
      </View>
    )
  }
}

export default Event
