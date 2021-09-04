// import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.scss'

const BottomText = (props) => {
  return <View className='bottom-text'>{props.msg || '没有更多了'}~</View>
}

export default BottomText
