import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Swiper, SwiperItem, Picker, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import ShopItem from '@/components/shopItem'

import t1 from '@/assets/imgs/test1.png'
import t2 from '@/assets/imgs/test2.png'
// import navTe from '@/assets/imgs/nav-te.png'
import headerBg from '@/assets/imgs/header-bg.png'
import addressIcon from '@/assets/imgs/address-icon.png'

import api from '@/api'

// import scrollPage from '@/hoc/scrollPage'

import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

// @scrollPage
class Home extends Component {
  state = {
    explainShow: true,
    banner1Data: [
      {
        appId: '',
        appType: 'inApp',
        img: t1,
        name: '123',
        navigateTo: '/pages/home/index'
      },
      {
        appId: '',
        appType: 'h5',
        img: t1,
        name: '123',
        navigateTo: '/pages/home/index',
        h5Path: 'www.baidu.com'
      }
    ],
    banner2Data: [
      {
        appId: 'wx26d93d4c8f8dd72a',
        appType: 'outApp',
        img: t2,
        name: '123',
        navigateTo: '',
        appPath: '/pages/express/express.html?scene_name=代取快递'
      }
    ],
    banner1Show: true,
    banner2Show: true,
    alertData: {
      bgColor: '#fff',
      borderColor: '#000',
      content: '测试文本',
      showAlert: true,
      textColor: '#000'
    },
    navList: [],
    shopList: [],
    areaRange: [[], [], []],
    selectorSchool: '',
    selectorFloor: ''
  }

  async componentDidMount() {
    this.fetchData()
  }

  onShareAppMessage = () => {
    return {
      title: '吃饭鸭',
      path: '/home/index',
      imageUrl: ''
    }
  }

  fetchData = () => {
    this.getAreaList(true)
    this.getBrandList()
  }

  onChange = (e) => {
    // console.log('onChange', e.detail)
    const { areaRange } = this.state
    let [area, school, floor] = e.detail.value
    // console.log(school, floor)
    const selectorSchool = areaRange[1][school].label
    const selectorFloor = areaRange[2][floor].label
    // console.log(selectorSchool)
    this.setState(
      {
        explainShow: false,
        selectorSchool,
        selectorFloor,
        schoolId: areaRange[1][school].value
      },
      () => {
        this.getBrandList()
      }
    )
  }

  onColumnChange = (e) => {
    // console.log('onColumnChange', e.detail)
    const { areaRange } = this.state
    const { column, value } = e.detail

    const sel = areaRange[column][value]

    if (column == 0) {
      this.getSchoolList(sel.value)
    }

    if (column == 1) {
      this.getFloorList(sel.value)
    }
  }

  onJump = (type, url, id, path, h5Path) => () => {
    if (type === 'inApp') {
      Taro.navigateTo({ url })
    }

    if (type === 'outApp') {
      Taro.navigateToMiniProgram({
        appId: id,
        path,
        extraData: {},
        envVersion: 'release',
        success: () => {}
      })
    }

    if (type === 'h5') {
      Taro.navigateTo({ url: `/pages/event/index?src=${h5Path}` })
    }
  }

  onJupmToList = () => {
    Taro.navigateTo({ url: `/pages/item/list/index` })
  }

  onJumpToDetail = (id) => {
    Taro.navigateTo({ url: `/pages/item/detail/index?id=${id}` })
  }

  closeExplainModal = () => {
    this.setState({ explainShow: false })
  }

  openExplainModal = () => {
    this.setState({ explainShow: true })
  }

  getAreaList = async (isFirst) => {
    const {
      data: { items }
    } = await api.home.GET_AREA_LIST()

    const area = items.map((item) => {
      return {
        value: item.id,
        label: item.areaName
      }
    })

    this.setState({ areaRange: [area, [], []] }, () => {
      if (isFirst) this.getSchoolList(area[0].value, true)
    })
  }

  getSchoolList = async (id, isFirst) => {
    const { areaRange } = this.state

    const query = { regionId: id }

    const {
      data: { items }
    } = await api.home.GET_SCHOOL_LIST(query)

    const schools = items.map((item) => {
      return {
        value: item.id,
        label: item.schoolName
      }
    })

    // console.log(schools)

    const [area, school, floor] = areaRange

    // debugger

    this.setState({ areaRange: [area, schools, floor] }, () => {
      if (isFirst) this.getFloorList(schools[0].value)
    })
  }

