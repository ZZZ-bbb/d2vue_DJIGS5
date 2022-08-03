import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 * auth:true 验证当前路由所有的匹配中是否需要有登录验证的
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 查看地块
      {
        path: 'field-list',
        name: 'field-list',
        meta: {
          title: '查看地块',
          auth: true
        },
        component: _import('fieldManagement/viewField')
      },
      // 添加地块
      {
        path: 'field-add',
        name: 'field-add',
        meta: {
          title: '添加地块',
          auth: true
        },
        component: _import('fieldManagement/addField')
      },
      // 农事管理
      {
        path: 'farm-management',
        name: 'farm-management',
        meta: {
          title: '农事管理',
          auth: true
        },
        component: _import('farmManagement')
      },
      // 任务管理
      {
        path: 'org-management',
        name: 'org-management',
        meta: {
          title: '任务管理',
          auth: true
        },
        component: _import('orgManagement')
      },
      // 处方管理
      {
        path: 'Rx-management',
        name: 'Rx-management',
        meta: {
          title: '处方列表',
          auth: true
        },
        component: _import('RxManagement')
      },
      // 路径列表
      {
        path: 'route-list',
        name: 'route-list',
        meta: {
          title: '路径列表',
          auth: true
        },
        component: _import('route/route-list')
      },
      // 版本信息
      {
        path: 'editon-info',
        name: 'editon-info',
        meta: {
          title: '版本信息',
          auth: true
        },
        component: _import('edition/edition-info')
      },
      // 作业数据
      {
        path: 'task-list',
        name: 'task-list',
        meta: {
          title: '数据列表',
          auth: true
        },
        component: _import('task/task-list')
      },
      {
        path: 'page3',
        name: 'page3',
        meta: {
          title: '页面 3',
          auth: true
        },
        component: _import('demo/page3')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
  {
    path: '/map',
    name: 'map',
    meta: {
      title: '地图',
      auth: true
    },
    component: _import('task/map')
  },
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
