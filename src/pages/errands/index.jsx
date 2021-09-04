import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Default from '@/components/default'
// import api from '@/api'
import ProveIcon from '@/assets/imgs/prove/popop.png'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Errands extends Component {
  state = {
    errandsList: []
  }

  componentDidMount() {
    // const info = Taro.getMenuButtonBoundingClientRect()

    // this.setState({ safeTop: info.top })

    // this.fetchData()
    // this.getLocation()
    this.nextPage()
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onPullDownRefresh = () => {
    this.setState({ postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onShareAppMessage = async () => {
    const { postsList, curPostsIndex, navOpt, curNav } = this.state

    const curPosts = postsList[curPostsIndex]

    const type = navOpt[curNav].type

    const title = curPosts.content || '万能盒'

    const path = `/pages/wnh/posts/index?id=${curPosts.postId}&type=${type}` || '/pages/forum/index'

    return {
      title,
      path,
      imageUrl: ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getPostsList(params)

    return { total }
  }

  getPostsList = async (params) => {
    const { errandsList } = this.state

    let query = {
      ...params
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const { list, total } = await api.pt.GET_ERRANDS_LIST(query)
      // console.log(list)

      let nList = list.map((item) => {
        let endTime = D.formatTimer(item.endTime, 'm-d h-m')
        let initiationTime = D.formatTimer(item.initiationTime, 'm-d h-m')
        let sex = item.sex == 1 ? '男' : '女'
        let theSize = item.theSize == 5 ? '小' : '大'

        return {
          ...item,
          endTime,
          initiationTime,
          sex,
          theSize
        }
      })

      nList = [...errandsList, ...nList]

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ errandsList: nList, total })
      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { errandsList } = this.state

    const ErrandsList =
      errandsList &&
      errandsList.map((item) => {
        return (
          <View key={item.id} className='list-item'>
            <View className='list-item__top'>
              <Image src={item.avatar} className='list-item__top-avatar' />
              <View className='list-item__top-info'>
                <View className='list-item__top-info__name'>{item.nickname}</View>
                {/* <View className='list-item__top-info__date'>20:00 xxxx</View> */}
              </View>
            </View>
            <View className='list-item__title'>
              <View className='list-item__title-tag'>{item.tagName}</View>
              <View className='list-item__title-con'>
                <View className='list-item__title-info'>{item.theSize}</View>
              </View>
              <View className='list-item__title-price'>
                <Image src={ProveIcon} className='list-item__title-price__icon' />
                {item.price}
              </View>
            </View>
            <View className='list-item__info'>
              <View className='list-item__info-icon '>取</View>
              <View className='list-item__info-text'>{item.pickupAddress}</View>
            </View>
            <View className='list-item__info'>
              <View className='list-item__info-icon song-icon'>送</View>
              <View className='list-item__info-text'>{item.deliveryAddress}</View>
            </View>
            <View className='list-item__content'>
              <View className='list-item__content-item'>
                <View>跑腿件数:</View>
                <View>{item.nums}</View>
              </View>
              <View className='list-item__content-item'>
                <View>性别需求:</View>
                <View>{item.sex}</View>
              </View>
            </View>
            <View className='list-item__content'>
              <View className='list-item__content-item'>
                <View>送达时间:</View>
                <View>{item.endTime}</View>
              </View>
              <View className='list-item__content-item'>
                <View>发单时间:</View>
                <View>{item.initiationTime}</View>
              </View>
            </View>
            <View className='list-item__bottom'>
              <View className='list-item__bottom-text'>备注：{item.context}</View>
              <View className='list-item__bottom-btn'>立即接单</View>
            </View>
          </View>
        )
      })

    return (
      <View className='errands'>
        <View className='content'>{ErrandsList}</View>
        {/* <Default msg='敬请期待' /> */}
      </View>
    )
  }
}

export default withScrollPage(Errands)
