import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Image } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'
import Posts from '@/components/posts'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import GiftPopup from '@/components/giftPopup'
import UserPopup from '@/components/userPopup'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import SearchIcon from '@/assets/imgs/forum/search.png'

import 'taro-ui/dist/style/components/curtain.scss'
import './index.scss'

class Search extends Component {
  state = {
    userId: Taro.getStorageSync('userId'),
    showGift: false,
    showUser: false,
    keywords: '',
    total: 0,
    tagList: [],
    postsList: [],
    giftList: [],
    curGift: 0,
    curUser: null,
    curPosts: null,
    giftGif: '',
    showGiftGif: false,
    showOptIndex: null
  }

  componentDidMount() {
    // this.getGiftlist()
  }

  componentDidShow() {
    const tagList = Taro.getStorageSync('searchPostsList')

    this.setState({ tagList })
  }

  // 下拉加载
  onReachBottom = () => {
    const { pageParams } = this.state
    // debugger
    !pageParams.isLoading && pageParams.hasNext && this.nextPage()
  }

  fetch = async (params) => {
    const { total } = await this.getPostsList(params)

    return { total }
  }

  openUser = (info) => () => {
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

  onChangeOptIndex = (index) => () => {
    const { showOptIndex } = this.state

    if (showOptIndex === index) {
      this.setState({ showOptIndex: null })
    } else {
      this.setState({ showOptIndex: index })
    }
  }

  onSelectHandle = (e) => () => {
    this.setState({ keywords: e, postsList: [] }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onChange = (e) => {
    this.setState({ keywords: e.detail.value })
  }

  onConfirm = () => {
    const { keywords } = this.state

    let tagList = Taro.getStorageSync('searchPostsList') || []

    tagList.push(keywords)

    Taro.setStorageSync('searchPostsList', tagList)

    this.setState({ tagList, keywords }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onJumpToDetail = (id) => () => {
    // return
    console.log(this.type)
    Taro.navigateTo({ url: `/pages/item/detail/index?id=${id}&type=${this.type}` })
  }

  onJumpToPerson = (id) => {
    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${id}` })
  }

  onJumpToChat = (id) => {
    Taro.navigateTo({ url: `/pages/wnh/chat/index?id=${id}` })
  }

  clearTag = () => {
    const tagList = []
    Taro.setStorageSync('searchPostsList', tagList)
    this.setState({ tagList, keywords: '' }, () => {
      this.resetPage(this.nextPage)
    })
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

  getPostsList = async (params) => {
    const { userId, keywords, postsList } = this.state

    const schoolId = Taro.getStorageSync('schoolId')

    let resApi,
      query = {
        ...params,
        userId,
        search: keywords
      }

    switch (this.type) {
      case 'school':
        resApi = api.forum.GET_HOT_LIST

        query.schoolId = schoolId

        break
      case 'hot':
        resApi = api.forum.GET_HOT_LIST
        break
      case 'tree':
        resApi = api.forum.GET_TREE_LIST

        // query.schoolId = proveSchool.schoolId

        break
      default:
        resApi = api.forum.GET_HOT_LIST
        break
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

        const info = {
          ...item,
          sendTimeDate,
          imgList,
          content,
          commentList,
          commentTotal
        }

        return info
      })

      nList = await Promise.all(nList)
      console.log(nList)
      nList = [...postsList, ...nList]

      Taro.hideLoading()

      // Taro.stopPullDownRefresh()

      this.setState({ postsList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  // getCommentList = async (postId) => {
  //   const { userId } = this.state

  //   let resApi,
  //     query = {
  //       limit: 3,
  //       page: 1,
  //       userId,
  //       postId
  //     }

  //   switch (this.id) {
  //     case 'tree':
  //       resApi = api.forum.GET_COMMENT_TREE_POSTS
  //       break
  //     case 'hot':
  //     case 'school':
  //     default:
  //       resApi = api.forum.GET_COMMENT_HOT_POSTS
  //       break
  //   }

  //   try {
  //     const {
  //       data: { list }
  //     } = await resApi(query)

  //     let nList = list.map((item) => {
  //       let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

  //       let children = item.children.map((it) => {
  //         let commentDateC = D.formatTimer(it.commentDate, 'm-d h-m')

  //         return {
  //           ...it,
  //           commentDate: commentDateC
  //         }
  //       })

  //       return {
  //         ...item,
  //         commentDate,
  //         children: children.slice(0, 3)
  //       }
  //     })

  //     return nList
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // getGiftlist = async () => {
  //   const { data } = await api.forum.GET_GIFT_LIST()

  //   const giftList = data.map((item) => {
  //     return {
  //       ...item
  //     }
  //   })

  //   this.setState({ giftList })
  // }

  getCommentList = async (postId, pId) => {
    // console.log(pId)
    const { userId } = this.state

    // const type = navOpt[curNav].type

    let resApi,
      query = {
        limit: 3,
        page: 1,
        userId,
        postId
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

  fetchLike = (info, index) => async () => {
    const { userId, postsList } = this.state

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
    const { userId, postsList } = this.state

    let resApi

    let comment = posts.commentList[idx]

    const query = {
      id: comment.id,
      senderId: userId,
      postId: posts.postId
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

      let pl = postsList.concat()

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

  get type() {
    return this.route.params.type
  }

  get route() {
    return getCurrentInstance().router
  }

  render() {
    const {
      total,
      pageParams,
      keywords,
      tagList,
      postsList,
      showOptIndex,
      showGift,
      showUser,
      curUser,
      curGift,
      giftGif,
      giftList,
      showGiftGif
    } = this.state

    const PostsList =
      postsList &&
      postsList.map((item, index) => {
        return (
          <Posts
            key={item.postId}
            info={item}
            type={this.type}
            showAddress={this.type === 'hot'}
            showOpt={showOptIndex === index}
            // onHandleLike={this.fetchLike(item, index)}
            // onHandleLikeComment={(idx) => this.fetchLikeComment(item, index, idx)}
            // onHandleJump={() => this.onJumpToPerson(item.userId)}
            onHandleClick={this.onJumpToDetail(item)}
            // onHandleShowOpt={this.onChangeOptIndex(index)}
            // onHandleGift={this.openGift(item)}
            // onHandleShowUser={this.openUser(item)}
          />
        )
      })

    return (
      <View className='forum-search'>
        <View className='search-container'>
          <Image src={SearchIcon} className='search-icon' />
          <Input
            value={keywords}
            type='text'
            placeholder='东京奥运会'
            className='search-inp'
            onInput={this.onChange}
            onConfirm={this.onConfirm}
          />
        </View>
        <View className='plate'>
          <View className='plate-title'>搜索历史</View>
          {tagList.length > 0 && (
            <View className='tag-container'>
              <View className='tag'>
                {tagList &&
                  tagList.map((item) => {
                    return (
                      <View key={item} className='tag-item' onClick={this.onSelectHandle(item)}>
                        {item}
                      </View>
                    )
                  })}
              </View>
              <View className='tag-btn' onClick={this.clearTag}>
                清空
              </View>
            </View>
          )}
        </View>
        <View className='goods-container'>
          {PostsList}
          {total > 0 && !pageParams.isLoading && !pageParams.hasNext && <BottomText />}
          {!total && !pageParams.isLoading && !pageParams.hasNext && <Default />}
        </View>
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
      </View>
    )
  }
}

export default withScrollPage(Search)
