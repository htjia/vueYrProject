
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, queryLists, addDetail, updateDetail, deleteDetail } from '@/api/chipBasicInfoManage/codeManage/comprehensiveGradeCode'
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
    const validateCode1 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入综合等级'))
      } else {
        callback()
      }
    }
    const validateCode2 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入分类'))
      } else {
        callback()
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
        scope: '',
        scope1: '',
        quality: '',
        classify: ''
      },
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        scope: [{ required: true, validator: validateCode1, trigger: 'blur' }],
        scope1: [{ required: true, validator: validateCode1, trigger: 'blur' }],
        quality: [{ required: true, message: '请选择正副品', trigger: 'blur' }],
        classify: [{ required: true, validator: validateCode2, trigger: 'blur' }]
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      bcList: [],
      scope: '',
      code: '',
      currentId: 0,
      qualityList: [
        {
          id: 0,
          name: '正品'
        },
        {
          id: 1,
          name: '副品'
        }
      ]
    }
  },
  mounted() {
    this.fetchData()
    this.queryList()
  },
  methods: {
    queryList() {
      queryList().then(res => {
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
        scope: this.scope
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
      this.machineForm.classify = ''
      this.machineForm.quality = ''
      this.addDialogVisible = true
    },
    // 修改
    handleEdit(row) {
      this.currentId = row.id
      this.machineForm.code = row.code
      const scope = row.scope.split('-')
      this.machineForm.scope = scope[0]
      this.machineForm.scope1 = scope[1]
      this.machineForm.classify = row.classify
      this.machineForm.quality = row.quality
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
            classify: this.machineForm.classify,
            quality: this.machineForm.quality,
            creator: sessionStorage.getItem('User-Id')
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
            classify: this.machineForm.classify,
            quality: this.machineForm.quality,
            creator: sessionStorage.getItem('User-Id'),
            id: this.currentId
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
      this.$confirm('此操作将永久删除当前综合等级信息, 是否继续?', '提示', {
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

