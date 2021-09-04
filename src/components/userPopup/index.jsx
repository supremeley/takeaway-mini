import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import api from '@/api'
import D from '@/common'

import TagIcon from '@/assets/imgs/tag.png'

import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class GiftPopup extends Component {
  defaultProps = {
    show: false,
    curUserId: null,
    identity: 0,
    // onJumpToPerson: () => {},
    // onJumpToChat: () => {},
    onFollow: () => {}
  }

  state = {
    userId: Taro.getStorageSync('userId'),
    curUser: null
  }

  componentWillReceiveProps(nextProps) {
    const { curUserId } = this.props
    if (nextProps.curUserId != curUserId) {
      this.checkUserFollow(nextProps.curUserId)
    }
  }

  handleClose = () => {
    const { onClose } = this.props

    onClose && onClose()
  }

  checkUserFollow = async (id) => {
    const query = {
      beUserId: id,
      userId: this.state.userId
    }

    const { data } = await api.mine.CHECK_USER_IS_FOLLOW(query)

    this.setState({ curUser: data })
  }

  handleFollowToPerson = async () => {
    const { curUser } = this.state

    const query = {
      beUserId: curUser.userId
    }

    try {
      const { data, errno } = await api.mine.CHANGE_FOLLOW_PERSON(query)

      if (!errno) {
        let msg = curUser.isFollow ? '取消关注成功' : '关注成功'

        D.toast(msg)

        this.setState({ curUser: { ...curUser, isFollow: curUser.isFollow ? 0 : 8 } })
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  handleJumpToPerson = () => {
    const { curUser } = this.state

    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${curUser.userId}` })
  }

  handleJumpToChat = () => {
    const { curUser } = this.state

    Taro.navigateTo({ url: `/pages/wnh/chat/index?id=${curUser.userId}` })
  }

  render() {
    const { show, identity } = this.props
    const { curUser } = this.state

    if (!curUser) {
      return null
    }

    const { avatar, nickName, schoolName, isFollow } = curUser

    return (
      <AtFloatLayout isOpened={show} onClose={this.handleClose}>
        <View className='user-float'>
          <View className='user-float-top'>
            <View className='user-float-top__right'>
              <View className='user-float-top__right-avatar-con'>
                <Image src={avatar} mode='aspectFill' className='user-float-top__right-avatar' />
                {identity == 5 && (
                  <Image
                    src={TagIcon}
                    mode='aspectFit'
                    className='user-float-top__right-avatar-tag'
                  />
                )}
              </View>
            </View>
            <View className='user-float-top__user'>
              <View className='user-float-top__user-name'>{nickName}</View>
              <View className='user-float-top__user-school'>{schoolName}</View>
            </View>
          </View>
          <View className='user-float-bottom'>
            <Button
              className={`user-float-bottom__btn ${isFollow && 'green-btn'}`}
              onClick={this.handleFollowToPerson}
            >
              {isFollow ? '已关注' : '关注'}
            </Button>
            <Button className='user-float-bottom__btn' onClick={this.handleJumpToPerson}>
              个人主页
            </Button>
            <Button className='user-float-bottom__btn' onClick={this.handleJumpToChat}>
              私聊
            </Button>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}

export default GiftPopup
