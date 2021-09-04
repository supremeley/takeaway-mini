import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Header from '@/components/header'

import api from '@/api'
import D from '@/common'

import YouIcon from '@/assets/imgs/youhuiquan.png'

import './index.scss'

class IntergralExchange extends Component {
  state = {
    inetgral: 0,
    exchangeList: [
      {
        title: '500',
        amount: '6'
      }
    ]
  }

  componentDidShow() {
    // this.fetchData()
  }

  fetchData = () => {
    this.getUserBalance()
    // this.getRechargeConfig()
  }

  onSelectOpt = (index) => () => {
    const { rechargeOpt } = this.state

    const number = rechargeOpt[index].amount

    this.setState({ currentOpt: index, number })
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

  render() {
    const { inetgral, exchangeList } = this.state

    return (
      <View className='exchange'>
        <Header title='盒盒币兑换' />
        <View className='title'>
          <View className='title-name'>盒盒币兑换</View>
          <View className='title-more'>
            当前盒盒币
            <Text className='green'>{inetgral}</Text>个
          </View>
        </View>
        <View className='content'>
          {exchangeList &&
            exchangeList.map((item, index) => {
              return (
                <View key={item.title} className='list-item'>
                  <Image src={YouIcon} mode='aspectFit' className='list-item__img' />
                  <View className='list-item__info'>
                    <View className='list-item__info-title'>{item.title}</View>
                    <View className='list-item__info-desc'>盒盒币</View>
                    <View className='list-item__info-bottom'>
                      <View className='list-item__info-bottom__num green'>{item.amount}元</View>
                      <View className='list-item__info-bottom__btn'>兑换</View>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

export default IntergralExchange
