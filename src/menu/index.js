import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '地块管理',
    icon: 'folder-o',
    children: [
      { path: '/field-list', title: '查看地块' },
      { path: '/field-add', title: '添加地块' },
      { path: '/farm-management', title: '添加地块' }
    ]
  },
  {
    title: '农事管理',
    icon: 'folder-o',
    children: [
      { path: '/farm-management', title: '农事管理' }
    ]
  },
  {
    title: '作业队管理',
    icon: 'folder-o',
    children: [
      { path: '/org-management', title: '任务管理' }
    ]
  },
  {
    title: '处方管理',
    icon: 'folder-o',
    children: [
      { path: '/Rx-management', title: '处方列表' }
    ]
  },
  {
    title: '农资管理',
    icon: 'folder-o',
    children: [
      { path: '/', title: '农资管理' }
    ]
  },
  {
    title: '作业路径',
    icon: 'folder-o',
    children: [
      { path: '/route-list', title: '路径列表' }
    ]
  },
  {
    title: '软件管理',
    icon: 'folder-o',
    children: [
      { path: 'editon-info', title: '版本信息' }
    ]
  },
  {
    title: '作业数据',
    icon: 'folder-o',
    children: [
      { path: 'task-list', title: '数据列表' }
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '地块管理',
    icon: 'folder-o',
    children: [
      { path: '/field-list', title: '查看地块' },
      { path: '/field-add', title: '添加地块' }
    ]
  },
  {
    title: '农事管理',
    icon: 'folder-o',
    children: [
      { path: '/farm-management', title: '农事管理' }
    ]
  },
  {
    title: '作业队管理',
    icon: 'folder-o',
    children: [
      { path: '/org-management', title: '任务管理' }
    ]
  },
  {
    title: '处方管理',
    icon: 'folder-o',
    children: [
      { path: '/Rx-management', title: '处方列表' }
    ]
  },
  {
    title: '农资管理',
    icon: 'folder-o',
    children: [
      { path: '/', title: '农资管理' }
    ]
  },
  {
    title: '作业路径',
    icon: 'folder-o',
    children: [
      { path: '/route-list', title: '路径列表' }
    ]
  },
  {
    title: '软件管理',
    icon: 'folder-o',
    children: [
      { path: 'editon-info', title: '版本信息' }
    ]
  },
  {
    title: '作业数据',
    icon: 'folder-o',
    children: [
      { path: 'task-list', title: '数据列表' }
    ]
  }
])