  getFloorList = async (id) => {
    const { areaRange } = this.state

    const query = { schoolId: id }

    const {
      data: { items }
    } = await api.home.GET_FLOOR_LIST(query)

    const floor = items.map((item) => {
      return {
        value: item.id,
        label: item.buildingNo
      }
    })

    const [area, school] = areaRange

    this.setState({ areaRange: [area, school, floor] })
  }

  getBrandList = async () => {
    const { schoolId } = this.state

    const query = { schoolId, page: 1, size: 10 }

    const {
      data: { brandList, total }
    } = await api.shop.GET_BRAND_LIST(query)

    const navList = brandList.map((item) => {
      return {
        icon: item.picUrl,
        id: item.id,
        title: item.name
      }
    })

    this.setState({ shopList: brandList, navList })
  }

  render() {
    const {
      explainShow,
      areaRange,
      selectorSchool,
      selectorFloor,
      banner1Data,
      banner1Show,
      banner2Data,
      banner2Show,
      alertData,
      navList,
      shopList
    } = this.state

    const SwiperList =
      banner1Show &&
      banner1Data.map((item) => {
        return (
          <SwiperItem key={item.url}>
            <Image
              src={item.img}
              mode='aspectFill'
              className='content-swiper-img'
              onClick={this.onJump(
                item.appType,
                item.navigateTo,
                item.appId,
                item.appPath,
                item.h5Path
              )}
            ></Image>
          </SwiperItem>
        )
      })

    const SwiperList2 =
      banner2Show &&
      banner2Data.map((item) => {
        return (
          <SwiperItem key={item.url}>
            <Image
              src={item.img}
              mode='aspectFill'
              className='content-swiper-img'
              onClick={this.onJump(
                item.appType,
                item.navigateTo,
                item.appId,
                item.appPath,
                item.h5Path
              )}
            ></Image>
          </SwiperItem>
        )
      })

    const Explain =
      alertData && alertData.showAlert ? (
        <View className='content-explain'>
          <View className='content-explain__title'>通知公告</View>
          <View
            style={{ background: alertData.bgColor, color: alertData.textColor }}
            className='content-explain__text'
          >
            <View className='marquee__text'>{alertData.content}</View>
          </View>
        </View>
      ) : null

    const NavList =
      navList &&
      navList.map((item) => {
        return (
          <View key={item.url} className='nav-item' onClick={this.onJumpToDetail}>
            <Image className='nav-icon' src={item.icon}></Image>
            <View className='nav-title'>{item.title}</View>
          </View>
        )
      })

    const ShopList =
      shopList &&
      shopList.map((item) => {
        return <ShopItem info={item} key={item.id} onClick={this.onJumpToDetail} />
      })

    return (
      <View className='index'>
        <View className='header'>
          <Image src={headerBg} mode='widthFix' className='header-bg'></Image>
          <View className='header-container'>
            <View className='header-title'>吃饭鸭</View>
            <Picker
              mode='multiSelector'
              rangeKey='label'
              range={areaRange}
              // value={}
              onChange={this.onChange}
              onColumnChange={this.onColumnChange}
            >
              <View className='header-address'>
                <Image src={addressIcon} mode='widthFix' className='header-address__icon'></Image>
                {selectorFloor && selectorSchool ? (
                  <>
                    <View className='header-address__floor'>{selectorFloor}</View>
                    <View className='header-address__school'>{selectorSchool}</View>
                  </>
                ) : (
                  <View className='header-address__school'>请选择楼宇</View>
                )}
              </View>
            </Picker>
            <View className='header-search' onClick={this.onJupmToList}>
              <View className='at-icon at-icon-search'></View>
              <View>请输入店铺名称</View>
            </View>
          </View>
        </View>
        <View className='content'>
          <Swiper
            className='content-swiper'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            indicatorDots={false}
            circular
            autoplay
          >
            {SwiperList}
          </Swiper>
          <View className='nav-container'>{NavList}</View>
          <Swiper
            className='content-swiper swiper-second'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            indicatorDots={false}
            circular
            autoplay
          >
            {SwiperList2}
          </Swiper>
          {Explain}
          <View className='list-container'>{ShopList}</View>
          <AtModal isOpened={explainShow}>
            <AtModalHeader>提示</AtModalHeader>
            <AtModalContent>
              您还没有选择所在区域，需要您选择区域后，才能为您提供最佳服务
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.closeExplainModal}>暂不选择</Button>
              <Button>
                <Picker
                  mode='multiSelector'
                  rangeKey='label'
                  range={areaRange}
                  // value={}
                  onChange={this.onChange}
                  onColumnChange={this.onColumnChange}
                >
                  <View className='modal-btn'>选择区域</View>
                </Picker>
              </Button>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}

export default Home
