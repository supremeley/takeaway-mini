import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Input, ScrollView } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import t1 from '@/assets/imgs/test1.png'
import api from '@/api'

import D from '@/common'

import 'taro-ui/dist/style/components/float-layout.scss'
import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class Checkout extends Component {
  state = {
    couponShow: false,
    couponList: [{}, {}, {}],
    currentCoupon: {},
    goodsList: [
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      },
      {
        price: 1,
        pic: t1,
        title: '蔬菜'
      }
    ]
  }

  // onConfirm = () => {
  //   Taro.navigateTo({ url: 'goods/list' })
  // }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    await this.getCartData()
  }

  openCouponShow = () => {
    this.setState({ couponShow: true })
  }

  closeCouponShow = () => {
    this.setState({ couponShow: false })
  }

  onSelect = (index) => () => {}

  getCartData = async () => {
    let { goodsList } = this.state
    // console.log(goodsList)
    const query = { id: this.id }

    const {
      data: { cartList, cartTotal }
    } = await api.cart.GET_CART_DETAIL()

    const netCartList = cartList.filter((item) => item.brandId == this.id)

    const cartGoods = []

    goodsList = goodsList.map((item) => {
      const newGoodsList = item.goods.map((goods) => {
        const res = netCartList.find((info) => info.goodsId === goods.id)

        if (res) {
          const newGoods = {
            ...goods,
            ...res
          }

          cartGoods.push(newGoods)

          return newGoods
        } else {
          return goods
        }
      })

      return { ...item, goods: [...newGoodsList] }
    })

    console.log(goodsList, cartGoods)

    this.setState({ cartList: cartGoods, goodsList })
  }

  fetchCheckout = async () => {
    let { goodsList } = this.state
    // console.log(goodsList)
    const query = { id: this.id }

    const {
      data: { cartList, cartTotal }
    } = await api.cart.CHECKOUT_BY_CART()

    // const netCartList = cartList.filter((item) => item.brandId == this.id)

    // const cartGoods = []

    // goodsList = goodsList.map((item) => {
    //   const newGoodsList = item.goods.map((goods) => {
    //     const res = netCartList.find((info) => info.goodsId === goods.id)

    //     if (res) {
    //       const newGoods = {
    //         ...goods,
    //         ...res
    //       }

    //       cartGoods.push(newGoods)

    //       return newGoods
    //     } else {
    //       return goods
    //     }
    //   })

    //   return { ...item, goods: [...newGoodsList] }
    // })

    // console.log(goodsList, cartGoods)

    // this.setState({ cartList: cartGoods, goodsList })
  }

  fetchSumbitOrder = async () => {
    let { goodsList } = this.state
    // console.log(goodsList)
    const query = { id: this.id }

    const {
      data: { cartList, cartTotal }
    } = await api.order.SUBMIT_ORDER()

    // const netCartList = cartList.filter((item) => item.brandId == this.id)

    // const cartGoods = []

    // goodsList = goodsList.map((item) => {
    //   const newGoodsList = item.goods.map((goods) => {
    //     const res = netCartList.find((info) => info.goodsId === goods.id)

    //     if (res) {
    //       const newGoods = {
    //         ...goods,
    //         ...res
    //       }

    //       cartGoods.push(newGoods)

    //       return newGoods
    //     } else {
    //       return goods
    //     }
    //   })

    //   return { ...item, goods: [...newGoodsList] }
    // })

    // console.log(goodsList, cartGoods)

    // this.setState({ cartList: cartGoods, goodsList })
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { couponShow, couponList, currentCoupon } = this.state

    return (
      <View className='index'>
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
              <View className='shop-plate__item-more' onClick={this.openCouponShow}>
                请选择
                <View className='at-icon at-icon-chevron-right'></View>
              </View>
              {/* <View className='shop-plate__item-price'>￥5</View> */}
            </View>
            {currentCoupon && (
              <View className='shop-plate__item'>
                <View className='shop-plate__item-title explain'>优惠券xxxx</View>
              </View>
            )}
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
        </View>
        <View className='plate'>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>期望送达时间</Text>
            <View className='plate-option__item-num'>
              2021-05.19 07:00-07:30
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>收货地址</View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>所在楼宇</Text>
            <View className='plate-option__item-num stronge'>3号楼</View>
          </View>
          <View className='plate-option'>
            <Text className='plate-option__item-title '>楼层寝室号</Text>
            <Input className='plate-option__item-inp' />
          </View>
        </View>
        <View className='plate'>
          <View className='plate-title'>用户信息</View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>收货人姓名</Text>
            <Input className='plate-option__item-inp' />
          </View>
          <View className='plate-option'>
            <Text className='plate-option__item-title'>联系电话</Text>
            <Input className='plate-option__item-inp' />
          </View>
        </View>

        <View className='footer'>
          <View className='footer-info'>
            <View className='footer-info__price'>实付金额</View>
            <View className='footer-info__explain'>￥3</View>
          </View>
          <View className='footer-btn active-btn' onClick={this.addCart}>
            去结算
          </View>
        </View>
        <AtFloatLayout isOpened={couponShow} onClose={this.closeCouponShow}>
          <View className='float-title'>平台抵扣券</View>
          <View className='float-list'>
            <ScrollView scrollY className='float-content'>
              {couponList &&
                couponList.map((item, index) => {
                  return (
                    <View
                      key={item.id}
                      className='float-list-item'
                      onClick={this.onSelect(item.id)}
                    >
                      <View className='circle circle-left'></View>
                      <View className='circle circle-right'></View>
                      <View className='float-list-item-top'>
                        <View className='float-list-item-top__info'>
                          <View className='float-list-item-top__info-title'>早餐补偿券</View>
                          <View className='float-list-item-top__info-date'>2021/05/08</View>
                        </View>
                        <View className='float-list-item-top__price'>
                          <View className='float-list-item-top__price-text'>￥5</View>
                          <View className='float-list-item-top__price-explain'>满15可用</View>
                        </View>
                      </View>
                      <View className='float-list-item-bottom'>
                        <Text className='float-list-item-bottom__title'>全部店铺可用</Text>
                        {/* <View className='float-list-item-bottom__btn'>去使用</View> */}
                      </View>
                      {/* <Image src={t1} className='list-item-icon' /> */}
                    </View>
                  )
                })}
            </ScrollView>
          </View>
          <View className='float-title' onClick={this.closeCouponShow}>
            不使用优惠券
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default Checkout
