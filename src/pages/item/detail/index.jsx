import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtCurtain, AtFloatLayout } from 'taro-ui'

import api from '@/api'
import D from '@/common'

import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'

import headerBg from '@/assets/imgs/header-bg.png'
import CartIcon from '@/assets/imgs/cart.png'
import CartActiveIcon from '@/assets/imgs/cart-active.png'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/float-layout.scss'
import 'taro-ui/dist/style/components/curtain.scss'

import Footer from '../components/footer'
import NumControl from '../components/num-control'

import './index.scss'

class itemDetail extends Component {
  state = {
    explainShow: false,
    cartShow: false,
    skuShow: false,
    currentTitle: '',
    currentIndex: 0,
    info: null,
    rule: null,
    shopBottom: 215,
    goodsList: [],
    cartList: [],
    curInfo: {},
    curIndex: 0,
    curIdx: 0,
    productList: [],
    specificationList: [],
    priceInfo: {},
    cashBackList: []
  }

  componentDidMount() {
    this.fetchData()
  }

  onShareAppMessage = () => {
    const { info } = this.state

    return {
      title: info.name || '吃饭鸭',
      path: `/item/detail/index?id=${this.id}`,
      imageUrl: ''
    }
  }

  handleAddCart = debounce(() => this.fetchAddCart(), 300)

  handleUpdateCartInModal = (type) => debounce(() => this.fetchUpdateCartInModal(type), 300)

  handleUpdateCartInList = (index, type) =>
    debounce(() => this.fetchUpdateCartInList(index, type), 300)

  handleUpdateCartInGoods = (index, idx, type) =>
    debounce(() => this.fetchUpdateCartInGoods(index, idx, type), 300)

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

  openExplainShow = () => {
    this.setState({ explainShow: true })
  }

  closeExplainShow = () => {
    this.setState({ explainShow: false })
  }

  goBack = () => {
    Taro.navigateBack()
  }

  onJumpToCheckout = () => {
    const { rule, priceInfo } = this.state
    const { totalPrice, freightPrice } = priceInfo

    if ((totalPrice - freightPrice || 0) >= rule.basePrice) {
      Taro.navigateTo({ url: `/pages/checkout/index/index?id=${this.id}` })
    }
  }

  onJumpToPlate = (index) => () => {
    const { goodsList } = this.state

    const currentTitle = goodsList[index].name

    this.setState({
      scrollIntoView: `jump-nav${index}`,
      currentIndex: index,
      currentTitle
    })
  }

  openSkuSelector = (index, idx) => async () => {
    const { goodsList } = this.state

    let { specificationList, productList, id } = goodsList[index].goods[idx]

    if (!specificationList && !productList) {
      const res = await this.getGoodsDetail(id)

      specificationList = res.specificationList
      productList = res.productList

      goodsList[index].goods[idx].specificationList = res.specificationList
      goodsList[index].goods[idx].productList = res.productList
    }

    specificationList = specificationList.map((item) => {
      return {
        ...item,
        curSpe: 0
      }
    })

    // this.handleProductList(productList, cartList)

    const curInfo = goodsList[index].goods[idx]

    // console.log(curInfo)

    this.setState({
      curIndex: index,
      curIdx: idx,
      skuShow: true,
      curInfo,
      goodsList,
      productList,
      specificationList
    })
  }

  closeSkuSelector = () => {
    this.setState({ skuShow: false })
  }

  selectSpe = (index, idx) => () => {
    const { specificationList } = this.state

    let speList = specificationList.concat()

    speList[index].curSpe = idx

    this.setState({ specificationList: speList })
  }

