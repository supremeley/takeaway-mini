import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Button, Textarea } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import './index.scss'

class Editor extends Component {
  state = {
    content: ''
  }

  onChangeInp = (e) => {
    this.setState({ content: e.detail.value })
  }

  fetchFollow = async () => {
    const { content } = this.state

    if (!content) {
      D.toast('请输入签名')
      return
    }

    const query = {
      sign: JSON.stringify(content.split('\n'))
    }

    try {
      const { data, errno } = await api.mine.UPDATE_PERSON_SIGN(query)

      if (!errno) {
        D.toast(data)

        setTimeout(() => {
          Taro.navigateBack()
        }, 500)
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { content } = this.state

    return (
      <View className='editor'>
        <View className='editor-title'>个人简介</View>
        <Textarea
          value={content}
          className='editor-text'
          placeholderClass='editor-text-pla'
          placeholder='你可以填写兴趣爱好、心情愿望，有趣的介绍能让你被关注的概率变高噢！'
          onInput={this.onChangeInp}
        />
        <Button className='page-btn' onClick={this.fetchFollow}>
          确定
        </Button>
      </View>
    )
  }
}

export default Editor
