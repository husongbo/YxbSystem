import Layout from '@/views/layout/Layout'

const JournalRouter = {
  path: '/LogManage',
  component: Layout,
  redirect: '/voicesManage/invoices',
  name: 'LogManage',
  meta: {
    title: '日志管理',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'TecnologyLog',
      component: () => import('@/views/Journal/Journalmanger'),
      name: 'TecnologyLog',
      meta: {
        title: '日志管理',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    }
  ]
}
export default JournalRouter
