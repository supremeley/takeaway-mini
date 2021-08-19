import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import api from '@/api'
import D from '@/common'
// import { connect } from 'react-redux'
import withScrollPage from '@/hocs/scrollPage'

import { popupOpt } from '@/constants/forum'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import UnlikeIcon from '@/assets/imgs/forum/unlike.png'
import LikeIcon from '@/assets/imgs/forum/like.png'
import AddressIcon from '@/assets/imgs/forum/address.png'
import CommitIcon from '@/assets/imgs/forum/commit.png'
import ShareIcon from '@/assets/imgs/forum/share.png'
import OptionIcon from '@/assets/imgs/forum/option.png'

import OneIcon from '@/assets/imgs/forum/one.png'
import TwoIcon from '@/assets/imgs/forum/two.png'
import ThreeIcon from '@/assets/imgs/forum/three.png'

import FooterComment from '@/components/footerComment'
import ForumPopup from '@/components/forumPopup'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

// @connect(({ counter }) => ({
//   info: counter.postsInfo
// }))
@withScrollPage
class Posts extends Component {
  state = {
    userId: Taro.getStorageSync('userId'),
    info: null,
    showAddress: false,
    showOpt: false,
    commentList: [],
    rankList: [],
    commentContext: '',
    inpFocus: false,
    placeholder: '',
    commentQuery: null,
    showPopup: false,
    popupType: 'sort',
    sortOpt: popupOpt.sort,
    curSort: 0,
    curComment: null,
    totalMoneys: 0,
    totalPerson: 0
  }

