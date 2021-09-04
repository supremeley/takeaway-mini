import { Component } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

class Footer extends Component {
  defaultProps = {
    type: {
      cancel: false,
      refund: false,
      applyAfterService: false,
      pay: false
    },
    onHandleClick: () => {}
  }

  state = {}

  handleClick = (e, type) => {
    e.stopPropagation()
    // console.log(e, type)
    const { onHandleClick } = this.props

    onHandleClick && onHandleClick(type)
  }

  render() {
    const { type } = this.props
    // console.log(type)
    return (
      <>
        {type.cancel && (
          <View className='order-btn cancel-btn' onClick={(e) => this.handleClick(e, 'cancle')}>
            取消订单
          </View>
        )}
        {type.applyAfterService && (
          <View
            className='order-btn cancel-btn'
            onClick={(e) => this.handleClick(e, 'applyAfterService')}
          >
            退款
          </View>
        )}
        {type.refund && (
          <View className='order-btn red-btn' onClick={(e) => this.handleClick(e, 'refund')}>
            申请售后
          </View>
        )}
        {type.pay && (
          <View className='order-btn' onClick={(e) => this.handleClick(e, 'pay')}>
            立即支付
          </View>
        )}
      </>
    )
  }
}

export default Footer
