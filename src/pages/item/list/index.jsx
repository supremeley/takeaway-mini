import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Input } from '@tarojs/components'
import ShopItem from '@/components/shopItem'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import withScrollPage from '@/hocs/scrollPage'

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

  onSelectHandle = (e) => () => {
    this.setState({ keywords: e }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onChange = (e) => {
    this.setState({ keywords: e.detail.value })
  }

  onConfirm = () => {
    const { keywords } = this.state

    let tagList = Taro.getStorageSync('searchList') || []

    tagList.push(keywords)

    Taro.setStorageSync('searchList', tagList)

    this.setState({ tagList, keywords }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onJumpToDetail = (id) => {
    // return
    Taro.navigateTo({ url: `/pages/item/detail/index?id=${id}` })
  }

  clearTag = () => {
    const tagList = []
    Taro.setStorageSync('searchList', tagList)
    this.setState({ tagList, keywords: '' }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getBrandList = async (params) => {
    const { keywords, shopList } = this.state

    const query = { schoolId: this.schoolId, ...params, name: keywords }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const {
      data: { brandList, totalPages }
    } = await api.shop.GET_BRAND_LIST(query)

    let nList = brandList.map((item) => {
      return {
        merchant: { ...item },
        ...item
      }
    })

    nList = [...shopList, ...nList]

    const total = totalPages * params.size

    Taro.hideLoading()

    this.setState({ shopList: nList, total })

    return { total }
  }

  get schoolId() {
    return this.route.params.schoolId
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { total, pageParams, keywords, tagList, shopList } = this.state

    const ShopList =
      shopList &&
      shopList.map((item) => {
        return <ShopItem info={item} key={item.id} onClick={this.onJumpToDetail} />
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
          {tagList.length > 0 && (
            <View className='tag-container'>
              <View className='tag'>
                {tagList &&
                  tagList.map((item) => {
                    return (
                      <View key={item} className='tag-item' onClick={this.onSelectHandle(item)}>
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
        </View>

        <View className='goods-container'>
          <View className='goods'>{ShopList}</View>
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </View>
      </View>
    )
  }
}

export default withScrollPage(ItemList)
