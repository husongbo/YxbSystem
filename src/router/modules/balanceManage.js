/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const balanceRouter = {
  path: '/balanceManage',
  component: Layout,
  redirect: '/balanceManage/balance-info',
  name: 'BalanceManage',
  meta: {
    title: 'BalanceManage',
    icon: 'table',
    roles: []
  },
  children: [
    {
      path: 'balance-info',
      component: () => import('@/views/balanceManage/balanceInfo'),
      name: 'BalanceInfo',
      meta: {
        title: 'BalanceInfo',
        roles: []
      }
    },
    {
      path: 'balance-user',
      component: () => import('@/views/balanceManage/balanceUser'),
      name: 'BalanceUser',
      meta: {
        title: 'BalanceUser',
        roles: []
        // roles: ['admin', 'editor', 'Operations Department Daily', 'Technology Department']
      }
    },
    {
      path: 'balance-apply',
      component: () => import('@/views/balanceManage/balanceApply'),
      name: 'BalanceApplay',
      meta: {
        title: 'BalanceApplay',
        roles: []
      },
    },
    {
      path: 'balance-apply-sign',
      component: () => import('@/views/balanceManage/balanceApplySign'),
      name: 'BalanceInfoSign',
      meta: {
        title: 'BalanceInfoSign',
        roles: []
      }
    },
    {
      path: 'balance-apply-history',
      component: () => import('@/views/balanceManage/balanceApplyHistory'),
      name: 'BalanceInfoHistory',
      meta: {
        title: 'BalanceInfoHistory',
        roles: []
      }
    },

    {
      path: 'couponManage ',
      component: () => import('@/views/volumeManage/volumeManagement'),
      name: 'CouponManage',
      meta: {
        title: '电子券管理',
        roles: []
      }
    },
    {
      path: 'AuditMerchantInfo',
      component: () => import('@/views/balanceManage/blanceUserinfo'),
      name: 'AuditMerchantInfo',
      meta: {
        title: '商户注册审核',
        roles: []
      }
    },
    {
      path: 'MerchantApplayInfo',
      component: () => import('@/views/balanceManage/balancebusiness'),
      name: 'MerchantApplayInfo',
      meta: {
        title: '商户注册审核记录',
        roles: []
      }
    },
    {
      path: 'MerchantTechnology',
      component: () => import('@/views/balanceManage/balanceUserGL'),
      name: 'MerchantTechnology',
      meta: {
        title: '商户技术管理',
        roles: []
      }
    },
    {
      path: 'BalanceDetail',
      component: () => import('@/views/balanceManage/Variationdetails'),
      name: 'BalanceDetail',
      meta: {
        title: '备付金变动明细',
        roles: []
      }
    },
    {
      path: 'MerchantBalanceCharge',
      component: () => import('@/views/balanceManage/balanceSettlement'),
      name: 'MerchantBalanceCharge',
      meta: {
        title: '第三方备付金结算',
        roles: []
      }
    },
    {
      path: 'CouponException',
      component: () => import('@/views/balanceManage/exceptionhandling'),
      name: 'CouponException',
      meta: {
        title: '电子券异常信息',
        roles: []
      }
    },
    {
      path: 'CouponExprieRevokeDetail',
      component: () => import('@/views/balanceManage/balanceTovoid'),
      name: 'CouponExprieRevokeDetail',
      meta: {
        title: '电子券过期作废明细',
        roles: []
      }
    },
    {
      path: 'CouponListDdtail',
      component: () => import('@/views/balanceManage/DetailedVouchers'),
      name: 'CouponListDdtail',
      meta: {
        title: '电子券购买明细',
        roles: []
      }
    }
  ]
}
export default balanceRouter
