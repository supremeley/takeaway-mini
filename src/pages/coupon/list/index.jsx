import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import CouponItem from '@/components/couponItem'

import { connect } from 'react-redux'

import api from '@/api'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

@connect(({ counter }) => ({
  couponList: counter.couponList
}))
@withScrollPage
class CouponList extends Component {
  state = {
    current: 0,
    total: 0,
    navList: [
      { title: '未使用', status: 0 },
      // { title: '已使用', status: 2 },
      { title: '已失效', status: 1 }
    ],
    couponList: [
      // {
      //   desc: '测试用优惠券',
      //   discount: '10.00',
      //   endTime: '2021-07-19',
      //   goodsType: 3,
      //   id: 2,
      //   min: '5.00',
      //   name: '测试5元优惠券1',
      //   startTime: '2021-06-19',
      //   tag: ''
      // }
    ]
  }

  componentDidShow() {
    if (this.type !== 'gift') {
      this.resetPage(this.nextPage)
    } else {
      const couponList = this.props.couponList.map((item) => {
        return {
          ...item
          // typeDesc: this.handelType(item.goodsType),
          // startTime: item.startTime.replace(/-/g, '/'),
          // endTime: item.endTime.replace(/-/g, '/')
        }
      })

      this.setState({ couponList })
    }
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

  checkTab = (index) => () => {
    this.setState({ current: index, couponList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  getCouponList = async (params) => {
    const { current, navList, couponList } = this.state

    const status = navList[current].status

    const query = {
      ...params,
      status
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const {
      data: { data, count: total }
    } = await api.coupon.GET_COUPON_LIST_BY_OWN(query)
    // console.log(data, count, 1000)
    let nList = data.map((item) => {
      return {
        ...item,
        typeDesc: this.handelType(item.goodsType),
        startTime: item.startTime.replace(/-/g, '/'),
        endTime: item.endTime.replace(/-/g, '/')
      }
    })

    nList = [...couponList, ...nList]

    Taro.hideLoading()

    this.setState({ couponList: nList, total })

    return { total }
  }

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { pageParams, total, current, navList, couponList } = this.state

    const NavList =
      navList &&
      navList.map((item, index) => {
        return (
          <View
            key={index}
            className={`nav-item ${index === current ? 'active-item' : ''}`}
            onClick={this.checkTab(index)}
          >
            {item.title}
          </View>
        )
      })

    const Coupons =
      couponList.length > 0 &&
      couponList.map((item) => {
        return <CouponItem key={item.id} info={item} showCouponOut={current === 1} />
      })

    return (
      <View className='index'>
        {this.type !== 'gift' && <View className='nav'>{NavList}</View>}
        <View className='list-container'>{Coupons}</View>
        {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
        {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
      </View>
    )
  }
}

export default CouponList
