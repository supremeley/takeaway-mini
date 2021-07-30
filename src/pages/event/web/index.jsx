import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, WebView } from '@tarojs/components'

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
        <WebView src={this.src} className='web-container' />
      </View>
    )
  }
}

export default Event
