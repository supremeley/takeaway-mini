import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class GiftPopup extends Component {
  defaultProps = {
    show: false,
    giftList: [],
    curGift: 0,
    onSelect: () => {},
    onClose: () => {},
    onSendGift: () => {}
  }

  handleClose = () => {
    const { onClose } = this.props

    onClose && onClose()
  }

  handlSelect = (index) => () => {
    const { onSelect } = this.props

    onSelect && onSelect(index)
  }

  handleSendGift = () => {
    const { onSendGift } = this.props

    onSendGift && onSendGift()
  }

  render() {
    const { giftList, curGift, show } = this.props

    const GiftList =
      giftList &&
      giftList.map((item, index) => {
        return (
          <View
            key={item.id}
            className={`gift-float__content-item ${curGift === index && 'active-item'}`}
            onClick={this.handlSelect(index)}
          >
            <Image src={item.img} mode='aspectFit' className='gift-float__content-item__img' />
            {curGift === index ? (
              <View className='gift-float__content-item__btn' onClick={this.handleSendGift}>
                赠送
              </View>
            ) : (
              <>
                <View className='gift-float__content-item__name'>{item.name}</View>
                <View className='gift-float__content-item__desc'>{item.point}盒盒币</View>
              </>
            )}
          </View>
        )
      })

    return (
      <AtFloatLayout isOpened={show} onClose={this.handleClose}>
        <View className='gift-float'>
          <View className='gift-float__title'>
            <View className='gift-float__title-info'>赞赏</View>
            <View className='gift-float__title-more'>
              888
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className='gift-float__content'>{GiftList}</View>
        </View>
      </AtFloatLayout>
    )
  }
}

export default GiftPopup
