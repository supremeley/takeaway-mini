import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'

import GiftIcon from '@/assets/imgs/forum/gift.png'
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
    // onHandleJump: () => {},
    onHandleShowOpt: () => {},
    onHandleShowUser: () => {},
    onHandleGift: () => {}
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
      commentList
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
        <View className='posts-user'>
          <Image
            src={avatar}
            mode='aspectFill'
            className='posts-user__avatar'
            onClick={this.onHandleShowUser}
          />
          <View className='posts-user__info'>
            <View className='posts-user__info-title'>
              <Text className='posts-user__info-title__name'>{nickname}</Text>
              <Text className='posts-user__info-title__date'>{sendTimeDate}</Text>
            </View>
            <View className='posts-user__info-tag'>
              <Text className='posts-user__info-tag__text'>{tagName}</Text>
            </View>
          </View>
        </View>
        <View className='posts-content'>{content || context}</View>
        {imgList && imgList.length > 0 && (
          <View className={`posts-album ${imgList.length > 1 ? 'more-album' : ''}`}>
            {imgList.map((item, index) => {
              return (
                <Image
                  lazyLoad
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
          {showAddress ? (
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
            <View className='posts-bottom__info' onClick={this.onHandleGift}>
              <Image src={GiftIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              赞赏
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
              <Image src={CommitIcon} mode='aspectFit' className='posts-bottom__info-icon' />
              {comment}
            </View>
          </View>
        </View>
        {commentList.length > 0 && (
          <View className='posts-commit'>
            {commentList.map((item, index) => {
              return (
                <View key={item.id} className='posts-commit__item'>
                  <Image
                    src={item.avatar}
                    mode='aspectFill'
                    className='posts-commit__item-avatar'
                  />
                  <View className='posts-commit__item-info'>
                    <View className='posts-commit__item-info__title'>
                      {item.nickname}.{item.commentDate}
                    </View>
                    <View className='posts-commit__item-info__content'>{item.context}</View>
                    {item.children.length > 0 &&
                      item.children.map((it) => {
                        return (
                          <View key={it.id} className='posts-commit__item-info__detail'>
                            {/* <Text className='posts-commit__item-info__detail-tag'>楼主</Text> */}
                            <Text className='posts-commit__item-info__detail-name'>
                              {it.nickname}：
                            </Text>
                            <Text className='posts-commit__item-info__detail-detail'>
                              {it.context}
                            </Text>
                          </View>
                        )
                      })}
                  </View>
                  <Image
                    src={item.isFabulous == 6 ? LikeIcon : UnlikeIcon}
                    mode='aspectFit'
                    className='posts-commit__item-icon'
                    onClick={(e) => this.onHandleLikeComment(e, index)}
                  />
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
