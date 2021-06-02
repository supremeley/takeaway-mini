import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtCurtain, AtModal, AtFloatLayout } from 'taro-ui'

import api from '@/api'
import D from '@/common'

import headerBg from '@/assets/imgs/header-bg.png'
import CartIcon from '@/assets/imgs/cart.png'
import CartActiveIcon from '@/assets/imgs/cart-active.png'
import ModalBg from '@/assets/imgs/modal-bg.png'

import 'taro-ui/dist/style/components/float-layout.scss'
import 'taro-ui/dist/style/components/curtain.scss'
import 'taro-ui/dist/style/components/modal.scss'
import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class itemDetail extends Component {
  state = {
    explainShow: false,
    cartShow: false,
    skuShow: false,
    // hasCart: false,
    info: null,
    currentTitle: '现烤面包0',
    currentIndex: 0,
    goodsList: [],
    cartList: [],
    curInfo: {},
    curIndex: 0,
    curIdx: 0,
    productList: [],
    curProduct: {}
  }

  componentDidMount() {
    this.fetchData()
  }

  onShareAppMessage = () => {
    return {
      title: '测试',
      path: '/home/index',
      imageUrl: ''
    }
  }

  fetchData = async () => {
    this.getShopData()
    await this.getGoodsData()
    await this.getCartData()
  }

  openCartShow = () => {
    this.setState({ cartShow: true })
  }

  closeCartShow = () => {
    this.setState({ cartShow: false })
  }

  goBack = () => {
    Taro.navigateBack()
  }

  onJumpToCheckout = () => {
    const { cartList } = this.state

    if (cartList.length) Taro.navigateTo({ url: `/pages/checkout/index/index?id=${this.id}` })
  }

  onJumpToPlate = (index) => () => {
    const { goodsList } = this.state

    const currentTitle = goodsList[index].title + index

    this.setState({
      scrollIntoView: `jump-nav${index}`,
      currentIndex: index,
      currentTitle
    })
  }

  openSkuSelector = (index, idx, id) => async () => {
    const { goodsList } = this.state
    const { info, productList } = await this.getGoodsDetail(id)

    const curProduct = productList.length && productList[0]
    // console.log(curProduct)
    this.setState({
      curIndex: index,
      curIdx: idx,
      curInfo: goodsList[index].goods[idx],
      skuShow: true,
      productList,
      curProduct
    })
  }

  closeSkuSelector = () => {
    this.setState({ skuShow: false })
  }

  addCart = async () => {
    const { cartList, curInfo, curIndex, curIdx } = this.state

    const res = await this.fetchAddCart(curIndex, curIdx)

    if (res) {
      cartList.push(curInfo)
      console.log(cartList)
      this.setState({ cartList })
    }

    // this.closeSkuSelector()
  }

  handleChange = (index, idx, type) => {
    // let { goodsList } = this.state

    // const goods = goodsList[index].goods[idx]
    this.fetchUpdateCart(index, idx, type)

    // if (type === 'add') {
    // goods.number++
    // }

    // if (type === 'minus') {
    //   goods.number--
    // }

    // goodsList[index].goods[idx] = goods

    // this.setState({ goodsList })
  }

  scrollHandle = () => {
    const { goodsList } = this.state

    const query = Taro.createSelectorQuery()

    const selector = query.selectAll(`.content-goods__plate-title`).boundingClientRect()

    selector.exec((res) => {
      const arr = res[0]

      const i = arr.findIndex((item) => {
        return item.top <= 273 && item.top >= 0
      })

      if (i >= 0) {
        const currentTitle = goodsList[i].title

        this.setState({ currentIndex: i, currentTitle, scrollIntoView: null })
      }
    })
  }

  getShopData = async () => {
    const query = { id: this.id }

    const {
      data: { brand }
    } = await api.shop.GET_BRAND_DETAIL(query)

    this.setState({ info: brand })
  }

  getGoodsData = async () => {
    const query = { brandId: this.id }

    const {
      data: { goodsList }
    } = await api.goods.GET_GOODS_LIST(query)

    const goods = goodsList.map((item) => {
      return {
        id: item.id,
        title: item.name,
        sale: 127,
        price: item.counterPrice,
        picUrl: item.picUrl,
        number: 0
      }
    })

    const currentTitle = '商品'

    this.setState({ currentTitle, goodsList: [{ title: '商品', goods }] })
  }

  getGoodsDetail = async (id) => {
    const query = { id }

    const {
      data: { info, productList }
    } = await api.goods.GET_GOODS_DETAIL(query)

    return { info, productList }
  }

  getCartData = async () => {
    let { goodsList } = this.state
    // console.log(goodsList)
    const query = { id: this.id }

    try {
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

      // console.log(goodsList, cartGoods)

      this.setState({ cartList: cartGoods, goodsList })
    } catch (e) {}
  }

  fetchAddCart = async (index, idx) => {
    let { goodsList, curProduct } = this.state

    const goods = goodsList[index].goods[idx]
    // debugger
    goods.number++

    const query = {
      brandId: this.id,
      goodsId: goods.id,
      productId: curProduct.id,
      number: goods.number
    }

    try {
      const { errno, errmsg } = await api.cart.ADD_TO_CART(query)

      if (!errno) {
        D.toast('添加成功')
      } else {
        D.toast(errmsg)
        return false
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }

    this.setState({ goodsList })

    return true
  }

  fetchUpdateCart = async (index, idx, type) => {
    let { goodsList, curProduct } = this.state

    const goods = goodsList[index].goods[idx]

    if (type === 'add') {
      goods.number++
    }

    if (type === 'minus') {
      goods.number--
    }

    const query = {
      id: this.id,
      goodsId: goods.id,
      productId: curProduct.id,
      number: goods.number
    }

    try {
      const { errno, errmsg } = await api.cart.UPDATE_CART(query)

      if (!errno) {
        if (type === 'add') {
          D.toast('添加成功')
        }

        if (type === 'minus') {
          D.toast('删除成功')
        }

        this.setState({ goodsList })
      } else {
        D.toast(errmsg)
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }
  }

  fetchDeleteCart = async (index, idx) => {
    let { goodsList, curProduct } = this.state

    const goods = goodsList[index].goods[idx]
    // debugger
    goods.number++

    const query = {
      brandId: this.id,
      goodsId: goods.id,
      productId: curProduct.id,
      number: goods.number
    }

    try {
      const { errno, errmsg } = await api.cart.DEL_TO_CART(query)

      if (!errno) {
        D.toast('添加成功')
      } else {
        D.toast(errmsg)
        return false
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }

    this.setState({ goodsList })

    return true
  }

  fetchCheckGoods = async (index, idx) => {
    let { goodsList, curProduct } = this.state

    const goods = goodsList[index].goods[idx]
    // debugger
    goods.number++

    const query = {
      brandId: this.id,
      goodsId: goods.id,
      productId: curProduct.id,
      number: goods.number
    }

    try {
      const { errno, errmsg } = await api.cart.CHECK_GOODS_IN_CART(query)

      if (!errno) {
        D.toast('添加成功')
      } else {
        D.toast(errmsg)
        return false
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }

    this.setState({ goodsList })

    return true
  }

  get total() {
    const { cartList } = this.state

    let price = 0
    let number = 0

    cartList.forEach((item) => {
      price += item.price * item.number
      number += item.number
    })
    // console.log({ price, number })
    if (price && number) {
      return { price, number }
    }

    return false
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      explainShow,
      cartShow,
      skuShow,
      info,
      cartList,
      goodsList,
      scrollIntoView,
      currentIndex,
      currentTitle,
      curInfo,
      curProduct,
      curIndex,
      curIdx
    } = this.state

    if (!info) return null

    const { iconUrl, picUrl, name, address, desc } = info

    return (
      <View className='index'>
        <View className='header'>
          <Image src={picUrl || headerBg} mode='aspectFill' className='header-bg'></Image>
          <View className='header-container'>
            <View className='at-icon at-icon-chevron-left' onClick={this.goBack}></View>
          </View>
        </View>
        <View className='shop'>
          <View className='shop-content'>
            <View className='shop-content-left'>
              <View className='shop-content-left-title'>{name}</View>
              <View className='shop-content-left-text'>{desc}</View>
            </View>
            <Image src={iconUrl} mode='aspectFill' className='shop-content-img'></Image>
          </View>
          <View className='shop-explain'>{address}</View>
          <View className='shop-tag'>
            {/* <View className='shop-tag-item'>新客立减3元 </View> */}
          </View>
        </View>
        <View className='content'>
          <ScrollView scrollY className='content-aside'>
            {goodsList &&
              goodsList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={`content-aside__item ${currentIndex === index ? 'active-item' : ''}`}
                    onClick={this.onJumpToPlate(index)}
                  >
                    {item.title}
                  </View>
                )
              })}
          </ScrollView>
          <ScrollView
            scrollIntoView={scrollIntoView}
            scrollWithAnimation
            scrollY
            className='content-goods'
            onScroll={this.scrollHandle}
          >
            <View className='cur-title'>{currentTitle}</View>
            {goodsList &&
              goodsList.map((item, index) => {
                return (
                  <View key={index} className='content-goods__plate'>
                    <View className='content-goods__plate-title' id={`jump-nav${index}`}>
                      {item.title}
                    </View>
                    <View className='content-goods__container'>
                      {item.goods.map((goods, idx) => {
                        return (
                          <View
                            key={idx}
                            className='content-goods__item'
                            onClick={this.openSkuSelector(index, idx, goods.id)}
                          >
                            <Image src={goods.picUrl} className='content-goods__item-img'></Image>
                            <View className='content-goods__item-info'>
                              <View className='content-goods__item-info__name'>{goods.title}</View>
                              {/* <View className='content-goods__item-info__sale'>
                                已售{goods.sale}
                              </View> */}
                              <View className='content-goods__item-info__price'>
                                ￥{goods.price}
                                <View className='content-goods__item-opt-text'>
                                  <View>x{goods.number}</View>
                                  {/* <View
                                    className='at-icon at-icon-subtract-circle'
                                    // onClick={(e) => {
                                    //   e.stopPropagation()
                                    //   this.handleChange(index, idx, 'minus')
                                    // }}
                                  ></View>
                                  <View>{goods.number}</View>
                                  <View
                                    className='at-icon at-icon-add-circle'
                                    // onClick={(e) => {
                                    //   e.stopPropagation()
                                    //   this.handleChange(index, idx, 'add')
                                    // }}
                                  ></View> */}
                                </View>
                              </View>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
          </ScrollView>
        </View>
        <View className='page-footer footer'>
          <Image
            src={cartList.length ? CartActiveIcon : CartIcon}
            className='footer-icon'
            onClick={this.openCartShow}
          ></Image>
          {this.total && (
            <>
              <Text className='footer-cricle'>{this.total.number}</Text>
              <View className='footer-info'>
                <View className='footer-info__price'>￥{this.total.price}</View>
                {/* <View className='footer-info__explain'>配送：￥3</View> */}
              </View>
            </>
          )}
          <View
            className={`footer-btn ${cartList.length ? 'active-btn' : ''}`}
            onClick={this.onJumpToCheckout}
          >
            {cartList.length ? '去结算' : '$15元起送'}
          </View>
        </View>
        <AtModal isOpened={explainShow}>
          <View className='modal'>
            <Image src={ModalBg} mode='aspectFill' className='modal-bg'></Image>
            <View className='modal-header'>
              <View className='modal-header__title'>吃饭鸭</View>
              <View className='modal-header__explain'>今天也要记得吃饭鸭</View>
            </View>
            <View className='modal-content'>
              <View>xxxxxxxxxxxxxxxxxx</View>
            </View>
            <View className='modal-footer'>
              <View className='modal-footer__btn'>取消</View>
              <View className='modal-footer__btn confirm'>确认</View>
            </View>
          </View>
        </AtModal>
        <AtCurtain isOpened={skuShow} onClose={this.closeSkuSelector}>
          {/* <View className='sku-selector'>
            <View className='content-goods__item'>
              <Image src={curInfo.picUrl} className='content-goods__item-img'></Image>
              <View className='content-goods__item-info'>
                <View className='content-goods__item-info__name'>{curInfo.title}</View>
                <View className='content-goods__item-info__sale'>已售{curInfo.sale}</View>
                <View className='content-goods__item-info__price'>
                  ${curInfo.price}
                  <View className='content-goods__item-opt'>
                    <View
                      className='at-icon at-icon-subtract-circle'
                      onClick={this.handleChange(0, 0, 'minus')}
                    ></View>
                    <View>{curInfo.number}</View>
                    <View
                      className='at-icon at-icon-add-circle'
                      onClick={this.handleChange(0, 0, 'add')}
                    ></View>
                  </View>
                </View>
              </View>
            </View>
            <View className='sku-option'>
              <View className='sku-option__title'>规格：</View>
              <View className='sku-option__tag'>
                <Text className='sku-option__tag-item'>约450克</Text>
                <Text className='sku-option__tag-item sku-active'>约450克</Text>
              </View>
            </View>
            <Button className='sku-btn' onClick={this.addCart}>
              加入购物车
            </Button>
          </View> */}
          <View className='sku'>
            <View className='sku-goods'>
              <Image src={curInfo.picUrl} mode='aspectFill' className='sku-goods__img'></Image>
              <View className='sku-goods__name'>{curInfo.name}</View>
              <View className='sku-goods__desc'>{curInfo.brief}</View>
              {/* <View className='sku-goods__sale'>已售2298</View> */}
            </View>
            <View className='footer'>
              <Image src={CartActiveIcon} className='footer-icon'></Image>
              <Text className='footer-cricle'>{curProduct.number}</Text>
              <View className='footer-info'>
                <View className='footer-info__price'>￥{curProduct.price}</View>
                {/* <View className='footer-info__explain'>配送：￥3</View> */}
              </View>
              {cartList.length ? (
                <View className='content-goods__item-opt'>
                  <View
                    className='at-icon at-icon-subtract-circle'
                    onClick={() => this.handleChange(curIndex, curIdx, 'minus')}
                  ></View>
                  <View>{curInfo.number}</View>
                  <View
                    className='at-icon at-icon-add-circle'
                    onClick={() => this.handleChange(curIndex, curIdx, 'add')}
                  ></View>
                </View>
              ) : (
                <View className='footer-btn active-btn' onClick={this.addCart}>
                  加入购物车
                </View>
              )}
            </View>
          </View>
        </AtCurtain>
        <AtFloatLayout isOpened={cartShow} onClose={this.closeCartShow}>
          <View className='float-title'>
            已选商品
            <Text>(打包费：￥3)</Text>
          </View>
          <View className='float-content'>
            {cartList &&
              cartList.map((item, index) => {
                return (
                  <View className='float-option' key={item.id}>
                    <View className='float-option__left'>
                      <View className='float-option__left-title'>{item.name}</View>
                      <View className='float-option__left-number'>￥{item.price}</View>
                    </View>
                    <View className='float-option__right'>
                      <View className='content-goods__item-opt'>
                        <View
                          className='at-icon at-icon-subtract-circle'
                          // onClick={this.handleChange(0, 0, 'minus')}
                        ></View>
                        <View>{item.number}</View>
                        <View
                          className='at-icon at-icon-add-circle'
                          // onClick={this.handleChange(0, 0, 'add')}
                        ></View>
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
          <View className='footer'>
            <Image src={CartActiveIcon} className='footer-icon'></Image>
            {this.total && (
              <>
                <Text className='footer-cricle'>{this.total.number}</Text>4
                <View className='footer-info'>
                  <View className='footer-info__price'>￥{this.total.price}</View>
                  {/* <View className='footer-info__explain'>配送：￥3</View> */}
                </View>
              </>
            )}
            <View className='footer-btn active-btn' onClick={this.onJumpToCheckout}>
              去结算
            </View>
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default itemDetail
