import request from '@/utils/request.js'

export const GET_TAG_LIST = (data) => request.get('wnh/tag/listAll', data, { type: 'forum' })

export const GET_SCHOOL_LIST = (data) => request.post('wnh/clause/school', data, { type: 'forum' })

export const REPROT_POSTS = (data) => request.post('wnh/report/uploadReportInfo', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// school

export const GET_SCHOOL_POSTS_LIST = (data) => request.get('wnh/hot/listAll', data, { type: 'forum' })


// hot

export const GET_HOT_LIST = (data) => request.get('wnh/hot/hotlistAll', data, { type: 'forum' })


export const GET_HOT_POSTS_DETAIL = (data) => request.get('wnh/hot/selonePost', data, { type: 'forum' })

export const SEND_HOT_POSTS = (data) => request.post('wnh/hot/sendArticles', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const DELETE_HOT_POSTS = (data) => request.post('wnh/hot/deleteHotById', data, {
  type: 'forum', header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const LIKE_HOT_POSTS = (data) => request.post('wnh/hot/addHotFabulos', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_COMMENT_HOT_POSTS = (data) => request.get('wnh/hot/selectComments', data, { type: 'forum' })

export const COMMENT_HOT_POSTS = (data) => request.post('wnh/hot/addComment', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const DELETE_COMMENT_BY_HOT_POSTS = (data) => request.post('wnh/hot/deleteComment', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const LIKE_COMMENT_BY_HOT_POSTS = (data) => request.post('wnh/hot/addCommentFabulos', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_RANKING_BY_HOT_POSTS = (data) => request.get('wnh/hot/appranking', data, { type: 'forum' })


// tree

export const GET_TREE_LIST = (data) => request.get('wnh/treehole/listAll', data, { type: 'forum' })

export const GET_TREE_POSTS_DETAIL = (data) => request.get('wnh/treehole/selonePost', data, { type: 'forum' })

export const SEND_TREE_POSTS = (data) => request.post('wnh/treehole/sendArticles', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const DELETE_TREE_POSTS = (data) => request.post('wnh/treehole/deleteTreeHoleById', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const LIKE_TREE_POSTS = (data) => request.post('wnh/treehole/addTreeHoleFabulos', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_COMMENT_TREE_POSTS = (data) => request.get('wnh/treehole/selectComments', data, { type: 'forum' })


export const COMMENT_TREE_POSTS = (data) => request.post('wnh/treehole/addComment', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const DELETE_COMMENT_BY_TREE_POSTS = (data) => request.post('wnh/treehole/deleteComment', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const LIKE_COMMENT_BY_TREE_POSTS = (data) => request.post('wnh/treehole/addCommentFabulos', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const GET_RANKING_BY_TREE_POSTS = (data) => request.get('wnh/treehole/appranking', data, { type: 'forum' })


// gift

export const GET_GIFT_LIST = (data) => request.get('/wnh/hot/giftAll', data, { type: 'forum' })

export const SEND_GIFT_TO_USER = (data) => request.post('/wnh/hot/Appreciate', data, {
  type: 'forum',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
