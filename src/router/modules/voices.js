import Layout from '@/views/layout/Layout'

const voicesRouter = {
  path: '/voicesManage',
  component: Layout,
  redirect: '/voicesManage/invoices',
  name: 'InvoicingManagement ',
  meta: {
    title: 'InvoicingManagement ',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'invoiceManage',
      component: () => import('@/views/invoice/invoice'),
      name: 'CouponInvoicingManagement',
      meta: {
        title: '发票管理',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    }
  ]
}
export default voicesRouter