  handelScroll = () => {
    const { goodsList, currentIndex } = this.state

    const query = Taro.createSelectorQuery()

    const selector = query.selectAll(`.content-goods__plate`).boundingClientRect()

    selector.exec((res) => {
      // console.log(res, 'resres')
      const arr = res[0]
      // console.log(res, 'resres')

      // const i = arr.findIndex((item, index) => {
      //   return item.top <= 273 && item.top >= 0 && index != currentIndex
      // })
      let i = 0

      const cur = arr[currentIndex]

      if (cur.top <= 273 && cur.bottom >= 273) {
        i = currentIndex
      }

      if (cur.bottom < 273) {
        i = currentIndex + 1
      }

      if (cur.top >= 273) {
        i = currentIndex - 1
      }

      // console.log(i, 'i')

      if (i != currentIndex) {
        const currentTitle = goodsList[i].name

        this.setState({ currentIndex: i, currentTitle, scrollIntoView: null })
      }
    })
  }

  getShopData = async () => {
    const query = { id: this.id }

    const {
      data: { brand, brokerageMerchantVo, cashBackList }
    } = await api.shop.GET_BRAND_DETAIL(query)

    const explainShow = !!brand.welcomeMessage

    this.setState({ info: brand, rule: brokerageMerchantVo, cashBackList, explainShow }, () => {
      // setTimeout(() => {
      Taro.nextTick(() => {
        const q = Taro.createSelectorQuery()
        const selector = q.select(`.shop`).boundingClientRect()
        // console.log(selector)
        selector.exec((res) => {
          // console.log(res,'res')

          this.setState({ shopBottom: res[0].bottom })
        })
      })
      // }, 500)
    })
  }

  getGoodsData = async () => {
    const query = { brandId: this.id }

    const {
      data: { goodsList, filterCategoryList, productNumList }
    } = await api.goods.GET_GOODS_LIST(query)

    const nGoods = goodsList.reduce((vals, goods) => {
      const res = vals.find((info) => info.categoryId == goods.categoryId)

      const proRes = productNumList.find((info) => info.goodsId === goods.id)

      let goodsItem = {
        categoryId: goods.categoryId,
        id: goods.id,
        goodsId: goods.id,
        name: goods.name,
        brief: goods.brief,
        // sale: 127,
        price: goods.retailPrice,
        linePrice: goods.counterPrice,
        picUrl: goods.picUrl,
        number: 0
      }

      if (proRes) {
        goodsItem.productNum = proRes.productNum
      }

      if (res) {
        res.goods.push(goodsItem)
      } else {
        vals.push({ categoryId: goods.categoryId, goods: [goodsItem] })
      }
      return vals
    }, [])
    // console.log(nGoods)

    const nGoodsList = nGoods.map((item) => {
      const n = filterCategoryList.find((gn) => gn.id == item.categoryId)

      if (n) {
        return { ...n, goods: item.goods }
      } else {
        return { name: '默认', goods: item.goods }
      }
    })
    // console.log(nGoodsList)
    const currentTitle = nGoodsList[0].name

    this.setState({ currentTitle, goodsList: nGoodsList })
  }

  getGoodsDetail = async (id) => {
    const query = { id }
    // debugger
    const {
      data: { info, productList, specificationList }
    } = await api.goods.GET_GOODS_DETAIL(query)

    return { info, productList, specificationList }
  }

  getCartData = async () => {
    let { goodsList } = this.state

    try {
      const {
        data: { cartList }
      } = await api.cart.GET_CART_DETAIL()

      const netCartList = cartList
        .filter((item) => item.brandId == this.id)
        .map((item) => {
          return {
            ...item,
            name: item.goodsName,
            cartId: item.id
          }
        })

      let cList = []

      goodsList = goodsList.map((item, index) => {
        let gnum = 0
        const newGoodsList = item.goods.map((goods, idx) => {
          let num = 0

          const newCartList = netCartList.reduce((val, cart) => {
            if (cart.goodsId === goods.id) {
              num += cart.number

              const nCart = {
                ...cart,
                gooodIndex: index,
                gooodIdx: idx
              }

              val.push(nCart)
            }

            return val
          }, [])

          cList.push(...newCartList)

          if (num) {
            gnum += num
            return {
              ...goods,
              number: num
            }
          } else {
            return goods
          }
        })

        return { ...item, gnum, goods: [...newGoodsList] }
      })

      // console.log(goodsList, netCartList, 'getCartData')

      this.setState({ cartList: cList, goodsList })

      if (cList.length) this.fetchCheckout()

      return cList
    } catch (e) {}
  }

