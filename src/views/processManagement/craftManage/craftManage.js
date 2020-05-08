
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryCraft, deleteCraft, addCraft, updateCraft } from '@/api/processManagement/craftManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName1 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    const validateName2 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
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
      searchName: '',
      currentId: '',
      list: [],
      userOptions: [],
      craftForm: {
        name: '',
        code: '',
        remark: ''
      },
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      rules: {
        name: [{ required: true, validator: validateName1, trigger: 'blur' }],
        code: [{ required: true, validator: validateName2, trigger: 'blur' }]
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
      this.craftForm.name = row.name
      this.craftForm.remark = row.remark
      this.craftForm.code = row.code
      this.editDialogVisible = true
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        name: this.searchName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      queryCraft(params).then(res => {
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
      this.craftForm.name = ''
      this.craftForm.code = ''
      this.craftForm.remark = ''
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
            name: this.craftForm.name,
            code: this.craftForm.code,
            remark: this.craftForm.remark
          }
          addCraft(params).then(res => {
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
          const params = {
            name: this.craftForm.name,
            code: this.craftForm.code,
            remark: this.craftForm.remark,
            id: this.currentId
          }
          updateCraft(params).then(res => {
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
      this.$confirm('此操作将永久删除当前工艺信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteCraft(params).then(res => {
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
      })
    }
  }
}

