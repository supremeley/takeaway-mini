import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import api from '@/api'
import D from '@/common'
import debounce from 'lodash/debounce'

import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

class OrderDetail extends Component {
  state = {
    info: null,
    priceInfo: null,
    goodsList: [],
    cancelShow: false,
    managerShow: false,
    currentReason: 0,
    shopInfo: {},
    canPay: true,
    reasonOption: [{ title: '我不想买了' }, { title: '信息填写错误，重新下单' }]
  }

  handleSubmit = debounce(() => this.fetchSumbitOrder(), 300)

  componentDidShow() {
    this.getOrderDetail()
  }

  onJumpToDetail = () => {
    const { shopInfo } = this.state
    Taro.navigateTo({ url: `/pages/item/detail/index?id=${shopInfo.id}` })
  }

  onJumpToRefund = () => {
    Taro.navigateTo({ url: `/pages/order/refund/index?id=${this.id}` })
  }

  openCancel = () => {
    this.setState({ cancelShow: true })
  }

  closeCancel = () => {
    this.setState({ cancelShow: false })
  }

  openManager = () => {
    this.setState({ managerShow: true })
  }

  closeManager = () => {
    this.setState({ managerShow: false })
  }

  onConfirm = () => {
    this.closeCancel()
  }

  changeReason = (e) => () => {
    this.setState({ currentReason: e })
  }

  onPhone = () => {
    const { shopInfo } = this.state

    Taro.makePhoneCall({ phoneNumber: shopInfo.phone })
  }

  onClipboard = (data = '123') => {
    Taro.setClipboardData({ data })
  }

  getOrderDetail = async () => {
    const query = { orderId: this.id }

    const {
      data: { orderDetailFee: priceInfo, orderGoods: goodsList, orderInfo: info, brand: shopInfo }
    } = await api.order.GET_ORDER_DETAIL(query)

    this.setState({ info, priceInfo, goodsList, shopInfo })
  }

  fetchSumbitOrder = async () => {
    const { canPay } = this.state

    if (!canPay) {
      return
    }

    this.setState({ canPay: false })

    const { data: payParams } = await api.order.SUBMIT_PREPAY({ orderId: this.id })

    // console.log(payParams)
    const payQuery = {
      nonceStr: payParams.nonceStr,
      package: payParams.packageValue,
      paySign: payParams.paySign,
      timeStamp: payParams.timeStamp,
      signType: payParams.signType
    }

    try {
      const res = await Taro.requestPayment(payQuery)

      if (res.msg === 'requestPayment:ok') {
        D.toast('支付成功')
        this.getOrderDetail()
      } else {
        this.setState({ canPay: true })
      }
    } catch (e) {
      this.setState({ canPay: true })
    }
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      cancelShow,
      managerShow,
      info,
      shopInfo,
      goodsList,
      priceInfo,
      currentReason,
      reasonOption
    } = this.state

    if (!info) return null

    const {
      orderStatusText,
      actualPrice,
      discountPrice,
      orderSn,
      consignee,
      mobile,
      address,
      addTime,
      handleOption
    } = info

    const { additionalFee, extraAdditionalFee, deliveryFee, packingFee, couponFee } = priceInfo

    const { name, iconUrl } = shopInfo

