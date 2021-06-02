import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button, Textarea } from '@tarojs/components'

import api from '@/api'

import UploadIcon from '@/assets/imgs/upload-icon.png'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class OrderCancel extends Component {
  state = {
    imgList: [],
    goodsList: [
      {
        price: 2.4,
        pic: UploadIcon,
        number: 2,
        title: '豆奶+鸡蛋饼',
        isSelected: false
      }
    ]
  }

  onConfirm = () => {
    // Taro.navigateTo({ url: 'goods/list' })
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

  upLoadImg = async () => {
    let { imgList } = this.state

    const res = await Taro.chooseImage({ count: 3, sourceType: 'album' })
    // console.log(res)
    const img = res.tempFilePaths

    imgList = imgList.concat()

    imgList.push(...img)

    imgList = imgList.slice(0, 3)
    // console.log(imgList)
    this.setState({ imgList })

    const imgRequest = imgList.map((item) => {
      return api.common.UPLOAD_IMG(item)
    })

    console.log(imgRequest)

    const result = await Promise.all(imgRequest)

    console.log(result)
  }

  delImg = (index) => () => {
    let { imgList } = this.state

    imgList = imgList.concat()

    imgList.splice(index, 1)

    this.setState({ imgList })
  }

  get allSelected() {
    let { goodsList } = this.state

    const res = goodsList.some((item) => !item.isSelected)
    // console.log(res)
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

  render() {
    const { imgList, goodsList } = this.state

    return (
      <View className='index'>
        <View className='goods'>
          {goodsList &&
            goodsList.map((item, index) => {
              return (
                <View key={item.title} className='goods-option' onClick={this.selectGoods(index)}>
                  <View className={`goods-circle ${item.isSelected ? 'cative-circle' : ''}`}></View>
                  <View className='goods-option__content'>
                    <View className='goods-option__content-info'>
                      {item.title}
                      <Text>（微辣）</Text>
                    </View>
                    <View className='goods-option__content-info__num'>x{item.number}</View>
                  </View>
                  <View className='goods-option__num'>
                    <View className='goods-option__num-line'>￥{item.price}</View>
                    <View className='goods-option__num-price'>￥{item.price}</View>
                  </View>
                </View>
              )
            })}

          <View className='goods-total'>
            <View
              className={`goods-circle ${this.allSelected ? 'cative-circle' : ''}`}
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
              placeholder='补充详细退款原因，有助于商家更好的处理售后问题'
              placeholderClass='con-placeholder'
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
            {imgList.length < 3 && (
              <View className='content-upload' onClick={this.upLoadImg}>
                <Image src={UploadIcon} mode='aspectFill' className='content-upload-icon'></Image>
                <Text>上传凭证</Text>
                <Text>（最多3张）</Text>
              </View>
            )}
          </View>
        </View>
        <View className='footer'>
          <Button className='footer-btn'>提交 </Button>
        </View>
      </View>
    )
  }
}

export default OrderCancel
