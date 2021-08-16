import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtCurtain, AtModal } from 'taro-ui'
import Posts from '@/components/posts'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'
import GiftPopup from '@/components/giftPopup'
import UserPopup from '@/components/userPopup'

import api from '@/api'
import D from '@/common'
import withScrollPage from '@/hocs/scrollPage'

import { connect } from 'react-redux'
import { setPostsInfo } from '@/actions/counter'

import ProveIcon from '@/assets/imgs/balance-icon.png'
import SearchIcon from '@/assets/imgs/forum/search.png'
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
        type: 'school',
        name: '本校'
      },
      {
        type: 'hot',
        name: '热门'
      },
      {
        type: 'tree',
        name: '树洞'
      }
    ],
    curTag: null,
    tagList: [
      // {
      //  id: 1
      //  pointNum: 0
      //  tagName: "吐槽"
      //  type: 0
      // },
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
    showOptIndex: null
  }

  componentDidMount() {
    this.fetchData()
    this.getLocation()
    // this.nextPage()
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

  onSelectNav = (index) => () => {
    // this.setState({ curNav: index })
    this.setState({ curNav: index, curTag: null, postsList: [] }, () => {
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

  handleAgree = () => {
    this.setState({ isAgree: !this.state.isAgree })
  }

  onJumpToDetail = (info) => () => {
    const { navOpt, curNav } = this.state

    const type = navOpt[curNav].type

    this.props.setPostsInfo(info)

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
      data: { role, schoolId }
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

    const tagList = data.map((item) => {
      return {
        ...item
      }
    })

    this.setState({ tagList })
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
        resApi = api.forum.GET_HOT_LIST

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

    if (tag) {
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

        let commentList = await this.getCommentList(item.postId)

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

      Taro.hideLoading()

      Taro.stopPullDownRefresh()

      this.setState({ postsList: nList, total })
      return { total }
    } catch (e) {
      console.log(e)
    }
  }

  getCommentList = async (postId) => {
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
      curUser
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
            showAddress={curNav === 1}
            showOpt={showOptIndex === index}
            onHandleLike={this.fetchLike(item, index)}
            onHandleLikeComment={(idx) => this.fetchLikeComment(item, index, idx)}
            onHandleJump={() => this.onJumpToPerson(item.userId)}
            onHandleClick={this.onJumpToDetail(item)}
            onHandleShowOpt={this.onChangeOptIndex(index)}
            onHandleGift={this.openGift(item)}
            onHandleShowUser={this.openUser(item)}
          />
        )
      })

    return (
      <View className='forum'>
        <View className='header'>
          <View className='header-container'>
            <View className='header-title'>万能盒</View>
          </View>
        </View>
        <View className='nav'>
          {Nav}
          <View className='nav-search' onClick={this.onJupmToSearch}>
            <Image src={SearchIcon} className='nav-search__icon' />
            搜索
          </View>
        </View>
        <View className='screen'>
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
        {curNav !== 1 && (
          <Image
            src={ReleaseIcon}
            mode='aspectFill'
            className='release-btn'
            onClick={this.onJupmToRelease}
          />
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
            <Image src={ProveIcon} className='prove-icon' />
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
            <Image src={ProveIcon} className='prove-icon' />
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
            <Image src={ProveIcon} className='prove-icon' />
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
      </View>
    )
  }
}

export default Forum
