import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
// import { AtCurtain } from 'taro-ui'
import FooterComment from '@/components/footerComment'
import ForumPopup from '@/components/forumPopup'
import GiftPopup from '@/components/giftPopup'

import api from '@/api'
import D from '@/common'
// import { connect } from 'react-redux'
import withScrollPage from '@/hocs/scrollPage'

import { popupOpt } from '@/constants/forum'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import GiftIcons from '@/assets/imgs/forum/gifts.png'
import UnlikeIcon from '@/assets/imgs/forum/unlike.png'
import LikeIcon from '@/assets/imgs/forum/like.png'
import AddressIcon from '@/assets/imgs/forum/address.png'
import CommitIcon from '@/assets/imgs/forum/commit.png'
import ShareIcon from '@/assets/imgs/forum/share.png'
import OptionIcon from '@/assets/imgs/forum/option.png'
import TagIcon from '@/assets/imgs/tag.png'

import OneIcon from '@/assets/imgs/forum/one.png'
import TwoIcon from '@/assets/imgs/forum/two.png'
import ThreeIcon from '@/assets/imgs/forum/three.png'

import 'taro-ui/dist/style/components/icon.scss'
// import 'taro-ui/dist/style/components/curtain.scss'
import './index.scss'

// @connect(({ counter }) => ({
//   info: counter.postsInfo
// }))
@withScrollPage
class Posts extends Component {
  state = {
    userId: Taro.getStorageSync('userId'),
    isOwn: false,
    info: null,
    showAddress: false,
    showOpt: false,
    commentList: [],
    rankList: [],
    commentContext: '',
    inpFocus: false,
    showFocus: false,
    placeholder: '',
    commentQuery: null,
    showPopup: false,
    popupType: 'sort',
    sortOpt: popupOpt.sort,
    curSort: 0,
    curComment: null,
    totalMoneys: 0,
    totalPerson: 0,
    showGift: false,
    // giftList: [],
    // curGift: 0,
    // giftGif: '',
    // userBalance: 0,
    // showGiftGif: false,
    optNav: [
      {
        name: '分享',
        needPre: true,
        type: 'share'
      },
      {
        name: '置顶',
        needPre: Taro.getStorageSync('forumUserRole') >= 10,
        onlyType: ['hot', 'school'],
        type: 'top'
      },
      {
        name: '加精',
        needPre: Taro.getStorageSync('forumUserRole') >= 10,
        onlyType: ['hot', 'school'],
        type: 'refined'
      },
      {
        name: '转热门',
        needPre: Taro.getStorageSync('forumUserRole') >= 20,
        onlyType: ['school'],
        type: 'hot'
      },
      {
        name: '删除',
        needPre: Taro.getStorageSync('forumUserRole') >= 10,
        canOwn: true,
        type: 'delete'
      },
      {
        name: '举报',
        needPre: true,
        type: 'report'
      }
    ],
    forumStatus: Taro.getStorageSync('forumStatus') == 1
  }

  componentDidMount() {
    this.getGiftlist()
  }