  fetchAddCart = async () => {
    let { curIndex, curIdx, goodsList } = this.state

    const goods = goodsList[curIndex].goods[curIdx]

    goods.number = 1

    const query = {
      id: this.id,
      goodsId: goods.goodsId,
      productId: this.curProduct.productId,
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
    }

    // const cartList = (await ) || []

    // console.log(cartList, 'cartList')

    // this.handleProductList(productList, cartList)

    this.setState({ goodsList }, () => this.getCartData())

    // return true
  }

  fetchCheckout = async () => {
    const query = { brandId: this.id, cartId: 0 }

    const {
      data: {
        freightPrice,
        actualCashBack: discountPrice,
        actualPrice: totalPrice,
        additionalFee: additionalPrice,
        extraAdditionalFee: extraAdditionalPrice,
        goodsTotalPrice: goodsPrice,
        goodsTotalPrice1: goodsPrice1,
        packingFee: packagePrice,
        orderTotalPrice: orderTotalPrice
      }
    } = await api.cart.CHECKOUT_BY_CART(query)

    const priceInfo = {
      discountPrice,
      totalPrice,
      additionalPrice,
      extraAdditionalPrice,
      freightPrice,
      goodsPrice,
      packagePrice,
      goodsPrice1,
      orderTotalPrice
    }

    this.setState({ priceInfo })
  }

  fetchUpdateCartInModal = async (type) => {
    let { curIndex, curIdx, goodsList, cartList } = this.state

    const goods = goodsList[curIndex].goods[curIdx]

    const curCart = cartList.find((item) => item.productId === this.curProduct.productId)
    // console.log(curIndex, curIdx, goodsList, cartList, curCart, 'fetchUpdateCartInModal')
    let { number } = curCart

    if (type === 'add') {
      goods.number++
      number++
    }

    if (type === 'minus') {
      goods.number--
      number--

      if (!number) {
        await this.fetchDeleteCart(this.curProduct.productId)

        this.setState({ goodsList }, () => this.getCartData())

        return
      }
    }

    const query = {
      id: this.curProduct.id,
      goodsId: goods.goodsId,
      productId: this.curProduct.productId,
      number: number
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

        this.setState({ goodsList }, () => this.getCartData())
      } else {
        D.toast(errmsg)
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }
  }

  fetchUpdateCartInList = async (index, type) => {
    let { cartList, goodsList } = this.state

    let { gooodIndex, gooodIdx, productId, id: cartId, number } = cartList[index]

    const goods = goodsList[gooodIndex].goods[gooodIdx]

    if (type === 'add') {
      goods.number++
      number++
    }

    if (type === 'minus') {
      goods.number--
      number--

      if (!number) {
        await this.fetchDeleteCart(productId)

        this.setState({ goodsList }, () => this.getCartData())

        return
      }
    }

    const query = {
      id: cartId,
      goodsId: goods.goodsId,
      productId: productId,
      number: number
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

        this.setState({ goodsList }, () => this.getCartData())
      } else {
        D.toast(errmsg)
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }
  }

  fetchUpdateCartInGoods = async (index, idx, type) => {
    const { goodsList } = this.state

    let { specificationList, productList, id } = goodsList[index].goods[idx]

    let curInfo = goodsList[index].goods[idx]

    if (!specificationList && !productList) {
      const res = await this.getGoodsDetail(id)

      specificationList = res.specificationList
      productList = res.productList

      // goodsList[index].goods[idx].specificationList = res.specificationList
      // goodsList[index].goods[idx].productList = res.productList

      curInfo = {
        ...curInfo,
        specificationList,
        productList
      }
    }

    specificationList = specificationList.map((item) => {
      return {
        ...item,
        curSpe: 0
      }
    })

    goodsList[index].goods[idx] = curInfo

    // this.handleProductList(productList, cartList)

    // console.log(curInfo)

    this.setState(
      {
        curIndex: index,
        curIdx: idx,
        curInfo,
        goodsList,
        productList,
        specificationList
      },
      () => {
        let { cartList } = this.state

        // const goods = goodsList[index].goods[idx]

        const curCart = cartList.find((item) => item.productId === this.curProduct.productId)

        if (curCart) {
          this.fetchUpdateCartInModal(type)
        } else {
          if (type === 'minus') {
            return
          }
          this.fetchAddCart()
        }
      }
    )
  }

