import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Input, Textarea, Button, Picker } from '@tarojs/components'
// import { AtModal } from 'taro-ui'

import api from '@/api'
import D from '@/common'
import debounce from 'lodash/debounce'

import 'taro-ui/dist/style/components/icon.scss'
// import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'
import classNames from 'classnames'

class Release extends Component {
  state = {
    // tagName: '',
    context: '',
    privContext: '',
    price: 150,
    endTime: '',
    endDate: '',
    // theSize: 5,
    nums: 1,
    sex: 1,
    pickupAddress: '',
    deliveryAddress: '',
    name: '',
    phone: '',
    urgent: false,
    context: '',
    temp: 2,
    tagList: [
      {
        tagName: '取快递'
      },
      {
        tagName: '拿外卖'
      },
      {
        tagName: '帮卖百货'
      },
      {
        tagName: '帮拿/帮送'
      },
      {
        tagName: '帮排队'
      },
      {
        tagName: '帮我办'
      },
      {
        tagName: '自定义',
        type: 'custom'
      }
    ],
    curTag: 0,
    step: 50,
    sizeList: [
      {
        name: '小件',
        desc: '*单件≤2kg',
        value: 5
      },
      {
        name: '大件',
        desc: '*单件>2kg',
        value: 10
      }
    ],
    curSize: 0,
    imgList: []
  }

  componentDidShow() {
    // this.fetchData()
  }

  handleSubmit = debounce(() => this.onSubmit(), 300)

  fetchData = () => {
    // this.getTaglist()
  }

  onJumpToAgreement = (type) => () => {
    Taro.navigateTo({ url: `/pages/wnh/agreement/index?type=${type}` })
  }

  onSelectTag = (index) => () => {
    // const { tagList } = this.state
    this.setState({ curTag: index })
  }

  onSelectSize = (index) => () => {
    // const { tagList } = this.state
    this.setState({ curSize: index })
  }

  onChangeSwitch = () => {
    this.setState({ urgent: !this.state.urgent })
  }

  onChangeInp = (e, key) => {
    // console.log(e.detail.value)
    this.setState({ [key]: e.detail.value })
  }

  changeSex = (e) => () => {
    this.setState({ sex: e })
  }

  changeTime = (e) => {
    console.log(e)
    this.setState({ endTime: e.detail.value })
  }

  changeDate = (e) => {
    // console.log({ endTime: e.detail.value })
    this.setState({ endDate: e.detail.value })
  }

  handleAdd = () => {
    const { price, step } = this.state

    this.setState({ price: price + step })
  }

  handleMinus = () => {
    const { price, step } = this.state

    if (price <= 150) {
      return
    }

    this.setState({ price: price - step })
  }

  upLoadImg = async () => {
    const { imgList } = this.state

    const res = await Taro.chooseImage({ count: 9 - imgList.length })

    // console.log(res)

    let il = imgList.concat()

    il.push(...res.tempFiles)

    this.setState({ imgList: il })

    //   imgList.push(...img)

    // try {
    //   const { url } = await api.common.UPLOAD_IMG(res.tempFilePaths[0])

    //   // console.log(a)

    //   D.toast('上传成功')

    //   this.setState({ imgList: [url] })
    // } catch (e) {
    //   console.log(e)
    //   D.toast('上传失败')
    // }
  }

  delImg = (index) => () => {
    let { imgList } = this.state

    imgList = imgList.concat()

    imgList.splice(index, 1)

    this.setState({ imgList })
  }

