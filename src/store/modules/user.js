import { loginByUsername, logout, getUserInfo, loginByUsernameCode, getUserInfoPower } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    userid: '',
    roleid: '',
    username: '',
    role_zh_name: '',
    role_en_name: '',
    meun_power_list: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_ROLEID: (state, roleid) => {
      state.roleid = roleid
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_ROLEZHNAME: (state, role_zh_name) => {
      state.role_zh_name = role_zh_name
    },
    SET_ROLEENNAME: (state, role_en_name) => {
      state.role_en_name = role_en_name
    },
    SET_MERCHANT_ID: (state, user_merchant_id) => {
      state.user_merchant_id = user_merchant_id
    },
    SET_MENULIST: (state, meun_power_list) => {
      state.meun_power_list = meun_power_list
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户名密码验证码登录
    LoginByUsernameCode({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsernameCode(username, userInfo.password, userInfo.validateCode).then(response => {

          debugger
          console.log(response)

          const data = response.data

          if(data.user_info){
            commit('SET_TOKEN', 'admin')
            setToken(response.data.token)
            commit('SET_USERID', data.user_info.MS_ID)
            commit('SET_ROLEID', data.user_info.MS_ROLE_ID)
            commit('SET_USERNAME', data.user_info.MS_LOGIN_NAME)
            commit('SET_MERCHANT_ID', data.user_info.MS_MERCHANT_ID)
            localStorage.setItem('username', data.user_info.MS_LOGIN_NAME)
            localStorage.setItem('userId', data.user_info.MS_ID)
            localStorage.setItem('roleId', data.user_info.MS_ROLE_ID)
            if(data.user_info.MS_MERCHANT_ID==null||data.user_info.MS_MERCHANT_ID==''){
              localStorage.setItem('userMerchantId',0)
            }
            else{
              localStorage.setItem('userMerchantId', data.user_info.MS_MERCHANT_ID)
            }
            console.log("bbbbbbbbbbbbbbbbbbbbbbb")
            console.log(localStorage.getItem("userMerchantId"))
            console.log(localStorage.getItem("userId"))
            console.log(data.user_info)
            resolve(data)
          }else{
            resolve(data)
          }


          // setToken(response.data.userid)

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户权限信息
    GetUserInfoPower({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        // const userid = 2 // state.userid  先默认使用 admin管理
        const userid = localStorage.getItem('userId') // state.userid  先默认使用 admin管理
        getUserInfoPower(userid).then(response => {
          if (!response.data.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data.data
          commit('SET_ROLES', [data.role_en_name])
          // if (data.meun_power_list && data.meun_power_list.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', [data.role_en_name])
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('SET_USERID', data.user_id)
          commit('SET_ROLEID', data.role_id)
          commit('SET_ROLEZHNAME', data.role_zh_name)
          commit('SET_ROLEENNAME', data.role_en_name)
          commit('SET_USERNAME', data.user_name)
          commit('SET_MENULIST', data.meun_power_list)
          localStorage.setItem("roleName",data.role_zh_name)
          // dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          console.log("我是阿波")
          console.log(response.data)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}
export default user
