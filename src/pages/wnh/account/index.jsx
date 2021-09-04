import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Input } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import './index.scss'

class Account extends Component {
  state = {
    accountList: null,
    avatar: '',
    nickname: ''
  }

  componentDidShow() {
    this.getAccountList()
  }

  changeInp = (e) => {
    this.setState({ nickname: e.detail.value })
  }

  upLoadImg = async () => {
    const res = await Taro.chooseImage({ count: 1 })

    // console.log(res)

    this.setState({ avatar: res.tempFilePaths[0] })
  }

  selectAccount = (id, index) => async () => {
    const { accountList } = this.state
    let query = { id }

    if (!id) {
      delete query.id
    }

    try {
      const { errno, data } = await api.manager.CHANGE_ACCOUNT(query)

      if (!errno) {
        D.toast(data)

        // let cl = accountList.concat()
        // cl = cl.map((item, idx) => {
        //   return {
        //     ...item,
        //     status: idx == index ? !item.status : false
        //   }
        // })
        this.getAccountList()
      } else {
        D.toast(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  getAccountList = async () => {
    const { data } = await api.manager.GET_ACCOUNT_LIST()

    const userInfo = Taro.getStorageSync('userInfo')

    const r = data.find((item) => item.status)

    let accountList = []
    if (r) {
      accountList = [{ avatar: userInfo.avatarUrl, nickname: userInfo.nickName }, ...data]
    } else {
      accountList = [
        { status: 1, avatar: userInfo.avatarUrl, nickname: userInfo.nickName },
        ...data
      ]
    }

    this.setState({ accountList })
  }

  fetchAdd = async () => {
    const { avatar, nickname } = this.state

    if (!avatar) {
      D.toast('请上传头像')
      return
    }

    if (!nickname) {
      D.toast('请输入姓名')
      return
    }

    Taro.showLoading({
      title: '上传中',
      icon: 'none'
    })

    const { url } = await api.common.UPLOAD_IMG(avatar)

    const query = { avatar: url, nickname, gender: 0 }

    try {
      const { errno, data } = await api.manager.ADD_ACCOUNT(query)

      if (!errno) {
        D.toast(data)
        Taro.hideLoading()
        this.getAccountList()
      } else {
        D.toast(data)
      }
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { accountList, avatar, nickname } = this.state

    // if (!info) {
    //   return null
    // }

    return (
      <View className='account'>
        {accountList &&
          accountList.map((item, index) => {
            return (
              <View
                key={item.avatar}
                className={`list-item ${item.status && 'active-item'}`}
                onClick={this.selectAccount(item.id, index)}
              >
                <Image src={item.avatar} className='list-item-avatar' />
                <View className='list-item-info'>
                  <View className='list-item-info__name'>{item.nickname}</View>
                </View>
              </View>
            )
          })}

        <View className='list-item'>
          <Image
            src={avatar}
            mode='aspectFill'
            className='list-item-avatar'
            onClick={this.upLoadImg}
          />
          <View className='list-item-info'>
            <Input
              value={nickname}
              placeholder='请输入账号名称'
              className='list-item-info__name'
              onInput={this.changeInp}
            />
          </View>
          <View className='list-item-btn' onClick={this.fetchAdd}>
            确认添加
          </View>
        </View>
      </View>
    )
  }
}

export default Account