  onSubmit = async () => {
    const {
      name,
      phone,
      nums,
      privContext,
      context,
      sex,
      pickupAddress,
      deliveryAddress,
      imgList,
      tagList,
      curTag,
      urgent,
      price,
      sizeList,
      curSize,
      temp,
      endTime,
      endDate
    } = this.state

    Taro.showLoading({
      title: '上传中',
      icon: 'none'
    })

    const resList = imgList.map((item) => {
      return api.common.UPLOAD_IMG(item.path)
    })

    const imgRes = await Promise.all(resList)

    // return

    let con = {
      context: privContext,
      imgList: imgRes.map((item) => {
        return item.url
      })
    }

    // console.log(JSON.stringify(con))
    let etime = `${endDate.replace(/-/g, '/')} ${endTime}:00`

    let query = {
      tagName: tagList[curTag].tagName,
      context,
      privContext: JSON.stringify(con),
      price,
      endTime: etime,
      theSize: sizeList[curSize].value,
      nums,
      sex,
      pickupAddress,
      deliveryAddress,
      name,
      phone,
      temp
    }

    if (urgent) {
      query.urgent = 10
    }

    console.log(query)

    // return

    try {
      // const { errno, errmsg } = await api.forum.SEND_HOT_POSTS(query)
      const { errno, errmsg } = await api.pt.CREATE_ERRANDS(query)

      if (!errno) {
        D.toast(errmsg)
        Taro.hideLoading()

        // Taro.setStorageSync('needRefresh', true)

        setTimeout(Taro.navigateBack(), 1000)
      }
    } catch (e) {
      D.toast(e)
    }
  }

  // getTaglist = async () => {
  //   const query = {}

  //   switch (this.type) {
  //     case 'tree':
  //       query.diffent = 2
  //       break
  //     case 'school':
  //       query.diffent = 1
  //       break
  //     case 'hot':
  //       query.diffent = 3
  //       break
  //   }

  //   const { data } = await api.forum.GET_TAG_LIST(query)

  //   const tagList = data.map((item) => {
  //     return {
  //       ...item
  //     }
  //   })

