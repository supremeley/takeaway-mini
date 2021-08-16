import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Button } from '@tarojs/components'

import './index.scss'

class FooterComment extends Component {
  defaultProps = {
    focus: false,
    content: '',
    placeholder: '',
    onChange: () => {},
    onSubmit: () => {},
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

  render() {
    const { focus, content, placeholder } = this.props

    return (
      <View className='comment-footer'>
        <Input
          focus={focus}
          value={content}
          placeholder={placeholder}
          className='comment-footer__inp'
          onInput={this.handleChange}
          onBlur={this.handleBlur}
        />
        <Button className='comment-footer__btn' onClick={this.handleSubmit}>
          发送
        </Button>
      </View>
    )
  }
}

export default FooterComment
