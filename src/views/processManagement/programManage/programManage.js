
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryProgram, deleteProgram, addProgram, updateProgram, processList } from '@/api/processManagement/programManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    const valuecheck1 = (rule, value, callback) => {
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
      programForm: {
        name: '',
        code: '',
        processId: '',
        remark: ''
      },
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      processLists: [],
      processName: '',
      rules: {
        name: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        code: [{ required: true, validator: valuecheck1, trigger: 'blur' }],
        processId: [{ required: true, message: '请选择工序', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.processList()
  },
  methods: {
    processList() {
      this.processLists = []
      const params = {
        pageNum: 1,
        pageSize: 100000
      }
      processList(params).then(res => {
        this.processLists = res.data.list
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
    tabClick(index) {
      this.activeTabIndex = index
    },
    handleEdit(row) {
      this.currentId = row.id
      this.programForm = {
        name: row.name,
        code: row.code,
        remark: row.remark,
        processId: row.processId
      }
      this.editDialogVisible = true
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        processName: this.processName
      }
      queryProgram(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === 0) {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.list.push(res.data.list[i])
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
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
          if (this.activeTabIndex === 0) {
            updateProgram(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else {
            updateProgram(requestParams).then(res => {
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
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          if (this.activeTabIndex === 0) {
            updateProgram(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else {
            updateProgram(requestParams).then(res => {
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
    // 添加
    handleAdd() {
      this.programForm = {
        name: '',
        code: '',
        remark: '',
        processId: ''
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
            name: this.programForm.name,
            code: this.programForm.code,
            remark: this.programForm.remark,
            status: 0,
            isDelete: 0,
            processId: this.programForm.processId
          }
          addProgram(params).then(res => {
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
            name: this.programForm.name,
            code: this.programForm.code,
            remark: this.programForm.remark,
            id: this.currentId,
            isDelete: 0,
            processId: this.programForm.processId
          }
          updateProgram(params).then(res => {
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
      this.$confirm('此操作将永久删除当前程序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id,
          isDelete: 1
        }
        deleteProgram(params).then(res => {
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

