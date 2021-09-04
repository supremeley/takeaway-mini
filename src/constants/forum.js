import HotIcon from '@/assets/imgs/hot.png'
import ZhengIcon from '@/assets/imgs/zheng.png'
import DaoIcon from '@/assets/imgs/dao.png'

export const popupOpt = {
  sort: [
    {
      name: '热门排序',
      icon: HotIcon,
      value: 1
    },
    {
      name: '时间正序',
      icon: ZhengIcon,
      value: 5
    },
    {
      name: '时间倒序',
      icon: DaoIcon,
      value: 10
    }
  ],
  report: [
    {
      name: '违反法律或违反校规',
      value: 1
    },
    {
      name: '传播低俗、色情、暴力',
      value: 2
    },
    {
      name: '侮辱谩骂或钓鱼引战',
      value: 3
    },
    {
      name: '涉嫌商业牟利营销引流',
      value: 4
    },
    {
      name: '暴露隐私、人肉搜索',
      value: 5
    },
    {
      name: '令人感到不适的其他理由',
      value: 6
    }
  ],
  share: [
    {
      name: '分享给朋友',
      value: 1,
      type: 'share'
    },
    {
      name: '生成海报分享',
      value: 2,
      // type: 'post'
    },
  ],
  normal: [
    {
      name: '回复',
      type: 'reply',
      value: 1
    },
    //  {
    //   name: '关注',
    //   type: 'follow',
    //   value: 1
    // },
    {
      name: '个人主页',
      type: 'person',
      value: 1
    },
    {
      name: '删除',
      type: 'delete',
      value: 2,
      permissions: ['mine', 'school', 'manager']
    },
    // {
    //   name: '置顶',
    //   type: 'delete',
    //   value: 2,
    //   permissions: ['school', 'manager']
    // },
    // {
    //   name: '加精',
    //   type: 'delete',
    //   value: 2,
    //   permissions: ['school', 'manager']
    // },
    // {
    //   name: '转热门',
    //   type: 'delete',
    //   value: 2,
    //   permissions: ['manager']
    // },
    {
      name: '举报',
      type: 'report',
      value: 4
    }
  ],
  mine: [
    {
      name: '删除',
      type: 'delete',
      value: 1
    },
  ]
}