  componentDidShow() {
    if (this.type !== 'hot') {
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
    return {
      title: '万能盒',
      path: `/pages/wnh/posts/index?id=${this.id}&type=${this.type}`,
      imageUrl: ''
    }
  }

  fetch = async (params) => {
    const { total } = await this.getCommentList(params)

    return { total }
  }

  onJumpToGift = () => {
    Taro.navigateTo({ url: `/pages/wnh/gift/index?id=${this.id}&type=${this.type}` })
  }

  onJumpToPerson = () => {
    Taro.navigateTo({ url: `/pages/wnh/mine/index?id=${this.id}` })
  }

  openOpt = () => {
    this.setState({ showOpt: !this.state.showOpt })
  }

  closeOpt = () => {
    this.setState({ showOpt: false })
  }

  openPopup = (type) => {
    console.log(type)

    this.setState({ showPopup: true, popupType: type })
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  handleOpenItemPopup = (index) => () => {
    const { commentList } = this.state

    this.setState({ curComment: commentList[index] }, () => this.openPopup('normal'))
  }

  handleSelect = (info, index) => {
    console.log(info, index)

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
      case 'delete':
        this.fetchDeleteComment()
        break
      case 'report':
        this.openPopup('report')

        break
    }
  }

  onChangeSort = (index) => {
    this.setState({ curSort: index, commentList: [], showPopup: false }, () => {
      this.resetPage(this.nextPage)
    })
  }

  onChangeInp = (e) => {
    this.setState({ commentContext: e.detail.value })
  }

  handleBlur = (e) => {
    // this.setState({ commentQuery: null, placeholder: '', inpFocus: false })
  }

  previewImg = (e, index) => {
    e.stopPropagation()

    const { imgList } = this.info

    Taro.previewImage({
      current: imgList[index],
      urls: imgList
    })
  }

  handleReply = () => {
    const { userId, curComment } = this.state
    console.log(curComment)

    const commentQuery = {
      id: curComment.id,
      type: 2
    }

    let placeholder = '回复:' + curComment.nickname

    this.setState({
      commentQuery,
      placeholder,
      inpFocus: true,
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

      this.setState({ info: { ...data, content, imgList, sendTimeDate } })
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

      let nList = list.reduce((val, item) => {
        let arr = [],
          chiArr = []

        let commentDate = D.formatTimer(item.commentDate, 'm-d h-m')

        arr.push({
          ...item,
          commentDate
        })

        if (item.children.length) {
          chiArr = item.children.map((chi) => {
            let commentDateC = D.formatTimer(chi.commentDate, 'm-d h-m')

            return {
              ...chi,
              fNickName: item.nickname,
              commentDate: commentDateC,
              isChi: true,
              pid: item.id
            }
          })
        }

        arr.push(...chiArr)

        val.push(...arr)

        return val
      }, [])

      if (showLoading) {
        Taro.hideLoading()
      }

      Taro.stopPullDownRefresh()

      nList = [...commentList, ...nList]

      this.setState({ commentList: nList, total })

      return { total }
    } catch (e) {
      console.log(e)
    }
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
      console.log(e)
    }
  }

  fetchComment = async () => {
    const { commentQuery, userId, commentContext } = this.state

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

      this.setState(
        {
          commentQuery: null,
          curComment: null,
          commentContext: '',
          placeholder: '',
          inpFocus: false,
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

  fetchLike = async (info, index) => {
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

      if (info.isFabulous == 6) {
        pl[index].fabulous--
        pl[index].isFabulous = 0
      } else {
        pl[index].fabulous++
        pl[index].isFabulous = 6
      }

      D.toast(data)

      this.setState({ commentList: pl })
    } catch (e) {}
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
      inpFocus,
      placeholder,
      showPopup,
      popupType,
      sortOpt,
      curSort,
      totalMoneys,
      totalPerson
    } = this.state

    if (!info) {
      return null
    }

    const sortName = sortOpt[curSort].name

    const {
      avatar,
      nickname,
      sendTimeDate,
      canComment,
      // comment,
      fabulous,
      isFabulous,
      context,
      schoolName,
      tagName,
      imgList,
      content
    } = info

    const CommentList =
      commentList.length > 0 &&
      commentList.map((item, index) => {
        return (
          <View
            key={item.id}
            className='posts-commit__item'
            onClick={this.handleOpenItemPopup(index)}
          >
            <Image src={item.avatar} mode='aspectFill' className='posts-commit__item-avatar' />
            <View className='posts-commit__item-info'>
              <View className='posts-commit__item-info__title'>{item.nickname}</View>
              <View className='posts-commit__item-info__content'>{item.commentDate}</View>
              <View className='posts-commit__item-info__detail'>
                {item.isChi && (
                  <>
                    <Text className='posts-commit__item-info__detail-name'>回复</Text>
                    <Text className='green'>{item.fNickName}:</Text>
                  </>
                )}
                <Text className='posts-commit__item-info__detail-detail'>{item.context}</Text>
              </View>
            </View>
            <View className='posts-commit__item-like'>
              <Image
                src={item.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                mode='aspectFit'
                className='posts-commit__item-icon'
                onClick={(e) => {
                  e.stopPropagation()
                  this.fetchLike(item, index)
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
            <Image
              src={avatar}
              mode='aspectFill'
              className='posts-user__avatar'
              onClick={this.onJumpToPerson}
            />
            <View className='posts-user__info'>
              <View className='posts-user__info-title'>
                <Text className='posts-user__info-title__name'>{nickname}</Text>
                <Text className='posts-user__info-title__date'>{sendTimeDate}</Text>
              </View>
              <View className='posts-user__info-tag'></View>
            </View>
            <View className='posts-user__opt'>
              <View className='posts-user__btn'>关注</View>
              <Image
                src={OptionIcon}
                mode='aspectFit'
                className='posts-bottom__opt-icon'
                onClick={this.openOpt}
              />
              {showOpt && (
                <View className='posts-bottom__opt'>
                  <View className='posts-bottom__opt-item' onClick={() => this.openPopup('share')}>
                    分享
                  </View>
                  <View className='posts-bottom__opt-item' onClick={() => this.openPopup('report')}>
                    举报
                  </View>
                </View>
              )}
            </View>
          </View>
          <View className='posts-content'>
            <Text className='posts-user__info-tag__text'>#{tagName}#</Text>
            {content || context}
          </View>
          {imgList && imgList.length > 0 && (
            <View className={`posts-album ${imgList.length > 1 ? 'more-album' : ''}`}>
              {imgList.map((item, index) => {
                return (
                  <Image
                    src={item}
                    key={item}
                    mode={imgList.length > 1 ? 'aspectFill' : 'heightFix'}
                    className='posts-album__img'
                    onClick={(e) => this.previewImg(e, index)}
                  />
                )
              })}
            </View>
          )}
          <View className='posts-bottom'>
            {/* {showAddress ? (
            <View className='posts-bottom__info green'>
              <Image src={AddressIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              {schoolName}
            </View>
          ) : (
            <View className='posts-bottom__info'>
              <Image src={ShareIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              分享
            </View>
          )}
          <View className='posts-bottom__right'>
            <View className='posts-bottom__info'>
              <Image src={GiftIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              赞赏
            </View>
            <View className='posts-bottom__info' onClick={this.onHandleLike}>
              <Image
                src={fabulous ? LikeIcon : UnlikeIcon}
                mode='aspectFit'
                className='posts-bottom__info-icon'
              ></Image>
              {fabulous}
            </View>
            <View className='posts-bottom__info'>
              <Image src={CommitIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              {comment}
            </View>
          </View> */}
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
            <View className='plate-content'>
              {RankList}
              {/* <View className='plate-content__item'>
                <Image src={LikeIcon} mode='aspectFill' className='plate-content__item-avatar' />
                <View className='plate-content__item-info'>
                  <Image src={LikeIcon} mode='aspectFit' className='plate-content__item-icon' />
                  <Text>迷路的</Text>
                </View>
              </View>
              <View className='plate-content__item'>
                <Image src={LikeIcon} mode='aspectFill' className='plate-content__item-avatar' />
                <View className='plate-content__item-info'>
                  <Text className='plate-content__item-btn'>赞赏</Text>
                </View>
              </View> */}
            </View>
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
        <ForumPopup
          showPopup={showPopup}
          type={popupType}
          onSelect={this.handleSelect}
          onClose={this.closePopup}
        />
        <FooterComment
          focus={inpFocus}
          content={commentContext}
          placeholder={placeholder}
          onChange={this.onChangeInp}
          onSubmit={this.fetchComment}
          onBlur={this.handleBlur}
        />
      </View>
    )
  }
}

export default Posts
