import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import OneIcon from '@/assets/imgs/forum/one.png'
import TwoIcon from '@/assets/imgs/forum/two.png'
import ThreeIcon from '@/assets/imgs/forum/three.png'

import './index.scss'

class Gift extends Component {
  state = {
    total: 0,
    rankList: [],
    totalMoneys: 0
  }

  componentDidShow() {
    this.setState({ rankList: [] }, () => {
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
    const { total } = await this.getRankingList(params)

    return { total }
  }

  getRankingList = async (params) => {
    const { rankList } = this.state

    let resApi,
      query = {
        ...params,
        postId: this.id
      }

    switch (this.type) {
      case 'tree':
        resApi = api.forum.GET_RANKING_BY_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.GET_RANKING_BY_HOT_POSTS
        break
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: {
          data: { list, total },
          totalMoneys
        }
      } = await resApi(query)

      let nList = list.map((item) => {
        return {
          ...item
        }
      })

      nList = [...rankList, ...nList]

      Taro.hideLoading()

      this.setState({ rankList: nList, totalMoneys, total })

      return { total }
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

  get type() {
    return this.route.params.type
  }
  render() {
    const { total, rankList, totalMoneys } = this.state

    const RankList = rankList.map((item, index) => {
      return (
        <View key={item.id} className='list-item'>
          {index === 0 && <Image src={OneIcon} className='list-item__icon' />}
          {index === 1 && <Image src={TwoIcon} className='list-item__icon' />}
          {index === 2 && <Image src={ThreeIcon} className='list-item__icon' />}
          <Image src={item.avatar} className='list-item__avatar' />
          <View className='list-item__info'>
            <View className='list-item__info-name'>{item.nickname}</View>
            <View className='list-item__info-desc'>{item.totalMoney}盒盒币</View>
          </View>
          <View className='list-item__btn'>关注</View>
          {/* <Image src={GiftIcon} className='list-item__emj' /> */}
        </View>
      )
    })

    return (
      <View className='gift'>
        <View className='title'>
          <Text>共获</Text>
          <Text className='green'>{totalMoneys}</Text>
          <Text>盒盒币</Text>
          <Text className='green'>{total}</Text>
          <Text>人送礼</Text>
        </View>
        <View className='list'>{RankList}</View>
        {rankList.length > 0 && (
          <View className='footer-item'>
            <Image src={rankList[0].avatar} className='footer-item__avatar' />
            <View className='footer-item__info'>
              <View className='footer-item__info-name'>{rankList[0].nickname}</View>
              <View className='footer-item__info-desc'>{rankList[0].totalMoney}盒盒币 第一名</View>
            </View>
            <View className='footer-item__btn'>送礼</View>
          </View>
        )}
      </View>
    )
  }
}

export default withScrollPage(Gift)
