import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import api from '@/api'
import 'taro-ui/dist/style/components/float-layout.scss'

import './index.scss'

class Setting extends Component {
  state = {
    isNotice: false,
    isOpen: false,
    showPopup: false,
    option: [
      {
        name: '所有人',
        value: 1,
        type: 'all'
      },
      {
        name: '互关朋友',
        desc: '互相关注的朋友',
        value: 1,
        type: 'all'
      },
      {
        name: '关闭',
        desc: '不允许任何人私信我',
        value: 1,
        type: 'all'
      }
    ]
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.getNodisturb()
    this.getSecrecy()
  }

  onChangeSwitch = (key) => () => {
    this.setState({ [key]: !this.state[key] }, () => {
      if (key == 'isNotice') {
        this.fetchNodisturb()
      }

      if (key == 'isOpen') {
        this.fetchSecrecy()
      }
    })
  }

  onJumpToBlackList = () => {
    Taro.navigateTo({ url: `/pages/wnh/blacklist/index` })
  }

  handlSelect = (info) => () => {
    console.log(info)
  }

  openPopup = () => {
    this.setState({ showPopup: true })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  getNodisturb = async () => {
    try {
      const res = await api.mine.GET_NODISTURB()
      // console.log(res)
      if (res == 'close') {
        this.setState({ isNotice: false })
      }

      if (res == 'enable') {
        this.setState({ isNotice: true })
      }
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  fetchNodisturb = async () => {
    const { isNotice } = this.state

    let query = {}

    if (isNotice) {
      query.type = 10
    }

    if (!isNotice) {
      query.type = 0
    }

    try {
      const res = await api.mine.SET_NODISTURB(query)

      // console.log(res)

      // if (res == 'close') {
      //   this.setState({ isNotice: false })
      // }

      // if (res == 'enable') {
      //   this.setState({ isNotice: true })
      // }
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  getSecrecy = async () => {
    try {
      const { data } = await api.mine.GET_SECRECY()
      console.log(data)
      if (!data) {
        this.setState({ isOpen: false })
      }

      if (data == 5) {
        this.setState({ isOpen: true })
      }
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  fetchSecrecy = async () => {
    // const { isNotice } = this.state

    // let query = {}

    // if (isNotice) {
    //   query.type = 10
    // }

    // if (!isNotice) {
    //   query.type = 0
    // }

    try {
      const res = await api.mine.SET_SECRECY()

      console.log(res)

      // if (res == 'close') {
      //   this.setState({ isNotice: false })
      // }

      // if (res == 'enable') {
      //   this.setState({ isNotice: true })
      // }
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  render() {
    const { isNotice, isOpen, showPopup, option } = this.state

    return (
      <View className='setting'>
        <View className='setting-opt'>
          <View className='setting-opt__name'>是否开启免打扰</View>
          <View className='setting-switch'>
            <View
              className={`setting-switch__opt ${isNotice ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch('isNotice')}
            >
              <View className='setting-switch__opt-cir'></View>
            </View>
          </View>
          {/* <View className='at-icon at-icon-chevron-right'></View> */}
        </View>
        <View className='setting-opt'>
          <View className='setting-opt__name'>是否开放个人主页</View>
          <View className='setting-switch'>
            <View
              className={`setting-switch__opt ${isOpen ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch('isOpen')}
            >
              <View className='setting-switch__opt-cir'></View>
            </View>
          </View>
        </View>
        <View className='setting-opt' onClick={this.onJumpToBlackList}>
          <View className='setting-opt__name'>拉黑列表</View>
          <View className='at-icon at-icon-chevron-right'></View>
        </View>
        {/* <View className='setting-opt'>
          <View className='setting-opt__name'>
            收到消息震动
            <View className='setting-opt__desc'>开启后再使用小程序时，收到新消息会震动</View>
          </View>
          <View className='setting-switch'>
            <View
              className={`setting-switch__opt ${isNotice ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch}
            >
              <View className='setting-switch__opt-cir'></View>
            </View>
          </View>
        </View> */}
        <AtFloatLayout isOpened={showPopup} onClose={this.handleClose}>
          <View className='float-content'>
            {option &&
              option.map((item, index) => {
                return (
                  <View key={item.name} className='float-item' onClick={this.handlSelect(index)}>
                    <View>
                      <View className='float-item__name'>{item.name}</View>
                      <View className='float-item__desc'>{item.desc}</View>
                    </View>
                    <View className='at-icon at-icon-check'></View>
                  </View>
                )
              })}
            <View className='float-item cancel' onClick={this.handleClose}>
              取消
            </View>
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default Setting
