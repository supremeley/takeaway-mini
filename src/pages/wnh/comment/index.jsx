import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import GiftIcon from '@/assets/imgs/forum/gift.png'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Comment extends Component {
  state = {
    total: 0,
    commentList: [],
    navList: [
      { type: 'comment', title: '我的评论' },
      { type: 'commented', title: '评论我的' }
    ],
    current: 0
  }

  componentDidShow() {
    this.setState({ commentList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  fetch = async (params) => {
    const { total } = await this.getCommentList(params)

    return { total }
  }

  checkTab = (index) => () => {
    this.setState({ current: index, commentList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getCommentList = async (params) => {
    const { navList, current, commentList } = this.state

    const type = navList[current].type

    let resApi,
      query = {
        ...params
      }

    switch (type) {
      case 'comment':
        resApi = api.mine.GET_MINE_COMMENT
        break
      case 'commented':
      default:
        resApi = api.mine.GET_MINE_COMMENT_BY_USER
        break
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { list, total }
      } = await resApi(query)

      let nList = list.map((item) => {
        return {
          ...item
        }
      })

      nList = nList.map((item) => {
        let commentDate = D.formatTimer(item.commentDate)

        let context,
          content,
          imgList = []

        try {
          context = JSON.parse(item.context)

          imgList = context.imgList
          content = context.context
        } catch {
          content = context
        }

        return {
          ...item,
          commentDate,
          content,
          imgList
        }
      })

      nList = [...commentList, ...nList]

      Taro.hideLoading()

      this.setState({ commentList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  // get id() {
  //   return this.route.params.id
  // }

  // get route() {
  //   return getCurrentInstance().router
  // }

  render() {
    const { commentList, navList, current } = this.state

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
          {commentList &&
            commentList.map((item) => {
              return (
                <View key={item.commentDate} className='list-item'>
                  <View className='list-item__top'>
                    <Image src={item.avatar} mode='aspectFill' className='list-item__top-avatar' />
                    <View className='list-item__top-info'>
                      <View className='list-item__top-info__name'>{item.nickName}</View>
                      <View className='list-item__top-info__desc'>{item.commentDate}</View>
                    </View>
                    {/* <View className='list-item__top-btn'>关注</View> */}
                  </View>
                  <View className='list-item__desc'>
                    <Text>回复</Text>
                    {/* <Text className='green'>@凌夕:</Text> */}
                    <Text>{item.comment}</Text>
                  </View>
                  <View className='list-item__content'>
                    <View className='list-item__content-info'>
                      {item.imgList && item.imgList.length > 0 && (
                        <Image src={item.imgList[0]} mode='aspectFill' className='list-item__content-info__img' />
                      )}

                      <View className='list-item__content-info__right'>
                        <View className='list-item__content-info__right-title'>{item.content}</View>
                        {/* <View className='list-item__content-info__right-desc'>xxxxxxxx</View> */}
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

export default withScrollPage(Comment)
