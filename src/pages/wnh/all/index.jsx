import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

import PingLunIcon from '@/assets/imgs/forum/pinglun.png'
import ZanIcon from '@/assets/imgs/forum/dianzan.png'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Person extends Component {
  state = {
    navList: [
      {
        name: '评论',
        url: '/pages/wnh/comment',
        icon: PingLunIcon,
        bgColor: '#FDCF51',
        url: '/pages/wnh/comment/index'
      },
      {
        name: '点赞',
        url: '/pages/wnh/comment',
        icon: ZanIcon,
        bgColor: '#F87659',
        url: '/pages/wnh/like/index'
      }
    ],
    total: 0,
    chatList: [],
    isFirst: true
  }

  componentDidMount() {
    // this.nextPage()

    // this.setState({ isFirst: false })
  }

  timer = null

  componentDidShow() {
    const { isFirst } = this.state

    if (!isFirst) {
      this.getNewMessage()
    }

    this.timer = setInterval(() => {
      this.getNewMessage()
    }, 5000)
  }

  componentDidHide() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onPullDownRefresh = () => {
    this.setState({ chatList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  fetch = async (params) => {
    const { total } = await this.getChatList(params)

    return { total }
  }

  onJump = (url) => () => {
    Taro.navigateTo({ url })
  }

  onJumpToChat = (id) => () => {
    Taro.navigateTo({ url: `/pages/wnh/chat/index?id=${id}` })
  }

  getChatList = async (params) => {
    const { chatList } = this.state

    const query = {
      ...params
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { list, total }
      } = await api.chat.GET_CHAT_LIST(query)
      // console.log(data, count, 1000)
      let nList = list.map((item) => {
        let receiveTime = D.formatTimer(item.receiveTime)
        return {
          ...item,
          receiveTime
        }
      })

      nList = [...chatList, ...nList]

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ chatList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  getNewMessage = async () => {
    try {
      const { data } = await api.chat.SELECT_NEW_CHAT()
      if (data) {
        this.setState({ chatList: [] }, () => {
          this.resetPage(this.nextPage)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  fetchDeleteChat = async (e, item) => {
    e.stopPropagation()

    const query = {
      receive: item.sender
    }

    const { data } = await api.chat.CLEAR_CHAT(query)
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { navList, chatList } = this.state

    const NavList = navList.map((item) => {
      return (
        <View key={item.icon} className='list-item' onClick={this.onJump(item.url)}>
          <View style={{ background: item.bgColor }} className='list-item__icon'>
            <Image src={item.icon} mode='aspectFit' className='list-item__icon-img' />
          </View>
          <View className='list-item__info'>
            <View className='list-item__info-name'>{item.name}</View>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
      )
    })

    const List = chatList.map((item) => {
      return (
        <View key={item.id} className='list-item__container'>
          <View className='list-item' onClick={this.onJumpToChat(item.sender)}>
            <Image src={item.avatar} className='list-item__avatar' />
            <View className='list-item__info'>
              <View>
                <View className='list-item__info-name'>{item.nickname}</View>
                <View className='list-item__info-desc'>{item.lastMessage}</View>
              </View>
              <View className='list-item__date'>{item.receiveTime}</View>
              {item.messageNum > 0 && <View className='list-item__dot'>{item.messageNum}</View>}
            </View>
          </View>
          <View className='list-item__del' onClick={(e) => this.fetchDeleteChat(e, item)}>
            删除
          </View>
        </View>
      )
    })

    return (
      <View className='person'>
        <View className='list'>
          {NavList}
          {/* {List} */}
        </View>
      </View>
    )
  }
}

export default withScrollPage(Person)
