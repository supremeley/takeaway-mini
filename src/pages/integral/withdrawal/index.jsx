import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class IntergralWithDrawal extends Component {
  state = {
    inetgral: 0,
    // rechargeOpt: [
    //   {
    //     title: '500',
    //     amount: '6'
    //   },
    //   {
    //     title: '1100',
    //     amount: '10'
    //   }
    // ],
    // currentOpt: 0,
    number: 0,
    step: 1000
    // amount: 0
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.getUserBalance()
    // this.getRechargeConfig()
  }

  // onSelectOpt = (index) => () => {
  //   const { rechargeOpt } = this.state

  //   const number = rechargeOpt[index].amount

  //   this.setState({ currentOpt: index, number })
  // }

  onJumpToBill = () => {
    Taro.navigateTo({ url: `/pages/balance/bill/index` })
  }

  changeInp = (e) => {
    this.setState({ number: e.detail.value })
  }

  handleAdd = () => {
    let { number, step } = this.state

    this.setState({ number: number + step })
  }

  handleMinus = () => {
    let { number, step } = this.state

    if (!number) return

    this.setState({ number: number - step })
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
    const { data } = await api.mine.GET_MINE_INTEGRAL()

    this.setState({ inetgral: data })
  }

  fetchSubmit = async () => {
    return
    const { number, currentOpt, rechargeOpt } = this.state

    if (!number) {
      D.toast('请输入金额')
    }

    const query = { money1: number, type: 1, tranType: 'JSAPI' }

    const { data } = await api.mine.RECHARGE_INTEGRAL(query)

    // const { data: payParams } = await api.order.SUBMIT_PREPAY({ orderId: data })

    // console.log(payParams)
    const payQuery = {
      nonceStr: data.nonceStr,
      package: data.packageValue,
      paySign: data.paySign,
      timeStamp: data.timeStamp,
      signType: data.signType
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

  get amount() {
    const { number } = this.state
    return (number * 8.8) / 1000
  }

  render() {
    const { inetgral, number } = this.state

    return (
      <View className='with'>
        <View className='header'>
          <View className='header-balance'>
            <Text className='header-balance__num'>{inetgral}</Text>
            <Text>盒盒币</Text>
          </View>
          <View className='header-more' onClick={this.onJumpToBill}>
            盒盒币明细
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='plate first-plate'>
          <View className='plate-title'>提现盒盒币</View>
          <View className='plate-content'>
            <View className='num-contrl'>
              <View className='at-icon at-icon-subtract' onClick={this.handleMinus}></View>
              <Input value={number} className='num-contrl__inp' onInput={this.changeInp} />
              <View className='at-icon at-icon-add' onClick={this.handleAdd}></View>
            </View>
          </View>
          <View className='plate-explain'>*只能添加1000的倍数，1000盒盒币</View>
        </View>
        <View className='content'>
          <View className='plate-title'>提现说明</View>
          {/* <View className='content-explain'>
            盒盒币超过
            <Text className='green'>1000</Text>
            枚即可提现，可提现至微信零钱/吃饭鸭会员余额
          </View> */}
          <View className='content-explain'>
            盒盒币
            <Text className='green'>1000枚=8.8元</Text>
            ，可提现至微信零钱/平台余额
          </View>
        </View>
        <View className='explain'>
          提现金额：
          <Text className='explain-num'>{this.amount.toFixed(2)}元</Text>
        </View>
        <View className='btn-content'>
          <View className='btn-content__item green-btn'>提现到零钱</View>
          <View className='btn-content__item green-btn'>提现到余额</View>
        </View>
      </View>
    )
  }
}

export default IntergralWithDrawal
