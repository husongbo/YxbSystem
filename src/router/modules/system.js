/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/roles',
  name: 'System',
  meta: {
    title: 'System',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'roles',
      component: () => import('@/views/system/roles'),
      name: 'Roles',
      meta: {
        title: 'Roles',
        // roles: ['admin', 'Technology Department']
        roles: []
      }
    },
    {
      path: 'users',
      component: () => import('@/views/system/userManage'),
      name: 'Users',
      meta: {
        title: 'Users',
        roles: []
      }
    }
  ]
}
export default tableRouter
