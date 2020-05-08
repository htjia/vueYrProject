
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, queryLists, addDetail, updateDetail, deleteDetail } from '@/api/chipBasicInfoManage/codeManage/wavelengthCode'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateCode = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入代码'))
      } else {
        callback()
      }
    }
    const validateCodes = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入亮度'))
      } else {
        // const str = value.substring(0, 1)
        // if (str !== 'L' && str !== 'P') {
        //   callback(new Error('代码开头必须是L或P'))
        // } else {
        callback()
        // }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      machineForm: {
        code: '',
        scope1: '',
        scope: ''
      },
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        scope1: [{ required: true, validator: validateCodes, trigger: 'blur' }],
        scope: [{ required: true, validator: validateCodes, trigger: 'blur' }]
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      bcList: [],
      scope: '',
      code: '',
      currentId: 0,
      isActive: 0
    }
  },
  mounted() {
    this.fetchData()
    this.queryList()
  },
  methods: {
    navClick(type) {
      if (type !== this.isActive) {
        this.pageNum = 1
        this.code = ''
        this.scope = ''
        this.isActive = type
        this.fetchData()
        this.queryList()
      }
    },
    queryList() {
      const params = {
        type: this.isActive,
        pageNum: 1,
        pageSize: 100000
      }
      queryList(params).then(res => {
        this.bcList = res.data.list
      })
    },
    clearAll() {
      this.pageNum = 1
      this.code = ''
      this.scope = ''
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        code: this.code,
        scope: this.scope,
        type: this.isActive
      }
      queryLists(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.scope = ''
      this.machineForm.scope1 = ''
      this.addDialogVisible = true
    },
    // 修改
    handleEdit(row) {
      this.currentId = row.id
      const scope = row.scope.split('-')
      this.machineForm.code = row.code
      this.machineForm.scope = scope[0]
      this.machineForm.scope1 = scope[1]
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.machineForm.code,
            scope: this.machineForm.scope + '-' + this.machineForm.scope1,
            creator: sessionStorage.getItem('User-Id'),
            type: this.isActive
          }
          addDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
              this.queryList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.machineForm.code,
            scope: this.machineForm.scope + '-' + this.machineForm.scope1,
            creator: sessionStorage.getItem('User-Id'),
            id: this.currentId,
            type: this.isActive
          }
          updateDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
              this.queryList()
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
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前波长信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteDetail(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
            this.queryList()
          }
        })
      })
    }
  }
}

