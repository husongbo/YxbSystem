import request from '@/utils/request'

// export function fetchList(query) {
//   return request({
//     url: '/gasPriceManage/list',
//     method: 'get',
//     params: query
//   })
// }
// 商户备付金信息列表
export function getBalanceInfoList(query) {
  return request({
    url: '/Balance/GetBalanceInfoList',
    method: 'get',
    params: query
  })
}

// 商户备申请信息列表
export function getBalanceHistoryInfoList(query) {
  return request({
    url: '/Balance/GetBalanceHistoryInfoList',
    method: 'get',
    params: query
  })
}

// 备付金商户修改SubMitBalanceApp
export function subMitBalanceApp(query) {
  return request({
    url: '/Balance/SubMitBalanceApp',
    method: 'get',
    params: query
  })
}
// subMitBalanceApplyInfo 备付金申请添加修改
export function subMitBalanceApplyInfo(query) {
  return request({
    url: '/Balance/SubMitBalanceApplyInfo',
    method: 'get',
    params: query
  })
}

// GetBalanceHistory 备付金申请记录
export function getBalanceHistory(query) {
  return request({
    url: '/Balance/GetBalanceHistory',
    method: 'get',
    params: query
  })
}
// GetMerchantList 商户列表
export function getMerchantList(query) {
  return request({
    url: '/Balance/GetMerchantList',
    method: 'get',
    params: query
  })
}


//查询历史记录
export function getRecordInfo(query) {
  return request({
    url: '/Balance/GetRecordInfo',
    method: 'get',
    params: query
  })
}

//电子券流水
export function GetCouponRecordInfo(query){
  return request({
    url:'/Balance/GetCouponRecordInfoFromProc',
    method:'get',
    params:query
  })
}


//发票管理
export function GetCouponTicketRecods(query){
  return request({
    url:'/Balance/GetCouponTicketRecods',
    method:'post',
    params:query
  })
}

//发票信息维护
export function SubMitCouponTicketApplyInfo(query) {
  return request({
    url: '/Balance/SubMitCouponTicketApplyInfo',
    method: 'get',
    params: query
  })
}
//电子券管理
  export function GetCouponBalanceInfo(query){
    return request({
      url:'/Balance/GetCouponBalanceInfo',
      method:'get',
      params:query
    })
}

//电子券的编辑和增加
export function SubMitCouponApplyInfo(query){
  return request({
    url:'/Balance/SubMitCouponApplyInfo',
    method:'get',
    params:query
  })
}







// 查看角色列表 http://192.168.10.23:9100/Public/GetRoleList
export function getRoleList(query) {
  return request({
    url: '/Public/GetRoleList',
    method: 'get',
    params: query
  })
}
// 查看角色权限列表 http://192.168.10.23:9100/Public/GetRolePowerList
export function fetchRolePowerById(query) {
  return request({
    url: '/Public/GetRolePowerList',
    method: 'get',
    params: query
  })
}
// http://192.168.10.23:9100/Public/GetUserListByRoleId
export function getUserListByRoleId(query) {
  return request({
    url: '/Public/GetUserListByRoleId',
    method: 'get',
    params: query
  })
}

export function SubMitRolePower(query) {
  return request({
    url: '/Public/SubMitRolePower',
    method: 'get',
    params: query
  })
}

// export function createUnifiedPrice(data) {
//   // data = JSON.stringify(data)
//   return request({
//     url: '/OilInfoManage/SubMitOilInfo',
//     method: 'post',
//     data
//   })
// }

// http://192.168.10.23:9100/OilInfoManage/GetStationList?dataType=3&province_id=1&city_id=2
export function fetchStations(query) {
  return request({
    url: '/OilInfoManage/GetStationList',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

// userManage
export function fetchUserList(query) {
  return request({
    url: '/Public/GetUserList',
    method: 'get',
    params: query
  })
}

// edit user infomation SubMitUserInfo
export function SubMitUserInfo(query) {
  return request({
    url: '/Public/SubMitUserInfo',
    method: 'get',
    params: query
  })
}
//上傳圖片
export function UpLoadFile(query) {
  return request({
    url: '/Public/UpLoadFile',
    method: 'post',
    params: query
  })
}

//上傳圖片
export function SaveImage(query) {
  return request({
    url: '/Public/SaveImage',
    method: 'post',
    params: query
  })
}


//商户名验证
export function CheckMerchantName(query) {
  return request({
    url: '/Public/CheckMerchantName',
    method: 'post',
    params: query
  })
}

//用户名验证
export function CheckMerchantUserName(query) {
  return request({
    url: '/Public/CheckMerchantUserName',
    method: 'post',
    params: query
  })
}

//商户注册
export function RegisterMerchant(query) {
  return request({
    url: '/Public/RegisterMerchant',
    method: 'post',
    params: query
  })
}


//商户用户注册
export function RegisterMerchantUser(query) {
  return request({
    url: '/Public/RegisterMerchantUser',
    method: 'post',
    params: query
  })
}

//用户信息
export function UpdateUserInfo(query) {
  return request({
    url: '/Public/UpdateUserInfo',
    method: 'post',
    params: query
  })
}

//发送短信验证码
export function SendSmsCode(query) {
  return request({
    url: '/Public/SendSmsCode',
    method: 'post',
    params: query
  })
}


//发送短信验证码
export function CheckSmsValidateCode(query) {
  return request({
    url: '/Public/CheckSmsValidateCode',
    method: 'post',
    params: query
  })
}

//更新商户信息
export function UpdateMerchant(query) {
  return request({
    url: '/Public/UpdateMerchant',
    method: 'post',
    params: query
  })
}

//新注册商户信息
export function GetRegisterMerchantList(query) {
  return request({
    url: '/Public/GetRegisterMerchantList',
    method: 'post',
    params: query
  })
}

//新注册商户审核
export function AuditMerchantInfo(query) {
  return request({
    url: '/Public/AuditMerchantInfo',
    method: 'post',
    params: query
  })
}

//商户技术信息管理列表
export function GetMerchantTechnologyList(query) {
  return request({
    url: '/Public/GetMerchantTechnologyList',
    method: 'post',
    params: query
  })
}

//商户技术信息管理
export function UpdateMerchantTechnology(query) {
  return request({
    url: '/Public/UpdateMerchantTechnology',
    method: 'post',
    params: query
  })
}

//备用金变动明细
export function GetMerchantBalanceLog(query) {
  return request({
    url: '/Balance/GetMerchantBalanceLog',
    method: 'post',
    params: query
  })
}

//商户核销异常信息
export function GetMerchantCouponException(query) {
  return request({
    url: '/Balance/GetMerchantCouponException',
    method: 'post',
    params: query
  })
}

//商户核销异常信息修改
export function SubMitCouponException(query) {
  return request({
    url: '/Balance/SubMitCouponException',
    method: 'post',
    params: query
  })
}
//获取作废列表
export function GetExprieCoupon(query) {
  return request({
    url: 'GetExprieCoupon',
    method: 'post',
    params: query
  })
}
//电子券购券信息
export function GetMerchantCouponInfo(query) {
  return request({
    url: 'Public/GetMerchantCouponInfoFromProc',
    method: 'post',
    params: query
  })
}
//作废电子券结算
// export function SubMitCouponException(query) {
//   return request({
//     url: '/Balance/SubMitCouponException',
//     method: 'post',
//     params: query
//   })
// }
