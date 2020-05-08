
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, add, deleteSetting, enabledisable } from '@/api/versionManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      siteForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  computed: {
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      query(requestParams).then(res => {
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
          row.status = '0'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisable(requestParams).then(res => {
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
          row.status = '1'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisable(requestParams).then(res => {
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
    // 添加
    handleAdd() {
      this.siteForm.code = ''
      this.siteForm.name = ''
      this.siteForm.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      console.log(123)
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.siteForm.code,
            name: this.siteForm.name,
            remark: this.siteForm.remark
          }
          add(params).then(res => {
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除该设置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSetting(row.id).then(res => {
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
      }).catch(() => {
      })
    }
  }
}

