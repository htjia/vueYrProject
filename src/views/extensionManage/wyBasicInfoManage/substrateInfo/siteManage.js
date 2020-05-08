
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  typePageList,
  supplierPageList,
  measurePageList,
  genrePageList,
  addSubstrateType,
  addSubstrateMeasure,
  addSupplier,
  addSubstrateGenre,
  deleteMeasure,
  deleteType,
  deleteGenre,
  deleteSupplier,
  updateSupplier,
  updateType,
  updateMeasure,
  updateGenre
} from '@/api/extensionManage/wyBasicInfoManage/substrateInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入编号'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    return {
      open: false,
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      typeList: [],
      supplierList: [],
      measureList: [],
      userOptions: [],
      substrateForm: {
        code: '',
        implication: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        implication: [{ required: true, validator: validateName, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchSupplierList()
    // this.fetchTypeList()
    // this.fetchMeasureList()
  },
  computed: {
    dialogTitle: function() {
      let title = ''
      switch (this.activeTabIndex) {
        case 0 : title = '衬底厂家'
          break
        case 1 : title = '衬底工艺'
          break
        case 2 : title = '衬底尺寸'
          break
        case 3 : title = '衬底类型'
          break
      }
      return title
    }
  },
  methods: {
    close() {
      this.open = false
    },
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      switch (index) {
        case 0 : this.fetchSupplierList()
          break
        case 1 : this.fetchTypeList()
          break
        case 2 : this.fetchMeasureList()
          break
        case 3 : this.fetchGenreList()
          break
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      switch (this.activeTabIndex) {
        case 0 : this.fetchSupplierList()
          break
        case 1 : this.fetchTypeList()
          break
        case 2 : this.fetchMeasureList()
          break
        case 3 : this.fetchGenreList()
          break
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      switch (this.activeTabIndex) {
        case 0 : this.fetchSupplierList()
          break
        case 1 : this.fetchTypeList()
          break
        case 2 : this.fetchMeasureList()
          break
        case 3 : this.fetchGenreList()
          break
      }
    },
    // 查询衬底厂家
    fetchSupplierList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      supplierPageList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询衬底工艺
    fetchTypeList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      typePageList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      measurePageList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    fetchGenreList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      genrePageList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.open = false
      this.substrateForm.code = ''
      this.substrateForm.implication = ''
      this.substrateForm.remark = ''
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
            code: this.substrateForm.code,
            name: this.substrateForm.implication,
            remark: this.substrateForm.remark,
            status: 0
          }
          if (this.activeTabIndex === 0) {
            addSupplier(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.fetchSupplierList()
              }
            })
          } else if (this.activeTabIndex === 1) {
            addSubstrateType(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.fetchTypeList()
              }
            })
          } else if (this.activeTabIndex === 2) {
            addSubstrateMeasure(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.fetchMeasureList()
              }
            })
          } else {
            addSubstrateGenre(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.fetchGenreList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 启用禁用
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      switch (this.activeTabIndex) {
        case 0 :
          updateSupplier(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchSupplierList()
          })
          break
        case 1 :
          updateType(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchTypeList()
          })
          break
        case 2 :
          updateMeasure(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchMeasureList()
          })
          break
        case 3 :
          updateGenre(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchGenreList()
          })
          break
      }
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
        const param = {
          id: row.id
        }
        switch (this.activeTabIndex) {
          case 0 :
            deleteSupplier(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchSupplierList()
            })
            break
          case 1 :
            deleteType(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchTypeList()
            })
            break
          case 2 :
            deleteMeasure(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchMeasureList()
            })
            break
          case 3 :
            deleteGenre(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchGenreList()
            })
            break
        }
      }).catch(() => {
      })
    }
  }
}

