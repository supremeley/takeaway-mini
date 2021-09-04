import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtFloatLayout, AtCurtain } from 'taro-ui'

import api from '@/api'
import D from '@/common'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/float-layout.scss'
import 'taro-ui/dist/style/components/curtain.scss'
import './index.scss'

class GiftPopup extends Component {
  defaultProps = {
    show: false,
    type: 'hot',
    postId: 0,
    onClose: () => {},
    onHandleSendGift: () => {}
  }

  state = {
    userBalance: 0,
    giftList: [],
    curGift: 0,
    giftGif: '',
    showGiftGif: false
  }

  componentDidMount() {
    this.getGiftlist()
  }

  openGiftGif = () => {
    this.setState({ showGiftGif: true })
  }

  closeGiftGif = () => {
    this.setState({ showGiftGif: false })
  }

  onJumpToRecharge = () => {
    Taro.navigateTo({ url: `/pages/integral/recharge/index` })
  }

  handleChangeGift = (index) => () => {
    const { curGift } = this.state

    if (curGift !== index) {
      this.setState({ curGift: index })
    }
  }

  handleClose = () => {
    const { onClose } = this.props

    onClose && onClose()
  }

  // handleSendGift = () => {
  //   const { onSendGift } = this.props

  //   onSendGift && onSendGift()
  // }

  fetchSendGift = async () => {
    const { onHandleSendGift, type, postId } = this.props
    const { userBalance, curGift, giftList } = this.state

    const query = {
      postId,
      id: giftList[curGift].id
    }

    // const type = navOpt[curNav].type

    let resApi

    switch (type) {
      case 'tree':
        resApi = api.forum.SEND_GIFT_TO_USER_BY_TREE
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.SEND_GIFT_TO_USER
        break
    }

    try {
      const { errno, errmsg } = await resApi(query)

      if (!errno) {
        // let pl = postsList.concat()
        // pl[curPostsIndex].appreciateCount++

        const ub = userBalance - giftList[curGift].point

        this.setState({ userBalance: ub, giftGif: giftList[curGift].img2 }, () => {
          this.openGiftGif()
          onHandleSendGift && onHandleSendGift()
        })
      } else {
        D.toast(errmsg)
      }
    } catch (e) {}
  }

  getGiftlist = async () => {
    const {
      data: { 1: userBalance, 2: list }
    } = await api.forum.GET_GIFT_LIST()

    const giftList = list.map((item) => {
      return {
        ...item
      }
    })

    this.setState({ giftList, userBalance })
  }

  render() {
    const { show } = this.props
    const { showGiftGif, giftGif, userBalance, giftList, curGift } = this.state

    const GiftList =
      giftList &&
      giftList.map((item, index) => {
        return (
          <View
            key={item.id}
            className={`gift-float__content-item ${curGift === index && 'active-item'}`}
            onClick={this.handleChangeGift(index)}
          >
            <Image src={item.img} mode='aspectFit' className='gift-float__content-item__img' />
            {curGift === index ? (
              <View className='gift-float__content-item__btn' onClick={this.fetchSendGift}>
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
      <>
        <AtFloatLayout isOpened={show} onClose={this.handleClose} onScroll={this.props.onScroll}>
          <View className='gift-float'>
            <View className='gift-float__title'>
              <View className='gift-float__title-info'>赞赏</View>
              <View className='gift-float__title-more'>
                {userBalance}
                <View className='at-icon at-icon-chevron-right'></View>
              </View>
            </View>
            <View className='gift-float__content'>{GiftList}</View>
            <View className='gift-float__more' onClick={this.onJumpToRecharge}>
              马上充值
              <View className='at-icon at-icon-chevron-right' onClick={this.goBack}></View>
            </View>
          </View>
        </AtFloatLayout>
        <AtCurtain isOpened={showGiftGif} onClose={this.closeGiftGif}>
          <Image src={giftGif} mode='widthFix' className='gift-gif' />
        </AtCurtain>
      </>
    )
  }
}

export default GiftPopup