    return (
      <View className='index'>
        <View className='header'>
          <View className='header-status'>
            <Text className='header-status-text'>{orderStatusText}</Text>
            <Text>（记得好好吃饭鸭~）</Text>
          </View>
        </View>
        <View className='shop-container'>
          <View className='shop-header' onClick={this.onJumpToDetail}>
            <Image src={iconUrl} mode='aspectFill' className='shop-header__avatar'></Image>
            <View className='shop-header__name'>{name}</View>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
          <View className='shop-plate'>
            {goodsList &&
              goodsList.map((goods) => {
                return (
                  <View key={goods.goodsName} className='shop-plate__item'>
                    <View className='shop-plate__item-title'>
                      {/* <Text className='shop-plate__item-title__tag red-tag'>折</Text> */}
                      <Text className='shop-plate__item-title__name'>{goods.goodsName}</Text>
                      {goods.specifications &&
                        goods.specifications.map((val) => {
                          return (
                            <>
                              {val != '默认' && (
                                <Text key={val} className='shop-plate__item-title__spe'>
                                  ({val})
                                </Text>
                              )}
                            </>
                          )
                        })}
                    </View>
                    <View className='shop-plate__item-price hava-num'>
                      <View className='shop-plate__item-num'>x{goods.number}</View>
                      <View className='shop-plate__item-price__num'>
                        {/* <View className='shop-plate__item-price__line'>￥6</View> */}￥
                        {goods.price}
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag green-tag'>打包</Text>
                打包费
              </View>
              <View className='shop-plate__item-price'>￥{packingFee || 0}</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag blue-tag'>配送</Text>
                配送费
              </View>
              <View className='shop-plate__item-price'>￥{deliveryFee || 0}</View>
            </View>
            {additionalFee + extraAdditionalFee > 0 && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title'>
                  <Text className='shop-plate__item-title__tag red-d-tag'>附加</Text>
                  附加费
                </View>
                <View className='shop-plate__item-price'>
                  ￥{additionalFee + extraAdditionalFee}
                </View>
              </View>
            )}
            {/* <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag red-d-tag'>新客</Text>
                新客费
              </View>
              <View className='shop-plate__item-price'>￥5</View>
            </View> */}
            {couponFee > 0 && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title'>平台抵扣券</View>
                <View className='shop-plate__item-price'>￥{couponFee}</View>
              </View>
            )}
            {/* <View className='shop-plate__item'>
              <View className='shop-plate__item-title explain'>优惠券xxxx</View>
            </View> */}
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              {discountPrice > 0 && (
                <View className='shop-plate__item-title'>已为您节省￥{discountPrice}</View>
              )}
              <View className='shop-plate__item-price'></View>
              <View className='shop-plate__item-price'>
                <View className='shop-plate__item-price__num'>
                  总计
                  <View className='red'>￥{actualPrice}</View>
                </View>
              </View>
            </View>
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-opt' onClick={this.onPhone}>
                <View className='at-icon at-icon-phone'></View>
                <View className='shop-plate__item-opt-text'>联系商家</View>
              </View>
              <View className='shop-plate__item-opt' onClick={this.openManager}>
                <View className='at-icon at-icon-message'></View>
                <View className='shop-plate__item-opt-text'>联系楼长</View>
              </View>
            </View>
          </View>
        </View>
        <View className='detail-container'>
          <View className='detail-option'>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>订单号</View>
              <View>{orderSn}</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>期望送达时间</View>
              <View>{addTime}</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>支付方式</View>
              <View>在线支付</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>配送方式</View>
              <View>外卖到寝</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>收货人</View>
              <View>{consignee}</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>收货电话</View>
              <View>{mobile}</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>收货地址</View>
              <View>{address}</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>下单时间</View>
              <View>{addTime}</View>
            </View>
          </View>
        </View>
        <View className='footer'>
          {handleOption.cancel && (
            <View className='footer-btn cancel-btn' onClick={this.openCancel}>
              取消订单
            </View>
          )}
          {handleOption.refund && (
            <View className='footer-btn red-btn' onClick={this.onJumpToRefund}>
              退款
            </View>
          )}
          {handleOption.pay && (
            <View className='footer-btn red-btn' onClick={this.handleSubmit}>
              立即支付
            </View>
          )}
          {handleOption.rebuy && <View className='footer-btn'>再来一单</View>}
        </View>
        <AtModal isOpened={cancelShow}>
          <AtModalHeader>请选择取消订单的理由</AtModalHeader>
          <AtModalContent>
            {reasonOption &&
              reasonOption.map((item, index) => {
                return (
                  <View key={item.title} className='cancel-option'>
                    <View className='cancel-option__title'>{item.title}</View>
                    <View
                      className={`cancel-option__circle ${
                        currentReason === index ? 'red-circle' : ''
                      }`}
                      onClick={this.changeReason(index)}
                    ></View>
                  </View>
                )
              })}
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeCancel}>取消</Button>
            <Button className='modal-btn' onClick={this.onConfirm}>
              确定
            </Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={managerShow}>
          <AtModalHeader>请选择楼长</AtModalHeader>
          <AtModalContent>
            {reasonOption &&
              reasonOption.map((item) => {
                return (
                  <View key={item.title} className='cancel-option'>
                    <View className='cancel-option__title'>xxx</View>
                    <View className='cancel-option__info'>wxwxwxwx</View>
                    {/* <View
                      className={`cancel-option__circle ${
                        currentReason === index ? 'red-circle' : ''
                      }`}
                      onClick={this.changeReason(index)}
                    ></View> */}
                    <View className='cancel-option__text' onClick={this.onClipboard}>
                      复制微信
                    </View>
                  </View>
                )
              })}
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeManager}>取消</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default OrderDetail
