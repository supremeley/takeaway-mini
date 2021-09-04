import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Comment extends Component {
  state = {
    total: 0,
    followList: [],
    navList: [
      { type: 'like', title: '我的点赞' },
      { type: 'liked', title: '点赞我的' }
    ],
    current: 0
  }

  componentDidShow() {
    this.setState({ followList: [] }, () => {
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
    const { total } = await this.getLikeList(params)

    return { total }
  }

  checkTab = (index) => () => {
    this.setState({ current: index, followList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getLikeList = async (params) => {
    const { navList, current, followList } = this.state

    const type = navList[current].type

    let resApi,
      query = {
        ...params
      }

    switch (type) {
      case 'like':
        resApi = api.mine.GET_MINE_LIKE
        break
      case 'liked':
      default:
        resApi = api.mine.GET_MINE_LIKE_BY_USER
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
        let fabulousDate = D.formatTimer(item.fabulousDate)

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
          fabulousDate,
          content,
          imgList
        }
      })

      nList = [...followList, ...nList]

      Taro.hideLoading()
      // debugger
      this.setState({ followList: nList, total })

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
    const { followList, navList, current } = this.state

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
          {followList &&
            followList.map((item) => {
              return (
                <View key={item.fabulousDate} className='list-item'>
                  <View className='list-item__top'>
                    <Image src={item.avatar} mode='aspectFill' className='list-item__top-avatar' />
                    <View className='list-item__top-info'>
                      <View className='list-item__top-info__name'>{item.nickName}</View>
                      <View className='list-item__top-info__desc'>{item.fabulousDate}</View>
                    </View>
                    {/* <View className='list-item__top-btn'>关注</View> */}
                  </View>
                  <View className='list-item__desc'>
                    {item.typa == 1 ? '赞了这个帖子' : '赞了这个评论'}
                  </View>
                  <View className='list-item__content'>
                    <View className='list-item__content-info'>
                      {item.imgList && item.imgList.length > 0 && (
                        <Image
                          src={item.imgList[0]}
                          mode='aspectFill'
                          className='list-item__content-info__img'
                        />
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
