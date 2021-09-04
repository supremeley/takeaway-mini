import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class CouponCenter extends Component {
  state = {
    total: 0,
    schoolId: 0,
    couponList: []
  }

  componentDidMount() {
    const orderSchool = Taro.getStorageSync('orderSchool')

    this.setState({ schoolId: orderSchool.school.value }, () => {
      this.nextPage()
    })
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  handelType = (type) => {
    switch (type) {
      case 0:
        return '全部店铺可用'
      case 1:
        return '部分类目可用'
      case 2:
        return '部分商品可用'
      case 3:
        return '部分店铺可用'
      default:
        return ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getCouponList(params)

    return { total }
  }

  getCouponList = async () => {
    const { schoolId } = this.state

    const query = { schoolId }

    const {
      data: { couponList }
    } = await api.home.GET_HOME_INDEX(query)

    let nList = couponList.map((item) => {
      return {
        ...item,
        typeDesc: this.handelType(item.goodsType)
        // startTime: item.startTime.replace(/-/g, '/'),
        // endTime: item.endTime.replace(/-/g, '/')
      }
    })

    this.setState({ couponList: nList, total: nList.length })

    return { total: nList.length }
  }

  fetchReceiveCoupon = (id) => async () => {
    const query = {
      couponId: id
    }

    const { errno, errmsg } = await api.coupon.RECEIVE_COUPON(query)

    if (!errno) {
      D.toast('领取成功')
      await this.fetch()
    }
  }

  render() {
    const { pageParams, total, couponList } = this.state

    const Coupons =
      couponList.length > 0 &&
      couponList.map((item) => {
        return (
          <View key={item.id} className='list-item'>
            <View className='circle circle-left'></View>
            <View className='circle circle-right'></View>
            <View className='list-item-top'>
              <View className='list-item-top__info'>
                <View className='list-item-top__info-title'>{item.name}</View>
                <View className='list-item-top__info-date'>
                  {item.startTime}-{item.endTime}
                </View>
              </View>
              <View className='list-item-top__price'>
                <View className='list-item-top__price-text'>￥{item.discount}</View>
                <View className='list-item-top__price-explain'>满{item.min}可用</View>
              </View>
            </View>
            <View className='list-item-bottom'>
              <Text className='list-item-bottom__title'>{item.typeDesc}</Text>
              <View className='list-item-bottom__btn' onClick={this.fetchReceiveCoupon(item.id)}>
                领取
              </View>
            </View>
          </View>
        )
      })

    return (
      <View className='index'>
        <View className='list-container'>{Coupons}</View>
        {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
        {!total && !pageParams.isLoading && !pageParams.hasNext && <Default msg='暂无可领优惠券' />}
      </View>
    )
  }
}

export default withScrollPage(CouponCenter)
