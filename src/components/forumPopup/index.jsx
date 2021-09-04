import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import { popupOpt } from '@/constants/forum'

import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class ForumPopup extends Component {
  defaultProps = {
    showPopup: false,
    type: '',
    isOwn: false,
    onSelect: () => {},
    onClose: () => {}
  }

  state = {
    role: Taro.getStorageSync('forumUser')
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
    const { type, showPopup, isOwn } = this.props

    const { role } = this.state

    if (!type) {
      return null
    }

    let sortOpt = popupOpt[type]

    // if (role) {
    //   sortOpt = sortOpt.filter((item) => {
    //     return !item.permissions || item.permissions.includes(role)
    //   })
    // } else {
    // console.log(isOwn)
    if (!isOwn && role === 'normal') {
      sortOpt = sortOpt.filter((item) => {
        return !item.permissions || (item.permissions && !item.permissions.includes('mine'))
      })
    }
    // }

    // console.log(sortOpt)

    const SortOpt =
      sortOpt &&
      sortOpt.map((item, index) => {
        // if (item.permissions) return
        if (item.type === 'share') {
          return (
            <Button key={item.name} className='float-item' openType='share'>
              {item.icon && <Image src={item.icon} mode='aspectFit' className='float-item__icon' />}
              {item.name}
            </Button>
          )
        }

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
