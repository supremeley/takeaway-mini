import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Header from '@/components/header'

import './index.scss'

class Guide extends Component {
  state = {
    safeTop: 0,
    img: [
      'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/wtiqscry1g7kx9dnsmro.jpg',
      'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/jsx26bqt3nvqvsddiii4.jpg',
      'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/sd013lxg2cv7eacei72u.jpg',
      'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/ndvkzf1r0p0ut5m1jg76.jpg'
    ]
  }

  // componentDidMount() {
  //   const info = Taro.getMenuButtonBoundingClientRect()

  //   this.setState({ safeTop: info.top })
  // }

  // goBack = () => {
  //   Taro.navigateBack()
  // }

  render() {
    const { img, safeTop } = this.state

    return (
      <View className='guide'>
        <Header />
        {img.map((item) => {
          return <Image key={item} src={item} mode='widthFix' className='guide-img' />
        })}
      </View>
    )
  }
}

export default Guide
