export default {
  pages: [
    'pages/forum/index',
    'pages/home/index',
    'pages/center/index',
    'pages/errands/index',
    'pages/login/index',
  ],
  subpackages: [
    {
      root: 'pages/item',
      pages: [
        'list/index',
        'detail/index',
      ]
    },
    {
      root: 'pages/balance',
      pages: [
        'detail/index',
        'bill/index',
      ]
    },
    {
      root: 'pages/integral',
      pages: [
        'index',
        'recharge/index',
        'withdrawal/index',
        'exchange/index',
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
      root: 'pages/checkout',
      pages: [
        'index/index',
      ]
    },
    {
      root: 'pages/event',
      pages: [
        'web/index',
        'setting/index',
        'cooperation/index',
        'settled/index',
        'join/index',
        'guide/index',
      ]
    },
    {
      root: 'pages/prove',
      pages: [
        'school/index',
        'guide/index',
        'user/index',
      ]
    },
    {
      root: 'pages/fund',
      pages: [
        'about/index',
        'school/index',
        'mine/index',
      ]
    },
    {
      root: 'pages/pt',
      pages: [
        'release/index',
      ]
    },
    {
      root: 'pages/wnh',
      pages: [
        'agreement/index',
        'search/index',
        'mine/index',
        'mine/editor/index',
        'posts/index',
        'release/index',
        'ranking/index',
        'comment/index',
        'like/index',
        'follow/index',
        'person/index',
        'all/index',
        'vote/index',
        'chat/index',
        'blacklist/index',
        'account/index',
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
        text: '论坛',
        pagePath: 'pages/forum/index',
        iconPath: './assets/imgs/tab-bar/forum.png',
        selectedIconPath: './assets/imgs/tab-bar/forum-active.png'
      },
      {
        text: '早餐',
        pagePath: 'pages/home/index',
        iconPath: './assets/imgs/tab-bar/home.png',
        selectedIconPath: './assets/imgs/tab-bar/home-active.png'
      },
      {
        text: '跑腿',
        pagePath: 'pages/errands/index',
        iconPath: './assets/imgs/tab-bar/test.png',
        selectedIconPath: './assets/imgs/tab-bar/test-active.png'
      },
      {
        text: '我的',
        pagePath: 'pages/center/index',
        iconPath: './assets/imgs/tab-bar/center.png',
        selectedIconPath: './assets/imgs/tab-bar/center-active.png'
      }
    ]
  },
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
