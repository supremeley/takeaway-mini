import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'

import 'taro-ui/dist/style/components/icon.scss'

import Title1 from '@/assets/imgs/prove/title-1.png'
import Title2 from '@/assets/imgs/prove/title-2.png'

import ProveHeader from '../components/header'

import './index.scss'

class ProveGuide extends Component {
  state = {
    explainList: [
      {
        title: '为什么需要校园实名认证？',
        info: ['万能盒是定位于高校学生群体的半私密社区，社区内部需要统一的身份认同。']
      },
      {
        title: '校园认证后有什么权益？',
        info: ['万能盒是定位于高校学生群体的半私密社区，社区内部需要统一的身份认同。']
      }
    ]
  }

  nextStep = () => {
    Taro.navigateTo({ url: `/pages/prove/user/index` })
  }

  render() {
    const { explainList } = this.state

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
          <View className='content-title'>校园认证</View>
          <View className='content-plate'>
            <View className='content-plate__left'>
              <View className='content-plate__left-title'>
                <Image src={Title1} className='content-plate__left-title__icon' />
                通过个人证件认证
              </View>
              <View className='content-plate__left-explain'>
                证件资料仅用于认证，我们将严格保密
              </View>
            </View>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
          <View className='content-reasons'>{ExplainList}</View>
        </View>
        <Button className='page-btn' onClick={this.nextStep}>
          完成认证
        </Button>
      </View>
    )
  }
}

export default ProveGuide
