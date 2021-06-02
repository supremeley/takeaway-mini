import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Text, Button } from '@tarojs/components'
import { AtSwitch } from 'taro-ui'
import t1 from '@/assets/imgs/test1.png'

import 'taro-ui/dist/style/components/input-number.scss'
import 'taro-ui/dist/style/components/icon.scss'

import 'taro-ui/dist/style/components/switch.scss'
import './index.scss'

class AddressEditor extends Component {
  state = {}

  onConfirm = () => {
    Taro.navigateTo({ url: 'item/list' })
  }

  render() {
    const {} = this.state

    return (
      <View className='index'>
        <View className='form'>
          <View className='form-option'>
            <View className='form-option__title'>联系人</View>
            <Input className='form-option__inp'></Input>
            {/* <View className='at-icon at-icon-chevron-right'></View> */}
          </View>
          <View className='form-option'>
            <View className='form-option__title'>手机号</View>
            <Input className='form-option__inp'></Input>
            {/* <View className='at-icon at-icon-chevron-right'></View> */}
          </View>
          <View className='form-option'>
            <View className='form-option__title'>收货地址</View>
            <Input className='form-option__inp'></Input>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
          <View className='form-option'>
            <View className='form-option__title'>门牌号</View>
            <Input className='form-option__inp'></Input>
            {/* <View className='at-icon at-icon-chevron-right'></View> */}
          </View>
          <View className='form-option'>
            <View className='form-option__title'>设为默认地址</View>
            <AtSwitch checked={this.state.value} onChange={this.handleChange} />
          </View>
        </View>
        <View className='page-btn'>保存</View>
      </View>
    )
  }
}

export default AddressEditor
