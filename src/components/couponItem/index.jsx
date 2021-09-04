import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import CouponOut from '@/assets/imgs/coupon-out.png'

import './index.scss'

class CouponItem extends Component {
  defaultProps = {
    info: null,
    showCouponOut: false,
    onHandleClick: () => {}
  }

  state = {}

  handleClick = () => {
    const { onHandleClick, info } = this.props
    // debugger
    onHandleClick && onHandleClick(info)
  }

  render() {
    const { info, showCouponOut } = this.props

    if (!info) return null

    let { name, startTime, endTime, discount, min, typeDesc, number } = info

    return (
      <View className='coupon-item' onClick={this.handleClick}>
        <View className='circle circle-left'></View>
        <View className='circle circle-right'></View>
        <View className='coupon-item-top'>
          <View className='coupon-item-top__info'>
            <View className='coupon-item-top__info-title'>{name}</View>
            {startTime && endTime && (
              <View className='coupon-item-top__info-date'>
                {startTime}-{endTime}
              </View>
            )}
          </View>
          <View className='coupon-item-top__price'>
            <View className='coupon-item-top__price-text'>￥{discount}</View>
            {min > 0 ? (
              <View className='coupon-item-top__price-explain'>满{min}可用</View>
            ) : (
              <View className='coupon-item-top__price-explain'>无门槛</View>
            )}
          </View>
        </View>
        <View className='coupon-item-bottom'>
          <Text className='coupon-item-bottom__title'>{typeDesc || 'x' + number + '张'}</Text>
        </View>
        {showCouponOut && <Image src={CouponOut} className='coupon-item-icon' />}
      </View>
    )
  }
}

export default CouponItem
