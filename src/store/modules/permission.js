import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }

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
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          const routers = []
          for (const router of asyncRouterMap) {
            if (router.children !== null && router.path !== '*') {
              for (let i = 0; i < router.children.length; i++) {
                const child = router.children[i]
                if (child.meta.icon === 'hadoop') {
                  router.children[i].path = sessionStorage.getItem('hadoop')
                }
                if (child.meta.icon === 'spark') {
                  router.children[i].path = sessionStorage.getItem('spark')
                }
              }
            }
            if (roles.includes(router.path.substr(1))) {
              routers.push(router)
            }
          }
          accessedRouters = routers
          // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          // console.log(accessedRouters)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
