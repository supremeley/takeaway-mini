import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button, Textarea } from '@tarojs/components'

import api from '@/api'
import D from '@/common'
import debounce from 'lodash/debounce'

import UploadIcon from '@/assets/imgs/upload-icon.png'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class OrderCancel extends Component {
  state = {
    imgList: [],
    refundReason: '',
    goodsList: []
  }

  componentDidShow() {
    this.getOrderDetail()
  }

  onConfirm = () => {
    // Taro.navigateTo({ url: 'goods/list' })
  }

  changeInp = (e) => {
    console.log(e)
    this.setState({ refundReason: e.detail.value })
  }

  selectGoods = (index) => () => {
    let { goodsList } = this.state

    let goods = goodsList[index]

    goods = {
      ...goods,
      isSelected: !goods.isSelected
    }

    goodsList[index] = goods

    this.setState({ goodsList })
  }

  selectAllGoods = () => {
    let { goodsList } = this.state

    goodsList = goodsList.concat()

    goodsList = goodsList.map((item) => {
      // if (item.isSelected === this.allSelected) {
      //   return item
      // } else {
      return {
        ...item,
        isSelected: !this.allSelected
      }
      // }
    })

    this.setState({ goodsList })
  }

  // upLoadImg = async () => {
  //   let { imgList } = this.state

  //   const res = await Taro.chooseImage({ count: 1, sourceType: 'album' })
  //   // console.log(res)
  //   const img = res.tempFilePaths

  //   imgList = imgList.concat()

  //   imgList.push(...img)

  //   imgList = imgList.slice(0, 3)
  //   // console.log(imgList)
  //   this.setState({ imgList })

  //   const imgRequest = imgList.map((item) => {
  //     return api.common.UPLOAD_IMG(item)
  //   })

  //   console.log(imgRequest)

  //   const result = await Promise.all(imgRequest)

  //   console.log(result)
  // }

  upLoadImg = async () => {
    const res = await Taro.chooseImage({ count: 1 })

    // console.log(res)

    try {
      const { url } = await api.common.UPLOAD_IMG(res.tempFilePaths[0])

      // console.log(a)

      D.toast('上传成功')

      this.setState({ imgList: [url] })
    } catch (e) {
      console.log(e)
      D.toast('上传失败')
    }
  }

  delImg = (index) => () => {
    let { imgList } = this.state

    imgList = imgList.concat()

    imgList.splice(index, 1)

    this.setState({ imgList })
  }

  getOrderDetail = async () => {
    const query = { orderId: this.id }

    const {
      data: { orderGoods }
    } = await api.order.GET_REFUND_ORDER_DETAIL(query)

    const goodsList = orderGoods.map((goods) => {
      return {
        ...goods,
        isSelected: false
      }
    })

    this.setState({ goodsList })
  }

  fetchSumibitRefund = async () => {
    const { goodsList, refundReason, refundImg } = this.state

    let productIds = goodsList.map((item) => item.productId)

    const query = {
      productIds,
      refundReason,
      refundImg,
      orderId: this.id
    }

    const { data, errno, errmsg } = await api.order.ORDER_REFUND_APPLY(query)

    if (!errno) {
      D.toast('申请成功')

      setTimeout(() => {
        Taro.redirectTo({ url: `/pages/order/list/index` })
      }, 1000)
    }
  }

  get allSelected() {
    let { goodsList } = this.state

    const res = goodsList.some((item) => !item.isSelected)
    console.log(goodsList, res)
    return !res
  }

  get total() {
    let { goodsList } = this.state

    const res = goodsList
      .filter((item) => item.isSelected)
      .reduce((val, item) => {
        val += item.price

        return val
      }, 0)

    return res
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { imgList, refundReason, goodsList } = this.state

    const GoodsList = goodsList.map((goods, index) => {
      return (
        <View key={goods.goodsName} className='goods-option' onClick={this.selectGoods(index)}>
          <View className={`goods-circle ${goods.isSelected ? 'active-circle' : ''}`}></View>
          <View className='goods-option__content'>
            <View className='goods-option__content-info'>
              {goods.goodsName}
              {goods.specifications &&
                goods.specifications.map((val) => {
                  return <>{val != '默认' && <Text key={val}>({val})</Text>}</>
                })}
            </View>
            <View className='goods-option__content-info__num'>x{goods.number}</View>
          </View>
          <View className='goods-option__num'>
            {/* <View className='goods-option__num-line'>￥{goods.price}</View> */}
            <View className='goods-option__num-price'>￥{goods.price}</View>
          </View>
        </View>
      )
    })

    return (
      <View className='index'>
        <View className='goods'>
          {GoodsList}
          <View className='goods-total'>
            <View
              className={`goods-circle ${this.allSelected ? 'active-circle' : ''}`}
              onClick={this.selectAllGoods}
            ></View>
            <View className='goods-total__price'>
              退款金额：<Text>￥{this.total}</Text>
            </View>
          </View>
        </View>
        <View className='content'>
          <View className='content-title'>退款原因</View>
          <View className='content-inp'>
            <Textarea
              value={refundReason}
              placeholder='补充详细退款原因，有助于商家更好的处理售后问题'
              placeholderClass='con-placeholder'
              onInput={this.changeInp}
            />
          </View>
          <View className='content-img-box'>
            {imgList.length > 0 &&
              imgList.map((item, index) => {
                return (
                  <View key={item} className='upload-box'>
                    <Image src={item} mode='aspectFill' className='upload-box-img'></Image>
                    <View className='at-icon at-icon-subtract' onClick={this.delImg(index)}></View>
                  </View>
                )
              })}
            {!imgList.length && (
              <View className='content-upload' onClick={this.upLoadImg}>
                <Image src={UploadIcon} mode='aspectFill' className='content-upload-icon'></Image>
                <Text>上传凭证</Text>
                {/* <Text>（最多3张）</Text> */}
              </View>
            )}
          </View>
        </View>
        <View className='footer'>
          <Button className='footer-btn' onClick={this.fetchSumibitRefund}>
            提交
          </Button>
        </View>
      </View>
    )
  }
}

export default OrderCancel
