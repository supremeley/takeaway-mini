import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button, Picker } from '@tarojs/components'

import api from '@/api'
import D from '@/common'

import { connect } from 'react-redux'
import { setProveInfo } from '@/actions/counter'

import 'taro-ui/dist/style/components/icon.scss'

import ProveHeader from '../components/header'

import './index.scss'

@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    setProveInfo: (info) => dispatch(setProveInfo(info))
  })
)
class ProveSchool extends Component {
  state = {
    areaRange: [[]],
    selectorSchool: '',
    schoolId: '',
    identity: ['学生'],
    curIdentity: '',
    ruxueTime: '',
    locationInfo: null,
    current: 0,
    yearRange: [
      '2000',
      '2001',
      '2002',
      '2003',
      '2004',
      '2005',
      '2006',
      '2007',
      '2008',
      '2009',
      '2010',
      '2011',
      '2012',
      '2013',
      '2014',
      '2015',
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023',
      '2024',
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030'
    ]
  }

  componentDidShow() {
    // this.getAreaList(true)
    this.getLocation()

    this.handleYear()
  }

  handleYear = () => {
    const { yearRange } = this.state

    const y = new Date().getFullYear()

    const index = yearRange.findIndex((item) => item == y)

    this.setState({ current: index })
  }

  onChange = (e) => {
    const { areaRange } = this.state

    let { value } = e.detail

    const selectorSchool = areaRange[value]

    this.setState({
      selectorSchool: selectorSchool.label,
      schoolId: selectorSchool.value
    })
  }

  onChangeIdentity = (e) => {
    const { identity } = this.state

    const ci = identity[e.detail.value]

    this.setState({ curIdentity: ci })
  }

  onDateChange = (e) => {
    const { yearRange } = this.state

    let { value } = e.detail

    this.setState({ ruxueTime: yearRange[value], current: value })
  }

  fetchVali = () => {
    const { schoolId, ruxueTime, curIdentity } = this.state

    if (!schoolId) {
      D.toast('请选择学校')
      return false
    }

    if (!curIdentity) {
      D.toast('请选择身份')
      return false
    }

    if (!ruxueTime) {
      D.toast('请选择入学年份')
      return false
    }

    return true
  }

  getLocation = () => {
    const locationInfo = Taro.getStorageSync('locationInfo')

    if (locationInfo) {
      this.setState({ locationInfo }, () => this.getSchoolList())
    }
  }

  getSchoolList = async () => {
    const {
      locationInfo: { longitude: longi, latitude: lanti }
    } = this.state

    const query = { longi, lanti }

    const {
      data: { items }
    } = await api.forum.GET_SCHOOL_LIST(query)

    const schools = items
      .filter((item) => !item.deleted)
      .map((item) => {
        return {
          value: item.id,
          label: item.schoolName
        }
      })

    // const [area, school] = areaRange
    // console.log(schools)

    this.setState({ areaRange: schools })
  }

  nextStep = () => {
    if (!this.fetchVali()) {
      return
    }

    const { schoolId, selectorSchool, ruxueTime, curIdentity } = this.state

    const proveSchool = {
      schoolName: selectorSchool,
      schoolId
    }

    Taro.setStorageSync('proveSchool', proveSchool)

    Taro.setStorageSync('schoolId', schoolId)

    this.props.setProveInfo({ auSchool: schoolId, ruxueTime, identity: curIdentity })

    Taro.navigateTo({ url: `/pages/prove/guide/index` })
  }

  render() {
    const { current, areaRange, yearRange, selectorSchool, identity, curIdentity, ruxueTime } =
      this.state

    // const { nickName, avatarUrl } = userInfo

    return (
      <View className='prove'>
        <ProveHeader />
        <View className='content'>
          <View className='content-opt'>
            <View className='content-opt__item'>
              <Text className='content-opt__item-title'>认证学校</Text>
              <Picker
                mode='selector'
                rangeKey='label'
                range={areaRange}
                onChange={this.onChange}
                // onColumnChange={this.onColumnChange}
              >
                <View className='content-opt__item-inp'>
                  {selectorSchool || '请选择学校'}
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              </Picker>
            </View>
            <View className='content-opt__item'>
              <Text className='content-opt__item-title'>认证身份</Text>
              <Picker mode='selector' range={identity} onChange={this.onChangeIdentity}>
                <View className='content-opt__item-inp'>
                  {curIdentity || '请选择身份'}
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              </Picker>
            </View>
            <View className='content-opt__item'>
              <Text className='content-opt__item-title'>入学年份</Text>
              <Picker
                mode='selector'
                value={current}
                range={yearRange}
                onChange={this.onDateChange}
              >
                <View className='content-opt__item-inp'>
                  {ruxueTime || '请选择入学年份'}
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              </Picker>
            </View>
          </View>
          <View className='content-explain'>*请认真选择自己真实的母校，一经认证不可修改！</View>
        </View>
        <Button className='page-btn' onClick={this.nextStep}>
          下一步
        </Button>
      </View>
    )
  }
}

export default ProveSchool
