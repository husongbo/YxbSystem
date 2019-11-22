import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}
export function loginByUsernameCode(username, password, validateCode) {
  debugger
  const data = {
    user_name: username,
    user_pwd: password,
    validate_code: validateCode

  }
  return request({
    url: '/Public/Login',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 获取用户权限信息
export function getUserInfoPower(userid) {
  return request({
    url: '/Public/GetUserPowerList',
    method: 'get',
    params: { user_id: userid }
  })
}

export function ChangePwd(data){
  return request({
    url:'/Public/ChangePwd',
    method:'get',
    params:data
  })
}

