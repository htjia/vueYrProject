
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryColor, deleteColor, addColor, updateColor } from '@/api/processManagement/colorModelsManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateColor = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const az = new RegExp('[a-z]')
      const num = new RegExp('[0-9]')
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
      } else {
        if (chinese.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else if (az.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else if (num.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else if (pattern.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else {
          callback()
        }
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
      editDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      currentId: '',
      list: [],
      userOptions: [],
      colorModelForm: {
        name: '',
        code: '',
        remark: ''
      },
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      rules: {
        code: [{ required: true, validator: validateColor, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
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
        name: row.name,
        code: row.code,
        remark: row.remark
      }
      this.editDialogVisible = true
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      queryColor(params).then(res => {
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
        name: '',
        code: '',
        remark: ''
      }
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
          const params = {
            name: this.colorModelForm.name,
            code: this.colorModelForm.code,
            remark: this.colorModelForm.remark
          }
          addColor(params).then(res => {
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
            name: this.colorModelForm.name,
            code: this.colorModelForm.code,
            remark: this.colorModelForm.remark,
            id: this.currentId
          }
          updateColor(params).then(res => {
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
        deleteColor(params).then(res => {
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

