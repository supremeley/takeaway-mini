import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtCurtain, AtModal } from 'taro-ui'
import Posts from '@/components/posts'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import GiftPopup from '@/components/giftPopup'
import UserPopup from '@/components/userPopup'
import FooterComment from '@/components/footerComment'
import ForumPopup from '@/components/forumPopup'

import { popupOpt } from '@/constants/forum'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import { connect } from 'react-redux'
import { setPostsInfo } from '@/actions/counter'

import ProveIcon from '@/assets/imgs/prove/popop.png'
import SearchIcon from '@/assets/imgs/forum/search.png'
import MessageIcon from '@/assets/imgs/forum/message.png'
import ReleaseIcon from '@/assets/imgs/forum/release.png'
// import MessageIcon from '@/assets/imgs/forum/search.png'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/curtain.scss'
import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    setPostsInfo: (info) => dispatch(setPostsInfo(info))
  })
)
@withScrollPage
class Forum extends Component {
  state = {
    safeTop: 0,
    userId: Taro.getStorageSync('userId'),
    showGift: false,
    showUser: false,
    showFirstModal: false,
    showProveModal: false,
    showNotProveModal: false,
    showIsProveModal: false,
    showScreenPopup: false,
    isAgree: false,
    curNav: 0,
    navOpt: [
      {
        type: 'hot',
        name: '全国'
      },
      {
        type: 'school',
        name: '本校'
      },
      {
        type: 'tree',
        name: '树洞'
      }
    ],
    curTag: 0,
    tagList: [
      {
        id: 0,
        pointNum: 0,
        tagName: '全部'
      }
    ],
    total: 0,
    postsList: [],
    giftList: [],
    curGift: 0,
    curUser: null,
    curPosts: null,
    giftGif: '',
    showGiftGif: false,
    schoolId: '',
    showOptIndex: null,
    eStart: 0,
    commentContext: '',
    inpFocus: false,
    placeholder: '',
    commentQuery: null,
    showPopup: false,
    popupType: 'normal',
    curComment: null,
    curPostsIndex: null
  }

