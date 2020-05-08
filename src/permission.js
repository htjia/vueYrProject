import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.dispatch('SetKey', Math.random()).then(() => {})
  if (getToken() && document.cookie.indexOf('quanshi_userId') !== -1) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      // 如果当前页面是仪表板，则不会在每个钩子之后触发，因此手动处理它。
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // store.dispatch('GetUrl').then(() => {})// 获取跳转url
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          let roles
          if (sessionStorage.getItem('yr-route') === null) {
            roles = ['siteManage', 'proceManage', 'proceCardManage', 'colorModelsManage', 'craftManage', 'programManage', 'shopManage']
          } else {
            // 刷新校验
            let flag = true
            if (sessionStorage.getItem('be-route') !== null && sessionStorage.getItem('be-route') !== undefined) {
              const bRoute = sessionStorage.getItem('be-route').split(',')
              for (const item of bRoute) {
                const url = '/' + item + '/'
                const readyurl = to.path.substring(0, item.length + 2)
                if (url === readyurl) {
                  flag = false
                  roles = sessionStorage.getItem('be-route').split(',')
                  sessionStorage.setItem('yr-activeIndex', sessionStorage.getItem('be-activeIndex'))
                  sessionStorage.setItem('yr-route', sessionStorage.getItem('be-route'))
                  break
                }
              }
            }
            if (flag) {
              roles = sessionStorage.getItem('yr-route').split(',')
            }
          }
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else { // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        next()
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
