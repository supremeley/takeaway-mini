import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import api from '@/api'
import withScrollPage from '@/hocs/scrollPage'

import './index.scss'

class Bill extends Component {
  state = {
    recordList: []
  }

  componentDidShow() {
    this.resetPage(this.nextPage)
  }

  handleStatus(status) {
    switch (status) {
      case 1:
        return '提现'
      case 2:
        return '提现（线下结算）'
      case 3:
        return '充值'
      case 4:
        return '抵扣'
      default:
        return ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getBillList(params)

    return { total }
  }

  fetchData = () => {
    this.getBillList()
  }

  getBillList = async (params) => {
    const { recordList } = this.state

    const query = {
      ...params
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    const {
      data: { items, total }
    } = await api.user.GET_BILL_LIST(query)

    let nList = [...recordList, ...items]

    Taro.hideLoading()

    this.setState({ recordList: nList, total })

    return { total }
  }

  render() {
    const { pageParams, total, recordList } = this.state

    const RecordList =
      recordList &&
      recordList.map((item) => {
        return (
          <View key={item.id} className='list-item'>
            <View className='list-item__left'>
              <View className='list-item__left-title'>{this.handleStatus(item.type)}</View>
              <View className='list-item__left-date'>{item.addTime}</View>
            </View>
            <View className='list-item__right'>
              {item.type == 4 ? '-' : '+'}
              {item.amount}
            </View>
          </View>
        )
      })

    return (
      <View className='bill'>
        <View className='list'>{RecordList}</View>
        {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
        {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
      </View>
    )
  }
}

export default withScrollPage(Bill)
