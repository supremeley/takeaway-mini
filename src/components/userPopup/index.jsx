import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class GiftPopup extends Component {
  defaultProps = {
    show: false,
    curUser: null,
    onJumpToPerson: () => {},
    onJumpToChat: () => {}
  }

  handleClose = () => {
    const { onClose } = this.props

    onClose && onClose()
  }

  handleJumpToPerson = (id) => () => {
    const { onJumpToPerson } = this.props

    onJumpToPerson && onJumpToPerson(id)
  }

  handleJumpToChat = (id) => () => {
    const { onJumpToChat } = this.props

    onJumpToChat && onJumpToChat(id)
  }

  render() {
    const { curUser, show } = this.props

    if (!curUser) {
      return null
    }

    return (
      <AtFloatLayout isOpened={show} onClose={this.handleClose}>
        <View className='user-float'>
          <View className='user-float-top'>
            <View className='user-float-top__user'>
              <View className='user-float-top__user-info'>
                <View className='user-float-top__user-info__name'>{curUser.nickname}</View>
              </View>
              <View className='user-float-top__user-school'>{curUser.schoolName}</View>
            </View>
            <View className='user-float-top__right'>
              <Image src={curUser.avatar} mode='aspectFill' className='user-float-top__right-avatar' />
              <View className='user-float-top__right-btn'>+关注</View>
            </View>
          </View>
          <View className='user-float-bottom'>
            <Button className='user-float-bottom__btn' onClick={this.handleJumpToPerson(curUser.userId)}>
              个人主页
            </Button>
            <Button
              className='user-float-bottom__btn long-btn'
              onClick={this.handleJumpToChat(curUser.userId)}
            >
              发起私聊
            </Button>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}

export default GiftPopup
