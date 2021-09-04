import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtModal } from 'taro-ui'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

class Follow extends Component {
  state = {
    total: 0,
    followList: [],
    current: 0,
    navList: [
      { type: 'follow', title: '关注' },
      { type: 'fans', title: '粉丝' }
    ],
    isOpened: false,
    curUser: null
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
    const { total } = await this.getFollowList(params)

    return { total }
  }

  checkTab = (index) => () => {
    this.setState({ current: index, followList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  openModal = (user) => () => {
    this.setState({ curUser: user, isOpened: true })
  }

  closeModal = () => {
    this.setState({ isOpened: false })
  }

  fetchFollow = async (id) => {
    const { navList, current, curUser } = this.state

    const type = navList[current].type

    let query = {}

    switch (type) {
      case 'follow':
        query.beUserId = curUser.beUserId
        break
      case 'fans':
        query.beUserId = id
    }

    try {
      const { data, errno } = await api.mine.CHANGE_FOLLOW_PERSON(query)

      if (!errno) {
        let msg = type == 'follow' ? '取消关注成功' : '关注成功'

        D.toast(msg)

        this.setState({ followList: [], isOpened: false }, () => {
          this.resetPage(this.nextPage)
        })
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  getFollowList = async (params) => {
    const { navList, current, followList } = this.state

    const type = navList[current].type

    let resApi,
      query = {
        ...params
      }

    switch (type) {
      case 'follow':
        resApi = api.mine.GET_FOLLOW_LIST
        break
      case 'fans':
      default:
        resApi = api.mine.GET_FANS_LIST
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

      nList = [...followList, ...nList]

      Taro.hideLoading()

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
    const { isOpened, followList, navList, current } = this.state

    const FollowList = followList.map((item) => {
      // if (item.isEoFollow == 10) {
      //   return null
      // }

      return (
        <View key={item.beUserId} className='list-item'>
          <View className='list-item__left'>
            <Image src={item.avatar} className='list-item__left-avatar' />
            <View className='list-item__left-info'>
              <View className='list-item__left-info__name'>{item.nickName}</View>
            </View>
          </View>
          {/* <View className='list-item__btn' onClick={() => this.fetchFollow(item.beUserId)}>
            相互关注
          </View> */}
          {navList[current].type == 'follow' && (
            <View className='list-item__btn' onClick={this.openModal(item)}>
              取消关注
            </View>
          )}
          {navList[current].type == 'fans' && (
            <>
              {item.isEoFollow == 10 ? (
                <View className='list-item__btn'>相互关注</View>
              ) : (
                <View className='list-item__btn' onClick={() => this.fetchFollow(item.userId)}>
                  立刻关注
                </View>
              )}
            </>
          )}
        </View>
      )
    })

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
        <View className='list'>{FollowList}</View>
        <AtModal
          isOpened={isOpened}
          cancelText='取消'
          confirmText='确认'
          onClose={this.closeModal}
          onCancel={this.closeModal}
          onConfirm={this.fetchFollow}
          content='确定不再关注？'
        />
      </View>
    )
  }
}

export default withScrollPage(Follow)
