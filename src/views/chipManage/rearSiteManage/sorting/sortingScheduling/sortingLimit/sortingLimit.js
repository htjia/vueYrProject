import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { mulAdd, mulFind, findAll, update, remove } from '@/api/chipManage/rearSiteManage/sorting/sortingLimit'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      queryDialogVisible: false,
      editDialogVisible: false,
      list: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      isMulFind: false,
      currentId: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      beginDate: new Date(new Date().toLocaleDateString()).getTime(),
      endDate: new Date().getTime(),
      searchKeys: {
        waferId: '',
        reason: ''
      },
      mulWaferID: '',
      mulForm: {
        mulWaferID: ''
      },
      mulRules: {
        mulWaferID: [{ required: true, message: '请输入WaferID', trigger: 'blur' }]
      },
      addForm: {
        mulWaferID: '',
        reason: ''
      },
      editForm: {
        waferId: '',
        reason: ''
      },
      addRules: {
        mulWaferID: [{ required: true, message: '请输入WaferID', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入限制原因', trigger: 'blur' }]
      },
      editRules: {
        waferId: [{ required: true, message: '请输入WaferID', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入限制原因', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 每页数量改变timeRadio
    sizeChange(pageSize) {
      this.pageSize = pageSize
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
        this.fetchData()
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
        this.fetchData()
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      this.isMulFind = false
      const params = {
        waferId: this.searchKeys.waferId,
        reason: this.searchKeys.reason,
        pageNum: this.pageNum,
        pageSize: this.pageSize

      }
      findAll(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.addDialogVisible = false
      this.queryDialogVisible = false
      this.editDialogVisible = false
    },
    // 批量查询
    mulSearchClick() {
      this.queryDialogVisible = true
    },
    handleAdd() {
      this.addForm.mulWaferID = ''
      this.addForm.reason = ''
      this.addDialogVisible = true
    },
    resetForm(formName) {
      this.addDialogVisible = false
      this.queryDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    mulWaferFind() {
      this.listLoading = true
      this.isMulFind = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mulWaferId: this.mulWaferID
      }
      mulFind(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.queryDialogVisible = false
      })
    },
    // 查询提交
    SearchClick() {
      this.fetchData()
    },
    clearSearch() {
      this.searchKeys.waferId = ''
      this.searchKeys.reason = ''
      this.fetchData()
    },
    // 批量查询提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mulWaferID = this.mulForm.mulWaferID
          this.mulWaferFind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加提交
    addSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            mulWaferID: this.addForm.mulWaferID,
            reason: this.addForm.reason,
            creator: sessionStorage.getItem('User-Id')
          }
          mulAdd(params).then(res => {
            if (res.code === 0) {
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
    editSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            waferId: this.editForm.waferId,
            id: this.currentId,
            reason: this.editForm.reason,
            creator: sessionStorage.getItem('User-Id')
          }
          update(params).then(res => {
            if (res.code === 0 & res.data !== null) {
              this.editDialogVisible = false
              if (this.isMulFind) {
                this.mulWaferFind()
              } else {
                this.fetchData()
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      this.editForm.waferId = row.waferId
      this.editForm.reason = row.reason
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
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
            if (this.isMulFind) {
              this.mulWaferFind()
            } else {
              this.fetchData()
            }
          }
        })
      }).catch(() => {
      })
    }
  }
}
