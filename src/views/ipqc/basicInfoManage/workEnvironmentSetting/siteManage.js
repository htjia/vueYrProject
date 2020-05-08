
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, getTypeList, updateType, addType, updateList, addList, zlEnvWorkShopUpdateWorkshopOrder, zlEnvPointUpdateSequence, zlEnvPointUpdateStatus, removeProject } from '@/api/ipqc/basic/workEnvironmentSetting'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      editDialogVisible1: false,
      isDisable: '',
      content: '',
      programForm: {
        name: '',
        content: '',
        score: '',
        wlcl: '',
        wucl: '',
        slcl: '',
        sucl: '',
        jucl: ''
      },
      project: '',
      projectList: [],
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不可为空', trigger: 'blur' }]
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
      list: []
    }
  },
  mounted() {
    this.fetchData()
    this.getTypeList()
    const _this = this
    setTimeout(function() {
      _this.rowDrop()
    }, 1000)
  },
  methods: {
    // 重置
    clearAll() {
      this.project = ''
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
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 3000,
        workShopId: this.project,
        name: this.content,
        status: this.isDisable
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
        if (this.list[index].workShopId !== this.list[index - 1].workShopId) {
          this.$message({
            type: 'error',
            message: '移动项目不相同!'
          })
          return
        }
        const upDate = this.list[index - 1]
        this.list.splice(index - 1, 1)
        this.list.splice(index, 0, upDate)
        this.zlEnvPointUpdateSequence()
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
      } else {
        if (this.list[index].workShopId !== this.list[index + 1].workShopId) {
          this.$message({
            type: 'error',
            message: '移动项目不相同!'
          })
          return
        }
        const downDate = this.list[index + 1]
        this.list.splice(index + 1, 1)
        this.list.splice(index, 0, downDate)
        this.zlEnvPointUpdateSequence()
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
            _this.zlEnvPointUpdateSequence()
          }
        }
      })
    },
    zlEnvPointUpdateSequence() {
      const params = []
      for (let i = 0; i < this.list.length; i++) {
        params.push({
          id: this.list[i].id,
          sequence: i + 1
        })
      }
      zlEnvPointUpdateSequence(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    zlEnvWorkShopUpdateWorkshopOrder() {
      const params = []
      for (let i = 0; i < this.projectList.length; i++) {
        params.push({
          id: this.projectList[i].id,
          workshopOrder: i + 1
        })
      }
      zlEnvWorkShopUpdateWorkshopOrder(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    // 上移
    handleUp1(index) {
      if (index > 0) {
        const upDate = this.projectList[index - 1]
        this.projectList.splice(index - 1, 1)
        this.projectList.splice(index, 0, upDate)
        this.zlEnvWorkShopUpdateWorkshopOrder()
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown1(index) {
      if ((index + 1) === this.list.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.projectList[index + 1]
        this.projectList.splice(index + 1, 1)
        this.projectList.splice(index, 0, downDate)
        this.zlEnvWorkShopUpdateWorkshopOrder()
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
            _this.zlEnvWorkShopUpdateWorkshopOrder()
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
          zlEnvPointUpdateStatus(requestParams).then(res => {
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
          zlEnvPointUpdateStatus(requestParams).then(res => {
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
        jucl: row.cleanUcl,
        content: row.name,
        wlcl: row.wdLcl,
        wucl: row.wdUcl,
        slcl: row.sdLcl,
        sucl: row.sdUcl,
        name: row.workShopId
      }
      this.editDialogVisible1 = true
    },
    handleAdds() {
      this.editDialogVisible = true
      this.programForm = {
        name: '',
        content: '',
        score: '',
        wlcl: '',
        wucl: '',
        slcl: '',
        sucl: '',
        jucl: ''
      }
    },
    handleEdits(row) {
      row.isEdit = true
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
          workshopOrder: this.projectList.length + 1
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
          workshopOrder: row.workshopOrder
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
    handleDeleteProject(row, index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.id === 0) {
          this.projectList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        } else {
          removeProject({ id: row.id }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.handleAdd()
          })
        }
      })
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
          const num = new RegExp('/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/')
          let flag = false
          if (num.test(this.programForm.wlcl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度LCL输入有误!'
            })
          } else if (parseFloat(this.programForm.wlcl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度LCL不能为负值!'
            })
          } else if (num.test(this.programForm.wucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.wucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL不能为负值!'
            })
          } else if (num.test(this.programForm.slcl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度LCL输入有误!'
            })
          } else if (parseFloat(this.programForm.slcl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度LCL不能为负值!'
            })
          } else if (num.test(this.programForm.sucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.sucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL不能为负值!'
            })
          } else if (num.test(this.programForm.jucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '洁净度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.jucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '洁净度UCL不能为负值!'
            })
          } else if (parseFloat(this.programForm.wlcl) >= parseFloat(this.programForm.wucl)) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL必须大于LCL!'
            })
          } else if (parseFloat(this.programForm.slcl) >= parseFloat(this.programForm.sucl)) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL必须大于LCL!'
            })
          }
          if (flag) {
            return
          }
          const params = {
            cleanUcl: this.programForm.jucl,
            name: this.programForm.content,
            sdLcl: this.programForm.slcl,
            sdUcl: this.programForm.sucl,
            wdLcl: this.programForm.wlcl,
            wdUcl: this.programForm.wucl,
            workShopId: this.programForm.name,
            sequence: this.list.length + 1
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
          const num = new RegExp('/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/')
          let flag = false
          if (num.test(this.programForm.wlcl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度LCL输入有误!'
            })
          } else if (parseFloat(this.programForm.wlcl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度LCL不能为负值!'
            })
          } else if (num.test(this.programForm.wucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.wucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL不能为负值!'
            })
          } else if (num.test(this.programForm.slcl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度LCL输入有误!'
            })
          } else if (parseFloat(this.programForm.slcl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度LCL不能为负值!'
            })
          } else if (num.test(this.programForm.sucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.sucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL不能为负值!'
            })
          } else if (num.test(this.programForm.jucl + '')) {
            flag = true
            this.$message({
              type: 'error',
              message: '洁净度UCL输入有误!'
            })
          } else if (parseFloat(this.programForm.jucl) < 0) {
            flag = true
            this.$message({
              type: 'error',
              message: '洁净度UCL不能为负值!'
            })
          } else if (parseFloat(this.programForm.wlcl) >= parseFloat(this.programForm.wucl)) {
            flag = true
            this.$message({
              type: 'error',
              message: '温度UCL必须大于LCL!'
            })
          } else if (parseFloat(this.programForm.slcl) >= parseFloat(this.programForm.sucl)) {
            flag = true
            this.$message({
              type: 'error',
              message: '湿度UCL必须大于LCL!'
            })
          }
          if (flag) {
            return
          }
          const params = {
            id: this.rowInfo.id,
            cleanUcl: this.programForm.jucl,
            name: this.programForm.content,
            sdLcl: this.programForm.slcl,
            sdUcl: this.programForm.sucl,
            wdLcl: this.programForm.wlcl,
            wdUcl: this.programForm.wucl,
            workShopId: this.programForm.name,
            sequence: this.rowInfo.sequence
          }
          updateList(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
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
        zlEnvPointUpdateStatus(requestParams).then(res => {
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
    }
  }
}

