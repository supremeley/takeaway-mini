import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Input, ScrollView } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import BottomText from '@/components/bottomText'

import D from '@/common'
import debounce from 'lodash/debounce'
import api from '@/api'
import withScrollPage from '@/hocs/scrollPage'

import 'taro-ui/dist/style/components/float-layout.scss'
import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class Checkout extends Component {
  state = {
    currentSchool: '',
    currentFloor: '',
    couponShow: false,
    couponList: [],
    currentCoupon: null,
    total: 0,
    info: null,
    rule: null,
    cartList: [],
    isNew: false,
    priceInfo: {
      discountPrice: 0,
      tootalPrice: 0,
      additionalPrice: 0,
      extraAdditionalPrice: 0,
      freightPrice: 0,
      goodsPrice: 0,
      packagePrice: 0
    },
    sendTime: '',
    form: {
      // message: '测试',
      // userName: '赵',
      // mobile: '13700000000',
      // address: '1102'，
      message: '',
      userName: '',
      mobile: '',
      address: ''
    }
  }

  componentDidMount() {
    this.fetchData()
    this.nextPage()

    const locInfo = Taro.getStorageSync('locInfo')

    if (!locInfo) {
      // this.setState({ explainShow: true })
    } else {
      const currentSchool = locInfo.school.label
      const currentFloor = locInfo.floor.label

      this.setState({ currentSchool, currentFloor })
    }
  }

  handleSubmit = debounce(() => this.fetchSumbitOrder(), 300)

  handelType = (type) => {
    switch (type) {
      case 0:
        return '全部店铺可用'
      case 1:
        return '部分类目可用'
      case 2:
        return '部分商品可用'
      case 3:
        return '部分店铺可用'
      default:
        return ''
    }
  }

  // 下拉加载
  onScrollHandle = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  fetchData = async () => {
    await this.getShopData()
    await this.fetchCheckout()
  }

  fetch = async (params) => {
    const { total } = await this.getCouponList(params)

    return { total }
  }

  openCouponShow = () => {
    const { couponList } = this.state

    if (!couponList.length) {
      D.toast('暂无可用优惠券')
      return
    }

    this.setState({ couponShow: true })
  }

  closeCouponShow = () => {
    this.setState({ couponShow: false })
  }

  unuseCoupon = () => {
    this.setState({ currentCoupon: null, couponShow: false }, () => this.fetchCheckout())
  }

  onSelectCoupon = (index) => () => {
    const { couponList } = this.state

    this.setState({ currentCoupon: couponList[index], couponShow: false }, () =>
      this.fetchCheckout()
    )
  }

  changeInp = (e, key) => {
    // console.log(e)
    const { form } = this.state

    form[key] = e.detail.value
  }

  getShopData = async () => {
    const query = { id: this.id }

    const {
      data: { brand, brokerageMerchantVo }
    } = await api.shop.GET_BRAND_DETAIL(query)

    this.setState({ info: brand, rule: brokerageMerchantVo })
  }

  getCartData = async () => {
    const {
      data: { cartList }
    } = await api.cart.GET_CART_DETAIL()

    const netCartList = cartList.filter((item) => item.brandId == this.id)

    this.setState({ cartList: netCartList })
  }

  getCouponList = async (params) => {
    const { couponList } = this.state

    const query = {
      ...params,
      status: 0
    }

    const {
      data: { data, count: total }
    } = await api.coupon.GET_COUPON_LIST_BY_OWN(query)
    // console.log(data, count, 1000)
    let nList = data.map((item) => {
      return {
        ...item,
        typeDesc: this.handelType(item.goodsType),
        startTime: item.startTime.replace(/-/g, '/'),
        endTime: item.endTime.replace(/-/g, '/')
      }
    })

    nList = [...couponList, ...nList]

    // Taro.hideLoading()

    this.setState({ couponList: nList, total })

    return { total }
  }

  fetchCheckout = async () => {
    let { currentCoupon } = this.state

    const query = { couponId: currentCoupon ? currentCoupon.id : 0, brandId: this.id, cartId: 0 }

    const {
      data: {
        checkedGoodsList: cartList,
        actualCashBack: discountPrice,
        actualPrice: tootalPrice,
        additionalFee: additionalPrice,
        extraAdditionalFee: extraAdditionalPrice,
        goodsTotalPrice: goodsPrice,
        packingFee: packagePrice,
        deliveryTime,
        freightPrice,
        isNew
      }
    } = await api.cart.CHECKOUT_BY_CART(query)

    const priceInfo = {
      discountPrice,
      tootalPrice,
      additionalPrice,
      extraAdditionalPrice,
      freightPrice,
      goodsPrice,
      packagePrice
    }

    let sendTime

    if (deliveryTime) {
      const { date, endTime, startTime } = deliveryTime

      sendTime = `${date} ${startTime}-${endTime}`
    }

    this.setState({ cartList, priceInfo, sendTime, isNew })
  }

  fetchVali = () => {
    let {
      form: { userName, mobile, address }
    } = this.state

    if (!address) {
      D.toast('请输入收货人楼层寝室号')
      return false
    }

    if (!userName) {
      D.toast('请输入收货人姓名')
      return false
    }

    if (!mobile) {
      D.toast('请输入收货人手机号')
      return false
    }

    return true
  }

  fetchSumbitOrder = async () => {
    if (!this.fetchVali()) {
      return
    }

    let { form, currentCoupon } = this.state

    const locInfo = Taro.getStorageSync('locInfo')

    // console.log(form)

    const query = {
      ...form,
      cartId: 0,
      couponId: currentCoupon ? currentCoupon.id : 0,
      brandId: this.id,
      schoolName: locInfo.school.label,
      buildingId: locInfo.floor.value,
      buildingNo: locInfo.floor.label
    }

    const {
      data: { orderId }
    } = await api.order.SUBMIT_ORDER(query)

    const { data: payParams } = await api.order.SUBMIT_PREPAY({ orderId })

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

      console.log(res)
    } catch (e) {}
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      total,
      pageParams,
      form,
      info,
      rule,
      cartList,
      priceInfo,
      sendTime,
      isNew,
      couponShow,
      couponList,
      currentCoupon,
      currentSchool,
      currentFloor
    } = this.state

    if (!info) return null

    const { iconUrl, name } = info

    const { firstOrderReduceFee, deliveryFee } = rule

    const {
      discountPrice,
      tootalPrice,
      additionalPrice,
      extraAdditionalPrice,
      freightPrice,
      goodsPrice,
      packagePrice
    } = priceInfo

    const lineFreight = deliveryFee == freightPrice ? null : deliveryFee

    const CartList =
      cartList.length > 0 &&
      cartList.map((item) => {
        return (
          <View key={item.id} className='shop-plate__item'>
            <View className='shop-plate__item-title'>
              {/* <Text className='shop-plate__item-title__tag red-tag'>折</Text> */}
              <Text className='shop-plate__item-title__name'>{item.goodsName}</Text>

              {item.specifications &&
                item.specifications.map((val) => {
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
              <View className='shop-plate__item-num'>x{item.number}</View>
              <View className='shop-plate__item-price__num'>
                {/* <View className='shop-plate__item-price__line'>￥{item.price}</View>￥ */}￥
                {item.price}
              </View>
            </View>
          </View>
        )
      })

    const CouponList =
      couponList.length > 0 &&
      couponList.map((item, index) => {
        return (
          <View key={item.id} className='list-item' onClick={this.onSelectCoupon(index)}>
            <View className='circle circle-left'></View>
            <View className='circle circle-right'></View>
            <View className='list-item-top'>
              <View className='list-item-top__info'>
                <View className='list-item-top__info-title'>{item.name}</View>
                <View className='list-item-top__info-date'>
                  {item.startTime}-{item.endTime}
                </View>
              </View>
              <View className='list-item-top__price'>
                <View className='list-item-top__price-text'>￥{item.discount}</View>
                <View className='list-item-top__price-explain'>满{item.min}可用</View>
              </View>
            </View>
            <View className='list-item-bottom'>
              <Text className='list-item-bottom__title'>{item.typeDesc}</Text>
            </View>
          </View>
        )
      })

    return (
      <View className='index'>
        <View className='shop-container'>
          <View className='shop-header'>
            <Image src={iconUrl} mode='aspectFill' className='shop-header__avatar'></Image>
            <View className='shop-header__name'>{name}</View>
          </View>
          <View className='shop-plate'>{CartList}</View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag green-tag'>打包</Text>
                打包费
              </View>
              <View className='shop-plate__item-price'>￥{packagePrice || 0}</View>
            </View>
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>
                <Text className='shop-plate__item-title__tag blue-tag'>配送</Text>
                配送费
              </View>
              <View className='shop-plate__item-price'>
                ￥{freightPrice || 0}
                <Text className='shop-plate__item-price__line'>￥{lineFreight}</Text>
              </View>
            </View>
            {additionalPrice + extraAdditionalPrice > 0 && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title'>
                  <Text className='shop-plate__item-title__tag red-d-tag'>附加</Text>
                  附加费
                </View>
                <View className='shop-plate__item-price'>
                  ￥{additionalPrice + extraAdditionalPrice}
                </View>
              </View>
            )}
            {isNew && firstOrderReduceFee > 0 && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title'>
                  <Text className='shop-plate__item-title__tag red-d-tag'>新客</Text>
                  新客立减
                </View>
                <View className='shop-plate__item-price'>￥{firstOrderReduceFee}</View>
              </View>
            )}
            {isNew && firstOrderReduceFee > 0 && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title'>
                  <Text className='shop-plate__item-title__tag red-d-tag'>新客</Text>
                  满减优惠
                </View>
                <View className='shop-plate__item-price'>￥{firstOrderReduceFee}</View>
              </View>
            )}
            <View className='shop-plate__item'>
              <View className='shop-plate__item-title'>平台抵扣券</View>
              {!currentCoupon && (
                <View className='shop-plate__item-more' onClick={this.openCouponShow}>
                  请选择
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              )}
            </View>
            {currentCoupon && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title explain'>{currentCoupon.name}</View>
                <View className='shop-plate__item-price' onClick={this.openCouponShow}>
                  ￥{currentCoupon.discount}
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              </View>
            )}
          </View>
          <View className='shop-plate'>
            <View className='shop-plate__item'>
              {discountPrice > 0 && (
                <View className='shop-plate__item-title'>已为您节省￥{discountPrice}</View>
              )}
              <View className='shop-plate__item-price'>
                <View className='shop-plate__item-price__num'>
                  总计
                  <View className='red'>￥{tootalPrice}</View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className='plate'>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>期望送达时间</Text>
            <View className='plate-option__item-num'>{sendTime}</View>
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>收货地址</View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>所在楼宇</Text>
            <View className='plate-option__item-num stronge'>{currentFloor}</View>
          </View>
          <View className='plate-option'>
            <Text className='plate-option__item-title '>楼层寝室号</Text>
            <Input
              value={form.address}
              className='plate-option__item-inp'
              onInput={(e) => this.changeInp(e, 'address')}
            />
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>用户信息</View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>收货人姓名</Text>
            <Input
              value={form.userName}
              className='plate-option__item-inp'
              onInput={(e) => this.changeInp(e, 'userName')}
            />
          </View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>联系电话</Text>
            <Input
              value={form.mobile}
              className='plate-option__item-inp'
              onInput={(e) => this.changeInp(e, 'mobile')}
            />
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>备注</View>
          <View className='plate-option'>
            <Input
              value={form.message}
              placeholder='请输入备注'
              className='plate-option__item-inp remark'
              onInput={(e) => this.changeInp(e, 'message')}
            />
          </View>
        </View>
        <View className='footer'>
          <View className='footer-info'>
            <View className='footer-info__price'>实付金额</View>
            <View className='footer-info__explain'>￥{tootalPrice}</View>
          </View>
          <View className='footer-btn active-btn' onClick={this.handleSubmit}>
            去结算
          </View>
        </View>
        <AtFloatLayout isOpened={couponShow} onClose={this.closeCouponShow}>
          <View className='float-title'>平台抵扣券</View>
          <View className='float-list'>
            <ScrollView scrollY className='float-content' onScrollToLower={this.onScrollHandle}>
              {CouponList}
              {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
            </ScrollView>
          </View>
          <View className='float-title' onClick={this.unuseCoupon}>
            不使用优惠券
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default withScrollPage(Checkout)
