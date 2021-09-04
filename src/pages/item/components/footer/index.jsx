import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import CartIcon from '@/assets/imgs/cart.png'
import CartActiveIcon from '@/assets/imgs/cart-active.png'

import './index.scss'

class Footer extends Component {
  defaultProps = {
    isfloatLayout: false,
    total: false,
    basePrice: 0,
    totalPrice: 0,
    linePrice: 0,
    freightPrice: 0,
    lineFreight: 0,
    onCartClick: () => {},
    onJump: () => {}
  }

  state = {}

  handleClick = () => {
    const { onCartClick } = this.props
    onCartClick && onCartClick()
  }

  handleJump = () => {
    const { onJump } = this.props
    onJump && onJump()
  }

  render() {
    const { isfloatLayout, total, basePrice, totalPrice, linePrice, freightPrice, lineFreight } =
      this.props

    // if (!info) return null
    // console.log(totalPrice, basePrice,'t')
    const canPay = total && basePrice && totalPrice - freightPrice >= basePrice

    return (
      <View className={`${!isfloatLayout ? 'page-footer' : ''} footer`}>
        <Image
          src={total ? CartActiveIcon : CartIcon}
          className='footer-icon'
          onClick={this.handleClick}
        ></Image>
        {total && (
          <>
            <Text className='footer-cricle'>{total.number}</Text>
            <View className='footer-info'>
              <View className='footer-info__price'>
                ￥{totalPrice}
                {linePrice && <Text className='footer-info__price-line'>￥{linePrice}</Text>}
              </View>
              <View className='footer-info__explain'>
                含配送费￥{freightPrice}
                {lineFreight && <Text className='footer-info__explain-line'>￥{lineFreight}</Text>}
              </View>
            </View>
          </>
        )}
        <View className={`footer-btn ${canPay ? 'active-btn' : ''}`} onClick={this.handleJump}>
          {canPay ? '去结算' : `￥${basePrice || 0}元起送`}
        </View>
      </View>
    )
  }
}

export default Footer
