import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import GiftIcon from '@/assets/imgs/forum/gift.png'
import GiftIcons from '@/assets/imgs/forum/gifts.png'
import UnlikeIcon from '@/assets/imgs/forum/unlike.png'
import LikeIcon from '@/assets/imgs/forum/like.png'
import AddressIcon from '@/assets/imgs/forum/address.png'
import CommitIcon from '@/assets/imgs/forum/commit.png'
import ShareIcon from '@/assets/imgs/forum/share.png'
import OptionIcon from '@/assets/imgs/forum/option.png'
import MediaIcon from '@/assets/imgs/media.png'
import TagIcon from '@/assets/imgs/tag.png'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class PostsItem extends Component {
  defaultProps = {
    info: null,
    type: 'hot',
    showOpt: false,
    onHandleLike: () => {},
    onHandleLikeComment: () => {},
    onHandleMoreComment: () => {},
    onHandleShowOpt: () => {},
    onHandleShowUser: () => {},
    onHandleGift: () => {},
    onHandleComment: () => {},
    onHandleCommentChild: () => {},
    onHandleCommentPosts: () => {},
    onHandleSharePosts: () => {},
    onHandleOpenOpt: () => {},
    onHandleDelete: () => {},
    onHandleTop: () => {},
    onHandleHot: () => {},
    onHandleRefined: () => {},
    onHandleShowMore: () => {}
  }

  state = {
    oriUserId: Taro.getStorageSync('userId'),
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
    ]
  }

  onJumpToDetail = (e) => {
    e.stopPropagation()

    const { type, info } = this.props

    Taro.navigateTo({ url: `/pages/wnh/posts/index?id=${info.postId}&type=${type}` })
  }

  openOpt = (e) => {
    e.stopPropagation()

    const { onHandleShowOpt } = this.props

    onHandleShowOpt && onHandleShowOpt()
  }

  handleOpt = (e, type) => {
    e.stopPropagation()

    switch (type) {
      case 'delete':
        this.onHandleDelete(e)
        break
      case 'top':
        this.onHandleTop(e)
        break
      case 'hot':
        this.onHandleHot(e)
        break
      case 'refined':
        this.onHandleRefined(e)
        break
      default:
        this.openPopup(e, type)
    }
  }

  handleShowMore = (e) => {
    e.stopPropagation()

    const { onHandleShowMore } = this.props

    onHandleShowMore && onHandleShowMore()
  }

  onHandleDelete = (e) => {
    e.stopPropagation()

    const { onHandleDelete } = this.props

    onHandleDelete && onHandleDelete()
  }

  onHandleTop = (e) => {
    e.stopPropagation()

    const { onHandleTop } = this.props

    onHandleTop && onHandleTop()
  }

  onHandleHot = (e) => {
    e.stopPropagation()

    const { onHandleHot } = this.props

    onHandleHot && onHandleHot()
  }

  onHandleRefined = (e) => {
    e.stopPropagation()

    const { onHandleRefined } = this.props

    onHandleRefined && onHandleRefined()
  }

  // closeOpt = () => {
  //   this.setState({ showOpt: false })
  // }

  // handleClick = (e) => {
  //   e.stopPropagation()

  //   const { onHandleClick } = this.props

  //   // this.closeOpt()

  //   onHandleClick && onHandleClick()
  // }

  onHandleLike = (e) => {
    e.stopPropagation()

    const { onHandleLike } = this.props

    onHandleLike && onHandleLike()
  }

  onHandleLikeComment = (e, idx) => {
    e.stopPropagation()

    const { onHandleLikeComment } = this.props

    onHandleLikeComment && onHandleLikeComment(idx)
  }

  onHandleShowUser = (e) => {
    e.stopPropagation()

    const { onHandleShowUser } = this.props

    onHandleShowUser && onHandleShowUser()
  }

  onHandleGift = (e) => {
    e.stopPropagation()

    const { onHandleGift } = this.props

    onHandleGift && onHandleGift()
  }

  onHandleCommentPosts = (e, info) => {
    e.stopPropagation()

    const { onHandleCommentPosts } = this.props

    onHandleCommentPosts && onHandleCommentPosts(info)
  }

  onHandleComment = (e, info) => {
    e.stopPropagation()

    const { onHandleComment } = this.props

    onHandleComment && onHandleComment(info)
  }

  // onHandleCommentChild = (e, info) => {
  //   e.stopPropagation()

  //   const { onHandleCommentChild } = this.props

  //   onHandleCommentChild && onHandleCommentChild(info)
  // }

  openPopup = (e, type) => {
    e.stopPropagation()

    const { onHandleOpenOpt } = this.props

    onHandleOpenOpt && onHandleOpenOpt(type)
  }

  onHandleMoreComment = (e) => {
    // e.stopPropagation()
    // const { onHandleMoreComment } = this.props
    // onHandleMoreComment && onHandleMoreComment()
  }

  previewImg = (e, index) => {
    e.stopPropagation()

    const { imgList } = this.props.info

    Taro.previewImage({
      current: imgList[index],
      urls: imgList
    })
  }

  previewCommentImg = (e, img) => {
    e.stopPropagation()

    Taro.previewImage({
      current: img,
      urls: [img]
    })
  }

  render() {
    const { info, type, showOpt } = this.props

    const { optNav, oriUserId } = this.state

    if (!info) {
      return null
    }

    const {
      avatar,
      nickname,
      sendTimeDate,
      isFabulous,
      canComment,
      comment,
      fabulous,
      context,
      schoolName,
      tagName,
      imgList,
      content,
      commentList,
      commentTotal,
      userId,
      appreciateCount,
      top,
      refining,
      identity,
      showContent,
      contentLength
    } = info

    const isOwn = info.userId == oriUserId

    return (
      <View className='posts-item' onClick={this.onJumpToDetail}>
        <View className='posts-opt'>
          <Image
            src={OptionIcon}
            mode='aspectFit'
            className='posts-opt__icon'
            onClick={this.openOpt}
          />
          {showOpt && (
            <View className='posts-opt__content'>
              {optNav &&
                optNav.map((nav) => {
                  if (
                    (nav.needPre || (nav.canOwn && isOwn)) &&
                    (nav.onlyType ? nav.onlyType.includes(type) : true)
                  ) {
                    return (
                      <View
                        key={nav.name}
                        className='posts-opt__content-item'
                        onClick={(e) => this.handleOpt(e, nav.type)}
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
        <View className='posts-tag'>
          {top === 1 && <View className='posts-tag__text'>置顶</View>}
          {refining === 10 && <View className='posts-tag__text refining-tag'>精</View>}
        </View>
        <View className='posts-top'>
          <View className='posts-avatar-con'>
            <Image
              src={avatar}
              mode='aspectFill'
              className='posts-avatar'
              onClick={this.onHandleShowUser}
            />
            {identity == 5 && <Image src={TagIcon} mode='aspectFit' className='posts-avatar-tag' />}
          </View>
          <View className='posts-right'>
            <View className='posts-user'>
              <View className='posts-user__info'>
                <View className='posts-user__info-title'>
                  <Text className='posts-user__info-title__name'>{nickname || '#' + userId}</Text>
                </View>
                <View className='posts-user__info-title__date'>
                  {sendTimeDate}
                  <Text className='posts-user__info-tag__text'>{tagName}</Text>
                </View>
              </View>
            </View>
            <View className={`posts-content ${showContent && 'show-content'}`}>
              {/* <Text className='posts-user__info-tag__text'>#{tagName}#</Text> */}
              {content &&
                Array.isArray(content) &&
                content.map((text) => {
                  return <View key={text} className='posts-content-tetxt'>{text}</View>
                })}
            </View>

            {contentLength > 6 && (
              <View className='show-more' onClick={this.handleShowMore}>
                {!showContent ? '展开全部' : '收起'}
                {!showContent ? (
                  <View className='at-icon at-icon-chevron-down'></View>
                ) : (
                  <View className='at-icon at-icon-chevron-up'></View>
                )}
              </View>
            )}
            {imgList && imgList.length > 0 && (
              <View className={`posts-album ${imgList.length > 1 ? 'more-album' : ''}`}>
                {imgList.map((item, index) => {
                  return (
                    <Image
                      lazyLoad
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
          </View>
        </View>
        {type === 'hot' && schoolName.trim() && (
          <View className='posts-address'>
            <Image src={AddressIcon} mode='aspectFit' className='posts-address__icon' />
            {schoolName}
          </View>
        )}
        <View className='posts-bottom'>
          <View className='posts-bottom__right'>
            <View className='posts-bottom__info' onClick={this.onHandleGift}>
              <Image
                src={appreciateCount > 0 ? GiftIcons : GiftIcon}
                mode='aspectFit'
                className='posts-bottom__info-icon'
              />
              {appreciateCount || 0}
            </View>
            <View className='posts-bottom__info' onClick={this.onHandleLike}>
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
                onClick={this.onHandleCommentPosts}
              />
              {comment}
            </View>
            <View className='posts-bottom__info'>
              <Image
                src={ShareIcon}
                mode='aspectFit'
                className='posts-bottom__info-icon'
                onClick={(e) => this.openPopup(e, 'share')}
              />
            </View>
          </View>
        </View>
        {commentList.length > 0 && (
          <View className='posts-commit'>
            {commentList.map((item, index) => {
              return (
                <View
                  key={item.id}
                  className='posts-commit__item'
                  onClick={(e) => this.onHandleComment(e, item)}
                >
                  <Image
                    src={item.avatar}
                    mode='aspectFill'
                    className='posts-commit__item-avatar'
                  />
                  <View className='posts-commit__item-info'>
                    <View className='posts-commit__item-info__title'>
                      {item.nickname || '#' + item.senderId}
                      {item.isFather && (
                        <Text className='posts-commit__item-info__title-father'>作者</Text>
                      )}
                      <Text className='posts-commit__item-info__title-data'>
                        {item.commentDate}
                      </Text>
                    </View>
                    <View className='posts-commit__item-info__content'>
                      {item.context}
                      {item.contextImg && (
                        <View
                          className='posts-commit__item-info__content-img'
                          onClick={(e) => this.previewCommentImg(e, item.contextImg)}
                        >
                          <Image
                            src={MediaIcon}
                            mode='aspectFit'
                            className='posts-commit__item-info__content-img__icon'
                          />
                          查看图片
                        </View>
                      )}
                    </View>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map((it) => {
                        return (
                          <>
                            <View
                              key={it.id}
                              className='posts-commit__item-info__detail'
                              onClick={this.onJumpToDetail}
                            >
                              <View className='posts-commit__item-info__detail-top'>
                                <Image
                                  src={it.avatar}
                                  mode='aspectFill'
                                  className='posts-commit__item-info__detail-avatar'
                                />
                                <Text className='posts-commit__item-info__detail-name'>
                                  {it.nickname || '#' + it.senderId}
                                </Text>
                              </View>
                              <View className='posts-commit__item-info__detail-detail'>
                                {it.context}
                                {it.contextImg && (
                                  <View className='posts-commit__item-info__content-img'>
                                    <Image
                                      src={MediaIcon}
                                      mode='aspectFit'
                                      className='posts-commit__item-info__content-img__icon'
                                    />
                                    查看图片
                                  </View>
                                )}
                              </View>
                            </View>
                            {item.total > 1 && (
                              <View
                                className='posts-commit__item-info__more'
                                onClick={this.onJumpToDetail}
                              >
                                展开{item.total}条回复
                                <View className='at-icon at-icon-chevron-down'></View>
                                <View className='posts-commit__item-info__more-before'></View>
                              </View>
                            )}
                          </>
                        )
                      })}
                  </View>
                  <View className='posts-commit__item-like'>
                    {item.id && (
                      <Image
                        src={item.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                        mode='aspectFit'
                        className='posts-commit__item-icon'
                        onClick={(e) => this.onHandleLikeComment(e, index)}
                      />
                    )}
                    <Text className='posts-commit__item-num'>{item.fabulous}</Text>
                  </View>
                </View>
              )
            })}
            {commentTotal > 3 && (
              <View className='posts-commit__more' onClick={this.onJumpToDetail}>
                查看全部评论
                <View className='at-icon at-icon-chevron-down'></View>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}

export default PostsItem
