import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'

import 'taro-ui/dist/style/components/icon.scss'
import './index.scss'

class Header extends Component {
  defaultProps = {
    title: null,
    disableArrow: false
  }

  state = {
    safeTop: 0
  }

  componentDidMount() {
    const info = Taro.getMenuButtonBoundingClientRect()

    this.setState({ safeTop: info.top })
  }

  goBack = () => {
    Taro.navigateBack()
  }

  render() {
    const { title, disableArrow } = this.props
    const { safeTop } = this.state

    return (
      <View style={{ top: safeTop + 'px' }} className='header-container'>
        <View className='header-title'>{title}</View>
        {!disableArrow && (
          <View className='at-icon at-icon-chevron-left' onClick={this.goBack}></View>
        )}
      </View>
    )
  }
}

export default Header
