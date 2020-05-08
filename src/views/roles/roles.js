import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { roles, add, remove, menus, findTree, findTrees, addRights, update } from '@/api/roles'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      // const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入角色名称'))
      } else {
        if (value.length > 20) {
          callback(new Error('角色名称不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    // var checkedButton = [1, 2, 3]
    // var buttonList = [{
    //   id: 1,
    //   cname: '添加',
    //   ename: 'add'
    // },
    // {
    //   id: 2,
    //   cname: '修改',
    //   ename: 'edit'
    // },
    // {
    //   id: 3,
    //   cname: '删除',
    //   ename: 'delete'
    // }]
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      checkedRouters: [],
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      roleForm: {
        roleName: '',
        dept: ''
      },
      rules: {
        roleName: [{ required: true, validator: validateName, trigger: 'blur' }],
        dept: [{ required: true, message: '请选择部门', trigger: 'blur' }]
      },
      selectedArr: [],
      currentId: '',
      treeList: [],
      addTree: [],
      children: [],
      checkAlls: false,
      selectTree: [],
      keys: '',
      nodeInfo: null,
      deptList: [],
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
    this.getDept()
    const params = {
      pageNum: 1,
      pageSize: 15,
      searchkey: '',
      departmentId: ''
    }
    this.fetchData(params)
  },
  mounted() {
    this.getRouterList()
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
          this.deptList = res.data
        }
      })
    },
    handleCheckedBtnChange(row) {
      console.log(row)
    },
    handleRoles(row) {
      // this.roleDialogVisible = true
      this.treeList = []
      this.selectTree = []
      this.children = []
      this.checkAlls = false
      this.listLoading = true
      this.currentId = row.id
      const params = {
        roleId: row.id
      }
      findTree(params).then(res => {
        this.treeList = res.data
        this.stKeys(this.treeList)
        console.log(this.selectTree)
        console.log(this.treeList)
        this.$refs.tree.setCheckedKeys(this.selectTree)
        this.listLoading = false
      })
    },
    stKeys(list) {
      for (const ch of list) {
        if (ch.children.length === 0) {
          this.children.push(ch.id)
          if (ch.checked === '0') {
            this.selectTree.push(ch.id)
          }
        }
        if (ch.children !== null && ch.children.length > 0) {
          this.stKeys(ch.children)
        }
      }
    },
    handleCheckAllChange(val) {
      this.roleForm.checkedRouters = val ? this.routerValues : []
      this.isIndeterminate = false
      console.log(this.roleForm.checkedRouters)
    },
    handleCheckedRoutersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
    },
    // 每页数量改变
    sizeChange(pageSize) {
      const params = {
        pageNum: this.pageNum,
        pageSize,
        searchkey: this.searchkey,
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
        searchkey: this.searchkey,
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
        departmentId: ''
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
      roles(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.roleForm.roleName = ''
      this.roleForm.dept = ''
      this.treeList = []
      this.selectTree = []
      this.children = []
      this.mineStatusValue = ''
      this.checkAlls = false
      this.listLoading = true
      this.listLoading = true
      const params = {
        roleId: ''
      }
      findTree(params).then(res => {
        this.treeList = res.data
        this.stKeys(this.treeList)
        this.listLoading = false
        this.$refs.tree.setCheckedKeys([])
      })
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    handleNodeClick(node) {
      this.nodeInfo = node
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: this.keys,
        departmentId: node.id
      }
      this.fetchData(params)
    },
    handleCheckChange(node) {
      this.mineStatusValue = node.id
      this.roleForm.dept = node.name
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.roleForm.roleName.trim(),
            cnname: this.roleForm.roleName.trim(),
            departmentId: this.mineStatusValue,
            roleMenuList: []

          }
          this.listLoading = true
          add(params).then(res => {
            if (res.code === 0) {
              this.currentId = res.data.id
              this.submitRoleForm()
            }
          }, () => {
            this.listLoading = false
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
          const params = {
            name: this.roleForm.roleName.trim(),
            cnname: this.roleForm.roleName.trim(),
            departmentId: this.mineStatusValue,
            id: this.currentId,
            roleMenuList: []
          }
          this.listLoading = true
          update(params).then(res => {
            if (res.code === 0) {
              this.submitRoleForm()
            }
          }, () => {
            this.listLoading = false
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
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      if (this.routers.length !== row.roleMenuList.length) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }
      this.currentId = row.id
      this.mineStatusValue = row.departmentId
      this.roleForm.roleName = row.cnname
      this.roleForm.dept = row.departmentName
      this.handleRoles(row)
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
    // 获取菜单
    getRouterList() {
      menus({}).then(res => {
        if (res.code === 0) {
          const RouterMap = []
          for (const item of res.data) {
            RouterMap.push({
              name: item.name,
              value: item.id
            })
            this.routerValues.push(item.id)
          }
          this.routers = RouterMap
        }
      })
    },
    submitRoleForm() {
      const selectId = this.$refs.tree.getCheckedNodes()
      console.log(selectId)
      const list = []
      const parent = {}
      for (const item of selectId) {
        parent[item.id] = item.checkedFunctions
        parent[item.parentId] = []
        let flag = true
        for (const tree of this.treeList) {
          if (item.parentId === tree.id) {
            flag = false
          }
        }
        if (flag) {
          for (const tree of this.treeList) {
            for (const child of tree.children) {
              if (child.id === item.parentId) {
                parent[child.parentId] = []
                parent[child.id] = []
              } else {
                for (const childs of child.children) {
                  if (childs.id === item.parentId) {
                    parent[child.parentId] = []
                    parent[childs.id] = []
                    parent[childs.parentId] = []
                  }
                }
              }
            }
          }
        }
      }
      const key = Object.keys(parent)
      console.log(parent)
      for (const item of key) {
        list.push({
          menuId: item,
          functionId: parent[item]
        })
      }
      const params = {
        roleId: this.currentId,
        list: list
      }
      addRights(params).then(res => {
        if (res.code === 0) {
          this.addDialogVisible = false
          this.editDialogVisible = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$refs['roleForm'].resetFields()
          this.fetchData()
          // this.$message({
          //   type: 'success',
          //   message: '配置成功!'
          // })
          // this.roleDialogVisible = false
        }
      })
    },
    getCheck() {
      this.setAllBtn(this.treeList)
      if (this.checkAlls) {
        this.$refs.tree.setCheckedKeys(this.children)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    setAllBtn(item) {
      for (const its of item) {
        its.checkedFunctions = []
        if (this.checkAlls && its.functions.length > 0) {
          for (const bts of its.functions) {
            its.checkedFunctions.push(bts.id)
          }
        }
        if (its.children.length > 0) {
          this.setAllBtn(its.children)
        }
      }
    }
  }
}
