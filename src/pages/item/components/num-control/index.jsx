import { Component } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

class NumControl extends Component {
  defaultProps = {
    num: 0,
    onAddHandle: () => {},
    onMinusHandle: () => {}
  }

  state = {}

  minusHandle = () => {
    const { onAddHandle } = this.props
    onAddHandle && onAddHandle()
  }

  addHandle = () => {
    const { onMinusHandle } = this.props
    onMinusHandle && onMinusHandle()
  }

  render() {
    const { num } = this.props

    return (
      <View className='opt'>
        <View
          className='at-icon at-icon-subtract minus-icon'
          onClick={(e) => {
            e.stopPropagation()
            this.minusHandle()
          }}
        ></View>
        <View className='opt-num'>{num}</View>
        <View
          className='at-icon at-icon-add add-icon'
          onClick={(e) => {
            e.stopPropagation()
            this.addHandle()
          }}
        ></View>
      </View>
    )
  }
}

export default NumControl
