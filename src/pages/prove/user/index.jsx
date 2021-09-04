import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import { connect } from 'react-redux'

import Upload1 from '@/assets/imgs/prove/upload1.png'
import Upload2 from '@/assets/imgs/prove/upload2.png'
import Title2 from '@/assets/imgs/prove/title-2.png'

import 'taro-ui/dist/style/components/icon.scss'

import ProveHeader from '../components/header'

import './index.scss'

@connect(({ counter }) => ({
  proveInfo: counter.proveInfo
}))
class ProveUser extends Component {
  state = {
    certificates: '',
    explainList: [
      {
        title: '说明',
        info: [
          '请在本页面提交一张手持 山西传媒大学 的录取通知书/学生证/校园卡/学位证/毕业证的正面照片。',
          '万能盒是定位于高校学生群体的半私密社区，社区内部需要统一的身份认同。'
        ]
      }
    ]
  }

  handleSumbit = () => {
    if (this.fetchVali()) {
      this.fetchSubmit()
    }
  }

  upLoadImg = async () => {
    const res = await Taro.chooseImage({ count: 1 })

    // console.log(res)

    try {
      const { url } = await api.common.UPLOAD_IMG(res.tempFilePaths[0])

      // console.log(a)

      D.toast('上传成功')

      this.setState({ certificates: url })
    } catch (e) {
      console.log(e)
      D.toast('上传失败')
    }
  }

  fetchVali = () => {
    let { certificates } = this.state

    if (!certificates) {
      D.toast('请上传录取通知书/学生证/毕业证照片')
      return false
    }

    return true
  }

  fetchSubmit = async () => {
    let {
      proveInfo: { auSchool, ruxueTime, identity }
    } = this.props

    let { certificates } = this.state

    const userId = Taro.getStorageSync('userId')

    const query = {
      auSchool,
      ruxueTime: Number(ruxueTime),
      identity: 1,
      certificates,
      userId
    }

    const { errmsg, errno } = await api.prove.SUMBIT_PROVER(query)

    if (!errno) {
      D.toast('认证成功')

      Taro.setStorageSync('isProve', true)

      setTimeout(() => {
        Taro.switchTab({ url: '/pages/forum/index' })
      },500)
    } else {
      D.toast(errmsg)
    }
  }

  render() {
    const { certificates, explainList } = this.state

    const ExplainList = explainList.map((item) => {
      return (
        <View key={item.title} className='content-reasons__plate'>
          <View className='content-reasons__plate-title'>
            <Image src={Title2} className='content-reasons__plate-title__icon' />
            {item.title}
          </View>
          <View className='content-reasons__plate-info'>
            {item.info &&
              item.info.map((info) => {
                return (
                  <View key={info} className='content-reasons__plate-info__text'>
                    {info}
                  </View>
                )
              })}
          </View>
        </View>
      )
    })

    return (
      <View className='prove'>
        <ProveHeader />
        <View className='content'>
          <View className='content-title'>请拍摄手持录取通知书/学生证/学位证/毕业证照片</View>
          <View className='content-explain'>资料仅用于校园实名身份认证，我们将严格保密</View>
          <View className='content-upload'>
            <View className='content-upload__item'>
              <View className='content-upload__item-con'>
                <Image src={Upload1} className='content-upload__item-icon' />
              </View>
              <View className='content-upload__item-text'>示例</View>
            </View>
            <View className='content-upload__item second' onClick={this.upLoadImg}>
              <View className='content-upload__item-con'>
                {certificates ? (
                  <Image
                    src={certificates}
                    mode='aspectFill'
                    className='content-upload__item-img'
                  />
                ) : (
                  <Image src={Upload2} className='content-upload__item-icon' />
                )}
              </View>
              <View className='content-upload__item-text'>点击拍摄手持证件照片</View>
            </View>
          </View>
          <View className='content-reasons'>{ExplainList}</View>
        </View>
        <Button className='page-btn' onClick={this.handleSumbit}>
          提交
        </Button>
      </View>
    )
  }
}

export default ProveUser
