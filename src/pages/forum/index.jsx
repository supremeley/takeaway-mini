import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button, Picker } from '@tarojs/components'
import { AtCurtain, AtModal } from 'taro-ui'
import Posts from '@/components/posts'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import GiftPopup from '@/components/giftPopup'
import UserPopup from '@/components/userPopup'
import FooterComment from '@/components/footerComment'
import ForumPopup from '@/components/forumPopup'
// import { popupOpt } from '@/constants/forum'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import { connect } from 'react-redux'
import { setPostsInfo } from '@/actions/counter'

import ProveIcon from '@/assets/imgs/prove/popop.png'
import SearchIcon from '@/assets/imgs/forum/search.png'
import MessageIcon from '@/assets/imgs/forum/message.png'
import ReleaseIcon from '@/assets/imgs/forum/release.png'

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
    areaRange: [],
    safeTop: 0,
    userId: Taro.getStorageSync('userId'),
    showGift: false,
    showFirstModal: false,
    showProveModal: false,
    showNotProveModal: false,
    showIsProveModal: false,
    showScreenPopup: false,
    isAgree: false,
    curNav: 1,
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
    schoolId: '',
    total: 0,
    postsList: [],
    curPostsIndex: null,
    showOptIndex: null,
    commentContext: '',
    inpFocus: false,
    showFocus: false,
    placeholder: '',
    // commentQuery: null,
    showPopup: false,
    popupType: 'normal',
    curComment: null,
    showUser: false,
    curUserId: null,
    forumStatus: Taro.getStorageSync('forumStatus') == 1,
    identity: 0
  }

  componentDidMount() {
    const info = Taro.getMenuButtonBoundingClientRect()

    this.setState({ safeTop: info.top })

    this.fetchData()
    this.getLocation()
  }

  componentDidShow() {
    const isProve = Taro.getStorageSync('isProve')

    if (isProve) {
      this.getUserProve()
      Taro.setStorageSync('isProve')
    }

    const needRefresh = Taro.getStorageSync('needRefresh')

    if (needRefresh) {
      this.setState({ postsList: [] }, () => {
        this.resetPage(this.nextPage)
      })

      Taro.setStorageSync('needRefresh')
    }
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

  onShareAppMessage = async () => {
    const { postsList, curPostsIndex, navOpt, curNav } = this.state

    const curPosts = postsList[curPostsIndex]

    const type = navOpt[curNav].type

    const title = curPosts.content || '万能盒'

    const path = `/pages/wnh/posts/index?id=${curPosts.postId}&type=${type}` || '/pages/forum/index'

    return {
      title,
      path,
      imageUrl: ''
    }
  }

  fetchData = async () => {
    this.getTaglist()
    this.getUserProve()
    // this.getGiftlist()
  }

  fetch = async (params) => {
    const { total } = await this.getPostsList(params)

    return { total }
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  onChangeSchool = (e) => {
    const { areaRange } = this.state

    let { value } = e.detail

    const selectorSchool = areaRange[value]

    this.setState(
      {
        // selectorSchool: selectorSchool.label,
        schoolId: selectorSchool.value
      },
      () => {
        this.setState({ postsList: [] }, () => {
          this.resetPage(this.nextPage)
        })

        this.closeFirstProveModal()
      }
    )

    Taro.setStorageSync('temSchoolId', selectorSchool.value)
  }

  // handleTouchStart = (e) => {
  //   // console.log(e)

  //   this.setState({ eStart: e.changedTouches[0].clientX })
  // }

  // handleTouchEnd = (e) => {
  //   const { eStart, curNav, navOpt } = this.state

  //   // if (!showEffect) {
  //   //   return
  //   // }

  //   const eEnd = e.changedTouches[0].clientX

  //   let cs
  //   // console.log(eEnd, eStart)
  //   if (eEnd > eStart + 115) {
  //     cs = curNav ? curNav - 1 : navOpt.length - 1
  //   }

  //   if (eEnd < eStart - 115) {
  //     cs = curNav !== navOpt.length - 1 ? curNav + 1 : 0
  //   }

  //   if (!cs && cs !== 0) {
  //     return
  //   }

  //   this.setState({ curNav: cs, curTag: 0, postsList: [] }, () => {
  //     this.resetPage(this.nextPage)
  //     this.getTaglist()
  //   })
  // }

  // handleTouchMove = () => {
  //   const { showGift, showUser } = this.state

  //   if (showGift) this.setState({ showGift: false })
  //   if (showUser) this.setState({ showUser: false })
  // }

  handleSharePosts = () => {}

  handleBlur = () => {
    setTimeout(() => {
      this.setState({ showFocus: false })
    }, 500)
  }

  handleSelect = (info, index) => {
    // console.log(info, index)

    const { popupType } = this.state

    switch (popupType) {
      case 'sort':
        this.onChangeSort(index)
        break
      case 'normal':
        this.handleNormalPopup(info)
        break
      case 'report':
        this.fetchReport(info.value)
        break
    }
  }

  handleNormalPopup = (info) => {
    switch (info.type) {
      case 'reply':
        this.handleReply()
        break
        // case 'follow':
        //   this.handleFollowToPerson()
        break
      case 'person':
        this.onJumpToMine()
        break
      case 'delete':
        this.fetchDeleteComment()
        break
      case 'report':
        this.openPopup('report')
        // this.openPopup('report')
        break
    }
  }

  fetchReport = async (reportType) => {
    const { userId, curComment } = this.state

    const query = {
      reportType,
      userId,
      postId: this.id
    }

    if (curComment) {
      query.commentId = curComment.id
    }

    switch (this.type) {
      case 'tree':
        query.type = 0
        break
      case 'hot':
      case 'school':
      default:
        query.type = 1
        break
    }

    try {
      const { errmsg, errno } = await api.forum.REPROT_POSTS(query)

      if (!errno) {
        this.closePopup()
      }

      D.toast(errmsg)

      if (curComment) this.setState({ curComment: null })
    } catch (e) {}
  }

  handleReply = () => {
    const { curComment, curPostsIndex, postsList } = this.state

    const curPosts = postsList[curPostsIndex]

    // console.log(curComment, curPosts)

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
      showFocus: true,
      commentContext: '',
      showPopup: false
    })
  }

  handleComment = (e) => {
    const { forumStatus } = this.state
    // console.log(forumStatus)
    if (forumStatus) {
      D.toast('账户存在违规操作，已被封号处理')
      return
    }

    this.setState({ curComment: e })

    this.openPopup()
  }

  handleCommentPosts = (index) => () => {
    const { forumStatus } = this.state

    if (forumStatus) {
      D.toast('账户存在违规操作，已被封号处理')
      return
    }

    this.setState(
      {
        curPostsIndex: index
      },
      () => {
        this.handleReply()
      }
    )

    // this.openPopup()
  }

  handleCommentChild = (e) => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${e.postId}&type=${type}` })
  }

  onSelectNav = (index) => () => {
    // this.setState({ curNav: index })
    this.setState({ curNav: index, curTag: 0, postsList: [], showOptIndex: null }, () => {
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

  openPopup = (type) => {
    this.setState({ showPopup: true, popupType: type || 'normal' })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  handleAgree = () => {
    this.setState({ isAgree: !this.state.isAgree })
  }

  // onJumpToDetail = (info) => () => {
  //   const { navOpt, curNav } = this.state

  //   const type = navOpt[curNav].type

  //   // this.props.setPostsInfo(info)

  //   Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${info.postId}&type=${type}` })
  // }

  onJupmToSearch = () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    Taro.navigateTo({ url: `/pages/wnh/search/index?type=${type}` })
  }

  onJumpToMine = () => {
    const { curComment } = this.state

    // const type = navOpt[curNav].type

    // Taro.navigateTo({ url: `/pages/wnh/search/index?type=${type}` })
    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${curComment.senderId}` })
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

  handleOpenOpt = (type, index) => {
    this.setState({ curPostsIndex: index })
    this.openPopup(type)
  }

  openFirstProveModal = () => {
    this.setState({ showFirstModal: true })
  }

  closeFirstProveModal = () => {
    const { isAgree } = this.state

    if (!isAgree) {
      D.toast('请同意《论坛规范》和《隐私保护指引》')
      return
    }

    this.setState({ showFirstModal: false }, () => {
      this.openProveModal()
    })
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

  openUser = (index) => async () => {
    const { userId, postsList } = this.state

    const curUserId = postsList[index].userId

    if (userId == curUserId) {
      Taro.navigateTo({ url: `/pages/wnh/mine/index?id=mine` })
      return
    }

    this.setState({ curUserId, showUser: true, identity: postsList[index].identity })
  }

  closeUser = () => {
    this.setState({ showUser: false })
  }

  openGift = (index) => () => {
    this.setState({
      curPostsIndex: index,
      showGift: true
    })
  }

  closeGift = () => {
    this.setState({ showGift: false })
  }

  handleSendGift = async () => {
    const { postsList, curPostsIndex } = this.state

    let pl = postsList.concat()
    pl[curPostsIndex].appreciateCount++

    this.setState({ postsList: pl })
  }

  handleShowMore = (index) => () => {
    console.log(1)
    const { postsList } = this.state

    const pl = postsList.concat()

    pl[index].showContent = !pl[index].showContent

    this.setState({ postsList: pl })
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

  fetchComment = async () => {
    const {
      navOpt,
      curNav,

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
        context: commentContext
        // type: 2
      }

    const curPosts = postsList[curPostsIndex]

    if (curPosts) {
      query.postId = curPosts.postId
    }

    if (curComment) {
      query.id = curComment.id
      query.postId = curComment.postId
      query.type = 2
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
          // commentQuery: null,
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false,
          showFocus: false
        },
        () => {
          let pl = postsList.concat()
          // console.log(pl[curPostsIndex])
          if (pl[curPostsIndex].commentList.length < 3) {
            pl[curPostsIndex].commentList.push({
              avatar: Taro.getStorageSync('userInfo').avatarUrl,
              nickname: Taro.getStorageSync('userInfo').nickName,
              context: commentContext
            })
          }

          pl[curPostsIndex].comment++

          this.setState({ postsList: pl })
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  fetchCommentImg = async (img) => {
    const { navOpt, curNav, curPostsIndex, postsList, userId, curComment } = this.state

    Taro.showLoading({
      title: '上传中',
      icon: 'none'
    })

    const { url: contextImg } = await api.common.UPLOAD_IMG(img)
    // console.log(contextImg)
    // return
    let resApi,
      query = {
        senderId: userId,
        contextImg
      }

    const curPosts = postsList[curPostsIndex]

    if (curPosts) {
      query.postId = curPosts.postId
    }

    if (curComment) {
      query.postId = curComment.postId
    }

    // if (commentQuery) {
    //   query = {
    //     ...query,
    //     ...commentQuery
    //   }
    // }

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

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      D.toast(data)

      this.setState(
        {
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false,
          showFocus: false
        },
        () => {
          let pl = postsList.concat()
          // console.log(pl[curPostsIndex])
          if (pl[curPostsIndex].commentList.length < 3) {
            pl[curPostsIndex].commentList.push({
              avatar: Taro.getStorageSync('userInfo').avatarUrl,
              nickname: Taro.getStorageSync('userInfo').nickName,
              contextImg
            })
          }

          pl[curPostsIndex].comment++

          this.setState({ postsList: pl })
        }
      )
    } catch (e) {
      Taro.hideLoading()
      console.log(e)
    }
  }

  fetchDelete = (info) => async () => {
    const { userId, navOpt, curNav } = this.state

    let resApi

    const query = {
      id: info.postId,
      userId
    }

    const type = navOpt[curNav].type

    switch (type) {
      case 'tree':
        resApi = api.forum.DELETE_TREE_POSTS
        break
      case 'school':
      case 'hot':
      default:
        resApi = api.forum.DELETE_HOT_POSTS
        break
    }

    try {
      const { data } = await resApi(query)

      D.toast(data)

      // this.colseopt
      this.setState({ postsList: [], showOptIndex: null }, () => {
        this.resetPage(this.nextPage)
      })
    } catch (e) {
      console.log(e)
    }
  }

  fetchTop = (info) => async () => {
    const { userId } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_TOP_POSTS(query)

      D.toast(data)

      this.setState({ postsList: [], showOptIndex: null }, () => {
        this.resetPage(this.nextPage)
      })
    } catch (e) {
      console.log(e)
    }
  }

  fetchHot = (info) => async () => {
    const { userId } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_HOT_POSTS(query)

      D.toast(data)

      this.setState({ postsList: [], showOptIndex: null }, () => {
        this.resetPage(this.nextPage)
      })
    } catch (e) {
      console.log(e)
    }
  }

  fetchRefined = (info) => async () => {
    const { userId } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_REFINED_POSTS(query)

      D.toast(data)

      this.setState({ postsList: [], showOptIndex: null }, () => {
        this.resetPage(this.nextPage)
      })
    } catch (e) {
      console.log(e)
    }
  }

  fetchDeleteComment = async () => {
    const { userId, curComment } = this.state

    const query = {
      id: curComment.id,
      userId
    }

    // if (curComment) {
    //   query.commentId = curComment.id
    // }

    let resApi

    switch (this.type) {
      case 'tree':
        resApi = api.forum.DELETE_COMMENT_BY_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.DELETE_COMMENT_BY_HOT_POSTS
        break
    }

    try {
      const { data, errno, errmsg } = await resApi(query)

      if (!errno) {
        D.toast(data)

        this.setState({ postsList: [], showOptIndex: null, showPopup: false }, () => {
          this.resetPage(this.nextPage)
        })
      } else {
        D.toast(errmsg)
      }
    } catch (e) {}
  }

  // handleFollowToPerson = async () => {
  //   const { curComment } = this.state
  //   // console.log(curComment)
  //   const query = {
  //     beUserId: curComment.senderId
  //   }

  //   try {
  //     const { data, errno } = await api.mine.CHANGE_FOLLOW_PERSON(query)

  //     if (!errno) {
  //       // let msg = curUser.isFollow ? '取消关注成功' : '关注成功'
  //       let msg = '关注成功'
  //       D.toast(msg)

  //       // this.setState({ curUser: { ...curUser, isFollow: curUser.isFollow ? 0 : 8 } })
  //     } else {
  //       D.toast(data)
  //     }
  //   } catch (e) {}
  // }

  getLocation = async () => {
    const { latitude, longitude } = await Taro.getLocation()

    Taro.setStorageSync('locationInfo', { latitude, longitude })

    await this.getSchoolList()
  }

  getUserProve = async () => {
    const { userId } = this.state

    const query = {
      id: userId
    }

    const { data, errno } = await api.prove.CHECK_PROVER(query)

    // role 0-默认 10-校园管理员 20-论坛管理员

    // let forumUser

    if (errno === -1) {
      const isFirstProveModal = Taro.getStorageSync('isFirstProveModal')

      if (isFirstProveModal) {
        this.openProveModal()
      } else {
        // this.getSchoolList()
        this.openFirstProveModal()
        Taro.setStorageSync('isFirstProveModal', true)
      }

      return
    }

    if (errno === -2) {
      this.openNotProveModal()
      return
    }

    const { role, schoolId, schoolName } = data

    Taro.setStorageSync('forumUserRole', role)

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
      this.closeProveModal()

      // const schoolIds = Taro.getStorageSync('schoolId')

      Taro.setStorageSync('schoolId', schoolId)
      Taro.setStorageSync('schoolName', schoolName)

      this.setState({ schoolId }, () => {
        this.nextPage()
      })
    }
  }

  getTaglist = async () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    let query = {}

    switch (type) {
      case 'tree':
        query.diffent = 2
        break
      case 'school':
        query.diffent = 1
        break
      case 'hot':
        query.diffent = 3
        break
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

    const temSchoolId = Taro.getStorageSync('temSchoolId')
    // if ()
    let resApi,
      query = {
        ...params,
        userId
      }

    switch (type) {
      case 'school':
        resApi = api.forum.GET_SCHOOL_POSTS_LIST

        query.schoolId = schoolId || schoolIds || temSchoolId || 0

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
          // console.log(context)

          imgList = context.imgList
          content = context.context
        } catch {
          // console.log(1111)
          content = context
        }
        // console.log(content)
        let { list: commentList, total: commentTotal } = await this.getCommentList(
          item.postId,
          item.userId
        )

        let contentLength = content.reduce((val, it) => {
          return (val += Math.ceil(it.length / 19))
        }, 0)

        const info = {
          ...item,
          sendTimeDate,
          imgList,
          content,
          showContent: contentLength <= 6,
          contentLength,
          commentList,
          commentTotal
        }

        return info
      })

      nList = await Promise.all(nList)

      nList = [...postsList, ...nList]
      // console.log(nList)
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
        data: { list, total }
      } = await resApi(query)

      let nList = list.map((item) => {
        let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

        // let children = this.commentHandle(item.children)

        let children = item.children.map((it) => {
          let commentDateC = D.formatTimer(it.commentDate, 'm-d h-m')

          return {
            ...it,
            commentDate: commentDateC
          }
        })

        return {
          ...item,
          commentDate,
          total: children.length,
          isFather: pId === item.senderId,
          children: children.slice(0, 1)
        }
      })
      // console.log(nList, 'nList')
      return { list: nList, total }
    } catch (e) {
      console.log(e)
    }
  }

  commentHandle = (list, beNickname) => {
    // console.log(list)
    const newList = list.map((item) => {
      let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

      let children = []

      if (item.children.length) {
        children = item.children.map((it) => {
          return this.commentHandle(it.children, item.nickname)
        })
      }

      return {
        ...item,
        commentDate,
        children,
        beNickname
      }
    })

    return newList
  }

  getSchoolList = async () => {
    const { longitude: longi, latitude: lanti } = Taro.getStorageSync('locationInfo')
    // console.log(locationInfo)
    const query = { longi, lanti }

    const {
      data: { items }
    } = await api.forum.GET_SCHOOL_LIST(query)

    const schools = items
      .filter((item) => !item.deleted)
      .map((item) => {
        return {
          value: item.id,
          label: item.schoolName
        }
      })

    // const [area, school] = areaRange
    // console.log(schools)

    if (!this.state.schoolId) {
      this.setState({ schoolId: schools.value }, () => {
        this.nextPage()
      })
    }

    this.setState({ areaRange: schools })
  }

  render() {
    const {
      areaRange,
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
      curPostsIndex,
      curUserId,
      commentContext,
      inpFocus,
      showFocus,
      placeholder,
      showPopup,
      popupType,
      curComment,
      userId,
      forumStatus,
      identity
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

    const screenList = tagList.length > 3 ? tagList.slice(0, 4) : tagList

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
            type={navOpt[curNav].type}
            showOpt={showOptIndex === index}
            onHandleShowOpt={this.onChangeOptIndex(index)}
            onHandleLike={this.fetchLike(item, index)}
            onHandleLikeComment={(idx) => this.fetchLikeComment(item, index, idx)}
            onHandleGift={this.openGift(index)}
            onHandleShowUser={this.openUser(index)}
            onHandleComment={this.handleComment}
            onHandleCommentChild={this.handleCommentChild}
            onHandleCommentPosts={this.handleCommentPosts(index)}
            onHandleSharePosts={this.handleSharePosts}
            onHandleOpenOpt={(type) => this.handleOpenOpt(type, index)}
            onHandleDelete={this.fetchDelete(item)}
            onHandleTop={this.fetchTop(item)}
            onHandleHot={this.fetchHot(item)}
            onHandleRefined={this.fetchRefined(item)}
            onHandleShowMore={this.handleShowMore(index)}
          />
        )
      })

    return (
      <View className='forum'>
        <View style={{ height: safeTop + 'px' }} className='header'></View>
        <View style={{ top: safeTop + 'px' }} className='nav'>
          <View className='nav-search' onClick={this.onJupmToSearch}>
            <Image src={SearchIcon} mode='aspectFit' className='nav-search__icon' />
          </View>
          <View className='nav-release' onClick={this.onJupmToMessage}>
            <Image src={MessageIcon} mode='aspectFit' className='nav-release__icon' />
            {/* <View className='circle'></View> */}
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
                切换话题
                <View className='at-icon at-icon-close' onClick={this.closeScreenPopup}></View>
              </View>
              <View className='screen-popup__list'>{ScreenPopupList}</View>
            </View>
          </AtModal>
        </View>
        <View className='content'>
          {PostsList}
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && (
            <BottomText msg='成为光而不是被照亮' />
          )}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </View>
        {curNav != 0 && !forumStatus && (
          <View className='release-btn'>
            <Image
              src={ReleaseIcon}
              mode='aspectFill'
              className='release-btn__icon'
              onClick={this.onJupmToRelease}
            />
            {/* <View className='circle'></View> */}
          </View>
        )}
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
            <Picker
              mode='selector'
              rangeKey='label'
              range={areaRange}
              onChange={this.onChangeSchool}
            >
              <Button className='modal-btn'>我同意</Button>
            </Picker>
          </View>
        </AtModal>
        <AtCurtain
          isOpened={showNotProveModal}
          closeBtnPosition='bottom'
          onClose={this.closeNotProveModal}
        >
          <View className='prove-container'>
            <Image src={ProveIcon} mode='aspectFit' className='prove-icon' />
            <View className='prove-title'>盒盒提示</View>
            <View className='prove-explain'>身份认证未通过审核</View>
            <View className='prove-explain'>请修改后重新提交</View>
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
          identity={identity}
          show={showUser}
          curUserId={curUserId}
          onClose={this.closeUser}
        />
        <GiftPopup
          show={showGift}
          type={navOpt[curNav].type}
          postId={postsList[curPostsIndex] && postsList[curPostsIndex].postId}
          onClose={this.closeGift}
          onHandleSendGift={this.handleSendGift}
        />
        {showFocus && (
          <FooterComment
            // show={inpFocus}
            focus={inpFocus}
            content={commentContext}
            placeholder={placeholder}
            onChange={this.onChangeInp}
            onSubmit={this.fetchComment}
            onSubmitImg={this.fetchCommentImg}
            onBlur={this.handleBlur}
          />
        )}
        <ForumPopup
          isOwn={curComment && curComment.senderId == userId}
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
