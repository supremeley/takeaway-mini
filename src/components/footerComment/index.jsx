import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Image, Button } from '@tarojs/components'

import PhotoIcon from '@/assets/imgs/photo.png'
import './index.scss'

class FooterComment extends Component {
  defaultProps = {
    focus: false,
    content: '',
    placeholder: '',
    onChange: () => {},
    onSubmit: () => {},
    onSubmitImg: () => {},
    onBlur: () => {}
  }

  handleChange = (e) => {
    const { onChange } = this.props

    onChange && onChange(e)
  }

  handleSubmit = (e) => {
    const { onSubmit } = this.props

    onSubmit && onSubmit(e)
  }

  handleBlur = (e) => {
    const { onBlur } = this.props

    onBlur && onBlur(e)
  }

  upLoadImg = async () => {
    const { onSubmitImg } = this.props

    const {tempFiles} = await Taro.chooseImage({ count: 1 })

    // console.log(res)

    onSubmitImg && onSubmitImg(tempFiles[0].path)
  }

  render() {
    const { focus, content, placeholder } = this.props

    return (
      <View className='comment-footer'>
        <Image
          src={PhotoIcon}
          mode='aspectFit'
          className='comment-footer__upimg'
          onClick={this.upLoadImg}
        />
        <Input
          focus={focus}
          value={content}
          placeholder={placeholder}
          className='comment-footer__inp'
          onInput={this.handleChange}
          onBlur={this.handleBlur}
          maxlength={500}
        />
        <Button className='comment-footer__btn' onClick={this.handleSubmit}>
          发送
        </Button>
      </View>
    )
  }
}

export default FooterComment
