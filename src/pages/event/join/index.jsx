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

  changeSex = (e) => () => {
    const { form } = this.state

    const f = { ...form }

    f.gender = e

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
            <View className='content-opt__title'>姓名:</View>
            <Input
              vlue={form.name}
              placeholder='你的名字'
              className='content-opt__inp'
              onInput={(e) => this.changeInp(e, 'name')}
            />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>性别:</View>
            <View className='content-opt__rid'>
              <View className='content-opt__rid-item' onClick={this.changeSex(1)}>
                <View className={`item__cir ${form.gender == 1 && 'active-item'}`}></View>
                <View>男</View>
              </View>
              <View className='content-opt__rid-item' onClick={this.changeSex(2)}>
                <View className={`item__cir ${form.gender == 2 && 'active-item'}`}></View>
                <View>女</View>
              </View>
            </View>
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>手机号:</View>
            <Input
              vlue={form.mobile}
              type='number'
              className='content-opt__inp'
              onInput={(e) => this.changeInp(e, 'mobile')}
            />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>学校:</View>
            <Input
              vlue={form.schoolName}
              className='content-opt__inp'
              onInput={(e) => this.changeInp(e, 'schoolName')}
            />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>楼号:</View>
            <Input
              vlue={form.building}
              className='content-opt__inp'
              onInput={(e) => this.changeInp(e, 'building')}
            />
          </View>
          <View className='content-opt'>
            <View className='content-opt__title'>个人简介:</View>
            <Textarea
              vlue={form.Introduction}
              placeholder='关于自己的一些介绍和联系方式'
              className='content-opt__area'
              onInput={(e) => this.changeInp(e, 'Introduction')}
            />
          </View>
          <View className='content-btn' onClick={this.onSubmit}>
            点击提交
          </View>
        </View>
      </View>
    )
  }
}

export default About
