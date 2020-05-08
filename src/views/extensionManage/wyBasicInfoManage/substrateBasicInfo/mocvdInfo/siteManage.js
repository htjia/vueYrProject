
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachine, addMachine, updateMachine, removeMachine, findMachineUser, findUser, updateRecipeMenu,
  findRecipeMenu, findPlatter, addMachineUser, updateMachineUserStatus, deleteMachineUser, addRecipeMenu, deleteRecipeMenu
} from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/mocvdInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      platterCircleVisble: false,
      addUser: false,
      addRecipe: false,
      activeTabIndex: 0,
      activeDialogTabIndex: 0,
      list: [],
      userList: [],
      recipeList: [],
      allUserList: [],
      userOptions: [],
      platterList: [],
      platterCircleList: [],
      selectedMachineRow: '',
      selectedUserRow: '',
      selectedRecipeRow: '',
      machineForm: {
        code: '',
        maxTime: '',
        minTime: '',
        waitTime: ''
      },
      rules: {
        code: [{ required: true, message: '请输入机台编号', trigger: 'blur' }],
        maxTime: [{ required: true, message: '请输入运行时间Max(h)', trigger: 'blur' }],
        minTime: [{ required: true, message: '请输入运行时间Min(h)', trigger: 'blur' }],
        waitTime: [{ required: true, message: '请输入待机时间', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findUserFun()
  },
  methods: {
    // 全部人员
    findUserFun() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      findUser(params).then(res => {
        this.allUserList = res.data.list
      })
    },
    // 查看table circle 详情
    viewCircleDetail(row) {
      this.platterCircleVisble = true
      this.platterCircleList = row.circleList
    },
    // 机台操作人员
    findMachineUserFun(machineId) {
      findMachineUser({ machineId }).then(res => {
        res.data.map((item) => {
          item.status = item.status === 0
          item.disabled = true
        })
        this.userList = res.data
        this.allUserList.map((item) => {
          item.disabled = false
        })
        this.allUserList.map((item) => {
          this.userList.map((userItem) => {
            if (item.id === userItem.userId) {
              item.disabled = true
            }
          })
        })
      })
    },
    // 机台Recipe
    findRecipeMenuFun(machineId) {
      const params = {
        machineId,
        pageNum: 1,
        pageSize: 10000
      }
      findRecipeMenu(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
          item.disabled = item.disabled = true
        })
        this.recipeList = res.data.list
      })
    },
    findPlatterFun(machine) {
      findPlatter({ machine }).then(res => {
        res.data.map((item) => {
          item.status = item.status === 0
        })
        this.platterList = res.data
      })
    },
    tabClick(index) {
      this.activeTabIndex = index
      if (index === 0) {
        this.addRecipe = false
        this.findMachineUserFun(this.selectedMachineRow.id)
        this.selectedRecipeRow = ''
      } else if (index === 1) {
        this.addUser = false
        this.selectedUserRow = ''
        this.findRecipeMenuFun(this.selectedMachineRow.id)
      } else {
        this.selectedRecipeRow = ''
        this.selectedUserRow = ''
        this.findPlatterFun(this.selectedMachineRow.id)
      }
    },
    dialogTabClick(index) {
      this.activeDialogTabIndex = index
    },
    // 查询
    fetchData() {
      this.listLoading = true
      findMachine({}).then(res => {
        res.data.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data
        if (this.list.length > 0) {
          this.findMachineUserFun(this.list[0].id)
          this.$refs.machineTable.setCurrentRow(this.list[0])
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 人员状态改变
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      updateMachineUserStatus(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.findMachineUserFun(this.selectedMachineRow.id)
      })
    },
    // reicpe状态改变
    switchRecipeChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      updateRecipeMenu(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.findRecipeMenuFun(this.selectedMachineRow.id)
      })
    },
    handleEdit() {
      if (this.selectedMachineRow === '') {
        this.$message({
          type: 'error',
          message: '请先选择要操作的机台!'
        })
        return false
      }
      if (this.selectedMachineRow.maxTime < this.selectedMachineRow.minTime) {
        this.$message({
          type: 'error',
          message: '运行时间Min不能大于运行时间Max!'
        })
        return false
      }
      this.machineForm.code = this.selectedMachineRow.code
      this.machineForm.waitTime = this.selectedMachineRow.waitTime
      this.machineForm.maxTime = this.selectedMachineRow.maxTime
      this.machineForm.minTime = this.selectedMachineRow.minTime
      this.currentId = this.selectedMachineRow.id
      this.editDialogVisible = true
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.waitTime = ''
      this.machineForm.minTime = ''
      this.machineForm.maxTime = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.editDialogVisible = false
    },
    // 人员table选择
    currentUserChange(row) {
      this.selectedUserRow = row
    },
    currentRecipeChange(row) {
      this.selectedRecipeRow = row
    },
    // 删除机台人员
    handleDeleteUser() {
      if (this.selectedUserRow === '' || this.selectedUserRow === null) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的人员信息!'
        })
        return false
      }
      this.$confirm('此操作将永久删除当前人员信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.selectedUserRow.id
        }
        deleteMachineUser(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$refs.userTable.clearSelection()
            this.selectedUserRow = ''
            this.findMachineUserFun(this.selectedMachineRow.id)
          }
        })
      })
    },
    // 机台table选择
    currentMachineChange(row) {
      this.selectedMachineRow = row
      if (this.activeTabIndex === 0) {
        this.findMachineUserFun(this.selectedMachineRow.id)
      } else if (this.activeTabIndex === 1) {
        this.findRecipeMenuFun(this.selectedMachineRow.id)
      } else {
        this.findPlatterFun(this.selectedMachineRow.id)
      }
      document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    },
    // 新增人员
    handleAddUser() {
      this.userList.push({
        userId: '',
        status: true
      })
      this.addUser = true
    },
    // 新增人员提交
    addUserSubmit() {
      if (this.userList[this.userList.length - 1].userId === '') {
        this.$message({
          type: 'error',
          message: '人员名称不能为空!'
        })
        return
      }
      const params = {
        machineId: this.selectedMachineRow.id,
        status: this.userList[this.userList.length - 1].status ? 0 : 1,
        userId: this.userList[this.userList.length - 1].userId
      }
      console.log(params)
      addMachineUser(params).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.findMachineUserFun(this.selectedMachineRow.id)
        this.addUser = false
      })
    },
    // 删除Recipe
    handleDeleteRecipe() {
      console.log(this.selectedRecipeRow)
      if (this.selectedRecipeRow === '' || this.selectedRecipeRow === null) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的Recipe信息!'
        })
        return false
      }
      this.$confirm('此操作将永久删除当前Recipe信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.selectedRecipeRow.id
        }
        deleteRecipeMenu(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$refs.recipeTable.clearSelection()
            this.selectedRecipeRow = ''
            this.findRecipeMenuFun(this.selectedMachineRow.id)
            console.log(this.selectedRecipeRow)
          }
        })
      })
    },
    waitTimeChange(val) {
      this.machineForm.waitTime = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    maxTimeChange(val) {
      this.machineForm.maxTime = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    minTimeChange(val) {
      this.machineForm.minTime = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    // 新增Recipe
    handleAddRecipe() {
      this.recipeList.push({
        name: '',
        status: true
      })
      this.addRecipe = true
    },
    addRecipeSubmit() {
      if (this.recipeList[this.recipeList.length - 1].name === '') {
        this.$message({
          type: 'error',
          message: 'recipe_name不能为空!'
        })
        return
      }
      const params = {
        machineId: this.selectedMachineRow.id,
        status: this.recipeList[this.recipeList.length - 1].status ? 0 : 1,
        code: this.recipeList[this.recipeList.length - 1].name,
        name: this.recipeList[this.recipeList.length - 1].name
      }
      console.log(params)
      addRecipeMenu(params).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.findRecipeMenuFun(this.selectedMachineRow.id)
        this.addRecipe = false
      })
    },
    // 取消
    cancelAdd() {
      this.findMachineUserFun(this.selectedMachineRow.id)
      this.addUser = false
    },
    cancelAddRecipe() {
      this.findRecipeMenuFun(this.selectedMachineRow.id)
      this.addRecipe = false
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.machineForm.maxTime < this.machineForm.minTime) {
            this.$message({
              type: 'error',
              message: '运行时间Min不能大于运行时间Max!'
            })
            return false
          }
          const params = {
            name: this.machineForm.code,
            code: this.machineForm.code,
            maxTime: this.machineForm.maxTime,
            minTime: this.machineForm.minTime,
            waitTime: this.machineForm.waitTime
          }
          addMachine(params).then(res => {
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
          if (this.machineForm.maxTime < this.machineForm.minTime) {
            this.$message({
              type: 'error',
              message: '运行时间Min不能大于运行时间Max!'
            })
            return false
          }
          const params = {
            code: this.machineForm.code,
            maxTime: this.machineForm.maxTime,
            minTime: this.machineForm.minTime,
            waitTime: this.machineForm.waitTime,
            id: this.currentId
          }
          updateMachine(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
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
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete() {
      this.$confirm('此操作将永久删除当前机台信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.selectedMachineRow.id
        }
        removeMachine(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    }
  }
}

