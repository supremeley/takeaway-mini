import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Textarea, Input, Button } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'

import api from '@/api'
import D from '@/common'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/curtain.scss'
import './index.scss'

class Release extends Component {
  state = {
    canComment: false,
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
    showScreenPopup: true,
    navList: [
      { status: 0, title: '我的评论' },
      { status: 1, title: '评论我的' }
    ],
    current: 0
  }

  componentDidShow() {
    // this.fetchData()
  }

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

    console.log(res)

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

    console.log(JSON.stringify(con))

    const query = {
      sender: userId,
      canComment: canComment ? 1 : -1,
      tagId: tagList[curTag].id,
      context: JSON.stringify(con)
      // rewardMoney:
    }

    try {
      // const { errno, errmsg } = await api.forum.SEND_HOT_POSTS(query)
      const { errno, errmsg } = await api.forum.SEND_TREE_POSTS(query)

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
  checkTab = (index) => () => {
    this.setState({ current: index })
  }
  render() {
    const { navList, current, showScreenPopup, context, canComment, imgList, tagList, curTag } =
      this.state

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
      <View className='vote'>
        <View className='content'>
          <View className='title'>
            <Input placeholder='投票标题,最多25个字' placeholderClass='title__pla' />
          </View>
          <View className='plate'>
            <View className='at-icon at-icon-add-circle'></View>
            <View>添加投票说明</View>
            {/* <Textarea
              value={context}
              placeholder='投票说明'
              className='content-text'
              onInput={this.onChangeInp}
            /> */}
          </View>
          <View className='nav'>
            {navList &&
              navList.map((item, index) => {
                return (
                  <View key={item.title} className='nav-item' onClick={this.checkTab(index)}>
                    <Text className={`nav-item-text ${current === index ? 'active' : ''}`}>
                      {item.title}
                    </Text>
                  </View>
                )
              })}
          </View>
          <View className='opt'>
            <View className='opt-item'>
              <Image mode='aspectFill' className='opt-item__img' />
              <Input
                placeholder='选项1，最多20个字'
                className='opt-item__inp'
                placeholderClass='opt-item__inp-pla'
              />
            </View>
            <View className='opt-add'>+ 添加选项</View>
          </View>
          <View className='switch'>
            <View>高级设置</View>
            <View
              className={`switch-opt ${canComment ? 'active-opt' : ''}`}
              onClick={this.onChangeSwitch}
            >
              <View className='switch-opt__cir'></View>
            </View>
          </View>
        </View>
        <View className='explain'>默认单选，一周后结束，投票后显示结果，无隐藏文字</View>
        <Button class='release-btn' onClick={this.onSubmit}>
          发起投票
        </Button>
        <AtCurtain isOpened={showScreenPopup} closeBtnPosition='bottom'>
          <View className='popup'>
            <View className='popup-title'>高级设置</View>
            <View className='popup-opt'>
              <View className='popup-opt__item'>
                <View className='popup-opt__item-title'>多选投票</View>
                <View
                  className={`switch-opt ${canComment ? 'active-opt' : ''}`}
                  onClick={this.onChangeSwitch}
                >
                  <View className='switch-opt__cir'></View>
                </View>
              </View>
            </View>
            <Button class='popup-btn' onClick={this.onSubmit}>
              提交保存
            </Button>
          </View>
        </AtCurtain>
      </View>
    )
  }
}

export default Release
