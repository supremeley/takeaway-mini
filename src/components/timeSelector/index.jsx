import { Component } from 'react'
import { View, Picker } from '@tarojs/components'

import './index.scss'

class ShopItem extends Component {
  // defaultProps = {
  //   info: null,
  //   onClick: () => {}
  // }

  state = {
    startTime: '',
    endTime: ''
  }

  componentDidMount() {
    const d = new Date()

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()

    const startTime = `${this.addZero(year)}-${this.addZero(month)}-${this.addZero(date)}`

    d.setDate(date + 1)

    const years = d.getFullYear()
    const months = d.getMonth() + 1
    const dates = d.getDate()

    const endTime = `${this.addZero(years)}-${this.addZero(months)}-${this.addZero(dates)}`

    this.setState({ startTime, endTime })
  }

  addZero = (n) => {
    if (n < 10) {
      return '0' + n
    }
    return n
  }

  onDateChange = (e, type) => {
    console.log(e.detail.value)
    // onClick && onClick(info.id)

    if (type === 'start') {
      this.setState({ startTime: e.detail.value })
    }

    if (type === 'end') {
      this.setState({ endTime: e.detail.value })
    }
  }

  onSearch = () => {
    const { onSearch } = this.props
    const { startTime, endTime } = this.state

    onSearch && onSearch(startTime, endTime)
  }

  render() {
    const { startTime, endTime } = this.state
    // const { keywords, current, imgList, navList, barList, goodsList } = this.state

    // if (!info) return null

    return (
      <View className='time-search'>
        <View className='time-search__date'>
          <Picker mode='date' start={startTime} onChange={(e) => this.onDateChange(e, 'start')}>
            <View className='time-search__date-info'>{startTime}</View>
          </Picker>
          -
          <Picker mode='date' start={endTime} onChange={(e) => this.onDateChange(e, 'end')}>
            <View className='time-search__date-info'>{endTime}</View>
          </Picker>
        </View>

        <View className='time-search__btn' onClick={this.onSearch}>
          搜索
        </View>
      </View>
    )
  }
}

export default ShopItem