  //   this.setState({ tagList })
  // }

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      name,
      phone,
      nums,
      privContext,
      context,
      sex,
      pickupAddress,
      deliveryAddress,
      imgList,
      tagList,
      curTag,
      urgent,
      price,
      sizeList,
      curSize,
      temp,
      endTime,
      endDate
    } = this.state

    return (
      <View className='pt-release'>
        <View className='content'>
          {/* <View className='content-header' onClick={this.openScreenPopup}>
            <View className='content-header__title'>选择话题</View>
            <View className='content-header__inp'>
              {tagList[curTag] ? tagList[curTag].tagName : '话题格式说明'}
            </View>
            <View className='at-icon at-icon-chevron-right'></View>
          </View> */}
          <View className='opt-item'>
            <View className='opt-item__title'>姓名</View>
            <Input
              value={name}
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'name')}
            />
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>电话</View>
            <Input
              value={phone}
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'phone')}
            />
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>跑腿件数</View>
            <Input
              value={nums}
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'nums')}
            />
          </View>
          <View className='selector'>
            <View className='selector-title'>
              <Text className='selector-title__name'>选择任务标签</Text>
              <Text className='selector-title__desc'>（选择标签，更容易被人接单哦）</Text>
            </View>
            <View className='selector-content'>
              {tagList &&
                tagList.map((item, index) => {
                  return (
                    <View
                      key={item.tagName}
                      className={`selector-item ${curTag === index && 'active-item'}`}
                      onClick={this.onSelectTag(index)}
                    >
                      {item.tagName}
                    </View>
                  )
                })}
            </View>
          </View>
        </View>
        <View className='plate'>
          <View className='opt-item'>
            <View className='opt-item__title'>取件地点</View>
            <Input
              value={pickupAddress}
              placeholder='请输入取件地点'
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'pickupAddress')}
            />
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>送件地点</View>
            <Input
              value={deliveryAddress}
              placeholder='请输入送达地点'
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'deliveryAddress')}
            />
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>送达日期</View>
            <Picker mode='date' className='opt-item__inp' onChange={this.changeDate}>
              <View>{endDate || '请选择送达日期'}</View>
            </Picker>
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>送达时间</View>
            <Picker mode='time' className='opt-item__inp' onChange={this.changeTime}>
              <View>{endTime || '请选择送达时间'}</View>
            </Picker>
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>性别要求</View>
            <View className='opt-item__rid'>
              <View className='opt-item__rid-item' onClick={this.changeSex(1)}>
                <View className={`item__cir ${sex == 1 && 'active-item'}`}></View>
                <View>男</View>
              </View>
              <View className='opt-item__rid-item' onClick={this.changeSex(2)}>
                <View className={`item__cir ${sex == 2 && 'active-item'}`}></View>
                <View>女</View>
              </View>
            </View>
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>接单时效</View>
            <Input
              value={temp}
              type='number'
              placeholder='2小时未接单则作废'
              className='opt-item__inp'
              onInput={(e) => this.onChangeInp(e, 'temp')}
            />
          </View>
          <View className='opt-item'>
            <View className='opt-item__title'>取件信息</View>
            <Textarea
              value={privContext}
              placeholder='该信息仅接单人可见，请自行输入快递信息，以便快递准确取达。'
              placeholderClass='opt-item__area-placeholder'
              className='opt-item__area'
              onInput={(e) => this.onChangeInp(e, 'privContext')}
            />
            <View className='content-album'>
              {imgList.length > 0 &&
                imgList.map((item, index) => {
                  return (
                    <View key={item.path} className='content-album__item'>
                      <Image
                        src={item.path}
                        mode='aspectFill'
                        className='content-album__item-img'
                      />
                      <View
                        className='at-icon at-icon-subtract'
                        onClick={this.delImg(index)}
                      ></View>
                    </View>
                  )
                })}
              {imgList.length < 9 && (
                <View className='content-album__item' onClick={this.upLoadImg}>
                  +
                </View>
              )}
            </View>
          </View>
          <View className='opt-item sep-opt'>
            <View className='opt-item__title'>备注</View>
            <View className='opt-item__opt'>
              {sizeList &&
                sizeList.map((item, index) => {
                  return (
                    <View
                      key={item.name}
                      className={classNames('opt-item__opt-item', {
                        'active-size': curSize === index
                      })}
                      onClick={this.onSelectSize(index)}
                    >
                      <View className='opt-item__opt-item__title'>{item.name}</View>
                      <View className='opt-item__opt-item__desc'>{item.desc}</View>
                    </View>
                  )
                })}
            </View>
          </View>
          <View className='opt-item only-area'>
            <Textarea
              value={context}
              placeholder='该信息所有人可见，避免填写与订单相关的私密信息，非必填'
              placeholderClass='opt-item__area-placeholder'
              className='opt-item__area'
              onInput={(e) => this.onChangeInp(e, 'context')}
            />
          </View>
        </View>
        <View className='pl'>
          <View className='pl-item'>
            <View className='pl-item__title-name'>任务费</View>
            <View className='pl-item__info'>
              <View className='num-contrl'>
                <View className='at-icon at-icon-subtract' onClick={this.handleMinus}></View>
                <Input value={price} className='num-contrl__inp' onInput={this.changeInp} />
                <View className='at-icon at-icon-add' onClick={this.handleAdd}></View>
              </View>
              <View>盒盒币</View>
            </View>
          </View>
          <View className='pl-item'>
            <View className='pl-item__title-desc'>*任务费越高，接单率越高哦～</View>
            <View className='pl-item__title-desc-green'>马上充值</View>
          </View>
        </View>
        <View className='pl'>
          <View className='pl-item'>
            <View className='pl-item__title'>
              <View className='pl-item__title-name'>加急</View>
              <View className='pl-item__title-desc'>
                *开启加急将在原任务费的基础上增加500枚盒盒币
              </View>
            </View>
            <View
              className={`switch-opt ${urgent ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch}
            >
              <View className='switch-opt__cir'></View>
            </View>
          </View>
        </View>
        <Button class='release-btn' onClick={this.handleSubmit}>
          确认发布
        </Button>
      </View>
    )
  }
}

export default Release
