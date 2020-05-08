
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  findList,
  insert,
  deletes
} from '@/api/chipBasicInfoManage/orderBasicInfo'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      open: false,
      listLoading: false,
      addDialogVisible: false,
      name: '', // 客户名称
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      substrateForm: {
        name: '',
        code: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.KHfindList()
  },
  methods: {
    // 查询筛选条件
    handleSearch() {
      this.KHfindList()
    },
    close() {
      this.open = false
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.KHfindList()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.KHfindList()
    },
    // 查询衬底厂家
    KHfindList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.open = false
      this.substrateForm.name = ''
      this.substrateForm.code = ''
      this.substrateForm.remark = ''
      this.addDialogVisible = true
      setTimeout(() => {
        this.$refs.name.focus()
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
            name: this.substrateForm.name,
            remark: this.substrateForm.remark,
            code: this.substrateForm.code,
            status: 0
          }
          insert(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.KHfindList()
            }
          })
        } else {
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
      const param = {
        id: row.id
      }
      this.$confirm(`是否确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletes(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.KHfindList()
          }
        })
      })
    }
  }
}

