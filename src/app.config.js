export default {
  pages: [
    'pages/home/index',
    'pages/forum/index',
    'pages/center/index',
    'pages/login/index',
    'pages/item/list/index',
    'pages/item/detail/index',
    'pages/checkout/index/index',
    // 'pages/event/index',
    // 'pages/coupon/list/index',
    // 'pages/coupon/center/index',
    // 'pages/integral/index',
    // 'pages/balance/index',
    // 'pages/balance/bill/index',
    // 'pages/order/list/index',
    // 'pages/order/detail/index',
    // 'pages/order/refund/index',

  ],
  subpackages: [
    {
      root: 'pages/balance',
      pages: [
        'detail/index',
        'bill/index',
      ]
    },
    {
      root: 'pages/coupon',
      pages: [
        'list/index',
        'center/index',
      ]
    },
    {
      root: 'pages/order',
      pages: [
        'list/index',
        'detail/index',
        'refund/index',
      ]
    },
    {
      root: 'pages/event',
      pages: [
        'web/index',
        'setting/index',
      ]
    },
    {
      root: 'pages/prove',
      pages: [
        'school/index',
        'guide/index',
        'user/index',
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#47cfca',
    navigationBarTitleText: '吃饭鸭',
    navigationBarTextStyle: 'white',
    backgroundColor: '#47cfca'
  },
  tabBar: {
    selectedColor: '#47cfca',
    color: '#999',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: './assets/imgs/tar-bar/tar-home.png',
        selectedIconPath: './assets/imgs/tar-bar/tar-home-active.png'
      },
      {
        text: '论坛',
        pagePath: 'pages/forum/index',
        iconPath: './assets/imgs/tar-bar/tar-order.png',
        selectedIconPath: './assets/imgs/tar-bar/tar-order-active.png'
      },
      {
        text: '我的',
        pagePath: 'pages/center/index',
        iconPath: './assets/imgs/tar-bar/tar-center.png',
        selectedIconPath: './assets/imgs/tar-bar/tar-center-active.png'
      }
    ]
  }
}
