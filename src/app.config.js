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
    'pages/event/index',
    'pages/coupon/center/index',
    'pages/integral/index',
    //////////////////////
    // 'pages/manager/order/list/index',
    // 'pages/manager/order/detail/index',
    // 'pages/manager/order/apply/index',
    // 'pages/manager/center/index',
    // 'pages/manager/finance/index/index',
    // 'pages/manager/finance/record/index',
    // 'pages/manager/finance/detail/index',
    // 'pages/manager/statistics/index/index',
    // 'pages/manager/statistics/revenue/index',
    // 'pages/manager/statistics/goods/index',
    // 'pages/manager/statistics/account/index',
    // 'pages/manager/statistics/accountDetail/index',
    // 'pages/manager/print/index/index',
    // 'pages/manager/print/setting/index',
    // // 'pages/manager/print/batch/index',
    // // 'pages/manager/manager/index',
    // 'pages/manager/member/index',
    // // 'pages/manager/message/index',
    // 'pages/manager/login/index'
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
