import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import withScrollPage from '@/hocs/scrollPage'

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
      // {
      //   actualPrice: 17.5,
      //   addTime: '2021-06-05 13:22:21',
      //   address: '测试学校1 测试1 大厅',
      //   consignee: '赵',
      //   freightPrice: 1,
      //   freightType: 0,
      //   goodsList: [
      //     {
      //       addTime: '2021-06-05 13:22:21',
      //       brandId: 1001016,
      //       comment: 0,
      //       deleted: false,
      //       goodsId: 277,
      //       goodsName: '大包子',
      //       goodsSn: 'a1234',
      //       id: 21,
      //       number: 1,
      //       orderId: 15,
      //       picUrl:
      //         'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/sscdm0jwkz3br69jof98.JPG',
      //       price: 7.5,
      //       productId: 5255,
      //       seckillReducePrice: 0,
      //       settlementMoney: 0,
      //       specifications: ['默认'],
      //       updateTime: '2021-06-05 13:22:21',
      //       userId: 204
      //     }
      //   ],
      //   goodsPrice: 13.5
      // }
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

  onJump = (id) => () => {
    Taro.navigateTo({ url: `/pages/order/detail/index?id=${id}` })
  }

  checkTab = (index) => () => {
    this.setState({ current: index, orderList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getOrderList = async (params) => {
    const { current, navList, orderList } = this.state

    const showType = navList[current].status

    const query = {
      ...params,
      showType
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    
    try {
      const {
        data: { data, count: total }
      } = await api.order.GET_ORDER_LIST(query)
      // console.log(data, count, 1000)
      let nList = data.map((item) => {
        let num = 0
        const goodsInfo = item.goodsList.map((goods) => {
          num += goods.number
          return goods.goodsName
        })
        // console.log(goodsInfo)
        return {
          ...item,
          goodsInfo: goodsInfo.join('+'),
          goodsExplain: ` 等${num}件商品`
        }
      })

      nList = [...orderList, ...nList]

      Taro.hideLoading()

      this.setState({ orderList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { pageParams, total, current, navList, orderList } = this.state

    // const {handleOption} = orderList

    const Order =
      orderList &&
      orderList.map((item) => {
        const { name, iconUrl } = item.merchantVo

        return (
          <View className='order-item' key={item.id} onClick={this.onJump(item.id)}>
            <Image src={iconUrl} mode='aspectFill' className='order-item-img'></Image>
            <View className='order-item__content'>
              <View className='order-item__header'>
                <View className='order-item__header-name'>{name}</View>
                <View className='order-item__header-status'>{item.orderStatusText}</View>
              </View>
              <View className='order-item__address'>{item.addTime}</View>
              <View className='order-item__info'>
                <View className='order-item__info-goods'>
                  <Text className='order-item__info-goods__detail'>{item.goodsInfo}</Text>
                  <Text>{item.goodsExplain}</Text>
                </View>
                <View className='order-item__info-price'>￥{item.actualPrice}</View>
              </View>
              <View className='order-item__bottom'>
                {item.handleOption.cancel && (
                  <View className='order-item__bottom-btn cancel-btn'>取消订单</View>
                )}
                {/* <View className='order-item__bottom-btn'>再来一单</View> */}
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
                <View key={item.title} className='nav-item' onClick={this.checkTab(index)}>
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
