import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import UnlikeIcon from '@/assets/imgs/forum/unlike.png'
import LikeIcon from '@/assets/imgs/forum/like.png'
import AddressIcon from '@/assets/imgs/forum/address.png'
import CommitIcon from '@/assets/imgs/forum/commit.png'
import ShareIcon from '@/assets/imgs/forum/share.png'
import OptionIcon from '@/assets/imgs/forum/option.png'

import './index.scss'

class Comment extends Component {
  state = {
    list: [],
    navList: [
      { status: 0, title: '我的评论' },
      { status: 1, title: '评论我的' }
    ],
    current: 0
  }

  checkTab = (index) => () => {
    this.setState({ current: index })
  }

  handleClick = () => {
    const { onHandleClick } = this.props

    onHandleClick && onHandleClick()
  }

  onHandleLike = (e) => {
    e.stopPropagation()

    const { onHandleLike } = this.props

    onHandleLike && onHandleLike()
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { list, navList, current } = this.state

    return (
      <View className='comment'>
        <View className='nav'>
          {navList &&
            navList.map((item, index) => {
              return (
                <View key={item.title} className='nav-item' onClick={this.checkTab(index)}>
                  <Text className={`nav-item-text ${current === index ? 'active' : ''}`}>
                    {item.title}
                  </Text>
                </View>
              )
            })}
        </View>
        <View className='list'>
          <View className='list-item'>
            <View className='list-item__top'>
              <Image src={GiftIcon} className='list-item__top-avatar' />
              <View className='list-item__top-info'>
                <View className='list-item__top-info__name'>xxxxxxxxx</View>
                <View className='list-item__top-info__desc'>xxxxxxxx</View>
              </View>
              <View className='list-item__top-btn'>关注</View>
            </View>
            <View className='list-item__desc'>
              <Text>回复</Text>
              <Text className='green'>@凌夕:</Text>
              <Text>欢迎来到上海</Text>
            </View>
            <View className='list-item__content'>
              <View className='list-item__content-desc'>
                <Text className='green'>@凌夕:</Text>
                <Text>欢迎来到上海</Text>
              </View>
              <View className='list-item__content-info'>
                <Image src={GiftIcon} className='list-item__content-info__img' />
                <View className='list-item__content-info__right'>
                  <View className='list-item__content-info__right-title'>xxxxxxxxx</View>
                  <View className='list-item__content-info__right-desc'>xxxxxxxx</View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Comment
