import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'

import api from '@/api'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class Agreement extends Component {
  state = {
    info: null
  }

  componentDidMount() {
    this.getAgreement()
  }

  goBack = () => {
    Taro.navigateBack()
  }

  getAgreement = async () => {
    const query = {
      type: this.type
    }

    const { data } = await api.prove.GET_AGREEMENT(query)

    const res = data.find((item) => item.type == this.type)

    this.setState({ info: res })
  }

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { info } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='agreement'>
        <View className='agreement-header'>
          <View className='header-container'>
            <View className='header-title'>万能盒</View>
            <View className='at-icon at-icon-chevron-left' onClick={this.goBack}></View>
          </View>
        </View>
        <View className='agreement-content'>
          <View className='agreement-content__title'>{info.title}</View>
          <View className='agreement-content__time'>{info.time}</View>
          <View className='agreement-content__info'>{info.authenticationInfo}</View>
        </View>
      </View>
    )
  }
}

export default Agreement
