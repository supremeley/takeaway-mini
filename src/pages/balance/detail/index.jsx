import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'

import { connect } from 'react-redux'
import { setCouponlist } from '@/actions/counter'

import api from '@/api'
import D from '@/common'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    setCouponlist: (info) => dispatch(setCouponlist(info))
  })
)
class Balance extends Component {
  state = {
    balance: 0,
    rechargeOpt: [
      // {
      //   title: '50',
      //   desc: 'xxxx'
      // }
    ],
    currentOpt: 0
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.getUserBalance()
    this.getRechargeConfig()
  }

  onSelectOpt = (index) => () => {
    this.setState({ currentOpt: index })
  }

  onJumpToBill = () => {
    Taro.navigateTo({ url: `/pages/balance/bill/index` })
  }

  onJumpToCoupon = () => {
    const { currentOpt, rechargeOpt } = this.state

    const { couponList } = rechargeOpt[currentOpt]

    this.props.setCouponlist(couponList)

    Taro.navigateTo({ url: `/pages/coupon/list/index?type=gift` })
  }

  getRechargeConfig = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const { data } = await api.recharge.GET_RECHARGE_CONFIG()

    const rechargeOpt = data.map((item) => {
      const couponNum = item.couponList.reduce((val, info) => {
        return (val += info.number)
      }, 0)

      return {
        ...item,
        couponNum
      }
    })
    // debugger
    Taro.hideLoading()

    this.setState({ rechargeOpt })
  }

  getUserBalance = async () => {
    const {
      data: { remainAmount }
    } = await api.user.GET_USER_BALANCE()

    this.setState({ balance: remainAmount })
  }

  fetchSubmit = async () => {
    const { currentOpt, rechargeOpt } = this.state

    const { amount, id } = rechargeOpt[currentOpt]

    const query = { amount, config_id: id }

    const { data } = await api.recharge.SUBMIT_RECHARGE(query)

    const { data: payParams } = await api.order.SUBMIT_PREPAY({ orderId: data })

    // console.log(payParams)
    const payQuery = {
      nonceStr: payParams.nonceStr,
      package: payParams.packageValue,
      paySign: payParams.paySign,
      timeStamp: payParams.timeStamp,
      signType: payParams.signType
    }

    try {
      const { errMsg } = await Taro.requestPayment(payQuery)
      // console.log(errMsg)
      if (errMsg === 'requestPayment:ok') {
        D.toast('充值成功')

        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      }
    } catch (e) {}
  }

  render() {
    const { balance, rechargeOpt, currentOpt } = this.state

    return (
      <View className='balance'>
        <View className='header'>
          <View className='header-balance'>
            <Text className='header-balance__num'>{balance}</Text>
            <Text>元</Text>
          </View>
          <View className='header-more' onClick={this.onJumpToBill}>
            资金明细
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='plate first-plate'>
          <View className='plate-title'>充值金额</View>
          <View className='plate-option'>
            {rechargeOpt &&
              rechargeOpt.map((item, index) => {
                return (
                  <View
                    key={item.title}
                    className={`plate-option__item ${currentOpt === index ? 'active-opt' : ''}`}
                    onClick={this.onSelectOpt(index)}
                  >
                    <View className='plate-option__item-title'>
                      <Text className='plate-option__item-title__num'>{item.amount}</Text>
                      <Text>元</Text>
                    </View>
                    <View className='plate-option__item-desc'>{item.desc}</View>
                  </View>
                )
              })}
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>充值好礼</View>
          {rechargeOpt.length > 0 && (
            <View className='plate-coupon' onClick={this.onJumpToCoupon}>
              {rechargeOpt[currentOpt].couponNum}张优惠券
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          )}
          {/* <View className='plate-option'>
            {rechargeOpt &&
              rechargeOpt.map((item, index) => {
                return (
                  <View
                    key={item.title}
                    className={`plate-option__item ${currentOpt === index ? 'active-opt' : ''}`}
                    onClick={this.onSelectOpt(index)}
                  >
                    <View className='plate-option__item-title'>
                      <Text className='plate-option__item-title__num'>{item.amount}</Text>
                      <Text>元</Text>
                    </View>
                    <View className='plate-option__item-desc'>{item.desc}</View>
                  </View>
                )
              })}
          </View> */}
        </View>
        <Button className='recharge-btn' onClick={this.fetchSubmit}>
          充值
        </Button>
      </View>
    )
  }
}

export default Balance
