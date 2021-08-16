import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Textarea, Button } from '@tarojs/components'
import { AtModal } from 'taro-ui'

import api from '@/api'
import D from '@/common'
import debounce from 'lodash/debounce'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

class Release extends Component {
  state = {
    canComment: true,
    context: '',
    tagList: [
      // {
      //  id: 1
      //  pointNum: 0
      //  tagName: "吐槽"
      //  type: 0
      // },
    ],
    curTag: null,
    imgList: [],
    showScreenPopup: false
  }

  componentDidShow() {
    this.fetchData()
  }

  handleSubmit = debounce(() => this.onSubmit(), 300)

  fetchData = () => {
    this.getTaglist()
  }

  onJumpToAgreement = (type) => () => {
    Taro.navigateTo({ url: `/pages/wnh/agreement/index?type=${type}` })
  }

  openScreenPopup = () => {
    this.setState({ showScreenPopup: true })
  }

  closeScreenPopup = () => {
    this.setState({ showScreenPopup: false })
  }

  onSelectScreen = (index) => () => {
    this.setState({ curTag: index })
    this.closeScreenPopup()
  }

  onChangeSwitch = () => {
    this.setState({ canComment: !this.state.canComment })
  }

  onChangeInp = (e) => {
    // console.log(e.detail.value)
    this.setState({ context: e.detail.value })
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
    const userId = Taro.getStorageSync('userId')

    const { canComment, tagList, curTag, context, imgList } = this.state

    const resList = imgList.map((item) => {
      return api.common.UPLOAD_IMG(item.path)
    })

    const imgRes = await Promise.all(resList)

    // return

    let con = {
      context,
      imgList: imgRes.map((item) => {
        return item.url
      })
    }

    // console.log(JSON.stringify(con))

    const query = {
      sender: userId,
      canComment: canComment ? 1 : -1,
      tagId: tagList[curTag].id,
      context: JSON.stringify(con)
      // rewardMoney:
    }

    let resApi

    switch (this.type) {
      case 'school':
        resApi = api.forum.SEND_HOT_POSTS
        break
      case 'hot':
        resApi = api.forum.SEND_HOT_POSTS
        break
      case 'tree':
        resApi = api.forum.SEND_TREE_POSTS
        break
      default:
        resApi = api.forum.SEND_HOT_POSTS
        break
    }

    try {
      // const { errno, errmsg } = await api.forum.SEND_HOT_POSTS(query)
      const { errno, errmsg } = await resApi(query)

      if (!errno) {
        D.toast(errmsg)

        setTimeout(Taro.navigateBack(), 1000)
      }
    } catch (e) {
      D.toast(e)
    }
  }

  getTaglist = async () => {
    const query = {
      diffent: 2
    }

    const { data } = await api.forum.GET_TAG_LIST(query)

    const tagList = data.map((item) => {
      return {
        ...item
      }
    })

    this.setState({ tagList })
  }

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const { showScreenPopup, context, canComment, imgList, tagList, curTag } = this.state

    const ScreenPopupList =
      tagList &&
      tagList.map((item, index) => {
        return (
          <View
            key={item.id}
            className={`popup__list-item ${index === curTag ? 'active-item' : ''}`}
            onClick={this.onSelectScreen(index)}
          >
            {item.tagName}
          </View>
        )
      })

    return (
      <View className='release'>
        <View className='content'>
          <View className='content-header'>
            <View className='content-header__title'>选择主题</View>
            <View className='content-header__inp'>
              {tagList[curTag] ? tagList[curTag].tagName : '主题格式说明'}
            </View>
            <View className='at-icon at-icon-chevron-right' onClick={this.openScreenPopup}></View>
          </View>
          <Textarea
            value={context}
            placeholder='记录这一刻'
            className='content-text'
            onInput={this.onChangeInp}
          />
          <View className='content-album'>
            {imgList.length > 0 &&
              imgList.map((item, index) => {
                return (
                  <View key={item.path} className='content-album__item'>
                    <Image src={item.path} mode='aspectFill' className='content-album__item-img' />
                    <View className='at-icon at-icon-subtract' onClick={this.delImg(index)}></View>
                  </View>
                )
              })}
            {imgList.length < 9 && (
              <View className='content-album__item' onClick={this.upLoadImg}>
                +
              </View>
            )}
          </View>
          <View className='content-switch'>
            是否可评论
            <View
              className={`content-switch__opt ${canComment ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch}
            >
              <View className='content-switch__opt-cir'></View>
            </View>
          </View>
          <View className='content-explain'>
            *请务必遵守
            <Text className='agreement' onClick={this.onJumpToAgreement(1)}>
              《论坛规范》
            </Text>
            ，如有违规会被删帖、禁言及封号
          </View>
        </View>
        <Button class='release-btn' onClick={this.handleSubmit}>
          发布
        </Button>
        <AtModal isOpened={showScreenPopup}>
          <View className='popup'>
            <View className='popup__title'>
              选择主题
              <View className='at-icon at-icon-close' onClick={this.closeScreenPopup}></View>
            </View>
            <View className='popup__list'>{ScreenPopupList}</View>
          </View>
        </AtModal>
      </View>
    )
  }
}

export default Release