  componentDidMount() {
    const info = Taro.getMenuButtonBoundingClientRect()

    this.setState({ safeTop: info.top })

    this.fetchData()
    this.getLocation()
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onPullDownRefresh = () => {
    this.setState({ postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onShareAppMessage = () => {
    return {
      title: '吃饭鸭',
      path: '/pages/forum/index',
      imageUrl: ''
    }
  }

  fetchData = async () => {
    this.getTaglist()
    this.getUserProve()
    this.getGiftlist()
  }

  fetch = async (params) => {
    const { total } = await this.getPostsList(params)

    return { total }
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  handleTouchStart = (e) => {
    // console.log(e)

    this.setState({ eStart: e.changedTouches[0].clientX })
  }

  handleTouchEnd = (e) => {
    const { eStart, curNav, navOpt } = this.state

    // if (!showEffect) {
    //   return
    // }

    const eEnd = e.changedTouches[0].clientX

    let cs
    // console.log(eEnd, eStart)
    if (eEnd > eStart + 115) {
      cs = curNav ? curNav - 1 : navOpt.length - 1
    }

    if (eEnd < eStart - 115) {
      cs = curNav !== navOpt.length - 1 ? curNav + 1 : 0
    }

    if (!cs && cs !== 0) {
      return
    }

    this.setState({ curNav: cs, curTag: 0, postsList: [] }, () => {
      this.resetPage(this.nextPage)
      this.getTaglist()
    })
  }

  handleBlur = (e) => {
    // this.setState({ commentQuery: null, placeholder: '', inpFocus: false })
  }

  handleSelect = (info, index) => {
    console.log(info, index)

    const { curPosts } = this.state

    switch (info.type) {
      case 'reply':
        this.handleReply()
        break
    }
  }

  // handleReply = () => {
  //   const { curComment } = this.state
  //   console.log(curComment)

  //   // const commentQuery = {
  //   //   id: curComment.id,
  //   //   type: 2
  //   // }

  //   let placeholder = '回复:' + curComment.nickname

  //   this.setState({
  //     // commentQuery,
  //     placeholder,
  //     inpFocus: true,
  //     commentContext: '',
  //     showPopup: false
  //   })
  // }

  handleReply = () => {
    const { curComment, curPosts } = this.state
    console.log(curComment, curPosts)

    // const commentQuery = {
    //   id: curComment.id,
    //   type: 2
    // }

    let placeholder

    if (curPosts) {
      placeholder = '评论:' + (curPosts.nickname || '#' + curPosts.userId)
    }

    if (curComment) {
      placeholder = '回复:' + curComment.nickname
    }

    this.setState({
      // commentQuery,
      placeholder,
      inpFocus: true,
      commentContext: '',
      showPopup: false
    })
  }

  handleComment = (e) => {
    console.log(e)

    this.setState({ curComment: e })

    this.openPopup()
  }

  handleCommentPosts = (e, index) => () => {
    console.log(e)

    this.setState({ curPosts: e, curPostsIndex: index }, () => {
      this.handleReply()
    })

    // this.openPopup()
  }

  handleCommentChild = (e) => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${e.postId}&type=${type}` })
  }

  onSelectNav = (index) => () => {
    // this.setState({ curNav: index })
    this.setState({ curNav: index, curTag: 0, postsList: [] }, () => {
      this.resetPage(this.nextPage)
      this.getTaglist()
    })
  }

  onSelectScreen = (index) => () => {
    this.setState({ curTag: index, postsList: [], showScreenPopup: false }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onChangeOptIndex = (index) => () => {
    const { showOptIndex } = this.state

    if (showOptIndex === index) {
      this.setState({ showOptIndex: null })
    } else {
      this.setState({ showOptIndex: index })
    }
  }

  onChangeGift = (index) => {
    const { curGift } = this.state

    if (curGift !== index) {
      this.setState({ curGift: index })
    }
  }

  openGiftGif = () => {
    this.setState({ showGiftGif: true })
  }

  closeGiftGif = () => {
    this.setState({ showGiftGif: false })
  }

  openPopup = () => {
    this.setState({ showPopup: true })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  handleAgree = () => {
    this.setState({ isAgree: !this.state.isAgree })
  }

  onJumpToDetail = (info) => () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    // this.props.setPostsInfo(info)

    Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${info.postId}&type=${type}` })
  }

  onJumpToPerson = (id) => {
    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${id}` })
  }

  onJumpToChat = (id) => {
    Taro.navigateTo({ url: `/pages/wnh/chat/index?id=${id}` })
  }

  onJupmToSearch = () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    Taro.navigateTo({ url: `/pages/wnh/search/index?type=${type}` })
  }

  onJupmToRelease = () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    Taro.navigateTo({ url: `/pages/wnh/release/index?type=${type}` })
  }

  onJupmToMessage = () => {
    Taro.navigateTo({ url: `/pages/wnh/person/index` })
  }

  onJumpToProve = () => {
    Taro.navigateTo({ url: '/pages/prove/school/index' })
  }

  onJumpToAgreement = (type) => () => {
    Taro.navigateTo({ url: `/pages/wnh/agreement/index?type=${type}` })
  }

  openFirstProveModal = () => {
    this.setState({ showFirstModal: true })
  }

  closeFirstProveModal = () => {
    this.setState({ showFirstModal: false })
  }

  openProveModal = () => {
    this.setState({ showProveModal: true })
  }

  closeProveModal = () => {
    this.setState({ showProveModal: false })
  }

  openNotProveModal = () => {
    this.setState({ showNotProveModal: true })
  }

  closeNotProveModal = () => {
    this.setState({ showNotProveModal: false })
  }

  openIsProveModal = () => {
    this.setState({ showIsProveModal: true })
  }

  closeIsProveModal = () => {
    Taro.setStorageSync('isShowIsProveModal', 1)

    this.setState({ showIsProveModal: false })
  }

  openScreenPopup = () => {
    this.setState({ showScreenPopup: true })
  }

  closeScreenPopup = () => {
    this.setState({ showScreenPopup: false })
  }

  openUser = (info) => () => {
    const { userId } = this.state

    if (userId == info.userId) {
      Taro.navigateTo({ url: `/pages/wnh/mine/index?id=mine` })
      return
    }

    this.setState({ curUser: info, showUser: true })
  }

  closeUser = () => {
    this.setState({ showUser: false })
  }

  openGift = (info) => () => {
    this.setState({ curPosts: info, showGift: true })
  }

  closeGift = () => {
    this.setState({ showGift: false })
  }

  fetchLike = (info, index) => async () => {
    const { userId, navOpt, curNav, postsList } = this.state

    let resApi

    const query = {
      id: info.postId,
      userId
    }

    const type = navOpt[curNav].type

    switch (type) {
      case 'tree':
        resApi = api.forum.LIKE_TREE_POSTS
        break
      case 'school':
      case 'hot':
      default:
        resApi = api.forum.LIKE_HOT_POSTS
        break
    }

    try {
      const { data } = await resApi(query)

      let pl = postsList.concat()

      if (info.isFabulous == 6) {
        pl[index].fabulous--
        pl[index].isFabulous = 0
      } else {
        pl[index].fabulous++
        pl[index].isFabulous = 6
      }

      D.toast(data)

      this.setState({ postsList: pl, showOptIndex: null })
    } catch (e) {}
  }

  fetchLikeComment = async (posts, index, idx) => {
    const { userId, navOpt, curNav, postsList } = this.state

    let resApi

    let comment = posts.commentList[idx]

    const query = {
      id: comment.id,
      senderId: userId,
      postId: posts.postId
    }

    const type = navOpt[curNav].type

    switch (type) {
      case 'tree':
        resApi = api.forum.LIKE_COMMENT_BY_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.LIKE_COMMENT_BY_HOT_POSTS
        break
    }

    try {
      const { data } = await resApi(query)

      let pl = postsList.concat()
      // debugger
      if (comment.isFabulous == 6) {
        pl[index].commentList[idx].fabulous--
        pl[index].commentList[idx].isFabulous = 0
      } else {
        pl[index].commentList[idx].fabulous++
        pl[index].commentList[idx].isFabulous = 6
      }

      D.toast(data)

      this.setState({ postsList: pl })
    } catch (e) {}
  }

  fetchSendGift = async () => {
    const { curGift, giftList, curPosts } = this.state

    const query = {
      postId: curPosts.postId,
      id: giftList[curGift].id
    }

    try {
      const { errno } = await api.forum.SEND_GIFT_TO_USER(query)

      if (!errno) {
        this.setState({ giftGif: giftList[curGift].img2, showGift: false }, () => {
          this.openGiftGif()
        })
      }

      // D.toast(data)
    } catch (e) {}
  }

  fetchComment = async () => {
    const {
      navOpt,
      curNav,
      curPosts,
      commentQuery,
      curPostsIndex,
      postsList,
      userId,
      commentContext,
      curComment
    } = this.state

    if (!commentContext) {
      D.toast('请输入评论内容')
      return
    }

    let resApi,
      query = {
        senderId: userId,
        // postId: curComment.postId,
        context: commentContext
        // type: 2
      }

    if (curPosts) {
      query.postId = curPosts.postId
    }

    if (curComment) {
      query.postId = curComment.postId
    }

    if (commentQuery) {
      query = {
        ...query,
        ...commentQuery
      }
    }

    const type = navOpt[curNav].type

    switch (type) {
      case 'tree':
        resApi = api.forum.COMMENT_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.COMMENT_HOT_POSTS
        break
    }

    try {
      const { data } = await resApi(query)

      Taro.stopPullDownRefresh()

      D.toast(data)

      this.setState(
        {
          commentQuery: null,
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false
        },
        () => {
          let pl = postsList.concat()

          if (pl[curPostsIndex].commentList.length < 3) {
            pl[curPostsIndex].commentList.push({
              avatar: Taro.getStorageSync('userInfo').avatar,
              context: commentContext
            })

            this.setState({ postsList: pl })
          }
          // this.setState({ postsList: [] }, () => {
          //   this.resetPage(this.nextPage)
          // })
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  getLocation = async () => {
    const { latitude, longitude } = await Taro.getLocation()

    Taro.setStorageSync('locationInfo', { latitude, longitude })
  }

  getUserProve = async () => {
    const { userId } = this.state

    const query = {
      id: userId
    }

    const {
      data: { role, schoolId, schoolName }
    } = await api.prove.CHECK_PROVER(query)

    // role 0-默认 10-校园管理员 20-论坛管理员

    // let forumUser

    switch (role) {
      case 0:
        Taro.setStorageSync('forumUser', 'normal')
        break
      case 10: // 置顶  加精
        Taro.setStorageSync('forumUser', 'school')
        break
      case 20: // 置顶  加精 转热门
        Taro.setStorageSync('forumUser', 'manager')
        break
    }

    if (schoolId || schoolId == 0) {
      const isShowIsProveModal = Taro.getStorageSync('isShowIsProveModal')
      // console.log(isShowIsProveModal)
      if (!isShowIsProveModal) {
        this.openIsProveModal()
      }

      const schoolIds = Taro.getStorageSync('schoolId')

      Taro.setStorageSync('schoolId', schoolIds)
      Taro.setStorageSync('schoolName', schoolName)

      this.setState({ schoolId }, () => {
        this.nextPage()
      })
    }
  }

  getTaglist = async () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    const query = {
      diffent: type == 'tree' ? 2 : 1
    }

    const { data } = await api.forum.GET_TAG_LIST(query)

    let tl = data.map((item) => {
      return {
        ...item
      }
    })

    tl = [
      {
        id: 0,
        pointNum: 0,
        tagName: '全部'
      },
      ...tl
    ]

    this.setState({ tagList: tl })
  }

  getPostsList = async (params) => {
    const { userId, navOpt, curNav, tagList, curTag, postsList, schoolId } = this.state

    const type = navOpt[curNav].type

    const tag = tagList[curTag]

    const schoolIds = Taro.getStorageSync('schoolId')
    // console.log(schoolId, schoolIds)
    let resApi,
      query = {
        ...params,
        userId
      }

    switch (type) {
      case 'school':
        resApi = api.forum.GET_SCHOOL_POSTS_LIST

        query.schoolId = schoolId || schoolIds || 0

        break
      case 'hot':
        resApi = api.forum.GET_HOT_LIST
        break
      case 'tree':
        resApi = api.forum.GET_TREE_LIST

        query.schoolId = schoolId || schoolIds || 0

        break
      default:
        resApi = api.forum.GET_HOT_LIST
        break
    }

    if (tag && tag.id) {
      query.tag = tag.id
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: { list, total }
      } = await resApi(query)

      let nList = await list.map(async (item) => {
        let sendTimeDate = D.formatTimer(item.sendTimeDate, 'm-d h-m')

        let context,
          content,
          imgList = []

        try {
          context = JSON.parse(item.context)

          imgList = context.imgList
          content = context.context
        } catch {
          content = context
        }

        let commentList = await this.getCommentList(item.postId, item.userId)

        const info = {
          ...item,
          sendTimeDate,
          imgList,
          content,
          commentList
        }

        return info
      })

      nList = await Promise.all(nList)

      nList = [...postsList, ...nList]
      // debugger
      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ postsList: nList, total })
      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  getCommentList = async (postId, pId) => {
    // console.log(pId)
    const { userId, navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    let resApi,
      query = {
        limit: 3,
        page: 1,
        userId,
        postId
      }

    switch (type) {
      case 'tree':
        resApi = api.forum.GET_COMMENT_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.GET_COMMENT_HOT_POSTS
        break
    }

    try {
      const {
        data: { list }
      } = await resApi(query)

      let nList = list.map((item) => {
        let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

        let children = item.children.map((it) => {
          let commentDateC = D.formatTimer(it.commentDate, 'm-d h-m')

          return {
            ...it,
            commentDate: commentDateC
          }
        })

        return {
          ...item,
          isFather: pId === item.senderId,
          commentDate,
          children: children.slice(0, 3)
        }
      })

      return nList
    } catch (e) {
      console.log(e)
    }
  }

  getGiftlist = async () => {
    const { data } = await api.forum.GET_GIFT_LIST()

    const giftList = data.map((item) => {
      return {
        ...item
      }
    })

    this.setState({ giftList })
  }

  render() {
    const {
      safeTop,
      showGift,
      showUser,
      isAgree,
      showFirstModal,
      showProveModal,
      showNotProveModal,
      showIsProveModal,
      showScreenPopup,
      showOptIndex,
      curNav,
      navOpt,
      tagList,
      curTag,
      pageParams,
      total,
      postsList,
      giftList,
      curGift,
      giftGif,
      showGiftGif,
      curUser,
      commentContext,
      inpFocus,
      placeholder,
      showPopup,
      popupType
    } = this.state

    const Nav =
      navOpt &&
      navOpt.map((item, index) => {
        return (
          <View
            key={item.name}
            className={`nav-item ${index === curNav ? 'active-item' : ''}`}
            onClick={this.onSelectNav(index)}
          >
            {item.name}
            {/* <View className='nav-item__circle'></View> */}
          </View>
        )
      })

    const screenList = tagList.length > 4 ? tagList.slice(0, 4) : tagList

    const Screen =
      screenList &&
      screenList.map((item, index) => {
        return (
          <View
            key={item.id}
            className={`screen-list__item ${index === curTag ? 'active-item' : ''}`}
            onClick={this.onSelectScreen(index)}
          >
            {item.tagName}
          </View>
        )
      })

    const ScreenPopupList =
      tagList &&
      tagList.map((item, index) => {
        return (
          <View
            key={item.name}
            className={`screen-popup__list-item ${index === curTag ? 'active-item' : ''}`}
            onClick={this.onSelectScreen(index)}
          >
            {item.tagName}
          </View>
        )
      })

    const PostsList =
      postsList &&
      postsList.map((item, index) => {
        return (
          <Posts
            key={item.postId}
            info={item}
            showAddress={curNav === 0}
            showOpt={showOptIndex === index}
            onHandleLike={this.fetchLike(item, index)}
            onHandleLikeComment={(idx) => this.fetchLikeComment(item, index, idx)}
            onHandleJump={() => this.onJumpToPerson(item.userId)}
            onHandleClick={this.onJumpToDetail(item)}
            onHandleShowOpt={this.onChangeOptIndex(index)}
            onHandleGift={this.openGift(item)}
            onHandleShowUser={this.openUser(item)}
            onHandleComment={this.handleComment}
            onHandleCommentChild={this.handleCommentChild}
            onHandleCommentPosts={this.handleCommentPosts(item, index)}
          />
        )
      })

    return (
      <View className='forum' onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
        <View style={{ height: safeTop + 'px' }} className='header'></View>
        <View style={{ top: safeTop + 'px' }} className='nav'>
          <View className='nav-search' onClick={this.onJupmToSearch}>
            <Image src={SearchIcon} mode='aspectFit' className='nav-search__icon' />
          </View>
          <View className='nav-release' onClick={this.onJupmToMessage}>
            <Image src={MessageIcon} mode='aspectFit' className='nav-release__icon' />
            <View className='circle'></View>
          </View>
          {Nav}
        </View>
        <View style={{ top: safeTop + 33 + 'px' }} className='screen'>
          <View className='screen-list'>{Screen}</View>
          <View className='screen-search' onClick={this.openScreenPopup}>
            筛选
            <View className='at-icon at-icon-chevron-down'></View>
          </View>
          <AtModal isOpened={showScreenPopup} onClose={this.closeScreenPopup}>
            <View className='screen-popup'>
              <View className='screen-popup__title'>
                切换主题
                <View className='at-icon at-icon-close' onClick={this.closeScreenPopup}></View>
              </View>
              <View className='screen-popup__list'>{ScreenPopupList}</View>
            </View>
          </AtModal>
        </View>
        <View className='content'>
          {PostsList}
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </View>
        <View className='release-btn'>
          <Image
            src={ReleaseIcon}
            mode='aspectFill'
            className='release-btn__icon'
            onClick={this.onJupmToRelease}
          />
          {/* <View className='circle'></View> */}
        </View>
        <AtModal isOpened={showFirstModal} onClose={this.closeFirstProveModal}>
          <View className='first-modal'>
            <View className='modal-title'>温馨提示</View>
            <View className='modal-explain'>
              万能盒致力于为用户提供个温暖、 可信、 友善、和谐的线上社区。为了维护社区秩序，
              保持良好氛围，请务必阅读并同意我们的社区 规范与隐私保护指引，才能正常使用产品完整
              的功能。
            </View>
            <View className='modal-opt'>
              <View
                className={`modal-opt__circle ${isAgree ? 'active-circle' : ''}`}
                onClick={this.handleAgree}
              ></View>
              <View className='modal-opt__text'>
                <Text>我已阅读</Text>
                <Text className='green' onClick={this.onJumpToAgreement(1)}>
                  《论坛规范》
                </Text>
                <Text>和</Text>
                <Text className='green' onClick={this.onJumpToAgreement(0)}>
                  《隐私保护指引》
                </Text>
              </View>
            </View>
            <Button className='modal-btn' onClick={this.closeFirstProveModal}>
              我同意
            </Button>
          </View>
        </AtModal>
        <AtCurtain
          isOpened={showNotProveModal}
          closeBtnPosition='bottom'
          onClose={this.closeNotProveModal}
        >
          <View className='prove-container'>
            <Image src={ProveIcon} mode='aspectFit' className='prove-icon' />
            <View className='prove-title'>提示</View>
            <View className='prove-explain'>身份认证未通过审核，请修改后重新提交</View>
            <View className='prove-btn'>
              <Button className='prove-btn__item' onClick={this.closeNotProveModal}>
                知道了
              </Button>
              <Button className='prove-btn__item green-btn' onClick={this.onJumpToProve}>
                重新提交
              </Button>
            </View>
          </View>
        </AtCurtain>
        <AtCurtain
          isOpened={showProveModal}
          closeBtnPosition='bottom'
          onClose={this.closeProveModal}
        >
          <View className='prove-container'>
            <Image src={ProveIcon} mode='aspectFit' className='prove-icon' />
            <View className='prove-title'>需要认证</View>
            <View className='prove-explain'>
              需要校园身份认证并授权手机号后， 才能拥有发帖、评论等权限。
            </View>
            <View className='prove-btn'>
              <Button className='prove-btn__item' onClick={this.closeProveModal}>
                稍后再说
              </Button>
              <Button className='prove-btn__item green-btn' onClick={this.onJumpToProve}>
                前往认证
              </Button>
            </View>
          </View>
        </AtCurtain>
        <AtCurtain
          isOpened={showIsProveModal}
          closeBtnPosition='bottom'
          onClose={this.closeIsProveModal}
        >
          <View className='prove-container'>
            <Image src={ProveIcon} mode='aspectFit' className='prove-icon' />
            <View className='prove-title'>成功完成校园认证</View>
            <View className='prove-explain'>您已成为万能盒的认证用户</View>
            <View className='prove-btn'>
              <Button className='prove-btn__item green-btn' onClick={this.closeIsProveModal}>
                确定
              </Button>
            </View>
          </View>
        </AtCurtain>
        <UserPopup
          show={showUser}
          curUser={curUser}
          onClose={this.closeUser}
          onJumpToPerson={this.onJumpToPerson}
          onJumpToChat={this.onJumpToChat}
        />
        <GiftPopup
          show={showGift}
          curGift={curGift}
          giftList={giftList}
          onClose={this.closeGift}
          onSelect={this.onChangeGift}
          onSendGift={this.fetchSendGift}
        />
        <AtCurtain isOpened={showGiftGif} onClose={this.closeGiftGif}>
          <Image src={giftGif} mode='widthFix' className='gift-gif' />
        </AtCurtain>
        {inpFocus && (
          <FooterComment
            show={inpFocus}
            focus={inpFocus}
            content={commentContext}
            placeholder={placeholder}
            onChange={this.onChangeInp}
            onSubmit={this.fetchComment}
            onBlur={this.handleBlur}
          />
        )}

        <ForumPopup
          showPopup={showPopup}
          type={popupType}
          onSelect={this.handleSelect}
          onClose={this.closePopup}
        />
      </View>
    )
  }
}

export default Forum
