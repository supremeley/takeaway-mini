export default {
  pages: [
    'pages/home/index',
    'pages/center/index',
    'pages/login/index',
    'pages/order/list/index',
    'pages/order/detail/index',
    'pages/order/refund/index',
    'pages/item/list/index',
    'pages/item/detail/index',
    'pages/checkout/index/index',
    'pages/coupon/list/index',
    'pages/event/index'
    // 'pages/coupon/center/index'
    // 'pages/checkout/success/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#47cfca',
    navigationBarTitleText: '吃饭鸭',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    selectedColor: '#47cfca',
    color: '#999',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: './assets/imgs/tar-home.png',
        selectedIconPath: './assets/imgs/tar-home-active.png'
      },
      {
        text: '订单',
        pagePath: 'pages/order/list/index',
        iconPath: './assets/imgs/tar-order.png',
        selectedIconPath: './assets/imgs/tar-order-active.png'
      },
      {
        text: '我的',
        pagePath: 'pages/center/index',
        iconPath: './assets/imgs/tar-center.png',
        selectedIconPath: './assets/imgs/tar-center-active.png'
      }
    ]
  }
}
