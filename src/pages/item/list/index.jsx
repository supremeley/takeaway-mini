import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Input } from '@tarojs/components'
import ShopItem from '@/components/shopItem'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import withScrollPage from '@/hoc/scrollPage'

import 'taro-ui/dist/style/components/search-bar.scss'
import './index.scss'

class ItemList extends Component {
  state = {
    keywords: '',
    total: 0,
    tagList: [],
    shopList: [
      // {
      //   desc: 'audo',
      //   floorPrice: 0,
      //   id: 1001014,
      //   name: '奥迪',
      //   picUrl: 'https://tianhei-takeaway.oss-cn-shanghai.aliyuncs.com/mpt5djyj4yz535pw1tgy.jpg'
      // }
    ]
  }

  componentDidShow() {
    // if (this.keywords) this.setState({ keywords: this.keywords })
    // console.log(this.state)

    const tagList = Taro.getStorageSync('searchList')
    this.setState({ tagList })
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  fetch = async (params) => {
    const { total } = await this.getBrandList(params)

    return { total }
  }

  onChange = (e) => {
    this.setState({ keywords: e.detail.value })
  }

  onConfirm = () => {
    const { keywords } = this.state

    let tagList = Taro.getStorageSync('searchList') || []

    tagList.push(keywords)

    Taro.setStorageSync('searchList', tagList)

    this.setState({ tagList }, () => {
      this.nextPage()
    })
  }

  onJump = (id) => {
    Taro.navigateTo({ url: `/pages/item/detail/index?id=${id}` })
  }

  clearTag = () => {
    const tagList = []
    Taro.setStorageSync('searchList', tagList)
    this.setState({ tagList })
  }

  getBrandList = async (params) => {
    const { schoolId } = this.state

    const query = { schoolId, ...params }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const {
      data: { brandList: shopList, totalPages: total }
    } = await api.shop.GET_BRAND_LIST(query)

    let nList = shopList

    nList = [...this.state.shopList, ...nList]

    Taro.hideLoading()

    this.setState({ shopList: nList, total })

    return { total }
  }

  get keywords() {
    return this.route.params.keywords
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { total, pageParams, keywords, tagList, shopList } = this.state

    const GoodsList =
      shopList &&
      shopList.map((item) => {
        return <ShopItem info={item} key={item.id} onClick={this.onJump} />
      })

    return (
      <View className='index'>
        <View className='search-container'>
          <View className='header-search'>
            <View className='at-icon at-icon-search'></View>
            <Input
              value={keywords}
              type='text'
              placeholder='请输入店铺名称'
              onInput={this.onChange}
              onConfirm={this.onConfirm}
            />
          </View>
        </View>
        {tagList && (
          <View className='tag-container'>
            <View className='tag'>
              {tagList &&
                tagList.map((item) => {
                  return (
                    <View key={item} className='tag-item'>
                      {item}
                    </View>
                  )
                })}
            </View>
            <View className='tag-btn' onClick={this.clearTag}>
              清空
            </View>
          </View>
        )}
        <View className='goods-container'>
          <View className='goods'>{GoodsList}</View>
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </View>
      </View>
    )
  }
}

export default withScrollPage(ItemList)
