import Taro from '@tarojs/taro'
// import qs from 'qs'
import D from '@/common'

class Fetch {
  constructor() {
    // this.baseUrl = 'http://121.36.109.180:8085/wx/'
    this.baseUrl = 'http://1.116.230.160:8085/wx/'
    this.imgbaseUrl = 'http://1.116.230.160:8083/admin/'
    // this.baseUrl = 'http://shop.cn.utools.club/wx/'

    this.header = {
      'Content-Type': 'multipart/form-data'
    }
  }

  main(url, method, data, header = {}) {
    // debugger
    return new Promise((res, rej) => {
      Taro.request({
        url: this.baseUrl + url,
        timeout: 10000,
        data,
        method,
        header: {
          ...header,
          'X-Dts-Token': D.getToken(() => this.main(url, method, data))
        },
        success: (d) => {
          console.log(d)
          if (d.statusCode !== 200) {
            rej(d)
            D.toast(d.data.errmsg)
          } else {
            if (d.data.errno) {
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
        url: this.imgbaseUrl + url,
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

  async get(url, data) {
    return await this.main(url, 'GET', data)
  }

  async post(url, data) {
    return await this.main(url, 'POST', data)
  }
}

export default new Fetch()
