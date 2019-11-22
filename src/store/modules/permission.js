import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      // this.$store.state.userid=data.roles.user_id;
      // console.log(this.$store.state.userid);
      // console.log("阿波宝宝")
      // console.log(data)
      return new Promise(resolve => {
        // const { roles } = data.role_en_name
        console.log(data.roles.role_en_name)
        console.log(data.roles.meun_power_list)
        // const { roles } = { roles: ['Operations Department Daily'] }
        const { roles } = { roles: [data.roles.role_en_name] }
        let accessedRouters
        // roles.includes('admin')  data.roles.user_name === 'admin'
        console.log(roles);
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          console.log(typeof asyncRouterMap)
          console.log("aaaaaaaaaaaaa")
          console.log(asyncRouterMap)
          // console.log(asyncRouterMap.children.length)
          // 给每个菜单加上角色
          for (let i = 0; i < asyncRouterMap.length; i++) {
            if (asyncRouterMap[i].children) {
              for (let j = 0; j < asyncRouterMap[i].children.length; j++) {
                for (let n = 0; n < data.roles.meun_power_list.length; n++) {
                  if (asyncRouterMap[i].children[j].name === data.roles.meun_power_list[n].meun_en_name) {
                    console.log(data.roles.meun_power_list[n].meun_en_name+"..."+asyncRouterMap[i].children[j].name)
                    asyncRouterMap[i].children[j].meta.roles.push(data.roles.role_en_name)
                    console.log(asyncRouterMap[i].children[j].meta.roles)
                 }
                }
              }
            }
          }
          // asyncRouterMap.forEach(routeObj => {
          //   routeObj.children.forEach(routeChild => {
          //     data.roles.meun_power_list.forEach(power => {
          //       if (routeChild.name === power.meun_en_name) {
          //         routeChild.meta.roles.push(data.roles.role_en_name)
          //       }
          //     })
          //   })
          // })

          console.log(asyncRouterMap)
          for (let i = 0; i < asyncRouterMap.length; i++) {
            if (asyncRouterMap[i].children) {
              for (let j = 0; j < asyncRouterMap[i].children.length; j++) {
                if (asyncRouterMap[i].children[j].meta.roles) {
                  if (asyncRouterMap[i].children[j].meta.roles[0] === data.roles.role_en_name) {
                    asyncRouterMap[i].meta.roles.push(data.roles.role_en_name)
                  }
                }
              }
            }
          }
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
