import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Textarea } from '@tarojs/components'

import api from '@/api'
import D from '@/common'
import './index.scss'

class About extends Component {
  state = {
    form: {
      name: '',
      gender: 1,
      mobile: '',
      schoolName: '',
      building: '',
      Introduction: ''
    }
  }

  async componentDidMount() {}

  changeInp = (e, key) => {
    const { form } = this.state

    const f = { ...form }

    f[key] = e.detail.value

    this.setState({ form: f })
  }

  onSubmit = async () => {
    const { form } = this.state
    // console.log(form)
    if (!form.name) {
      D.toast('请填写姓名')
      return
    }

    if (!form.mobile) {
      D.toast('请填写手机号')
      return
    }

    if (!form.schoolName) {
      D.toast('请填写学校')
      return
    }

    if (!form.building) {
      D.toast('请填写楼号')
      return
    }

    Taro.showLoading({
      title: '上传中',
      icon: 'none'
    })

    const query = {
      ...form
    }

    try {
      const { errno, errmsg, data } = await api.mine.APPLY_FLOOR(query)

      if (!errno) {
        D.toast(data)

        setTimeout(Taro.navigateBack(), 1000)
      } else {
        D.toast(errmsg)
      }
    } catch (e) {
      Taro.hideLoading()
      // D.toast(errmsg)
    }
  }

  render() {
    const { form } = this.state

    return (
      <View className='cooperation'>
        <View className='content'>
          <View className='content-opt'>
            <View className='content-opt__title'>名称:</View>
            <Input placeholder='官方' className='content-opt__inp' />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>联系方式:</View>
            <Input placeholder='手机号/微信号' className='content-opt__inp' />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>学校:</View>
            <Input placeholder='' className='content-opt__inp' />
          </View>
          {/* <View className='content-opt'>
            <View className='content-opt__title'>城市:</View>
            <Input placeholder='' className='content-opt__inp' />
          </View> */}
          <View className='content-opt'>
            <View className='content-opt__title'>合作意向:</View>
            <Textarea placeholder='' className='content-opt__area' />
          </View>
          <View className='content-btn'>点击提交</View>
        </View>
      </View>
    )
  }
}

export default About
