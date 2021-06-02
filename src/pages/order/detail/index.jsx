import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import api from '@/api'
import t1 from '@/assets/imgs/test1.png'

import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

class OrderDetail extends Component {
  state = {
    info: null,
    cancelShow: false,
    managerShow: false,
    currentReason: 0,
    reasonOption: [{ title: '我不想买了' }, { title: '信息填写错误，重新下单' }]
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
    Taro.makePhoneCall({ phoneNumber: '123' })
  }

  onClipboard = (data = '123') => {
    Taro.setClipboardData({ data })
  }

  getSchoolList = async (id) => {
    const query = { regionId: id }
    const { data } = await api.order.GET_ORDER_DETAIL(query)

    // this.setState({ shopList })
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { cancelShow, managerShow, info, currentReason, reasonOption } = this.state

    // if (!info) return null

    return (
      <View className='index'>
        <View className='header'>
          <View className='header-status'>
            <Text className='header-status-text'>订单已完成</Text>
            <Text>（记得好好吃饭鸭~）</Text>
          </View>
        </View>
        <View className='shop-container'>
          <View className='shop-header'>
            <Image src={t1} mode='aspectFill' className='shop-header__avatar'></Image>
            <View className='shop-header__name'>光明鲜奶屋</View>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag red-tag'>折</Text>
                豆奶
              </View>
              <View className='shop-plate__item-price hava-num'>
                <View className='shop-plate__item-num'>x1</View>
                <View className='shop-plate__item-price__num'>
                  <View className='shop-plate__item-price__line'>￥6</View>
                  ￥5
                </View>
              </View>
            </View>
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag green-tag'>打包</Text>
                打包费
              </View>
              <View className='shop-plate__item-price'>￥5</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag blue-tag'>配送</Text>
                配送费
              </View>
              <View className='shop-plate__item-price'>￥5</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag red-d-tag'>新客</Text>
                新客费
              </View>
              <View className='shop-plate__item-price'>￥5</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>平台抵扣券</View>
              <View className='shop-plate__item-price'>￥5</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title explain'>优惠券xxxx</View>
            </View>
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>已为您节省￥11</View>
              <View className='shop-plate__item-price'>
                <View className='shop-plate__item-price__num'>
                  总计
                  <View className='red'>￥5</View>
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
              <View>2021132121</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>期望送达时间</View>
              <View>2021-05-11 07:00-07:30</View>
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
              <View>收货人</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>收货电话</View>
              <View>13788954223</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>楼栋号</View>
              <View>二期公寓3号楼</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>楼层</View>
              <View>7</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>门牌号</View>
              <View>713</View>
            </View>
            <View className='detail-option__item'>
              <View className='detail-option__item-title'>下单时间</View>
              <View>2021-05-11 07:00-07:30</View>
            </View>
          </View>
        </View>
        <View className='footer'>
          <View className='footer-btn'>再来一单</View>
          <View className='footer-btn red-btn'>立即支付</View>
          <View className='footer-btn cancel-btn' onClick={this.openCancel}>
            取消订单
          </View>
          <View className='footer-btn red-btn' onClick={this.onJumpToRefund}>
            退款
          </View>
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