  fetchDeleteCart = async (id) => {
    const query = {
      productIds: [id]
    }

    try {
      const { errno, errmsg } = await api.cart.DEL_TO_CART(query)

      if (!errno) {
        D.toast('删除成功')
        // await this.getCartData()
      } else {
        D.toast(errmsg)
        return false
      }
    } catch (e) {
      console.log(e)
      // return new Error(e)
    }

    return true
  }

  get curProduct() {
    const { specificationList, productList, cartList } = this.state

    const curSpe = specificationList.reduce((val, item) => {
      const value = item.valueList[item.curSpe].value
      val.push(value)
      return val
    }, [])

    const res = productList.find((item) => {
      return isEqual(item.specifications, curSpe)
    })

    if (!res) return false

    const curCart = cartList.find((item) => {
      return item.productId === res.id
    })

    console.log(cartList, res, curCart, 'curProduct')

    if (curCart) {
      const cur = {
        ...curCart,
        total: curCart.price * curCart.number
      }

      return { ...cur, goodsNum: cur.number, hasCart: true }
    } else {
      return { ...res, productId: res.id, goodsNum: 0, hasCart: false }
    }

    return res || null
  }

  get total() {
    const { cartList } = this.state

    let price = 0,
      number = 0,
      packingFee = 0

    cartList.forEach((item) => {
      price += item.price * item.number
      number += item.number
      packingFee += item.packingFee
    })
    console.log({ price, number, packingFee })
    if (price && number) {
      return { price, number, packingFee }
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
      rule,
      shopBottom,
      priceInfo,
      cartList,
      goodsList,
      scrollIntoView,
      currentIndex,
      currentTitle,
      curInfo,
      specificationList,
      productList,
      cashBackList
    } = this.state

    if (!info) return null

    const { iconUrl, name, address, desc, welcomeMessage } = info

    const { basePrice, deliveryFee, firstOrderReduceFee } = rule

    const {
      totalPrice,
      discountPrice,
      goodsPrice,
      goodsPrice1,
      packagePrice,
      freightPrice,
      orderTotalPrice
    } = priceInfo

    const linePrice = goodsPrice == goodsPrice1 ? null : orderTotalPrice + discountPrice

    const lineFreight = deliveryFee == freightPrice ? null : deliveryFee

    const addPrice = this.curProduct.price - curInfo.price

    const CashList =
      cashBackList.length > 0 &&
      cashBackList.map((item) => {
        return (
          <View key={item.targetPrice} className='shop-tag-item'>
            满{item.targetPrice}元减{item.amount}元
          </View>
        )
      })

    const AsideList =
      goodsList.length > 0 &&
      goodsList.map((item, index) => {
        return (
          <View
            key={index}
            className={`content-aside__item ${currentIndex === index ? 'active-item' : ''}`}
            onClick={this.onJumpToPlate(index)}
          >
            {item.name}
            {item.gnum > 0 && <Text className='content-aside__item-num'>{item.gnum}</Text>}
          </View>
        )
      })

    const CartList =
      cartList.length > 0 &&
      cartList.map((item, index) => {
        return (
          <View className='float-option' key={item.id}>
            <View className='float-option__left'>
              <View className='float-option__left-title'>
                {item.name}
                {item.specifications &&
                  item.specifications.map((val) => {
                    return (
                      <>
                        {val != '默认' && (
                          <Text key={val} className='float-option__left-title__spe'>
                            ({val})
                          </Text>
                        )}
                      </>
                    )
                  })}
              </View>
              <View className='float-option__left-number'>￥{item.price * item.number}</View>
            </View>
            <View className='float-option__right'>
              <NumControl
                num={item.number}
                onAddHandle={this.handleUpdateCartInList(index, 'add')}
                onMinusHandle={this.handleUpdateCartInList(index, 'minus')}
              />
            </View>
          </View>
        )
      })

    const GoodsList =
      goodsList.length > 0 &&
      goodsList.map((item, index) => {
        return (
          <View key={index} className='content-goods__plate'>
            <View className='content-goods__plate-title' id={`jump-nav${index}`}>
              {item.name}
            </View>
            <View className='content-goods__container'>
              {item.goods.map((goods, idx) => {
                return (
                  <View
                    key={idx}
                    className='content-goods__item'
                    onClick={this.openSkuSelector(index, idx)}
                  >
                    <Image
                      src={goods.picUrl}
                      mode='aspectFill'
                      className='content-goods__item-img'
                    ></Image>
                    <View className='content-goods__item-info'>
                      <View className='content-goods__item-info__name'>{goods.name}</View>
                      <View className='content-goods__item-info__sale'>{goods.brief}</View>
                      {/* <View className='content-goods__item-info__sale'>
                        已售{goods.sale}
                      </View> */}
                      <View className='content-goods__item-info__price'>
                        <View>
                          <Text>￥{goods.price}</Text>
                          {linePrice && (
                            <Text className='content-goods__item-info__price-line'>
                              ￥{goods.linePrice}
                            </Text>
                          )}
                        </View>
                        <View className='content-goods__item-opt-text'>
                          {goods.productNum == 1 ? (
                            <NumControl
                              num={goods.number}
                              onAddHandle={this.handleUpdateCartInGoods(index, idx, 'add')}
                              onMinusHandle={this.handleUpdateCartInGoods(index, idx, 'minus')}
                            />
                          ) : (
                            <View className='content-goods__item-opt-choose'>选规格</View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        )
      })

    return (
      <View className='item-detail'>
        <View className='header'>
          <Image src={headerBg} mode='aspectFill' className='header-bg'></Image>
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
            {firstOrderReduceFee > 0 && (
              <View className='shop-tag-item'>新客立减{firstOrderReduceFee}元</View>
            )}
            {CashList}
          </View>
        </View>
        <View className='content'>
          {/* {goodsList.length > 1 && (
            <ScrollView
              scrollY
              style={{ height: `calc(100vh - ${shopBottom + 85}px)` }}
              className='content-aside'
            >
              {AsideList}
            </ScrollView>
          )} */}
          <ScrollView
            scrollY
            style={{ height: `calc(100vh - ${shopBottom + 85}px)` }}
            className='content-aside'
          >
            {AsideList}
          </ScrollView>
          <ScrollView
            scrollIntoView={scrollIntoView}
            scrollWithAnimation
            scrollY
            style={{ height: `calc(100vh - ${shopBottom + 85}px)` }}
            className='content-goods'
            onScroll={this.handelScroll}
          >
            <View style={{ top: shopBottom + 'px' }} className='cur-title'>
              {currentTitle}
            </View>
            {GoodsList}
          </ScrollView>
        </View>
        <Footer
          isfloatLayout={false}
          total={this.total}
          basePrice={basePrice}
          totalPrice={totalPrice}
          linePrice={linePrice}
          freightPrice={freightPrice}
          lineFreight={lineFreight}
          onCartClick={this.openCartShow}
          onJump={this.onJumpToCheckout}
        />
        <AtCurtain isOpened={explainShow} onClose={this.closeExplainShow}>
          <View className='modal'>
            <Image src={iconUrl} mode='aspectFill' className='modal-icon'></Image>
            <View className='modal-header'>
              <View className='modal-header__title'>{name}</View>
              <View className='modal-header__explain'>温馨提示</View>
            </View>
            <View className='modal-content'>
              <View>{welcomeMessage}</View>
            </View>
          </View>
        </AtCurtain>
        <AtCurtain isOpened={skuShow} onClose={this.closeSkuSelector}>
          {productList.length > 1 ? (
            <View className='sku-selector'>
              <View className='content-goods__item'>
                <Image src={curInfo.picUrl} className='content-goods__item-img'></Image>
                <View className='content-goods__item-info'>
                  <View className='content-goods__item-info__name'>{curInfo.name}</View>
                  <View className='content-goods__item-info__sale'>{curInfo.brief}</View>
                  {this.curProduct && (
                    <View className='content-goods__item-info__price'>
                      <View>
                        ￥{this.curProduct.price}
                        {/* {addPrice > 0 && <Text>+{addPrice}</Text>} */}
                      </View>
                      {this.curProduct.goodsNum > 0 && (
                        <NumControl
                          num={this.curProduct.goodsNum}
                          onAddHandle={this.handleUpdateCartInModal('add')}
                          onMinusHandle={this.handleUpdateCartInModal('minus')}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
              {specificationList &&
                specificationList.map((item, index) => {
                  return (
                    <View className='sku-option' key={item.name}>
                      <View className='sku-option__title'>{item.name}：</View>
                      <View className='sku-option__tag'>
                        {item.valueList &&
                          item.valueList.map((inner, idx) => {
                            return (
                              <Text
                                className={`sku-option__tag-item ${
                                  item.curSpe === idx ? 'sku-active' : ''
                                }`}
                                key={inner.id}
                                onClick={this.selectSpe(index, idx)}
                              >
                                {inner.value}
                              </Text>
                            )
                          })}
                      </View>
                    </View>
                  )
                })}
              <View className='sku-btn' onClick={this.handleAddCart}>
                加入购物车
              </View>
            </View>
          ) : (
            <View className='sku'>
              <View className='sku-goods'>
                <Image src={curInfo.picUrl} mode='aspectFill' className='sku-goods__img'></Image>
                <View className='sku-goods__name'>{curInfo.name}</View>
                <View className='sku-goods__desc'>{curInfo.brief}</View>
                {this.curProduct && (
                  <View className='sku-goods__price'>
                    ￥{this.curProduct.price}
                    {curInfo.linePrice > 0 && (
                      <View className='sku-goods__price-line'>{curInfo.linePrice}</View>
                    )}
                  </View>
                )}
              </View>
              {this.curProduct && (
                <View className='footer'>
                  <Image
                    src={this.curProduct.hasCart ? CartActiveIcon : CartIcon}
                    className='footer-icon'
                  ></Image>
                  {this.curProduct.goodsNum > 0 && (
                    <Text className='footer-cricle'>{this.curProduct.goodsNum}</Text>
                  )}
                  <View className='footer-info'>
                    {this.curProduct.total > 0 && (
                      <View className='footer-info__price'>￥{this.curProduct.total}</View>
                    )}
                  </View>
                  {this.curProduct.goodsNum > 0 ? (
                    <NumControl
                      num={this.curProduct.goodsNum}
                      onAddHandle={this.handleUpdateCartInModal('add')}
                      onMinusHandle={this.handleUpdateCartInModal('minus')}
                    />
                  ) : (
                    <View className='footer-btn active-btn' onClick={this.handleAddCart}>
                      加入购物车
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </AtCurtain>
        <AtFloatLayout isOpened={cartShow} onClose={this.closeCartShow}>
          <View className='float-title'>
            已选商品
            {cartList.length > 0 && packagePrice > 0 && <Text>(打包费：￥{packagePrice})</Text>}
          </View>
          <View className='float-content'>{CartList}</View>
          <Footer
            isfloatLayout
            total={this.total}
            basePrice={basePrice}
            totalPrice={totalPrice}
            linePrice={linePrice}
            freightPrice={freightPrice}
            lineFreight={lineFreight}
            onJump={this.onJumpToCheckout}
          />
        </AtFloatLayout>
      </View>
    )
  }
}

export default itemDetail
