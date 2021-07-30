import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Swiper, SwiperItem, Picker, Button } from '@tarojs/components'
import { AtModal, AtCurtain, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import ShopItem from '@/components/shopItem'
import Default from '@/components/default'
import BottomText from '@/components/bottomText'

import headerBg from '@/assets/imgs/header-bg.png'
import addressIcon from '@/assets/imgs/address-icon.png'
import noticeIcon from '@/assets/imgs/notice-icon.png'

import api from '@/api'

import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/curtain.scss'
import 'taro-ui/dist/style/components/modal.scss'
import './index.scss'

// @scrollPage
class Home extends Component {
  state = {
    explainShow: false,
    explainType: null,
    schoolId: '',
    banner1Data: [
      // {
      //   appId: '',
      //   appType: 'inApp',
      //   img: t1,
      //   name: '123',
      //   navigateTo: '/pages/home/index'
      // },
      // {
      //   appId: '',
      //   appType: 'h5',
      //   img: t1,
      //   name: '123',
      //   navigateTo: '/pages/home/index',
      //   h5Path: 'www.baidu.com'
      // }
    ],
    banner2Data: [
      // {
      //   appId: 'wx26d93d4c8f8dd72a',
      //   appType: 'outApp',
      //   img: t2,
      //   name: '123',
      //   navigateTo: '',
      //   appPath: '/pages/express/express.html?scene_name=代取快递'
      // }
    ],
    banner1Show: true,
    banner2Show: true,
    alertData: {
      // bgColor: '#fff',
      // borderColor: '#000',
      content: '',
      showAlert: true
      // textColor: '#000'
    },
    modalShow: false,
    modalData: [],
    navList: [],
    shopList: [],
    areaRange: [[], [], []],
    selectorSchool: '',
    selectorFloor: ''
  }

  async componentDidMount() {
    const locInfo = Taro.getStorageSync('locInfo')

    if (!locInfo) {
      this.fetchData()

      this.setState({ explainShow: true })
    } else {
      const selectorSchool = locInfo.school.label
      const selectorFloor = locInfo.floor.label

      this.setState({ selectorSchool, selectorFloor, schoolId: locInfo.school.value }, () => {
        this.fetchData(locInfo)
      })
    }
  }

  onShareAppMessage = () => {
    return {
      title: '吃饭鸭',
      path: '/pages/home/index',
      imageUrl: ''
    }
  }

  fetchData = async (locInfo) => {
    await this.getHomeIndex()
    await this.getHomeBanner()
    await this.getAreaList(true, locInfo)
    // await this.getBrandList()
  }

  bannerHandle = (banner, type) => {
    // console.log(banner)
    const { schoolId } = this.state

    let bannerList = []

    if (!schoolId) {
      bannerList = banner.filter((item) => !item.schoolType)
    } else {
      bannerList = banner.filter((item) => {
        // console.log(item.schoolList)
        return !item.schoolType || (item.schoolList && item.schoolList.find((it) => it == schoolId))
      })
    }

    bannerList = bannerList.map((item, index) => {
      return { ...item, isShow: type === 'popup' && !index }
    })

    return bannerList
  }

  onChange = (e) => {
    // console.log('onChange', e.detail)
    const { areaRange } = this.state
    let [area, school, floor] = e.detail.value
    // console.log(school, floor)
    const selectorSchool = areaRange[1][school].label
    const selectorFloor = areaRange[2][floor].label
    // console.log(selectorSchool)
    const locInfo = {
      area: areaRange[0][area],
      school: areaRange[1][school],
      floor: areaRange[2][floor]
    }

    // console.log(locInfo)
    Taro.setStorageSync('locInfo', locInfo)

    this.setState(
      {
        explainShow: false,
        selectorSchool,
        selectorFloor,
        schoolId: areaRange[1][school].value
      },
      () => {
        this.getHomeIndex()
        this.getHomeBanner()
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

    // console.log(type, url, id, path, h5Path)
    if (type === 'h5') {
      Taro.navigateTo({ url: `/pages/event/index?src=${h5Path}` })
    }
  }

  onJupmToList = () => {
    const { schoolId } = this.state

    Taro.navigateTo({ url: `/pages/item/list/index?=schoolId=${schoolId}` })
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

  closeModal = (index) => () => {
    let { modalData } = this.state
    let nMD = modalData.concat()

    nMD[index].isShow = false

    if (index !== modalData.length - 1) {
      nMD[index + 1].isShow = true
    }

    this.setState({ modalData: nMD })
  }

  getHomeIndex = async () => {
    const { schoolId } = this.state

    const query = { schoolId }

    const {
      data: { brandGoodsList = [] }
    } = await api.home.GET_HOME_INDEX(query)

    const navList = brandGoodsList.map((item) => {
      return {
        ...item.merchant
      }
    })
    // debugger
    this.setState({ shopList: brandGoodsList, navList })
  }

  getHomeBanner = async () => {
    const { data } = await api.home.GET_HOME_BANNER()
    // const { data } = await api.home.GET_HOME_INDEX()
    // GET_HOME_INDEX

    if (data) {
      let { banner1Data, banner2Data, banner1Show, banner2Show, alertData, modalShow, modalData } =
        JSON.parse(data)
      // let res = data
      // console.log(banner1Data, banner2Data)
      // console.log(alertData)
      this.setState({
        banner1Data: this.bannerHandle(banner1Data),
        banner2Data: this.bannerHandle(banner2Data),
        banner1Show,
        banner2Show,
        modalShow,
        modalData: this.bannerHandle(modalData, 'popup'),
        alertData
      })
    }

    // console.log(this.bannerHandle(modalData, 'popup'))

    // const navList = brandList.map((item) => {
    //   return {
    //     icon: item.picUrl,
    //     id: item.id,
    //     title: item.name
    //   }
    // })

    // this.setState({ shopList: brandList, navList })
  }

  getAreaList = async (isFirst, locInfo) => {
    // console.log(locInfo)
    const {
      data: { items }
    } = await api.home.GET_AREA_LIST()

    const area = items.map((item) => {
      return {
        value: item.id,
        label: item.areaName
      }
    })

    if (area.length) {
      let isCon = true

      if (locInfo) {
        const aId = locInfo.area.value

        const res = area.find((item) => item.value === aId)

        if (!res) {
          this.setState({ explainShow: true, explainType: 'area' })

          isCon = false
        }
      }

      this.setState({ areaRange: [area, [], []] }, () => {
        if (isFirst) {
          this.getSchoolList(area[0].value, true, locInfo, isCon)
        }
      })
    }
  }

  getSchoolList = async (id, isFirst, locInfo, isCon) => {
    const { areaRange } = this.state

    const query = { areaId: id }

    const {
      data: { items }
    } = await api.home.GET_SCHOOL_LIST(query)

    const schools = items.map((item) => {
      return {
        value: item.id,
        label: item.schoolName
      }
    })

    if (schools.length) {
      if (locInfo && isCon) {
        const sId = locInfo.school.value

        const res = schools.find((item) => item.value === sId)

        if (!res) {
          this.setState({ explainShow: true, explainType: 'school' })

          isCon = false
        }
      }

      const [area, school, floor] = areaRange

      this.setState({ areaRange: [area, schools, floor] }, () => {
        if (isFirst) {
          this.getFloorList(schools[0].value, locInfo, isCon)

          if (!this.state.schoolId) {
            this.setState({ schoolId: schools[0].value })
          }
        }
      })
    }
  }

  getFloorList = async (id, locInfo, isCon) => {
    const { areaRange } = this.state

    const query = { schoolId: id, page: 1, limit: 9999 }

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

    if (locInfo && isCon) {
      const fId = locInfo.floor.value

      const res = floor.find((item) => item.value === fId)

      if (!res) {
        this.setState({ explainShow: true, explainType: 'floor' })
      }
    }

    this.setState({ areaRange: [area, school, floor] })
    // if (floor.length) {
    //   const [area, school] = areaRange

    //   this.setState({ areaRange: [area, school, floor] })
    // }
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
      explainType,
      areaRange,
      selectorSchool,
      selectorFloor,
      banner1Data,
      banner1Show,
      banner2Data,
      banner2Show,
      alertData,
      modalShow,
      modalData,
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

    const Explain = alertData && alertData.showAlert && (
      <View className='content-explain'>
        {/* <View className='content-explain__title'>通知公告</View> */}
        <Image className='content-explain__icon' mode='aspectFill' src={noticeIcon}></Image>

        <View
          // style={{ background: alertData.bgColor, color: alertData.textColor }}
          className='content-explain__text'
        >
          <View className='marquee__text'>{alertData.content}</View>
        </View>
      </View>
    )

    const NavList =
      navList.length > 0 &&
      navList.map((item) => {
        return (
          <View key={item.url} className='nav-item' onClick={() => this.onJumpToDetail(item.id)}>
            <Image className='nav-icon' mode='aspectFill' src={item.iconUrl}></Image>
            <View className='nav-title'>{item.name}</View>
          </View>
        )
      })

    const ShopList =
      shopList.length > 0 &&
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
          {banner1Data.length > 0 && banner1Show && (
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
          )}
          <View className='nav-container'>{NavList}</View>
          {banner2Data.length > 0 && banner2Show && (
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
          )}
          {Explain}
          <View className='list-container'>
            {ShopList}
            {shopList.length > 0 && <BottomText />}
            {!shopList.length && <Default msg='敬请期待' />}
          </View>
        </View>
        <AtModal isOpened={explainShow}>
          <AtModalHeader>提示</AtModalHeader>
          <AtModalContent>
            {explainType === 'area' && '所在大学城暂停服务，是否选择新的大学城'}
            {explainType === 'school' && '所在学校暂停服务，是否选择新的学校'}
            {explainType === 'floor' && '所在楼宇暂停服务，是否选择新的楼宇'}
            {!explainType && '您还没有选择所在大学城，需要您选择大学城后，才能为您提供最佳服务'}
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
                <View className='modal-btn'>选择大学城</View>
              </Picker>
            </Button>
          </AtModalAction>
        </AtModal>
        {modalShow &&
          modalData.length > 0 &&
          modalData.map((item, index) => {
            return (
              <AtCurtain key={item.url} isOpened={item.isShow} onClose={this.closeModal(index)}>
                <View
                  className='modal'
                  onClick={this.onJump(
                    item.appType,
                    item.navigateTo,
                    item.appId,
                    item.appPath,
                    item.h5Path
                  )}
                >
                  <Image src={item.img} mode='widthFix' className='modal-img'></Image>
                </View>
              </AtCurtain>
            )
          })}
      </View>
    )
  }
}

export default Home
