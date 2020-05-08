
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, getTypeList, addType, updateType, addList, updateList, findcj, savecjList, updatecjList, deletecj, zlSevenItemUpdateSequence, zlSevenCategoryUpdateCategoryOrder, zlSevenItemUpdateStatus } from '@/api/ipqc/basic/7SStandardSetting'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateTest = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('内容不可为空'))
      } else {
        if (!num.test(value)) {
          callback(new Error('分值必须1~99的正整数'))
        } else if (parseInt(value) < 1 || parseInt(value) >= 1000) {
          callback(new Error('分值必须1~99的正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      addDialogVisiblecj: false,
      editDialogVisible: false,
      editDialogVisible1: false,
      isDisable: '',
      content: '',
      programForm: {
        name: '',
        content: '',
        score: ''
      },
      project: '',
      projectList: [],
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        score: [{ required: true, validator: validateTest, trigger: 'blur' }]
      },
      disableList: [
        {
          id: 1,
          name: '禁用'
        },
        {
          id: 0,
          name: '启用'
        }
      ],
      rowInfo: null,
      list: [],
      projectcjList: []
    }
  },
  mounted() {
    this.getTypeList()
    this.fetchData()
    const _this = this
    setTimeout(function() {
      _this.rowDrop()
    }, 1000)
  },
  methods: {
    // 重置
    clearAll() {
      this.content = ''
      this.isDisable = ''
      this.handleSearch()
    },
    getTypeList() {
      getTypeList().then(res => {
        this.projectList = []
        for (let i = 0; i < res.data.length; i++) {
          var data = {
            isEdit: false,
            index: i + 1,
            name: res.data[i].name,
            id: res.data[i].id
          }
          this.projectList.push(data)
        }
      })
    },
    getTypeListcj() {
      findcj().then(res => {
        this.projectcjList = []
        for (let i = 0; i < res.data.length; i++) {
          var data = {
            isEdit: false,
            index: i + 1,
            name: res.data[i].name,
            id: res.data[i].id
          }
          this.projectcjList.push(data)
        }
      })
    },
    zlSevenItemUpdateSequence() {
      const params = []
      for (let i = 0; i < this.list.length; i++) {
        params.push({
          id: this.list[i].id,
          sequence: i + 1
        })
      }
      zlSevenItemUpdateSequence(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    zlSevenCategoryUpdateCategoryOrder() {
      const params = []
      for (let i = 0; i < this.projectList.length; i++) {
        params.push({
          id: this.projectList[i].id,
          categoryOrder: i + 1
        })
      }
      zlSevenCategoryUpdateCategoryOrder(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 3000,
        name: this.content,
        status: this.isDisable,
        categoryId: this.project
      }
      getList(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === 0) {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          res.data.list[i].index = i + 1
          this.list.push(res.data.list[i])
        }
        this.listLoading = false
      })
    },
    // 上移
    handleUp(index) {
      if (index > 0) {
        if (this.list[index].categoryId !== this.list[index - 1].categoryId) {
          this.$message({
            type: 'error',
            message: '移动项目不相同!'
          })
          return
        }
        const upDate = this.list[index - 1]
        this.list.splice(index - 1, 1)
        this.list.splice(index, 0, upDate)
        this.zlSevenItemUpdateSequence()
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(index) {
      if ((index + 1) === this.list.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else if (this.list[index].categoryId !== this.list[index + 1].categoryId) {
        this.$message({
          type: 'error',
          message: '移动项目不相同!'
        })
      } else {
        const downDate = this.list[index + 1]
        this.list.splice(index + 1, 1)
        this.list.splice(index, 0, downDate)
        this.zlSevenItemUpdateSequence()
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.left .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          if (newIndex !== oldIndex) {
            const currRow = _this.list.splice(oldIndex, 1)[0]
            _this.list.splice(newIndex, 0, currRow)
            _this.zlSevenItemUpdateSequence()
          }
        }
      })
    },
    // 上移
    handleUp1(index) {
      if (index > 0) {
        const upDate = this.projectList[index - 1]
        this.projectList.splice(index - 1, 1)
        this.projectList.splice(index, 0, upDate)
        this.zlSevenCategoryUpdateCategoryOrder()
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown1(index) {
      if ((index + 1) === this.projectList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.projectList[index + 1]
        this.projectList.splice(index + 1, 1)
        this.projectList.splice(index, 0, downDate)
        this.zlSevenCategoryUpdateCategoryOrder()
      }
    },
    // 行拖拽
    rowDrop1() {
      const tbody = document.querySelector('.left1 .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          if (newIndex !== oldIndex) {
            const currRow = _this.projectList.splice(oldIndex, 1)[0]
            _this.projectList.splice(newIndex, 0, currRow)
            _this.zlSevenCategoryUpdateCategoryOrder()
          }
        }
      })
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          const requestParams = {
            id: row.id,
            status: row.status
          }
          zlSevenItemUpdateStatus(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          zlSevenItemUpdateStatus(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = true
        })
      }
    },
    handleEdit(row) {
      this.rowInfo = row
      this.programForm = {
        content: row.name,
        name: row.categoryId,
        score: row.score
      }
      this.editDialogVisible1 = true
    },
    handleAdds() {
      this.programForm = {
        name: '',
        content: '',
        score: ''
      }
      this.editDialogVisible = true
    },
    handleEdits(row) {
      row.isEdit = true
    },
    handleSavecj(row) {
      if (row.name.trim().length === 0) {
        this.$message({
          type: 'error',
          message: '名称不能为空!'
        })
        return
      }
      if (row.id === 0) {
        const params = {
          name: row.name
        }
        savecjList(params).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getTypeListcj()
        })
      } else {
        const params = {
          name: row.name,
          id: row.id
        }
        updatecjList(params).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getTypeListcj()
        })
      }
    },
    handleDeletecj(row, index) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          id: row.id
        }
        console.log(index)
        console.log(row)
        if (row.id !== 0) {
          deletecj(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTypeListcj()
          })
        } else {
          this.projectcjList.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    handleDeletexm(row, index) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          id: row.id
        }
        console.log(index)
        console.log(row)
        if (row.id !== 0) {
          deletecj(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTypeList()
          })
        } else {
          this.projectList.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    handleSave(row) {
      if (row.name.trim().length === 0) {
        this.$message({
          type: 'error',
          message: '名称不能为空!'
        })
        return
      }
      if (row.id === 0) {
        const params = {
          name: row.name,
          categoryOrder: this.projectList.length + 1
        }
        addType(params).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getTypeList()
        })
      } else {
        const params = {
          name: row.name,
          id: row.id,
          categoryOrder: row.categoryOrder
        }
        updateType(params).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getTypeList()
        })
      }
    },
    // 添加
    handleAdd() {
      this.addDialogVisible = true
      this.getTypeList()
      const _this = this
      setTimeout(function() {
        _this.rowDrop1()
      }, 1000)
    },
    handleAddcj() {
      this.addDialogVisiblecj = true
      this.getTypeListcj()
      // setTimeout(function() {
      //   _this.rowDropcj1()
      // }, 1000)
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.editDialogVisible1 = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let sequence = 1
          if (this.list.length !== 0) {
            sequence = this.list[this.list.length - 1].sequence + 1
          }
          const params = {
            name: this.programForm.content,
            categoryId: this.programForm.name,
            score: this.programForm.score,
            sequence: sequence
          }
          addList(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
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
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.programForm.content,
            categoryId: this.programForm.name,
            id: this.rowInfo.id,
            score: this.programForm.score,
            sequence: this.rowInfo.sequence
          }
          updateList(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.editDialogVisible1 = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          id: row.id,
          status: 2
        }
        zlSevenItemUpdateStatus(requestParams).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    addNewList() {
      this.projectList.push({
        isEdit: true,
        name: '',
        index: this.projectList.length,
        id: 0
      })
      const _this = this
      setTimeout(function() {
        _this.$refs.newPro.bodyWrapper.scrollTop = _this.$refs.newPro.bodyWrapper.scrollHeight + 40
      }, 100)
    },
    addNewListcj() {
      if (this.projectcjList.length > 9) {
        this.$message({
          type: 'error',
          message: '新增车间不得超过10个!'
        })
        return
      }
      this.projectcjList.push({
        isEdit: true,
        name: '',
        index: this.projectcjList.length,
        id: 0
      })
      const _this = this
      setTimeout(function() {
        _this.$refs.newfac.bodyWrapper.scrollTop = _this.$refs.newfac.bodyWrapper.scrollHeight + 40
      }, 100)
    }
  }
}

