import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class IntergralRecharge extends Component {
  state = {
    inetgral: 0,
    rechargeOpt: [
      {
        title: '500',
        amount: '6'
      },
      {
        title: '1100',
        amount: '10'
      }
    ],
    currentOpt: 0,
    number: 1,
    step: 1
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.getUserBalance()
    // this.getRechargeConfig()
  }

  onSelectOpt = (index) => () => {
    // const { rechargeOpt } = this.state

    // const number = rechargeOpt[index].amount

    this.setState({ currentOpt: index, number: 1 })
  }

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
    const { number, currentOpt, rechargeOpt } = this.state

    // console
    if (!number) {
      D.toast('请输入金额')
    }

    const money = rechargeOpt[currentOpt].amount * number

    const query = { money1: money, type: 1, tranType: 'JSAPI' }

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
        const re = await api.mine.ORDER_QUERY_WXPAY({ tid: data.tid })

        D.toast('充值成功')

        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      }
    } catch (e) {}
  }

  render() {
    const { inetgral, rechargeOpt, currentOpt, number } = this.state

    return (
      <View className='recharge'>
        <View className='header'>
          <View className='header-balance'>
            <Text className='header-balance__num'>{inetgral}</Text>
            <Text>盒盒币</Text>
          </View>
          <View className='header-explain'>充值金额不得提现找零</View>
          <View className='header-more' onClick={this.onJumpToBill}>
            盒盒币明细
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='plate first-plate'>
          <View className='plate-title'>充值面额</View>
          <View className='plate-option'>
            {rechargeOpt &&
              rechargeOpt.map((item, index) => {
                return (
                  <View
                    key={item.title}
                    className={`plate-option__item ${currentOpt === index && 'active-opt'}`}
                    onClick={this.onSelectOpt(index)}
                  >
                    <View className='plate-option__item-title'>
                      <View className='plate-option__item-title__num'>
                        <View className='plate-option__item-title__num-left'>{item.title}</View>
                        <View className='plate-option__item-title__num-right'>盒盒币</View>
                      </View>
                    </View>
                    <View className='plate-option__item-title__desc'>{item.amount}元</View>
                  </View>
                )
              })}
          </View>
          {currentOpt > 0 && (
            <>
              <View className='plate-title'>充值次数</View>
              <View className='plate-content'>
                <View className='num-contrl'>
                  <View className='at-icon at-icon-subtract' onClick={this.handleMinus}></View>
                  <Input value={number} className='num-contrl__inp' onInput={this.changeInp} />
                  <View className='at-icon at-icon-add' onClick={this.handleAdd}></View>
                </View>
              </View>
            </>
          )}
        </View>
        <View className='explain'>
          支付金额：
          <Text className='explain-num'>{rechargeOpt[currentOpt].amount * number}元</Text>
        </View>
        <Button className='recharge-btn' onClick={this.fetchSubmit}>
          确认支付
        </Button>
      </View>
    )
  }
}

export default IntergralRecharge
