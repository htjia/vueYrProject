
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findTrees } from '@/api/roles'
import { getList, remove, configInfo, saveUserDetail, restPassWord } from '@/api/user'
import { findTree } from '@/api/background/deptManager'
import { roles } from '@/api/roles'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateUserName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入用账号'))
      } else {
        if (chinese.test(value)) {
          callback(new Error('账号不能为汉字'))
        } else if (pattern.test(value)) {
          callback(new Error('账号不能包含特殊字符'))
        } else if (value.length < 6) {
          callback(new Error('账号长度不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('账号长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validateName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const num = new RegExp('[0-9]')
      if (value.trim().length === 0) {
        callback(new Error('请输入姓名'))
      } else {
        if (num.test(value)) {
          callback(new Error('姓名不能包含数字'))
        } else if (pattern.test(value)) {
          callback(new Error('姓名不能包含特殊字符'))
        } else if (value.length > 20) {
          callback(new Error('姓名长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validatePassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('密码长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validateConfirmPassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入确认密码'))
      } else {
        if (value !== this.userForm.passWord) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    // const validateDept = (rule, value, callback) => {
    //   if (value.length === 0) {
    //     callback(new Error('请选择部门'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      updatePwdDialogVisible: false,
      configDialogVisible: false,
      list: [],
      col: [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '账号',
          prop: 'username'
        }
      ],
      dropCol: [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '账号',
          prop: 'username'
        }
      ],
      postOptions: [],
      roleOptions: [],
      deptList: [],
      username: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      userForm: {
        name: '',
        userName: '',
        passWord: '',
        confirmPassWord: '',
        role: '',
        dept: '',
        deptId: ''
      },
      // configForm: {
      //   post: '',
      //   dept: ''
      // },
      // configRules: {
      //   post: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
      //   dept: [{ required: true, validator: validateDept, trigger: 'blur' }]
      // },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        userName: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        passWord: [{ required: true, validator: validatePassWord, trigger: 'blur' }],
        confirmPassWord: [{ required: true, validator: validateConfirmPassWord, trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        dept: [{ required: true, message: '请选择部门', trigger: 'blur' }]
      },
      currentId: '',
      isSpan: false,
      treelist: [],
      checkKey: [],
      keys: '',
      nodeInfo: null,
      deptLists: [],
      mineStatusValue: '',
      defauleProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
  },
  created() {
    const params = {
      pageNum: 1,
      pageSize: 15,
      searchkey: '',
      departmentId: ''
    }
    this.fetchData(params)
  },
  mounted() {
    this.getRoleList()
    this.getDept()
    // this.rowDrop()
    // this.columnDrop()
  },
  methods: {
    getDept() {
      this.isLoadtree = true
      const params = {
        code: '',
        name: ''
      }
      findTrees(params).then(res => {
        if (res.code === 0) {
          this.deptLists = res.data
        }
      })
    },
    handleCheckChange(node) {
      this.mineStatusValue = node.id
      this.userForm.dept = node.name
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      console.log(tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0]
          _this.list.splice(newIndex, 0, currRow)
        }
      })
    },
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    },
    getRoleList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1,
        searchkey: ''
      }
      roles(requestParams).then(res => {
        if (res.code === 0) {
          this.roleOptions = res.data.list
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    setSpan() {
      this.isSpan = !this.isSpan
    },
    findTree() {
      const params = {
        code: '',
        name: ''
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.treelist = res.data
        }
      })
    },
    handleNodeClicks(node) {
      this.nodeInfo = node
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: this.keys,
        dept: node.id,
        departmentId: node.id
      }
      this.fetchData(params)
    },
    handleNodeClick(node) {
      this.userForm.deptId = node.id
      this.userForm.dept = node.name
    },
    // 每页数量改变
    sizeChange(pageSize) {
      const params = {
        pageNum: this.pageNum,
        pageSize,
        searchkey: this.keys,
        departmentId: this.nodeInfo === null ? '' : this.nodeInfo.id
      }
      this.pageSize = pageSize
      this.fetchData(params)
    },
    // 当前页数改变
    currentChange(pageNum) {
      const params = {
        pageSize: this.pageSize,
        pageNum,
        searchkey: this.keys,
        departmentId: this.nodeInfo === null ? '' : this.nodeInfo.id
      }
      this.pageNum = pageNum
      this.fetchData(params)
    },
    handleSearch(data) {
      this.keys = data
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: data,
        departmentId: this.nodeInfo === null ? '' : this.nodeInfo.id
      }
      this.fetchData(params)
    },
    clearall() {
      this.nodeInfo = null
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: this.keys,
        departmentId: this.nodeInfo === null ? '' : this.nodeInfo.id
      }
      this.$refs.depttree.setCurrentKey(null)
      this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey,
        departmentId: this.nodeInfo === null ? '' : this.nodeInfo.id
      }
      getList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 添加
    handleAdd() {
      this.userForm.name = ''
      this.userForm.userName = ''
      this.userForm.passWord = ''
      this.userForm.confirmPassWord = ''
      this.userForm.role = []
      this.mineStatusValue = ''
      this.checkKey = []
      this.userForm.dept = ''
      this.userForm.deptId = ''
      this.isSpan = false
      this.findTree()
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const role = []
          for (const item of this.userForm.role) {
            role.push({
              id: item
            })
          }
          const params = {
            listRole: role,
            sysUser: {
              // id: this.currentId,
              name: this.userForm.name.trim(),
              username: this.userForm.userName.trim(),
              password: this.userForm.passWord.trim(),
              departmentId: this.mineStatusValue
            }
          }
          console.log(params)
          saveUserDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const role = []
          for (const item of this.userForm.role) {
            role.push({
              id: item
            })
          }
          const params = {
            listRole: role,
            sysUser: {
              id: this.currentId,
              username: this.userForm.userName.trim(),
              name: this.userForm.name.trim(),
              departmentId: this.mineStatusValue
            }
          }
          saveUserDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.updatePwdDialogVisible = false
      this.addDialogVisible = false
      this.configDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.userForm.role = []
      this.currentId = row.id
      this.isSpan = false
      this.checkKey = [row.departmentId]
      this.userForm.name = row.name
      this.userForm.userName = row.username
      this.userForm.deptId = row.departmentId
      this.userForm.dept = row.departmentName
      this.mineStatusValue = row.departmentId
      this.findTree()
      this.editDialogVisible = true
      configInfo(row.id).then(res => {
        if (res.code === 0) {
          console.log(res.data)
          for (const item of res.data.listRole) {
            this.userForm.role.push(item.id)
          }
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 重置密码
    handleUpdatePwd(row) {
      console.log(row)
      this.currentId = row.id
      this.$confirm(`确认将用户名为 “${row.username}” 的密码重置为 888888 ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restPassWord({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 配置
    handleConfig(row) {
      this.configForm.post = []
      this.configForm.role = []
      this.checkedKeys = []
      this.currentId = row.id
      this.username = row.username
      this.configDialogVisible = true
      configInfo(row.id).then(res => {
        if (res.code === 0) {
          const post = []
          const role = []
          const dept = []
          for (const item of res.data.listStation) {
            post.push(item.id)
          }
          for (const item of res.data.listRole) {
            role.push(item.id)
          }
          for (const item of res.data.listDepartment) {
            dept.push(item.id)
          }
          this.configForm.post = post
          this.configForm.role = role
          this.$refs.tree.setCheckedKeys(dept)
        }
      })
    }
  }
}

