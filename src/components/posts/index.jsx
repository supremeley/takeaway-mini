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

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class PostsItem extends Component {
  defaultProps = {
    info: null,
    showAddress: false,
    showOpt: false,
    onHandleClick: () => {},
    onHandleLike: () => {},
    onHandleLikeComment: () => {},
    onHandleMoreComment: () => {},
    onHandleShowOpt: () => {},
    onHandleShowUser: () => {},
    onHandleGift: () => {},
    onHandleComment: () => {},
    onHandleCommentChild: () => {},
    onHandleCommentPosts: () => {}
  }

  state = {}

  openOpt = (e) => {
    e.stopPropagation()

    const { onHandleShowOpt } = this.props

    onHandleShowOpt && onHandleShowOpt()
  }

  // closeOpt = () => {
  //   this.setState({ showOpt: false })
  // }

  handleClick = () => {
    const { onHandleClick } = this.props

    // this.closeOpt()

    onHandleClick && onHandleClick()
  }

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

  onHandleCommentChild = (e, info) => {
    e.stopPropagation()

    const { onHandleCommentChild } = this.props

    onHandleCommentChild && onHandleCommentChild(info)
  }

  onHandleMoreComment = (e) => {
    // e.stopPropagation()
    // const { onHandleMoreComment } = this.props
    // onHandleMoreComment && onHandleMoreComment()
  }

  // onHandleJump = (e) => {
  //   e.stopPropagation()

  //   const { onHandleJump } = this.props

  //   onHandleJump && onHandleJump()
  // }

  previewImg = (e, index) => {
    e.stopPropagation()

    const { imgList } = this.props.info

    Taro.previewImage({
      current: imgList[index],
      urls: imgList
    })
  }

  render() {
    const { info, showAddress, showOpt } = this.props

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
      userId,
      appreciateCount
    } = info

    return (
      <View className='posts-item' onClick={this.handleClick}>
        <View className='posts-opt'>
          <Image
            src={OptionIcon}
            mode='aspectFit'
            className='posts-opt__icon'
            onClick={this.openOpt}
          />
          {showOpt && (
            <View className='posts-opt__content'>
              <View className='posts-opt__content-item'>分享</View>
              <View className='posts-opt__content-item'>删除</View>
              <View className='posts-opt__content-item'>举报</View>
            </View>
          )}
        </View>
        {/* <View className='posts-tag'>置顶</View> */}
        <View className='posts-top'>
          <Image
            src={avatar}
            mode='aspectFill'
            className='posts-avatar'
            onClick={this.onHandleShowUser}
          />
          <View className='posts-right'>
            <View className='posts-user'>
              <View className='posts-user__info'>
                <View className='posts-user__info-title'>
                  <Text className='posts-user__info-title__name'>{nickname || '#' + userId}</Text>
                  <Text className='posts-user__info-title__date'>{sendTimeDate}</Text>
                </View>
                {/* <View className='posts-user__info-tag'>
                </View> */}
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
        {showAddress && (
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
              <Image src={ShareIcon} mode='aspectFit' className='posts-bottom__info-icon' />
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
                    <View className='posts-commit__item-info__content'>{item.context}</View>
                    {item.children.length > 0 &&
                      item.children.map((it) => {
                        return (
                          <View
                            key={it.id}
                            className='posts-commit__item-info__detail'
                            onClick={(e) => this.onHandleCommentChild(e, it)}
                          >
                            <View className='posts-commit__item-info__detail-top'>
                              <Image
                                src={it.avatar}
                                mode='aspectFill'
                                className='posts-commit__item-info__detail-avatar'
                              />
                              <Text className='posts-commit__item-info__detail-name'>
                                {it.nickname || '#' + it.senderId}：
                              </Text>
                            </View>
                            <View className='posts-commit__item-info__detail-detail'>
                              {it.context}
                            </View>
                          </View>
                        )
                      })}
                  </View>
                  <View className='posts-commit__item-like'>
                    <Image
                      src={item.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                      mode='aspectFit'
                      className='posts-commit__item-icon'
                      onClick={(e) => this.onHandleLikeComment(e, index)}
                    />
                    <Text className='posts-commit__item-num'>{item.fabulous}</Text>
                  </View>
                </View>
              )
            })}
            {commentList.length > 3 && (
              <View className='posts-commit__more' onClick={this.onHandleMoreComment}>
                更多
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
