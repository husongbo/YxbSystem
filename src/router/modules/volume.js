import Layout from '@/views/layout/Layout'

const volumeRouter = {
  path: '/volumeManage',
  component: Layout,
  redirect: '/volumeManage/invoices',
  name: 'VolumeManage',
  meta: {
    title: 'VolumeManage',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'volume',
      component: () => import('@/views/volumeManage/volumeManagement'),
      name: 'Volume',
      meta: {
        title: '电子券管理',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    },
    {
      path: 'volume',
      component: () => import('@/views/volumeManage/volumeManagement'),
      name: 'Volume1',
      meta: {
        title: '电子券管理',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    }
  ]
}
export default volumeRouter
