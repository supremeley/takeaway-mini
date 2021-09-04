import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'

// import api from '@/api'

import './index.scss'

class About extends Component {
  state = {}

  async componentDidMount() {}

  render() {
    const {} = this.state

    return (
      <View className='about'>
        <View className='content'>
          <View className='content-title'>关于我们</View>
          <View className='content-desc'>
            “盒盒流浪宝贝计划”是一个由盒盒超级大学倡议发起，在中国各大高校分别落地的关爱流浪动物的爱心计划。我们致力于解决校园流浪动物的饮水、过冬、治疗、绝育等一系列力所能及的事情。希望通过我们的努力，让毛孩子们在校园里陪伴同学们共同成长。
            关于我们的“流浪宝贝计划”爱心资金均由盒盒平台从盈利中划出固定的部分，分配到各校由本校学生组成的，并且获得盒盒认证的爱心公益组织。各校的爱心公益组织将自主的进行资金使用，定期在本校的校内论坛进行资金使用明细公布。目前各校盒盒流浪宝贝组织暂不接受学生捐款，我们会尽我们所及，为流浪动物奉献出更多的爱心！
            <Image
              src='https://eating-1256365647.cos.ap-shanghai.myqcloud.com/5shknb6fpadh6vx8dzh2.jpg'
              mode='widthFix'
              className='page-img'
            />
          </View>
        </View>
      </View>
    )
  }
}

export default About
