
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  KHfindList,
  KHdeleteFake,
  KHsaveObj,
  BCfindList,
  BCdeleteFake,
  BCsaveObj
} from '@/api/orderManage/orderBasicInfo'

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
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.KHfindList()
  },
  computed: {
    dialogTitle: function() {
      let title = ''
      switch (this.activeTabIndex) {
        case 0 : title = '衬底厂家'
          break
        case 1 : title = '衬底工艺'
          break
      }
      return title
    }
  },
  methods: {
    // 查询筛选条件
    handleSearch() {
      switch (this.activeTabIndex) {
        case 0 : this.KHfindList()
          break
        case 1 : this.BCfindList()
          break
      }
    },
    close() {
      this.open = false
    },
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.name = ''
      this.activeTabIndex = index
      switch (index) {
        case 0 : this.KHfindList()
          break
        case 1 : this.BCfindList()
          break
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      switch (this.activeTabIndex) {
        case 0 : this.KHfindList()
          break
        case 1 : this.BCfindList()
          break
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      switch (this.activeTabIndex) {
        case 0 : this.KHfindList()
          break
        case 1 : this.BCfindList()
          break
      }
    },
    // 查询衬底厂家
    KHfindList() {
      const params = {
        name: this.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      KHfindList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询衬底工艺
    BCfindList() {
      const params = {
        name: this.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      BCfindList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.open = false
      this.substrateForm.anme = ''
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
            status: 0
          }
          if (this.activeTabIndex === 0) {
            KHsaveObj(params).then(res => {
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
            BCsaveObj(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.BCfindList()
              }
            })
          }
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
        switch (this.activeTabIndex) {
          case 0 :
            KHdeleteFake(param).then(res => {
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
            break
          case 1 :
            BCdeleteFake(param).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (this.list.length === 1 && this.pageNum !== 1) {
                  this.pageNum -= 1
                }
                this.BCfindList()
              }
            })
            break
        }
      })
    }
  }
}

