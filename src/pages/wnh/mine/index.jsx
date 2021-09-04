import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Header from '@/components/header'
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
import GiftIcons from '@/assets/imgs/forum/gifts.png'
import MediaIcons from '@/assets/imgs/media.png'
import TagIcon from '@/assets/imgs/tag.png'

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
    // isProve: false,
    isFollow: false,
    isBlack: false,
    // showAddress: false,
    showPopup: false,
    postsList: [],
    updateImg: '',
    curPosts: null,
    titleName: '个人主页',
    defaultImg: 'https://eating-1256365647.cos.ap-shanghai.myqcloud.com/kh3erkge39dtkygo7lzt.png',
    optNav: [
      // {
      //   name: '分享',
      //   needPre: true,
      //   type: 'share'
      // },
      // {
      //   name: '置顶',
      //   needPre: Taro.getStorageSync('forumUserRole') >= 10,
      //   onlyType: ['hot', 'school'],
      //   type: 'top'
      // },
      // {
      //   name: '加精',
      //   needPre: Taro.getStorageSync('forumUserRole') >= 10,
      //   onlyType: ['hot', 'school'],
      //   type: 'refined'
      // },
      // {
      //   name: '转热门',
      //   needPre: Taro.getStorageSync('forumUserRole') >= 20,
      //   onlyType: ['school'],
      //   type: 'hot'
      // },
      {
        name: '删除',
        needPre: Taro.getStorageSync('forumUserRole') >= 10,
        canOwn: true,
        type: 'delete'
      }
      // {
      //   name: '举报',
      //   needPre: true,
      //   type: 'report'
      // }
    ],
    managerNav: [
      {
        name: '禁言',
        needPre: Taro.getStorageSync('forumUser') == 'school',
        type: 'gag'
      },
      {
        name: '封号',
        needPre: Taro.getStorageSync('forumUser') == 'manager',
        type: 'ban'
      }
    ]
  }

  componentDidShow() {
    this.getPersonInfo()
    this.setState({ postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  // 下拉加载
  handleRefresh = () => {
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
    const { isOwn, userId, info } = this.state

    return {
      title: info.nickname,
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

  onJumpToLike = () => {
    const { isOwn } = this.state

    if (!isOwn) return

    Taro.navigateTo({
      url: `/pages/wnh/like/index`
    })
  }

  onJumpToFans = () => {
    const { isOwn } = this.state

    if (!isOwn) return

    Taro.navigateTo({
      url: `/pages/wnh/follow/index`
    })
  }

  onJumpToEdit = () => {
    const { userId } = this.state

    Taro.navigateTo({
      url: `/pages/wnh/mine/editor/index?id=${userId})}`
    })
  }

  onJumpToDetail = (info) => () => {
    // console.log(info)
    let t

    if (info.type == 1) t = 'tree'
    if (info.type == 2) t = 'hot'

    Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${info.id}&type=${t}` })
  }

  openPopup = (e, index) => {
    e.stopPropagation()
    const { showPopup } = this.state
    this.setState({ showPopup: !showPopup, curPosts: index })
  }

  openManagerPopup = (e) => {
    e.stopPropagation()
    const { showManagerPopup } = this.state
    this.setState({ showManagerPopup: !showManagerPopup })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  handleSelect = (e, type) => {
    // console.log(e)
    e.stopPropagation()
    switch (type) {
      case 'delete':
        this.fetchDeletePosts()
        break
      case 'gag':
        this.fetchBan(1)
        break
      case 'ban':
        this.fetchBan(-1)
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
        data: {
          0: info,
          1: inLikeNum,
          2: fansNum,
          3: followNum,
          4: isFollow,
          5: isProve,
          6: isBlack
        }
      } = await api.mine.GET_PERSON_INFO(query)

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      // Taro.setTopBarText({ text: info.nickname })

      this.setState({
        titleName: isOwn ? '个人主页' : info.nickname,
        info: {
          ...info,
          sign: info.sign ? JSON.parse(info.sign) : []
        },
        inLikeNum,
        fansNum,
        followNum,
        isProve,
        isBlack: isBlack == 4,
        isFollow: isFollow == 8
      })
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

  fetchBlack = async () => {
    const { isBlack } = this.state

    const query = {
      beUserId: this.id
    }

    try {
      const { data, errno } = await api.blackList.CHANGE_BLACK(query)

      if (!errno) {
        let msg = !isBlack ? '加入黑名单成功' : '已从黑名单移除'

        D.toast(msg)

        this.setState({ isBlack: !isBlack })
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

  fetchBan = async (banDay) => {
    // const { isFollow } = this.state

    const query = {
      beUserId: this.id,
      banDay
    }

    try {
      const { data, errno } = await api.manager.BE_BAN_USER(query)

      if (!errno) {
        // let msg = isFollow ? '取消关注成功' : '关注成功'

        D.toast(data)

        // this.setState({ isFollow: !isFollow })
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
      // showAddress,
      pageParams,
      total,
      updateImg,
      defaultImg,
      titleName,
      optNav,
      managerNav,
      showManagerPopup,
      curPosts,
      isBlack
    } = this.state

    if (!info) {
      return null
    }

    const { avatar, identity, nickname, backgroundImg, gender, comment, schoolName, sign } = info
    // console.log(info)
    const PostsList =
      postsList &&
      postsList.map((item, index) => {
        return (
          <View key={item.sendTimeDate} className='list-item' onClick={this.onJumpToDetail(item)}>
            <View className='list-item__top'>
              <View>{item.sendTimeDate}</View>
              <View className='list-item__top-btn'>
                {/* 本校发布 */}
                <Image
                  src={OptionIcon}
                  mode='aspectFit'
                  className='list-item__top-btn-icon'
                  onClick={(e) => this.openPopup(e, index)}
                />
                {showPopup && index === curPosts && (
                  <View className='list-item-opt__content'>
                    {optNav &&
                      optNav.map((nav) => {
                        if (nav.needPre || (nav.canOwn && isOwn)) {
                          return (
                            <View
                              key={nav.name}
                              className='list-item-opt__content-item'
                              onClick={(e) => this.handleSelect(e, nav.type)}
                            >
                              {nav.name}
                            </View>
                          )
                        }

                        return null
                      })}
                  </View>
                )}
              </View>
            </View>
            <View className='list-item__content'>
              {item.content &&
                Array.isArray(item.content) &&
                item.content.map((text) => {
                  return (
                    <View key={text} className='list-item__content-text'>
                      {text}
                    </View>
                  )
                })}
            </View>
            {item.imgList && item.imgList.length > 0 && (
              <View className={`list-item__album ${item.imgList.length > 1 ? 'more-album' : ''}`}>
                {item.imgList.map((img, idx) => {
                  return (
                    <Image
                      src={img}
                      key={img}
                      mode='aspectFill'
                      className='list-item__album-img'
                      onClick={(e) => this.previewImg(e, item.imgList, idx)}
                    />
                  )
                })}
              </View>
            )}
            <View className='list-item-bottom'>
              <View className='list-item-bottom__right'>
                <View className='list-item-bottom__info' onClick={this.onHandleGift}>
                  <Image src={GiftIcon} mode='aspectFit' className='list-item-bottom__info-icon' />
                  {item.appreciateCount || 0}
                </View>
                <View className='list-item-bottom__info' onClick={this.onHandleLike}>
                  <Image
                    src={UnlikeIcon}
                    mode='aspectFit'
                    className='list-item-bottom__info-icon'
                  ></Image>
                  {item.fabulous || 0}
                </View>
                <View className='list-item-bottom__info'>
                  <Image
                    src={CommitIcon}
                    mode='aspectFit'
                    className='list-item-bottom__info-icon'
                    onClick={this.onHandleCommentPosts}
                  />
                  {item.comment || 0}
                </View>
                <View className='list-item-bottom__info'>
                  <Image src={ShareIcon} mode='aspectFit' className='list-item-bottom__info-icon' />
                </View>
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
            // src={defaultImg}
            mode='widthFix'
            className='header-bg'
            // onClick={this.upLoadImg}
          />
          <Header title={titleName} />
        </View>
        <ScrollView
          scrollY
          enableBackToTop
          refresherEnabled
          refresherDefaultStyle='none'
          refresherBackground
          className={`content ${!isOwn && 'other-content'}`}
          onScrollToLower={this.handleRefresh}
          onRefresherRefresh={this.handleRefresherRefresh}
        >
          <View className='title'>
            {isOwn && (
              <View className='title-btn'>
                <Image
                  src={MediaIcons}
                  mode='aspectFit'
                  className='title-btn-icon'
                  onClick={this.upLoadImg}
                />
                换封面
              </View>
            )}

            <View className='title-user'>
              <View className='title-user__avatar-con'>
                <Image src={avatar} mode='aspectFill' className='title-user__avatar' />
                {identity == 5 && (
                  <Image src={TagIcon} mode='aspectFit' className='title-user__avatar-tag' />
                )}
              </View>
              <View className='title-user__info'>
                <View className='title-user__info-item' onClick={this.onJumpToLike}>
                  <Text className='title-user__info-item__name'>获赞</Text>
                  <Text className='title-user__info-item__data'>{inLikeNum || 0}</Text>
                </View>
                <View className='title-user__info-item' onClick={this.onJumpToFans}>
                  <Text className='title-user__info-item__name'>粉丝</Text>
                  <Text className='title-user__info-item__data'>{fansNum || 0}</Text>
                </View>
                <View className='title-user__info-item' onClick={this.onJumpToFans}>
                  <Text className='title-user__info-item__name'>关注</Text>
                  <Text className='title-user__info-item__data'>{followNum || 0}</Text>
                </View>
              </View>
              <Image
                src={OptionIcon}
                mode='aspectFit'
                className='title-user__opt'
                onClick={(e) => this.openManagerPopup(e)}
              />
              {showManagerPopup && (
                <View className='title-user__opt-content'>
                  {managerNav &&
                    managerNav.map((nav) => {
                      if (nav.needPre || (nav.canOwn && isOwn)) {
                        return (
                          <View
                            key={nav.name}
                            className='title-user__opt-content-item'
                            onClick={(e) => this.handleSelect(e, nav.type)}
                          >
                            {nav.name}
                          </View>
                        )
                      }

                      return null
                    })}
                </View>
              )}
            </View>
            <View className='title-info'>
              <View className='title-info__name'>{nickname}</View>
              {schoolName && schoolName.trim() && (
                <View className='title-info__tag'>{schoolName}</View>
              )}
            </View>
            <View className='title-desc'>
              {/* {sign} */}
              {sign &&
                Array.isArray(sign) &&
                sign.map((text) => {
                  return <View key={text}>{text}</View>
                })}
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
          <View className='list'>
            {PostsList}

            <View className='default-content'>
              {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
              {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
            </View>
          </View>
        </ScrollView>
        {!isOwn && (
          <View className='opt'>
            <View className={`opt-btn ${!isFollow && 'green-btn'}`} onClick={this.fetchFollow}>
              {!isFollow ? '关注' : '已关注'}
            </View>
            <View className='opt-btn' onClick={this.fetchBlack}>
              {isBlack}
              {!isBlack ? '加入黑名单' : '移除黑名单'}
            </View>
            <View className='opt-btn' onClick={this.onJumpToChat}>
              私信
            </View>
          </View>
        )}
        {/* <ForumPopup
          showPopup={showPopup}
          type='mine'
          onSelect={this.handleSelect}
          onClose={this.closePopup}
        /> */}
      </View>
    )
  }
}

export default withScrollPage(Mine)
