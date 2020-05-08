
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  findProduceType, deleteProduceType, addProduceType, updateProduceType, findStructureType, deleteStructureType, addStructureType, updateStructureType,
  findStove, deleteStove, addStove, updateStove, findStandbyReason, deleteStandbyReason, addStandbyReason, updateStandbyReason,
  deleteController, createController, editController, findController, updateSeries
} from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/chipInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validatecode = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      manageDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      typeList: [],
      colorList: [],
      supplierList: [],
      measureList: [],
      userOptions: [],
      substrateForm: {
        code: '',
        implication: '',
        series: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, validator: validatecode, trigger: 'blur' }],
        series: [{ required: true, message: '请选择光色系列', trigger: 'change' }],
        implication: [{ required: true, validator: validateName, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findController()
    this.findProduceTypeList()
  },
  computed: {
    dialogTitle: function() {
      let title = ''
      switch (this.activeTabIndex) {
        case 0 : title = '生产类型'
          break
        case 1 : title = '结构类型'
          break
        case 2 : title = '炉次'
          break
        case 3 : title = '待机原因'
          break
      }
      return title
    }
  },
  methods: {
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      switch (index) {
        case 0 : this.findProduceTypeList()
          break
        case 1 : this.findStructureTypeList()
          break
        case 2 : this.findStoveList()
          break
        case 3 : this.findStandbyReasonList()
          break
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      switch (this.activeTabIndex) {
        case 0 : this.findProduceTypeList()
          break
        case 1 : this.findStructureTypeList()
          break
        case 2 : this.findStoveList()
          break
        case 3 : this.findStandbyReasonList()
          break
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      switch (this.activeTabIndex) {
        case 0 : this.findProduceTypeList()
          break
        case 1 : this.findStructureTypeList()
          break
        case 2 : this.findStoveList()
          break
        case 3 : this.findStandbyReasonList()
          break
      }
    },
    cancelSave() {
      this.findController()
    },
    handleEdit(row) {
      row.edit = true
    },
    handleCancel(row) {
      row.edit = false
      this.findStructureTypeList()
    },
    handleSubmitItem(row) {
      const param = {
        id: row.id,
        series: row.series
      }
      updateSeries(param).then(res => {
        row.edit = false
        this.findStructureTypeList()
      })
    },
    // 查询生产类型
    findProduceTypeList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findProduceType(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询结构类型
    findStructureTypeList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findStructureType(params).then(res => {
        res.data.list.map((item) => {
          item.edit = false
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询炉次
    findStoveList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findStove(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 待机原因查询
    findStandbyReasonList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findStandbyReason(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.substrateForm.code = ''
      this.substrateForm.implication = ''
      this.substrateForm.series = ''
      this.substrateForm.remark = ''
      this.addDialogVisible = true
      this.findController()
    },
    // 光色系列管理
    handleManage() {
      this.manageDialogVisible = true
    },
    // 获取列表
    findController() {
      findController().then(res => {
        this.colorList = res.data
      })
    },
    // 新增光色管理
    addConfig() {
      this.colorList.push({
        name: '',
        id: 0,
        remark: '',
        status: 0
      })
    },
    // 修改当前光色
    updateColor(row) {
      if (row.name === '') {
        this.$message({
          type: 'error',
          message: '请填写光色系列!'
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
    // 保存当前光色的新增
    saveColor(row) {
      if (row.name === '') {
        this.$message({
          type: 'error',
          message: '请填写光色系列!'
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
        this.findController()
      })
    },
    // 删除当前光色系列
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
            code: this.substrateForm.code,
            name: this.substrateForm.implication,
            series: this.substrateForm.series,
            remark: this.substrateForm.remark,
            status: 0
          }
          if (this.activeTabIndex === 0) {
            addProduceType(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findProduceTypeList()
              }
            })
          } else if (this.activeTabIndex === 1) {
            addStructureType(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findStructureTypeList()
              }
            })
          } else if (this.activeTabIndex === 2) {
            addStove(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findStoveList()
              }
            })
          } else {
            addStandbyReason(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findStandbyReasonList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 启用禁用
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      switch (this.activeTabIndex) {
        case 0 :
          updateProduceType(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findProduceTypeList()
          })
          break
        case 1 :
          updateStructureType(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findStructureTypeList()
          })
          break
        case 2 :
          updateStove(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findStoveList()
          })
          break
        case 3 :
          updateStandbyReason(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findStandbyReasonList()
          })
          break
      }
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        switch (this.activeTabIndex) {
          case 0 :
            deleteProduceType(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findProduceTypeList()
            })
            break
          case 1 :
            deleteStructureType(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findStructureTypeList()
            })
            break
          case 2 :
            deleteStove(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findStoveList()
            })
            break
          case 3 :
            deleteStandbyReason(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findStandbyReasonList()
            })
        }
      }).catch(() => {
      })
    }
  }
}

