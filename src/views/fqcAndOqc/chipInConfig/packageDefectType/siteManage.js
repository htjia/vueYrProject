
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, insert, remove, update } from '@/api/fqc/packageDefectType'
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
      machineForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      findList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    switchChange(row) {
      let alertMsg = ''
      if (!row.status) {
        alertMsg = '是否确认弃用'
      } else {
        alertMsg = '是否确认启用'
      }
      this.$confirm(alertMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          status: row.status ? 0 : 1
        }
        update(param).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        row.status = !row.status
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.name = ''
      this.addDialogVisible = true
      setTimeout(() => {
        this.$refs.nameInput.focus()
      }, 100)
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
            name: this.machineForm.name
          }
          insert(params).then(res => {
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
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    }
  }
}

