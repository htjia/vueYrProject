import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findTree, add, remove } from '@/api/background/deptManager'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateMenuName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入部门名称'))
      } else {
        callback()
      }
    }
    const validateMenuRouter = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入部门编号'))
      } else {
        callback()
      }
    }
    return {
      expandAll: true,
      dialogVisible: false,
      editDialogVisible: false,
      isLoading: false,
      isLoadtree: false,
      detailDialogVisible: false,
      filterText: '',
      code: '',
      name: '',
      list: [],
      menuForm: {
        deptName: '',
        deptCode: ''
      },
      rules: {
        deptName: [{ required: true, validator: validateMenuName, trigger: 'blur' }],
        deptCode: [{ required: true, validator: validateMenuRouter, trigger: 'blur' }]
      },
      parentid: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.isLoadtree = true
      const params = {
        code: this.code,
        name: this.name
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.list = res.data
        }
        this.isLoadtree = false
      })
    },
    clearAll() {
      this.code = ''
      this.name = ''
      this.fetchData()
    },
    // 添加根目录
    handleAdd() {
      this.currentNode = null
      this.menuForm.deptName = ''
      this.menuForm.deptCode = ''
      this.dialogVisible = true
    },
    // 添加按钮
    append(data) {
      this.menuForm.deptName = ''
      this.menuForm.deptCode = ''
      this.dialogVisible = true
      this.currentNode = data
    },
    // 添加fun
    addNode(id) {
      const params = {
        parentId: id,
        name: this.menuForm.deptName,
        code: this.menuForm.deptCode
      }
      add(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.dialogVisible = false
          this.fetchData()
        }
      })
    },
    // 删除
    remove(data) {
      console.log(data.id)
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id: data.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    // 修改按钮
    edit(row) {
      this.parentid = row.parentId
      this.currentNode = row
      this.menuForm.deptName = row.name
      this.menuForm.deptCode = row.code
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentNode) {
            this.addNode(this.currentNode.id)
          } else {
            this.addNode('root')
          }
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
            id: this.currentNode.id,
            parentId: this.currentNode.parentId,
            name: this.menuForm.deptName,
            code: this.menuForm.deptCode
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.dialogVisible = false
              this.fetchData()
            }
          })
          this.editDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.dialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
