
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryColorModel, deleteColorModel, addColorModel, updateColorModel, findColorList } from '@/api/processManagement/colorModelsManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateModel = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const az = new RegExp('[a-z]')
      // const num = new RegExp('[0-9]')
      if (value.trim().length === 0) {
        callback(new Error('型号不能为空'))
      } else {
        if (chinese.test(value)) {
          callback(new Error('型号必须为大写字母'))
        } else if (az.test(value)) {
          callback(new Error('型号必须为大写字母'))
        } else if (pattern.test(value)) {
          callback(new Error('型号不能包含特殊字符'))
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
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      currentId: '',
      list: [],
      userOptions: [],
      colorModelForm: {
        colors: '',
        code: '',
        name: '',
        remark: '',
        codeMode: ''
      },
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      rules: {
        colors: [{ required: true, message: '请选择光色', trigger: 'blur' }],
        code: [{ required: true, validator: validateModel, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
      colorList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
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
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          const requestParams = {
            id: row.id,
            status: row.status
          }
          updateColorModel(requestParams).then(res => {
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
        this.$confirm('确定弃用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          updateColorModel(requestParams).then(res => {
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    handleEdit(row) {
      this.currentId = row.id
      this.colorModelForm = {
        colors: row.colorId,
        code: row.code,
        name: row.name,
        remark: row.remark
      }
      this.editDialogVisible = true
      this.findColorList()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        model: this.model,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      queryColorModel(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.colorModelForm = {
        colors: '',
        code: '',
        name: '',
        remark: ''
      }
      this.addDialogVisible = true
      this.findColorList()
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
            colorId: this.colorModelForm.colors,
            code: this.colorModelForm.code,
            name: this.colorModelForm.name,
            remark: this.colorModelForm.remark
          }
          addColorModel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
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
          const params = {
            colorId: this.colorModelForm.colors,
            code: this.colorModelForm.code,
            name: this.colorModelForm.name,
            remark: this.colorModelForm.remark,
            id: this.currentId
          }
          updateColorModel(params).then(res => {
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
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前光色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteColorModel(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

