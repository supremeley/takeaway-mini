import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import FooterComment from '@/components/footerComment'

import GiftIcon from '@/assets/imgs/forum/gift.png'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Chat extends Component {
  state = {
    userId: Taro.getStorageSync('userId'),
    total: 0,
    commentContext: '',
    chatList: [
      // {}, { user: true }, {}, {}, { user: true }
    ]
  }

  timer = null

  componentDidShow() {
    this.nextPage()
  }

  componentDidHide() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  // 下拉加载
  onPullDownRefresh = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  fetch = async (params) => {
    const { total } = await this.getChatList(params)

    return { total }
  }

  getChatList = async (params) => {
    const { chatList } = this.state

    const query = {
      ...params,
      receive: this.id
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { list, total }
      } = await api.chat.GET_CHAT_LIST_BY_USER(query)
      // console.log(data, count, 1000)
      let nList = list.map((item) => {
        let receiveTime = D.formatTimer(item.receiveTime)
        return {
          ...item,
          receiveTime
        }
      })

      nList = nList.reverse()

      nList = [...nList, ...chatList]

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ chatList: nList }, () => {
        if (this.state.pageParams.page === 1) {
          // setTimeout(() => {
          Taro.nextTick(() => {
            const q = Taro.createSelectorQuery()
            // console.log(q)
            const selector = q.select(`.chat`).boundingClientRect()
            // console.log(selector)

            selector.exec((res) => {
              // console.log(res)
              Taro.pageScrollTo({
                scrollTop: res[0].bottom,
                duration: 300
                // success: (e) => {
                //   console.log(e)
                // }
              })
            })
          })
          // }, 500)
        }
      })

      return { total }
    } catch (e) {
      console.log(e)
      Taro.hideLoading()

      this.setState({ chatList: [] })
    }
  }

  getNewMessage = async () => {
    const query = {
      receive: this.id
    }

    try {
      const { data } = await api.chat.SELECT_NEW_CHAT(query)
    } catch (e) {
      console.log(e)
    }
  }

  fetchComment = async () => {
    const { commentContext, chatList, userId } = this.state

    if (!commentContext) {
      D.toast('请输入评论内容')
      return
    }

    const userInfo = Taro.getStorageSync('userInfo')

    let query = {
      senderId: userId,
      receive: this.id,
      context: commentContext
    }

    try {
      const { data } = await api.chat.SEND_CHAT(query)

      // Taro.stopPullDownRefresh()

      let lc = chatList.concat()

      lc.push({ avatar: userInfo.avatarUrl, ...query, sender: userId })

      D.toast(data)

      this.setState({ commentContext: '', chatList: lc })
    } catch (e) {
      console.log(e)
    }
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { chatList, commentContext, userId } = this.state

    const List = chatList.map((item) => {
      return (
        <View key={item.id} className={`list-item ${item.sender == userId && 'user-item'}`}>
          <Image src={item.avatar} className='list-item__avatar' />
          <View className='list-item__info'>{item.context}</View>
        </View>
      )
    })

    return (
      <View className='chat'>
        <View className='list'>{List}</View>
        <FooterComment
          // focus={inpFocus}
          content={commentContext}
          onChange={this.onChangeInp}
          onSubmit={this.fetchComment}
        />
      </View>
    )
  }
}

export default withScrollPage(Chat)
