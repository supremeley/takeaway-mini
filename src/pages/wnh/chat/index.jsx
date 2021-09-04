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
    chatList: [],
    lastId: '',
    lastPage: ''
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  componentDidShow() {
    this.nextPage()

    this.timer = setInterval(() => {
      this.getNewMessage()
    }, 2000)
  }

  componentDidHide() {
    console.log('componentDidHide')
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

  timer = null

  fetch = async (params) => {
    const { total } = await this.getChatList(params)

    return { total }
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  previewImg = (url) => () => {
    Taro.previewImage({
      current: url,
      urls: [url]
    })
  }

  getNewMessage = async () => {
    const query = {
      receive: this.id
    }

    try {
      const { data } = await api.chat.SELECT_NEW_CHAT(query)

      if (data) {
        if (this.state.pageParams.page == 2) {
          this.resetPage(this.nextPage)
        } else {
          this.setState({ messageNum: data })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  getChatList = async (params) => {
    const { chatList, lastId, lastPage } = this.state

    const query = {
      ...params,
      receive: this.id
    }

    if (params.page != 1) {
      Taro.showLoading({
        title: '加载中',
        icon: 'none'
      })
    }

    try {
      const {
        data: { list, total }
      } = await api.chat.GET_CHAT_LIST_BY_USER(query)
      // console.log(data, count, 1000)
      let nList = list.map((item) => {
        let receiveTime = D.formatTimer(item.receiveTime)
        let contextImg = item.context.split('img:').length ? item.context.split('img:')[1] : null

        return {
          ...item,
          receiveTime,
          contextImg
        }
      })

      nList = nList.reverse()

      let cl = chatList.concat()

      let isPush = nList.find((item) => item.id === lastId)

      let nnList = nList.filter((item) => {
        const res = cl.find((info) => info.id === item.id)

        return !res
      })
      console.log(isPush, params.page, lastPage)
      if ((isPush || params.page > lastPage) && chatList.length >= params.limit) {
        cl.unshift(...nnList)
      } else {
        cl.push(...nnList)
      }

      Taro.hideLoading()

      Taro.stopPullDownRefresh()
      // console.log(cl)
      this.setState({ chatList: cl, lastId: cl[0].id, lastPage: params.page }, () => {
        if (this.state.pageParams.page == 1) {
          Taro.nextTick(() => {
            const q = Taro.createSelectorQuery()
            // console.log(q)
            const selector = q.selectAll(`.list-item`).boundingClientRect()
            // console.log(selector)
            selector.exec((res) => {
              console.log(res)
              Taro.pageScrollTo({
                scrollTop: res[res.length - 1].bottom + 15,
                duration: 300
                // success: (e) => {
                //   console.log(e)
                // }
              })
            })
          })
        }
      })

      return { total }
    } catch (e) {
      console.log(e)
      Taro.hideLoading()

      // this.setState({ chatList: [] })
    }
  }

  fetchComment = async () => {
    const { commentContext, chatList, userId } = this.state

    if (!commentContext) {
      D.toast('请输入评论内容')
      return
    }

    // const userInfo = Taro.getStorageSync('userInfo')

    let query = {
      senderId: userId,
      receive: this.id,
      context: commentContext
    }

    try {
      const { errno, data } = await api.chat.SEND_CHAT(query)

      if (!errno) {
        D.toast(data)

        this.setState({ commentContext: '' }, () => {
          this.resetPage(this.nextPage)
          // console.log(this.state.pageParams)
          // if (this.state.pageParams.page === 2) {
          setTimeout(() => {
            Taro.nextTick(() => {
              const q = Taro.createSelectorQuery()
              // console.log(q)

              const selector = q.selectAll(`.list-item`).boundingClientRect()
              // console.log(selector)
              selector.exec((res) => {
                console.log(res)
                Taro.pageScrollTo({
                  scrollTop: res[res.length - 1].bottom + 15,
                  duration: 300
                  // success: (e) => {
                  //   console.log(e)
                  // }
                })
              })
            })
          }, 500)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  fetchCommentImg = async (img) => {
    const { chatList, userId } = this.state

    // if (!commentContext) {
    //   D.toast('请输入评论内容')
    //   return
    // }

    // const userInfo = Taro.getStorageSync('userInfo')

    const { url: contextImg } = await api.common.UPLOAD_IMG(img)
    // console.log(contextImg)
    // return
    let query = {
      context: `img:${contextImg}`,
      senderId: userId,
      receive: this.id
      // context: commentContext
    }

    try {
      const { errno, data } = await api.chat.SEND_CHAT(query)

      if (!errno) {
        D.toast(data)

        this.setState({ commentContext: '' }, () => {
          this.resetPage(this.nextPage)
          // console.log(this.state.pageParams)
          // if (this.state.pageParams.page === 2) {
          // setTimeout(() => {
          Taro.nextTick(() => {
            const q = Taro.createSelectorQuery()
            // console.log(q)
            const selector = q.selectAll(`.list-item`).boundingClientRect()
            // console.log(selector)
            selector.exec((res) => {
              console.log(res)
              Taro.pageScrollTo({
                scrollTop: res[res.length - 1].bottom + 15,
                duration: 300
                // success: (e) => {
                //   console.log(e)
                // }
              })
            })
          })
          // }, 500)
        })
      }
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

          {item.contextImg ? (
            <Image
              src={item.contextImg}
              mode='aspectFill'
              className='list-item__img'
              onClick={this.previewImg(item.contextImg)}
            />
          ) : (
            <View className='list-item__info'>{item.context}</View>
          )}
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
          onSubmitImg={this.fetchCommentImg}
        />
      </View>
    )
  }
}

export default withScrollPage(Chat)
