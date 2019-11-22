/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const flowRouter = {
  path: '/flowManage',
  component: Layout,
  redirect: '/flowManage/flow-info',
  name: 'FlowManage',
  meta: {
    title: 'FlowManage',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'flow-total',
      component: () => import('@/views/flowManage/flowTotal'),
      name: 'FlowTotal',
      meta: {
        title: 'FlowTotal',
        roles: []
      }
    },
    {
      path: 'flow-platform',
      component: () => import('@/views/flowManage/flowPlatform'),
      name: 'FlowPlatform',
      meta: {
        title: 'FlowPlatform',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    },
    {
      path: 'coopon-flowtotal',
      component: () => import('@/views/flowManage/cooponflowTotal'),
      name: 'CouponFlowTotal',
      meta: {
        title: 'CouponFlowTotal',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    }
    // {
    //   path: 'volume',
    //   component: () => import('@/views/volumeManage/volumeManagement'),
    //   name: 'Volume',
    //   meta: {
    //     title: '电子券管理',
    //     roles: []
    //     // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
    //   }
    // }
  ]
}
export default flowRouter
