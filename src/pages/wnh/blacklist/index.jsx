import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
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
    // current: 0,
    // navList: [
    //   { type: 'follow', title: '关注' },
    //   { type: 'fans', title: '粉丝' }
    // ],
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

  openModal = (user) => () => {
    this.setState({ curUser: user, isOpened: true })
  }

  closeModal = () => {
    this.setState({ isOpened: false })
  }

  fetchBlack = async () => {
    const { curUser } = this.state

    const query = {
      beUserId: curUser.beUserId
    }

    try {
      const { data, errno } = await api.blackList.CHANGE_BLACK(query)

      if (!errno) {
        // let msg = !isBlack ? '加入黑名单成功' : ''

        D.toast('已从黑名单移除')

        this.setState({ followList: [], isOpened: false }, () => {
          this.resetPage(this.nextPage)
        })
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  getFollowList = async (params) => {
    const { followList } = this.state

    let query = {
      ...params
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { list, total }
      } = await api.blackList.GET_BLACKLIST(query)

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
      Taro.hideLoading()

      console.log(e)
    }
  }

  render() {
    const { isOpened, followList } = this.state

    const FollowList = followList.map((item) => {
      return (
        <View key={item.beUserId} className='list-item'>
          <View className='list-item__left'>
            <Image src={item.avatar} className='list-item__left-avatar' />
            <View className='list-item__left-info'>
              <View className='list-item__left-info__name'>{item.nickname}</View>
            </View>
          </View>
          <View className='list-item__btn' onClick={this.openModal(item)}>
            移除黑名单
          </View>
        </View>
      )
    })

    return (
      <View className='comment'>
        <View className='list'>{FollowList}</View>
        <AtModal
          isOpened={isOpened}
          cancelText='取消'
          confirmText='确认'
          onClose={this.closeModal}
          onCancel={this.closeModal}
          onConfirm={this.fetchBlack}
          content='确定移除黑名单？'
        />
      </View>
    )
  }
}

export default withScrollPage(Follow)
