import { login } from '@/api/login'
import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId } from '@/utils/auth'
import { getRouters } from '@/api/background/menuManager'
import { getComputerCenter, getDataCenter } from '@/api/metadata/tableManager'

const user = {
  state: {
    // token: getToken(),
    token: getToken(),
    name: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      var keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '='
      function encode64(input) {
        var chr1, chr2, enc1, enc2, enc3
        var output = ''
        var chr3 = ''
        var enc4 = ''
        var i = 0
        do {
          chr1 = input.charCodeAt(i++)
          chr2 = input.charCodeAt(i++)
          chr3 = input.charCodeAt(i++)
          enc1 = chr1 >> 2
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
          enc4 = chr3 & 63
          if (isNaN(chr2)) {
            enc3 = enc4 = 64
          } else if (isNaN(chr3)) {
            enc4 = 64
          }
          output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4)
          chr1 = chr2 = chr3 = ''
          enc1 = enc2 = enc3 = enc4 = ''
        } while (i < input.length)
        return output
      }
      const username = userInfo.username.trim()
      const password = encode64(userInfo.password.trim())
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          if (res.code === 0) {
            sessionStorage.removeItem('yr-activeIndex')
            sessionStorage.setItem('deptId', res.data.departmentId)
            setToken(res.data.name)
            setUserId(res.data.id)
            commit('SET_NAME', res.data.username)
            var expdate = new Date() // 初始化时间
            expdate.setTime(expdate.getTime() + 24 * 60 * 60 * 1000)
            document.cookie = 'quanshi_userId=' + res.data.id + ';expires=' + expdate.toGMTString()
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
        // setToken('res.data.name')
        // setUserId('1')
        // commit('SET_NAME', 'res.data.username')
        // resolve()
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getMeuns({ id: getUserId() }).then(response => {
        //   const data = response.data
        //   if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
        //     commit('SET_ROLES', data)
        //   } else {
        //     commit('SET_ROLES', ['roles'])
        //     // reject('getInfo: roles must be a non-null array !')
        //   }
        //   resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
        getRouters({ userId: getUserId() }).then(response => {
          const data = response.data
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data)
          } else {
            commit('SET_ROLES', ['roles'])
            // reject('getInfo: roles must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
        // commit('SET_ROLES', ['editor'])
        // resolve()
      })
    },
    GetUrl() {
      return new Promise((resolve, reject) => {
        getComputerCenter({}).then(res => {
          sessionStorage.setItem('spark', res.data)
        })
        getDataCenter({}).then(res => {
          sessionStorage.setItem('hadoop', res.data)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeUserId()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUserId()
        resolve()
      })
    }
  }
}

export default user
