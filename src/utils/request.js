import Taro from '@tarojs/taro'
// import qs from 'qs'
import D from '@/common'

class Fetch {
  constructor() {
    this.baseUrl = 'https://eating.hehezaisheng.com/wx/'
    this.adminUrl = 'https://admin.hehezaisheng.com/admin/'

    // this.baseUrl = 'http://shopwx.cn.utools.club/wx/'
    // this.adminUrl = 'http://shopzz.cn.utools.club/admin/'

    // this.baseUrl = 'http://tianhei.nat300.top/wx/'
    // this.adminUrl = 'http://thmm.nat300.top/admin/'
    // this.shopUrl = 'http://thmm.nat300.top/merchant/'

    this.token = ''
    this.header = {
      'Content-Type': 'multipart/form-data'
    }


  }

  init = async () => {
    this.token = await D.getToken()
  }

  async main(url, method, data, config = {}) {
    let { header = {}, type = 'base', noToken = false, refreshToken = false } = config

    if ((!noToken && !this.token) || refreshToken) {
      await this.init()
    }

    let newUrl = url

    console.log(this.token)

    if (type === 'base') {
      newUrl = this.baseUrl + newUrl
      header = {
        ...header,
        'X-Dts-Token': this.token
      }
    } else {
      newUrl = this.adminUrl + newUrl
      header = {
        ...header,
        'X-Dts-Admin-Token': this.token
      }
    }

    return new Promise((res, rej) => {
      Taro.request({
        url: newUrl,
        timeout: 10000,
        data,
        method,
        header,
        success: (d) => {
          console.log(d)
          if (d.statusCode !== 200) {
            rej(d)
            D.toast(d.data.errmsg)
          } else {
            if (d.data.errno) {
              if (d.data.errno === 501) {
                const cb = D.login(() => this.main(url, method, data, { refreshToken: true }))
                // console.log(cb, 'cb')
                res(cb)
                return
              }
              D.toast(d.data.errmsg)

              res(d.data)
            } else {
              res(d.data)
            }
          }
        },
        fail: (e) => {
          rej(e)
          // D.toast(e.errMsg)
        }
      })
    })
  }

  upload(url, filePath, formData, name = 'file', header = this.header) {
    return new Promise((res, rej) => {
      Taro.uploadFile({
        url: this.adminUrl + url,
        filePath,
        name,
        header: {
          ...header,
          'X-Dts-Token': D.getToken()
        },
        formData,
        success: (d) => {
          if (d.statusCode !== 200) {
            // rej(d)
            // D.toast(d.data.error)
          } else {
            res(d.data)
          }
        },
        fail: (e) => {
          D.toast(e.errMsg)
        }
      })
    })
  }

  async get(url, data, config) {
    return await this.main(url, 'GET', data, config)
  }

  async post(url, data, config) {
    return await this.main(url, 'POST', data, config)
  }
}

export default new Fetch()
