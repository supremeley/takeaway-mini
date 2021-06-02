import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import withScrollPage from '@/hoc/scrollPage'

import t1 from '@/assets/imgs/test1.png'

import './index.scss'

class OrderList extends Component {
  state = {
    current: 0,
    total: 0,
    navList: [
      { status: 0, title: '全部' },
      { status: 1, title: '待支付' },
      { status: 2, title: '出餐中' },
      { status: 3, title: '配送中' },
      { status: 4, title: '已完成' }
      // { url: '', title: '已取消' }
    ],
    orderList: [
      {
        price: 1,
        id: 1,
        pic: t1,
        title: '蔬菜'
      }
    ]
  }

  componentDidMount() {
    this.nextPage()
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  fetch = async (params) => {
    const { total } = await this.getOrderList(params)

    return { total }
  }

  // nextPage = async () => {
  //   const { pageParams } = this.state

  //   if (!pageParams.hasNext || pageParams.loading) return

  //   pageParams.loading = true

  //   this.setState({
  //     pageParams
  //   })

  //   const { size, page } = pageParams

  //   const { total } = await this.fetch({ size, page })

  //   if (!total || total < size) {
  //     pageParams.hasNext = false
  //   }

  //   const nextPageParams = {
  //     ...pageParams,
  //     page: pageParams.page + 1,
  //     loading: false,
  //     total
  //   }

  //   this.setState({
  //     pageParams: nextPageParams
  //   })
  // }

  // resetPage(cb = () => {}) {
  //   const { pageParams } = this.state

  //   const resetPageParams = {
  //     ...(pageParams || {}),
  //     page: 0,
  //     size: 10,
  //     loading: false,
  //     hasNext: true
  //   }

  //   this.setState({ pageParams: resetPageParams }, cb)
  // }

  // refreshList = async () => {
  //   // const { status } = this.router
  //   const { current, navList } = this.state
  //   const tabIdx = navList.findIndex((tab) => tab.status === status)
  //   let params = { curTabIdx: curTabIdx || tabIdx || 0, list: [] }
  //   if (tabIdx === curTabIdx) {
  //     delete params.curTabIdx
  //   }
  //   this.setState(params, () => {
  //     this.resetPage(this.nextPage)
  //   })
  // }

  onJump = (id) => () => {
    Taro.navigateTo({ url: `/pages/order/detail/index?id=${id}` })
  }

  handleClick = (index) => () => {
    this.setState({ current: index }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getOrderList = async (params) => {
    const { current, navList } = this.state

    const showType = navList[current].status

    const query = {
      ...params,
      showType
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const {
      data: { data, count: total }
    } = await api.order.GET_ORDER_LIST(query)
    // console.log(data, count, 1000)
    let nList = data

    nList = [...this.state.orderList, ...nList]

    Taro.hideLoading()

    this.setState({ orderList: nList, total })

    return { total }
  }

  render() {
    const { pageParams, total, current, navList, orderList } = this.state

    const Order =
      orderList &&
      orderList.map((item) => {
        return (
          <View className='order-item' key={item.id} onClick={this.onJump(item.id)}>
            <Image src={item.pic} mode='aspectFill' className='order-item-img'></Image>
            <View className='order-item__content'>
              <View className='order-item__header'>
                <View className='order-item__header-name'>光明鲜奶屋</View>
                <View className='order-item__header-status'>等待支付</View>
              </View>
              <View className='order-item__address'>2021-05-08 12:26</View>
              <View className='order-item__info'>
                <View className='order-item__info-goods'>豆奶</View>
                <View className='order-item__info-price'>$24.72</View>
              </View>
              <View className='order-item__bottom'>
                <View className='order-item__bottom-btn'>再来一单</View>
                {/* <View className='order-item__bottom-btn red-btn'>去支付</View>
                <View className='order-item__bottom-btn cancel-btn'>取消订单</View>
                <View className='order-item__bottom-btn red-btn'>退款</View> */}
              </View>
            </View>
          </View>
        )
      })

    return (
      <View className='index'>
        <ScrollView scrollX enableFlex className='nav-container'>
          {navList &&
            navList.map((item, index) => {
              return (
                <View key={item.title} className='nav-item' onClick={this.handleClick(index)}>
                  <Text className={`nav-item-text ${current === index ? 'active' : ''}`}>
                    {item.title}
                  </Text>
                </View>
              )
            })}
        </ScrollView>
        <View className='order-container'>{Order}</View>
        {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
        {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
      </View>
    )
  }
}

export default withScrollPage(OrderList)
