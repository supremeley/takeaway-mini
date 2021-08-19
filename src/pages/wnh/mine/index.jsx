import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import ForumPopup from '@/components/forumPopup'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import UnlikeIcon from '@/assets/imgs/forum/unlike.png'
import LikeIcon from '@/assets/imgs/forum/like.png'
import AddressIcon from '@/assets/imgs/forum/address.png'
import CommitIcon from '@/assets/imgs/forum/commit.png'
import ShareIcon from '@/assets/imgs/forum/share.png'
import OptionIcon from '@/assets/imgs/forum/option.png'
import ShaiIcon from '@/assets/imgs/shai.png'
import EditIcon from '@/assets/imgs/forum/edit.png'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class Mine extends Component {
  state = {
    userId: Taro.getStorageSync('userId'),
    isOwn: this.id === 'mine' ? true : Taro.getStorageSync('userId') == this.id,
    info: {},
    inLikeNum: 0,
    fansNum: 0,
    followNum: 0,
    isProve: false,
    isFollow: false,
    showAddress: false,
    showPopup: false,
    postsList: [],
    updateImg: '',
    curPosts: null,
    defaultImg:
      ' https://eating-1256365647.cos.ap-shanghai.myqcloud.com/background/20210817175402.jpg'
  }

  componentDidShow() {
    this.getPersonInfo()
    this.setState({ postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  // 下拉加载
  handleScrollBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  handleRefresherRefresh = () => {
    this.setState({ postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onShareAppMessage = () => {
    const { isOwn, userId } = this.state

    return {
      title: '吃饭鸭',
      path: `/pages/wnh/mine/index?id=${isOwn ? userId : this.id}`,
      imageUrl: ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getPersonHistory(params)

    return { total }
  }

  onJumpToChat = () => {
    const { isOwn, userId } = this.state

    Taro.navigateTo({
      url: `/pages/wnh/chat/index?id=${isOwn ? userId : this.id}`
    })
  }

  onJumpToEdit = () => {
    const { userId } = this.state

    Taro.navigateTo({
      url: `/pages/wnh/mine/editor/index?id=${userId})}`
    })
  }

  goBack = () => {
    Taro.navigateBack()
  }

  openPopup = (index) => () => {
    this.setState({ showPopup: true, curPosts: index })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  handleSelect = (e) => {
    console.log(e)
    switch (e.type) {
      case 'delete':
        this.fetchDeletePosts()
        break
    }
  }

  previewImg = (e, imgList, index) => {
    e.stopPropagation()

    Taro.previewImage({
      current: imgList[index],
      urls: imgList
    })
  }

  getPersonInfo = async () => {
    const { isOwn } = this.state

    let query = {}

    if (!isOwn) {
      query.beUserId = this.id
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { 0: info, 1: inLikeNum, 2: fansNum, 3: followNum, 4: isFollow, 5: isProve }
      } = await api.mine.GET_PERSON_INFO(query)

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ info, inLikeNum, fansNum, followNum, isProve, isFollow: isFollow == 8 })
    } catch (e) {
      console.log(e)
    }
  }

  getPersonHistory = async (params) => {
    const { isOwn, sortOpt, curSort, postsList } = this.state

    let query = {
      ...params
    }

    if (!isOwn) {
      query.beUserId = this.id
    }

    // if (showLoading) {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    // }

    try {
      const {
        data: { list, total }
      } = await api.mine.GET_PERSON_HISTORY(query)

      let nList = list.map((item) => {
        let context,
          content,
          imgList = []

        let sendTimeDate = D.formatTimer(item.sendTimeDate, 'm-d h-m')

        try {
          context = JSON.parse(item.context)

          imgList = context.imgList
          content = context.context
        } catch {
          content = context
        }

        return {
          ...item,
          content,
          imgList,
          sendTimeDate,
          context
        }
      })

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      nList = [...postsList, ...nList]

      this.setState({ postsList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  upLoadImg = async () => {
    const res = await Taro.chooseImage({ count: 1 })

    // console.log(res)

    try {
      const { url } = await api.common.UPLOAD_IMG(res.tempFilePaths[0])

      const { data, errno } = await api.mine.UPDATE_PERSON_BG({ img: url })

      D.toast(data)

      if (!errno) {
        this.setState({ updateImg: url })
      }
    } catch (e) {
      console.log(e)
      D.toast('上传失败')
    }
  }

  fetchFollow = async () => {
    const { isFollow } = this.state

    const query = {
      beUserId: this.id
    }

    try {
      const { data, errno } = await api.mine.CHANGE_FOLLOW_PERSON(query)

      if (!errno) {
        let msg = isFollow ? '取消关注成功' : '关注成功'

        D.toast(msg)

        this.setState({ isFollow: !isFollow })
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  fetchDeletePosts = async () => {
    const { userId, curPosts, postsList } = this.state

    const query = {
      id: postsList[curPosts].id,
      userId
    }

    let resApi

    switch (postsList[curPosts].type) {
      case 1:
        resApi = api.forum.DELETE_TREE_POSTS
        break
      case 2:
        resApi = api.forum.DELETE_HOT_POSTS
        resApi = api.forum.DELETE_HOT_POSTS
        break
    }

    try {
      const { data, errno } = await resApi(query)

      if (!errno) {
        D.toast('删除成功')

        this.setState({ postsList: [], showPopup: false }, () => {
          this.resetPage(this.nextPage)
        })
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
    const {
      showPopup,
      isOwn,
      info,
      inLikeNum,
      fansNum,
      followNum,
      isFollow,
      postsList,
      showAddress,
      pageParams,
      total,
      updateImg
    } = this.state

    if (!info) {
      return null
    }

    const { avatar, nickname, backgroundImg, defaultImg, gender, comment, schoolName, sign } = info

    const PostsList =
      postsList &&
      postsList.map((item, index) => {
        return (
          <View key={item.sendTimeDate} className='list-item'>
            <View className='list-item__top'>
              <View>{item.sendTimeDate}</View>
              <View>
                {/* 本校发布 */}
                <Image
                  src={OptionIcon}
                  mode='aspectFit'
                  className='list-item__top-btn'
                  onClick={this.openPopup(index)}
                />
              </View>
            </View>
            <View className='list-item__content'>{item.content || item.context}</View>
            {item.imgList && item.imgList.length > 0 && (
              <View className={`list-item__album ${item.imgList.length > 1 ? 'more-album' : ''}`}>
                {item.imgList.map((img, idx) => {
                  return (
                    <Image
                      src={img}
                      key={img}
                      mode={item.imgList.length > 1 ? 'aspectFill' : 'heightFix'}
                      className='list-item__album-img'
                      onClick={(e) => this.previewImg(e, item.imgList, idx)}
                    />
                  )
                })}
              </View>
            )}
            <View className='list-item__bottom'>
              <View className='list-item__bottom-info green'>
                <Image
                  src={AddressIcon}
                  mode='aspectFit'
                  className='list-item__bottom-info__icon'
                />
                {schoolName}
              </View>
            </View>
          </View>
        )
      })

    return (
      <View className='mine'>
        <View className='header'>
          <Image
            src={updateImg || backgroundImg || defaultImg}
            mode='aspectFill'
            className='header-bg'
            onClick={this.upLoadImg}
          />
          <View className='header-container'>
            <View className='header-title'>个人主页</View>
            <View className='at-icon at-icon-chevron-left' onClick={this.goBack}></View>
          </View>
        </View>
        <ScrollView
          scrollY
          enableBackToTop
          className='content'
          onScrollToLower={this.handleScrollBottom}
          // onRefresherRefresh={this.handleRefresherRefresh}
        >
          <View className='title'>
            <View className='title-user'>
              <Image src={avatar} mode='aspectFill' className='title-user__avatar' />
              <View className='title-user__info'>
                <View className='title-user__info-item'>
                  <Text className='title-user__info-item__name'>获赞</Text>
                  <Text className='title-user__info-item__data'>{inLikeNum}</Text>
                </View>
                <View className='title-user__info-item'>
                  <Text className='title-user__info-item__name'>粉丝</Text>
                  <Text className='title-user__info-item__data'>{fansNum}</Text>
                </View>
                <View className='title-user__info-item'>
                  <Text className='title-user__info-item__name'>关注</Text>
                  <Text className='title-user__info-item__data'>{followNum}</Text>
                </View>
              </View>
            </View>
            <View className='title-info'>
              <View className='title-info__name'>{nickname}</View>
              <View className='title-info__tag'>{schoolName}</View>
            </View>
            <View className='title-desc'>
              {sign}
              {isOwn && (
                <Image
                  src={EditIcon}
                  mode='aspectFit'
                  className='title-desc__icon'
                  onClick={this.onJumpToEdit}
                />
              )}
            </View>
          </View>
          {!isOwn && (
            <View className='opt'>
              <View className={`opt-btn ${!isFollow && 'green-btn'}`} onClick={this.fetchFollow}>
                {!isFollow ? '关注' : '取消关注'}
              </View>
              <View className='opt-btn' onClick={this.onJumpToChat}>
                私信
              </View>
            </View>
          )}
          <View className='nav'>
            <View className='nav-title'>全部帖子</View>
            {/* <View className='nav-more'>
            筛选
            <Image
              src={ShaiIcon}
              mode='aspectFit'
              className='nav-more__icon'
              onClick={this.openPopup}
            />
          </View> */}
          </View>
          <View className='list'>{PostsList}</View>
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </ScrollView>
        <ForumPopup
          showPopup={showPopup}
          type='mine'
          onSelect={this.handleSelect}
          onClose={this.closePopup}
        />
      </View>
    )
  }
}

export default withScrollPage(Mine)
