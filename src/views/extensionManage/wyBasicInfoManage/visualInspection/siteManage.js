
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { measurePageList } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo'
import { reasonList, levelList, reasonDelete, levelDelete, reasonAdd, levelAdd, reasonUpdate, levelUpdate
  , deleteController, createController, editController, findController, visualRefList, addRefVisualAndResult, updateRefVisual, updateQuickSearch
} from '@/api/visualInspection'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateModel = (rule, value, callback) => {
      const az = new RegExp('[a-z0-9]')
      if (value.trim().length === 0) {
        callback(new Error('请输入快捷键'))
      } else {
        if (!az.test(value)) {
          callback(new Error('快捷键为0~9a~z的字符'))
        } else {
          callback()
        }
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const validateName1 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入编号'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      manageDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      isActive: 1,
      tableKey: 0,
      sizeList: [],
      visualList: [],
      list: [],
      userOptions: [],
      lookLeavel: [], // 目检级别（仅启用）
      siteForm: {
        code: '',
        name: '',
        remark: '',
        isDeleted: '',
        quickSearch: ''
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      currentId: null,
      rules: {
        code: [{ required: true, validator: validateName1, trigger: 'blur' }],
        isDeleted: [{ required: true, message: '请选择目检结果', trigger: 'change' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        quickSearch: [{ required: true, validator: validateModel, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findController()
  },
  computed: {
    dialogTitle: function() {
      let title = ''
      switch (this.activeTabIndex) {
        case 0 : title = '目检判断原因'
          break
        case 1 : title = '目检级别'
          break
      }
      return title
    }
  },
  methods: {
    tabClick(index) {
      if (this.activeTabIndex !== index) {
        this.activeTabIndex = index
        this.pageNum = 1
        this.fetchData()
      }
      if (this.activeTabIndex === 2) {
        this.fetchMeasureList()
      }
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      measurePageList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.sizeList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.isActive = this.sizeList[0].id
      })
    },
    // 切换全部/圆片/方片
    navClick(id) {
      this.isActive = id
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        sizeId: id
      }
      levelList(requestParams).then(res => {
        this.lookLeavel = res.data.list.filter(_ => _.status === '0')
      })
      visualRefList(requestParams).then(res => {
        this.list = []
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]['edit'] = false
          res.data[i]['ids'] = res.data[i].visualId ? res.data[i].visualId.split(',').map(_ => +_) : []
          this.list.push(res.data[i])
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    handleEdit(row) {
      row.edit = true
      const arr = []
      this.list.map(_ => {
        if (row.resultId !== _.resultId) {
          arr.push(_.ids)
        }
      })
      const newArr = arr.flat()
      this.lookLeavel.map(_ => {
        if (newArr.includes(_.id)) {
          _['disabled'] = true
        } else {
          _['disabled'] = false
        }
      })
      console.log(this.lookLeavel)
    },
    handleEdits(row) {
      this.currentId = row.id
      this.siteForm.quickSearch = row.quickSearch
      this.editDialogVisible = true
    },
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            quickSearch: this.siteForm.quickSearch
          }
          updateQuickSearch(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
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
    handleCancel(row) {
      row.edit = false
      this.fetchData()
    },
    handleSubmitItem(row) {
      const param = {
        visualId: row.ids.toString()
      }
      if (row.refId) {
        param['id'] = row.refId
        updateRefVisual(param).then(res => {
          row.edit = false
          this.$message.success('修改成功！')
          this.fetchData()
        })
      } else {
        param['resultId'] = row.resultId
        param['sizeId'] = this.isActive
        addRefVisualAndResult(param).then(res => {
          row.edit = false
          this.$message.success('修改成功！')
          this.fetchData()
        })
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      if (this.activeTabIndex === 0) {
        reasonList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === '0') {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 1) {
        levelList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]['edit'] = false
            if (res.data.list[i].status === '0') {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else {
        this.navClick(this.isActive)
      }
      this.tableKey = Math.random()
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '0'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          if (this.activeTabIndex === 0) {
            reasonUpdate(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else {
            levelUpdate(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          }
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '1'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          if (this.activeTabIndex === 0) {
            reasonUpdate(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else {
            levelUpdate(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          }
        }, () => {
          row.isChecked = true
        })
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    // 添加
    handleAdd() {
      this.siteForm.code = ''
      this.siteForm.name = ''
      this.siteForm.isDeleted = ''
      this.siteForm.remark = ''
      this.siteForm.quickSearch = ''
      this.addDialogVisible = true
    },
    // 目检结果管理
    handleManage() {
      this.manageDialogVisible = true
    },
    // 获取列表
    findController() {
      findController().then(res => {
        this.visualList = res.data
      })
    },
    // 新增目检结果管理
    addConfig() {
      this.visualList.push({
        name: '',
        id: 0,
        remark: '',
        status: 0
      })
    },
    // 修改当前目检结果
    updateColor(row) {
      if (row.name === '') {
        this.$message({
          type: 'error',
          message: '请填写目检结果!'
        })
        return
      }
      const param = {
        id: row.id,
        name: row.name,
        remark: row.remark
      }
      editController(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.findController()
      })
    },
    cancelSave() {
      this.findController()
    },
    // 保存当前目检结果的新增
    saveColor(row) {
      if (row.name === '') {
        this.$message({
          type: 'error',
          message: '请填写目检结果!'
        })
        return
      }
      const param = {
        name: row.name,
        remark: row.remark
      }
      createController(param).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.fetchData()
        this.findController()
      })
    },
    // 删除当前目检结果
    deleteColor(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteController({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
          this.findController()
        })
      }).catch(() => {
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.siteForm.code,
            name: this.siteForm.name,
            isDeleted: this.siteForm.isDeleted,
            remark: this.siteForm.remark,
            status: 0
          }
          if (this.activeTabIndex === 0) {
            reasonAdd(params).then(res => {
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
            params.quickSearch = this.siteForm.quickSearch
            levelAdd(params).then(res => {
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.activeTabIndex === 0) {
          reasonDelete({ id: row.id }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum = this.pageNum - 1
              }
              this.fetchData()
            }
          })
        } else {
          levelDelete({ id: row.id }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum = this.pageNum - 1
              }
              this.fetchData()
            }
          })
        }
      }).catch(() => {
      })
    }
  }
}

