import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import BottomText from '@/components/bottomText'

import PingLunIcon from '@/assets/imgs/forum/pinglun.png'
import ZanIcon from '@/assets/imgs/forum/dianzan.png'

import api from '@/api'
import D from '@/common'
// import withScrollPage from '@/hocs/scrollPage'

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
        name: '赞',
        url: '/pages/wnh/comment',
        icon: ZanIcon,
        bgColor: '#F87659',
        url: '/pages/wnh/comment/index'
      }
    ],
    pageParams: {
      limit: 50,
      page: 1,
      hasNext: true,
      isLoading: false,
      total: 0
    },
    total: 0,
    chatList: [],
    isFirst: true
  }

  componentDidMount() {
    // this.nextPage()
    // console.log(this.state)
    // this.setState({ isFirst: false })
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount')
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  componentDidShow() {
    // const { isFirst } = this.state

    // if (!isFirst) {
    //   this.getNewMessage()
    // }
    // this.setState({ chatList: [] }, () => {
    this.resetPage(this.nextPage)
    // })

    // this.getNewMessage(true)

    this.timer = setInterval(() => {
      this.getNewMessage()
    }, 2000)
  }

  componentDidHide() {
    // console.log('componentDidHide')
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  timer = null

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onPullDownRefresh = () => {
    // this.setState({ }, () => {
    this.resetPage(this.nextPage)
    // })
  }

  nextPage = async () => {
    const { pageParams } = this.state

    if (!pageParams.hasNext || pageParams.isLoading) return

    pageParams.isLoading = true

    this.setState({
      pageParams
    })

    const { limit, page } = pageParams

    const { total } = await this.fetch({ limit, page })

    if (!total || total < limit * page) {
      pageParams.hasNext = false
    }

    const nextPageParams = {
      ...pageParams,
      page: pageParams.page + 1,
      isLoading: false,
      total
    }

    this.setState({
      pageParams: nextPageParams
    })
  }

  resetPage(cb = () => {}) {
    const { pageParams } = this.state

    const resetPageParams = {
      ...(pageParams || {}),
      page: 1,
      limit: 50,
      isLoading: false,
      hasNext: true
    }

    this.setState({ pageParams: resetPageParams }, cb)
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

    const cl = chatList.concat()

    const query = {
      ...params
    }

    // Taro.showLoading({
    //   title: '加载中',
    //   icon: 'none'
    // })

    try {
      const {
        data: { list, total }
      } = await api.chat.GET_CHAT_LIST(query)
      // console.log(data, count, 1000)
      let nList = list.map((item) => {
        let receiveTime = D.formatTimer(item.receiveTime)
        let isImg = item.lastMessage.split('img:').length > 1

        return {
          ...item,
          receiveTime,
          isImg
        }
      })

      // console.log(params)

      // if (params.page != 1) {
      // nList = [...chatList, ...nList]
      let nnList = []

      nList.forEach((item) => {
        const res = cl.findIndex((info) => info.id === item.id)
        // console.log(res)
        if (res != -1) {
          cl[res] = item
        } else {
          nnList.push(item)
          // console.log(val)
        }
      })
      // }
      console.log(nnList)
      // nList = [...chatList, ...nList]

      // Taro.hideLoading()

      // Taro.stopPullDownRefresh()

      this.setState({ chatList: [...cl, ...nnList], total })

      return { total }
    } catch (e) {
      // Taro.hideLoading()
      // Taro.stopPullDownRefresh()

      console.log(e)
    }
  }

  getNewMessage = async () => {
    try {
      const { data } = await api.chat.SELECT_NEW_CHAT()

      if (data) {
        this.resetPage(this.nextPage)
      }
    } catch (e) {
      console.log(e)
    }
  }

  fetchDeleteChat = async (e, item, index) => {
    const { chatList } = this.state

    e.stopPropagation()

    const query = {
      receive: item.sender
    }

    const { errno, data } = await api.chat.CLEAR_CHAT(query)

    let cl = chatList.concat()

    cl.splice(index, 1)

    if (!errno) {
      this.setState({ chatList: cl })
    }
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { navList, chatList } = this.state

    // const NavList = navList.map((item) => {
    //   return (
    //     <View key={item.icon} className='list-item' onClick={this.onJump(item.url)}>
    //       <View style={{ background: item.bgColor }} className='list-item__icon'>
    //         <Image src={item.icon} mode='aspectFit' className='list-item__icon-img' />
    //       </View>
    //       <View className='list-item__info'>
    //         <View className='list-item__info-name'>{item.name}</View>
    //         <View className='at-icon at-icon-chevron-right'></View>
    //       </View>
    //     </View>
    //   )
    // })

    const List = chatList.map((item, index) => {
      return (
        <View key={item.id} className='list-item__container'>
          <View className='list-item' onClick={this.onJumpToChat(item.sender)}>
            <Image src={item.avatar} className='list-item__avatar' />
            <View className='list-item__info'>
              <View>
                <View className='list-item__info-name'>{item.nickname}</View>
                <View className='list-item__info-desc'>
                  {item.isImg ? '图片' : item.lastMessage}
                </View>
              </View>
              <View className='list-item__date'>{item.receiveTime}</View>
              {item.messageNum > 0 && <View className='list-item__dot'>{item.messageNum}</View>}
            </View>
          </View>
          <View className='list-item__del' onClick={(e) => this.fetchDeleteChat(e, item, index)}>
            删除
          </View>
        </View>
      )
    })

    return (
      <View className='person'>
        <View className='list'>
          {/* {NavList} */}
          {List}
          {!chatList.length && (
            <View className='default'>
              <BottomText msg='暂无消息' />
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default Person
