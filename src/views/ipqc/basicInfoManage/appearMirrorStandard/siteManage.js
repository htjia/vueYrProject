
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, addList, updateList, updateByStatus, remove, updateSequence, getNumList, updateNum } from '@/api/ipqc/basic/appearMirrorStandard'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateTest = (rule, value, callback) => {
      const num = new RegExp('[0-9]')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('内容不可为空'))
      } else {
        if (!num.test(value)) {
          callback(new Error('检验批次必须1~99的正整数'))
        } else if (parseInt(value) <= 0 || parseInt(value) >= 100) {
          callback(new Error('检验批次必须1~99的正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      checkDialogVisible: false,
      isDisable: '',
      content: '',
      programForm: {
        name: '',
        num: ''
      },
      programForms: {
        num: ''
      },
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        num: [{ required: true, validator: validateTest, trigger: 'blur' }]
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
    const _this = this
    setTimeout(function() {
      _this.rowDrop()
    }, 1000)
  },
  methods: {
    // 重置
    clearSearch() {
      this.content = ''
      this.isDisable = ''
      this.handleSearch()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 30000,
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
        const upDate = this.list[index - 1]
        this.list.splice(index - 1, 1)
        this.list.splice(index, 0, upDate)
        this.updateSequence()
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
        const downDate = this.list[index + 1]
        this.list.splice(index + 1, 1)
        this.list.splice(index, 0, downDate)
        this.updateSequence()
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
            _this.updateSequence()
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
          updateByStatus(requestParams).then(res => {
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
          updateByStatus(requestParams).then(res => {
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
        name: row.name
      }
      this.editDialogVisible = true
    },
    updateSequence() {
      const params = []
      for (let i = 0; i < this.list.length; i++) {
        params.push({
          id: this.list[i].id,
          sequence: i + 1
        })
      }
      updateSequence(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    // 添加
    handleAdd() {
      this.programForm = {
        name: ''
      }
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.checkDialogVisible = false
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
            category: 0,
            name: this.programForm.name,
            sequence: sequence,
            status: 0
          }
          addList(params).then(res => {
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
            id: this.rowInfo.id,
            category: 0,
            name: this.programForm.name,
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
    submitEditForms(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            num: this.programForms.num
          }
          updateNum(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.checkDialogVisible = false
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
        const params = {
          id: row.id
        }
        remove(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    checkConfig() {
      this.checkDialogVisible = true
      getNumList().then(res => {
        if (res.code === 0) {
          this.programForms.num = res.data.num
        }
      })
    }
  }
}