  componentDidShow() {
    if (this.type === 'hot') {
      this.setState({ showAddress: true })
    }

    this.getPostsDetail()

    this.getRankingList()

    this.setState({ commentList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  onPullDownRefresh = () => {
    this.setState({ commentList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onShareAppMessage = () => {
    const { info } = this.state

    return {
      title: info.content || '万能盒',
      path: `/pages/wnh/posts/index?id=${this.id}&type=${this.type}`,
      imageUrl: ''
    }
  }

  onShareTimeline = () => {
    const { info } = this.state

    return {
      title: info.content || '万能盒',
      path: `/pages/wnh/posts/index?id=${this.id}&type=${this.type}`,
      imageUrl: ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getCommentList(params)

    return { total }
  }

  onJumpToGift = () => {
    Taro.navigateTo({ url: `/pages/wnh/ranking/index?id=${this.id}&type=${this.type}` })
  }

  onJumpToPerson = () => {
    const { info } = this.state

    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${info.userId}` })
  }

  onJumpToMine = () => {
    const { curComment } = this.state

    // const type = navOpt[curNav].type

    // Taro.navigateTo({ url: `/pages/wnh/search/index?type=${type}` })
    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${curComment.senderId}` })
  }

  openOpt = () => {
    this.setState({ showOpt: !this.state.showOpt })
  }

  closeOpt = () => {
    this.setState({ showOpt: false })
  }

  openPopup = (type) => {
    // console.log(type)

    this.setState({ showPopup: true, popupType: type })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  optHandle = (type) => {
    switch (type) {
      case 'refined':
        this.fetchRefined()
        break
      case 'hot':
        this.fetchHot()
        break
      case 'top':
        this.fetchTop()
        break
      case 'delete':
        this.fetchDelete()
        break
      default:
        this.openPopup(type)
        break
    }
  }

  handleOpenItemPopup = (index, idx) => {
    const { commentList, forumStatus } = this.state

    if (forumStatus) {
      D.toast('账户存在违规操作，已被封号处理')
      return
    }

    let curComment = {}

    if (idx || idx === 0) {
      curComment = commentList[index].children[idx]
    } else {
      curComment = commentList[index]
    }

    this.setState({ curComment }, () => this.openPopup('normal'))
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

  // handleNormalPopup = (info) => {
  //   switch (info.type) {
  //     case 'reply':
  //       this.handleReply()
  //       break
  //     case 'delete':
  //       this.fetchDeleteComment()
  //       break
  //     case 'report':
  //       this.openPopup('report')

  //       break
  //   }
  // }

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

  openGift = () => {
    this.setState({ showGift: true })
  }

  closeGift = () => {
    this.setState({ showGift: false })
  }

  // onChangeGift = (index) => {
  //   const { curGift } = this.state

  //   if (curGift !== index) {
  //     this.setState({ curGift: index })
  //   }
  // }

  onChangeSort = (index) => {
    this.setState({ curSort: index, commentList: [], showPopup: false }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  handleBlur = () => {
    // setTimeout(() => {
    //   this.setState({ showFocus: false })
    // }, 500)
  }

  handleOpenCommit = (e, index) => {
    e.stopPropagation()

    const { commentList } = this.state

    let cl = commentList.concat()

    cl[index].hidden = !cl[index].hidden

    this.setState({ commentList: cl })
  }

  previewImg = (e, index) => {
    e.stopPropagation()

    const { imgList } = this.state.info

    Taro.previewImage({
      current: imgList[index],
      urls: imgList
    })
  }

  previewCommentImg = (img) => {
    Taro.previewImage({
      current: img,
      urls: [img]
    })
  }

  handleComment = () => {
    const { info, forumStatus } = this.state

    if (forumStatus) {
      D.toast('账户存在违规操作，已被封号处理')
      return
    }

    const commentQuery = null

    let placeholder = '回复:' + info.nickname

    this.setState({
      commentQuery,
      placeholder,
      inpFocus: true,
      showFocus: true,
      commentContext: ''
    })
  }

  handleReply = () => {
    const { userId, curComment } = this.state
    // console.log(curComment)

    const commentQuery = {
      id: curComment.id,
      type: 2
    }

    let placeholder = '回复:' + curComment.nickname

    this.setState({
      commentQuery,
      placeholder,
      inpFocus: true,
      showFocus: true,
      commentContext: '',
      showPopup: false
    })
  }

  getPostsDetail = async () => {
    let resApi,
      query = {
        postId: this.id
      }

    switch (this.type) {
      case 'tree':
        resApi = api.forum.GET_TREE_POSTS_DETAIL
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.GET_HOT_POSTS_DETAIL
        break
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const { data } = await resApi(query)

      let sendTimeDate = D.formatTimer(data.sendTimeDate, 'm-d h-m')

      let context,
        content,
        imgList = []

      try {
        context = JSON.parse(data.context)

        imgList = context.imgList
        content = context.context
      } catch {
        content = context
      }

      Taro.hideLoading()

      const isOwn = data.userId == Taro.getStorageSync('userId')
      // console.log(data.userId)
      this.setState({ info: { ...data, content, imgList, sendTimeDate }, isOwn })
    } catch (e) {
      // console.log(e)
    }
  }

  getCommentList = async (params, showLoading = true) => {
    const { userId, sortOpt, curSort, commentList } = this.state

    let resApi,
      query = {
        ...params,
        userId,
        postId: this.id,
        sort: sortOpt[curSort].value
      }

    switch (this.type) {
      case 'tree':
        resApi = api.forum.GET_COMMENT_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.GET_COMMENT_HOT_POSTS
        break
    }

    if (showLoading) {
      Taro.showLoading({
        title: '加载中',
        icon: 'none'
      })
    }

    try {
      const {
        data: { list, total }
      } = await resApi(query)

      // let nList = list.reduce((val, item) => {
      //   let arr = [],
      //     chiArr = []

      //   let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

      //   arr.push({
      //     ...item,
      //     commentDate
      //   })

      //   if (item.children.length) {
      //     chiArr = item.children.map((chi) => {
      //       let commentDateC = D.formatTimer(chi.commentDate, 'm-d h-m')

      //       return {
      //         ...chi,
      //         fNickName: item.nickname,
      //         commentDate: commentDateC,
      //         isChi: true,
      //         pid: item.id
      //       }
      //     })
      //   }

      //   arr.push(...chiArr)

      //   val.push(...arr)

      //   return val
      // }, [])

      let nList = list.map((item) => {
        let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

        // const children = item.children.map((chi) => {
        //   let commentDateC = D.formatTimer(chi.commentDate, 'm-d h-m')

        //   return {
        //     ...chi,
        //     commentDate: commentDateC
        //   }
        // })

        let children = this.commentHandle(item.children)

        return {
          ...item,
          children,
          commentDate,
          total: children.length,
          hidden: true
        }
      })

      if (showLoading) {
        Taro.hideLoading()
      }

      Taro.stopPullDownRefresh()

      nList = [...commentList, ...nList]
      // console.log(nList)
      this.setState({ commentList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  commentHandle = (list, beNickname, beSenderId) => {
    // console.log(list, 'list')
    const newList = list.reduce((val, item) => {
      let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

      let children = []

      if (item.children.length) {
        children = this.commentHandle(item.children, item.nickname, item.senderId)
      }

      const nt = {
        ...item,
        commentDate,
        beNickname,
        beSenderId
      }

      val.push(nt, ...children)

      return val
    }, [])

    return newList
  }

  getRankingList = async () => {
    let resApi,
      query = {
        postId: this.id,
        page: 1,
        limit: 5
      }

    switch (this.type) {
      case 'tree':
        resApi = api.forum.GET_RANKING_BY_TREE_POSTS
        break
      case 'hot':
      case 'school':
      default:
        resApi = api.forum.GET_RANKING_BY_HOT_POSTS
        break
    }

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })

    try {
      const {
        data: {
          data: { list, total },
          totalMoneys
        }
      } = await resApi(query)

      Taro.hideLoading()

      this.setState({ rankList: list.slice(0, 5), totalMoneys, totalPerson: total })
    } catch (e) {
      Taro.hideLoading()

      console.log(e)
    }
  }

  getGiftlist = async () => {
    const {
      data: { 1: userBalance, 2: list }
    } = await api.forum.GET_GIFT_LIST()

    const giftList = list.map((item) => {
      return {
        ...item
      }
    })

    this.setState({ giftList, userBalance })
  }

  fetchLike = async () => {
    const { userId, info } = this.state
    let { fabulous, isFabulous } = info

    let resApi

    const query = {
      id: info.postId,
      userId
    }

    switch (this.type) {
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
      const { errno, data, errmsg } = await resApi(query)

      if (!errno) {
        D.toast(data)

        if (info.isFabulous == 6) {
          fabulous--
          isFabulous = 0
        } else {
          fabulous++
          isFabulous = 6
        }

        this.setState({ info: { ...info, fabulous, isFabulous } })
      } else {
        D.toast(errmsg)
      }
    } catch (e) {}
  }

  fetchLikeComment = async (info, index, idx) => {
    const { userId, commentList } = this.state

    let resApi

    const query = {
      id: info.id,
      senderId: userId,
      postId: this.id
    }

    switch (this.type) {
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

      let pl = commentList.concat()

      if (idx || idx === 0) {
        if (info.isFabulous == 6) {
          pl[index].children[idx].fabulous--
          pl[index].children[idx].isFabulous = 0
        } else {
          pl[index].children[idx].fabulous++
          pl[index].children[idx].isFabulous = 6
        }
      } else {
        if (info.isFabulous == 6) {
          pl[index].fabulous--
          pl[index].isFabulous = 0
        } else {
          pl[index].fabulous++
          pl[index].isFabulous = 6
        }
      }

      D.toast(data)

      this.setState({ commentList: pl })
    } catch (e) {}
  }

  fetchComment = async () => {
    const { commentQuery, userId, commentContext, info } = this.state

    if (!commentContext) {
      D.toast('请输入评论内容')
      return
    }

    let resApi,
      query = {
        senderId: userId,
        postId: this.id,
        context: commentContext
        // type: 2
      }

    if (commentQuery) {
      query = {
        ...query,
        ...commentQuery
      }
    }

    switch (this.type) {
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

      let inf = info

      if (!commentQuery) {
        inf = { ...inf, comment: ++inf.comment }
      }

      this.setState(
        {
          info: inf,
          commentQuery: null,
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false,
          showFocus: false,
          commentList: []
        },
        () => {
          setTimeout(() => {
            this.resetPage(this.nextPage)
          }, 500)
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  fetchCommentImg = async (img) => {
    const { commentQuery, info, userId } = this.state

    const { url: contextImg } = await api.common.UPLOAD_IMG(img)

    // return
    let resApi,
      query = {
        senderId: userId,
        postId: this.id,
        contextImg
      }

    if (commentQuery) {
      query = {
        ...query,
        ...commentQuery
      }
    }

    switch (this.type) {
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

      let inf = info

      if (!commentQuery) {
        inf = { ...inf, comment: ++inf.comment }
      }

      this.setState(
        {
          info: inf,
          commentQuery: null,
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false,
          showFocus: false,
          commentList: []
        },
        () => {
          setTimeout(() => {
            this.resetPage(this.nextPage)
          }, 500)
        }
      )
    } catch (e) {
      console.log(e)
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
      const { data } = await api.forum.REPROT_POSTS(query)

      D.toast(data)

      if (curComment) this.setState({ curComment: null })
    } catch (e) {}
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

        this.setState(
          {
            curComment: null,
            showPopup: false,
            commentList: []
          },
          () => {
            setTimeout(() => {
              this.resetPage(this.nextPage)
            }, 500)
          }
        )
      } else {
        D.toast(errmsg)
      }
    } catch (e) {}
  }

  fetchFollow = async () => {
    const { info } = this.state
    const { isFollow } = info

    const query = {
      beUserId: info.userId
    }

    try {
      const { data, errno } = await api.mine.CHANGE_FOLLOW_PERSON(query)

      if (!errno) {
        let msg = isFollow ? '取消关注成功' : '关注成功'

        D.toast(msg)

        this.setState({ info: { ...info, isFollow: isFollow ? 0 : 6 } })
      } else {
        D.toast(data)
      }
    } catch (e) {}
  }

  handleSendGift = async () => {
    const { info } = this.state

    let inf = { ...info }

    inf.appreciateCount++

    this.setState({ info: inf })
  }

  // fetchSendGift = async () => {
  //   const { userBalance, curGift, giftList, info } = this.state

  //   const query = {
  //     postId: this.id,
  //     id: giftList[curGift].id
  //   }

  //   let resApi

  //   switch (this.type) {
  //     case 'tree':
  //       resApi = api.forum.SEND_GIFT_TO_USER_BY_TREE
  //       break
  //     case 'hot':
  //     case 'school':
  //     default:
  //       resApi = api.forum.SEND_GIFT_TO_USER
  //       break
  //   }

  //   try {
  //     const { errno, errmsg } = await resApi(query)

  //     if (!errno) {
  //       let inf = { ...info }

  //       inf.appreciateCount++

  //       const ub = userBalance - giftList[curGift].point
  //       this.setState(
  //         { userBalance: ub, giftGif: giftList[curGift].img2, info: inf, showGift: false },
  //         () => {
  //           this.openGiftGif()
  //         }
  //       )
  //     } else {
  //       D.toast(errmsg)
  //     }
  //   } catch (e) {}
  // }

  fetchTop = async () => {
    const { userId, info } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_TOP_POSTS(query)

      D.toast(data)

      // this.setState({ postsList: [], showOptIndex: null }, () => {
      //   this.resetPage(this.nextPage)
      // })
      Taro.setStorageSync('needRefresh', true)
    } catch (e) {
      console.log(e)
    }
  }

  fetchHot = async () => {
    const { userId, info } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_HOT_POSTS(query)

      D.toast(data)

      // this.setState({ postsList: [], showOptIndex: null }, () => {
      //   this.resetPage(this.nextPage)
      // })
      Taro.setStorageSync('needRefresh', true)
    } catch (e) {
      console.log(e)
    }
  }

  fetchRefined = async () => {
    const { info, userId } = this.state

    const query = {
      postId: info.postId,
      userId
    }

    try {
      const { data } = await api.manager.SET_REFINED_POSTS(query)

      D.toast(data)

      // this.setState({ postsList: [], showOptIndex: null }, () => {
      //   this.resetPage(this.nextPage)
      // })
      Taro.setStorageSync('needRefresh', true)
    } catch (e) {
      console.log(e)
    }
  }

  fetchDelete = async () => {
    const { userId, info } = this.state

    let resApi

    const query = {
      id: info.postId,
      userId
    }

    switch (this.type) {
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

      Taro.setStorageSync('needRefresh', true)

      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (e) {
      console.log(e)
    }
  }

  get type() {
    return this.route.params.type
  }

  get id() {
    return this.route.params.id
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      info,
      showAddress,
      showOpt,
      commentList,
      rankList,
      commentContext,
      placeholder,
      showPopup,
      popupType,
      sortOpt,
      curSort,
      totalMoneys,
      totalPerson,
      optNav,
      isOwn,
      inpFocus,
      showFocus,
      showGift
    } = this.state

    if (!info) {
      return null
    }

    const sortName = sortOpt[curSort].name

    const {
      avatar,
      nickname,
      sendTimeDate,
      appreciateCount,
      canComment,
      comment,
      fabulous,
      isFabulous,
      context,
      schoolName,
      tagName,
      imgList,
      content,
      isFollow,
      identity
    } = info

    const CommentList =
      commentList.length > 0 &&
      commentList.map((item, index) => {
        return (
          <View
            key={item.id}
            className='posts-commit__item'
            onClick={() => this.handleOpenItemPopup(index)}
          >
            <Image src={item.avatar} mode='aspectFill' className='posts-commit__item-avatar' />
            <View className='posts-commit__item-info'>
              <View className='posts-commit__item-info__title'>{item.nickname}</View>
              <View className='posts-commit__item-info__content'>{item.commentDate}</View>
              <View className='posts-commit__item-info__detail'>
                {/* {item.isChi && (
                  <>
                    <Text className='posts-commit__item-info__detail-name'>回复</Text>
                    <Text className='green'>{item.fNickName}:</Text>
                  </>
                )} */}
                <View className='posts-commit__item-info__detail-content'>
                  {item.context}
                  {item.contextImg && (
                    <Image
                      src={item.contextImg}
                      mode='aspectFit'
                      className='posts-commit__item-info__detail-content__img'
                      onClick={(e) => {
                        e.stopPropagation()
                        this.previewCommentImg(item.contextImg)
                      }}
                    />
                  )}
                </View>
                {item.children &&
                  item.children.length > 0 &&
                  item.children.map((it, idx) => {
                    if (item.hidden && idx) {
                      return null
                    }

                    return (
                      <View
                        key={it.id}
                        className='posts-commit__item-info__detail-self'
                        onClick={(e) => {
                          e.stopPropagation()
                          this.handleOpenItemPopup(index, idx)
                        }}
                      >
                        <View className='posts-commit__item-info__detail-self__top'>
                          <Image
                            src={it.avatar}
                            mode='aspectFill'
                            className='posts-commit__item-info__detail-self__avatar'
                          />
                          <View className='posts-commit__item-info__detail-self__name'>
                            {it.nickname || '#' + it.senderId}
                            {it.beNickname && (
                              <>
                                <View className='arrow-right'></View>
                                {it.beNickname || '#' + it.beSenderId}
                              </>
                            )}
                          </View>
                          <View className='posts-commit__item-info__detail-self__like'>
                            <Image
                              src={it.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                              mode='aspectFit'
                              className='posts-commit__item-info__detail-self__like-icon'
                              onClick={(e) => {
                                e.stopPropagation()
                                this.fetchLikeComment(it, index, idx)
                              }}
                            />
                            {it.fabulous > 0 && (
                              <Text className='posts-commit__item-info__detail-self__like-num'>
                                {it.fabulous}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View className='posts-commit__item-info__detail-self__detail'>
                          {it.context}
                          {it.contextImg && (
                            <Image
                              src={it.contextImg}
                              mode='aspectFit'
                              className='posts-commit__item-info__detail-self__detail-img'
                              onClick={(e) => {
                                e.stopPropagation()
                                this.previewCommentImg(it.contextImg)
                              }}
                            />
                          )}
                        </View>
                      </View>
                    )
                  })}
                {item.total > 1 && (
                  <View
                    className='posts-commit__item-info__more'
                    onClick={(e) => this.handleOpenCommit(e, index)}
                  >
                    {item.hidden ? `展开${item.total}条回复` : '收起'}
                    {item.hidden ? (
                      <View className='at-icon at-icon-chevron-down'></View>
                    ) : (
                      <View className='at-icon at-icon-chevron-up'></View>
                    )}
                    <View className='posts-commit__item-info__more-before'></View>
                  </View>
                )}
              </View>
            </View>
            <View className='posts-commit__item-like'>
              <Image
                src={item.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                mode='aspectFit'
                className='posts-commit__item-icon'
                onClick={(e) => {
                  e.stopPropagation()
                  this.fetchLikeComment(item, index)
                }}
              />
              {item.fabulous > 0 && <Text className='posts-commit__item-num'>{item.fabulous}</Text>}
            </View>
          </View>
        )
      })

    const RankList =
      rankList.length > 0 &&
      rankList.map((item, index) => {
        return (
          <View key={item.id} className='plate-content__item'>
            <Image src={item.avatar} mode='aspectFill' className='plate-content__item-avatar' />
            <View className='plate-content__item-info'>
              {/* <Text className='plate-content__item-btn'>赞赏</Text> */}
              {index === 0 && (
                <Image src={OneIcon} mode='aspectFit' className='plate-content__item-icon' />
              )}
              {index === 1 && (
                <Image src={TwoIcon} mode='aspectFit' className='plate-content__item-icon' />
              )}
              {index === 2 && (
                <Image src={ThreeIcon} mode='aspectFit' className='plate-content__item-icon' />
              )}
              <Text className='plate-content__item-name'>{item.nickname}</Text>
            </View>
          </View>
        )
      })

    return (
      <View className='posts'>
        {/* <View className='posts-tag'>置顶</View> */}
        <View className='content'>
          <View className='posts-user'>
            <View className='posts-user__avatar-con'>
              <Image
                src={avatar}
                mode='aspectFill'
                className='posts-user__avatar'
                onClick={this.onJumpToPerson}
              />
              {identity == 5 && (
                <Image src={TagIcon} mode='aspectFit' className='posts-user__avatar-tag' />
              )}
            </View>

            <View className='posts-user__info'>
              <View className='posts-user__info-title'>
                <Text className='posts-user__info-title__name'>{nickname}</Text>
              </View>
              <View className='posts-user__info-title__date'>
                {sendTimeDate}
                <Text className='posts-user__info-tag__text'>{tagName}</Text>
              </View>
              {/* <View className='posts-user__info-tag'></View> */}
            </View>
            <View className='posts-user__opt'>
              {!isOwn && (
                <View
                  className={`posts-user__btn ${isFollow && 'un__btn'}`}
                  onClick={this.fetchFollow}
                >
                  {isFollow == 6 ? '已关注' : '关注'}
                </View>
              )}
              <Image
                src={OptionIcon}
                mode='aspectFit'
                className='posts-user__opt-icon'
                onClick={this.openOpt}
              />
              {showOpt && (
                <View className='posts-opt__content'>
                  {optNav &&
                    optNav.map((nav) => {
                      if (
                        (nav.needPre || (nav.canOwn && isOwn)) &&
                        (nav.onlyType ? nav.onlyType.includes(this.type) : true)
                      ) {
                        return (
                          <View
                            key={nav.name}
                            className='posts-opt__content-item'
                            onClick={() => this.optHandle(nav.type)}
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
          <View className='posts-content'>
            {content &&
              Array.isArray(content) &&
              content.map((text) => {
                return (
                  <View key={text} className='posts-content-text'>
                    {text}
                  </View>
                )
              })}
          </View>
          {imgList && imgList.length > 0 && (
            <View className={`posts-album ${imgList.length > 1 ? 'more-album' : ''}`}>
              {imgList.map((item, index) => {
                return (
                  <Image
                    src={item}
                    key={item}
                    mode='aspectFill'
                    className='posts-album__img'
                    onClick={(e) => this.previewImg(e, index)}
                  />
                )
              })}
            </View>
          )}
          {showAddress && schoolName.trim() && (
            <View className='posts-address'>
              <Image src={AddressIcon} mode='aspectFit' className='posts-address__icon' />
              {schoolName}
            </View>
          )}
          <View className='posts-bottom'>
            <View className='posts-bottom__right'>
              <View className='posts-bottom__info' onClick={this.openGift}>
                <Image
                  src={appreciateCount > 0 ? GiftIcons : GiftIcon}
                  mode='aspectFit'
                  className='posts-bottom__info-icon'
                />
                {appreciateCount || 0}
              </View>
              <View className='posts-bottom__info' onClick={this.fetchLike}>
                <Image
                  src={isFabulous == 6 ? LikeIcon : UnlikeIcon}
                  mode='aspectFit'
                  className='posts-bottom__info-icon'
                ></Image>
                {fabulous}
              </View>
              <View className='posts-bottom__info'>
                <Image
                  src={CommitIcon}
                  mode='aspectFit'
                  className='posts-bottom__info-icon'
                  onClick={this.handleComment}
                />
                {comment}
              </View>
              <View className='posts-bottom__info'>
                {/* <Button className='posts-bottom__info-share' openType='share'> */}
                <Image
                  src={ShareIcon}
                  mode='aspectFit'
                  className='posts-bottom__info-icon'
                  onClick={() => this.openPopup('share')}
                />
                {/* </Button> */}
              </View>
            </View>
          </View>
        </View>
        {rankList.length > 0 && (
          <View className='plate'>
            <View className='plate-title'>
              <View className='plate-title__name'>赞赏排行榜</View>
              <View className='plate-title__more' onClick={this.onJumpToGift}>
                <View className='plate-title__more-item'>
                  <Text className='green'>{totalMoneys}</Text>
                  <Text>盒盒币</Text>
                </View>
                <View className='plate-title__more-item'>
                  <Text className='green'>{totalPerson}</Text>
                  <Text>人送礼</Text>
                </View>
                <View className='at-icon at-icon-chevron-right'></View>
              </View>
            </View>
            <View className='plate-content'>{RankList}</View>
          </View>
        )}
        <View className='posts-commit'>
          <View className='posts-commit__title'>
            <View className='posts-commit__title-name'>共{commentList.length}条评论</View>
            <View className='posts-commit__title-more' onClick={() => this.openPopup('sort')}>
              {sortName}
              <View className='at-icon at-icon-chevron-down' onClick={this.openScreenPopup}></View>
            </View>
          </View>
          {CommentList}
        </View>
        <GiftPopup
          show={showGift}
          type={this.type}
          postId={this.id}
          onClose={this.closeGift}
          onHandleSendGift={this.handleSendGift}
        />
        <ForumPopup
          showPopup={showPopup}
          type={popupType}
          onSelect={this.handleSelect}
          onClose={this.closePopup}
        />
        {showFocus && (
          <FooterComment
            focus={inpFocus}
            content={commentContext}
            placeholder={placeholder}
            onChange={this.onChangeInp}
            onSubmit={this.fetchComment}
            onSubmitImg={this.fetchCommentImg}
            onBlur={this.handleBlur}
          />
        )}
      </View>
    )
  }
}

export default Posts
