import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import { popupOpt } from '@/constants/forum'

import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class ForumPopup extends Component {
  defaultProps = {
    showPopup: false,
    type: '',
    onSelect: () => {},
    onClose: () => {}
  }

  handleClose = () => {
    const { onClose } = this.props

    onClose && onClose()
  }

  handlSelect = (index) => () => {
    const { onSelect, type } = this.props

    const sortOpt = popupOpt[type]

    onSelect && onSelect(sortOpt[index], index)
  }

  render() {
    const { type, showPopup } = this.props

    if (!type) {
      return null
    }

    const sortOpt = popupOpt[type]

    const SortOpt =
      sortOpt &&
      sortOpt.map((item, index) => {
        return (
          <View key={item.name} className='float-item' onClick={this.handlSelect(index)}>
            {item.icon && <Image src={item.icon} mode='aspectFit' className='float-item__icon' />}
            {item.name}
          </View>
        )
      })

    return (
      <View className='float'>
        <AtFloatLayout isOpened={showPopup} onClose={this.handleClose}>
          <View className='float-content'>
            {SortOpt}
            <View className='float-item cancel' onClick={this.handleClose}>
              取消
            </View>
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default ForumPopup
