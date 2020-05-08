
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { deleteAny, findList, disableEnable, save } from '@/api/baobiao/baofeiType'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validatecode = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      manageDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      typeList: [],
      colorList: [],
      supplierList: [],
      measureList: [],
      userOptions: [],
      substrateForm: {
        code: '',
        implication: '',
        series: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, validator: validatecode, trigger: 'blur' }],
        series: [{ required: true, message: '请选择光色系列', trigger: 'change' }],
        implication: [{ required: true, validator: validateName, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findProduceTypeList()
  },
  computed: {},
  methods: {
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.findProduceTypeList()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.findProduceTypeList()
    },
    handleEdit(row) {
      row.edit = true
    },
    handleCancel(row) {
      row.edit = false
      this.findStructureTypeList()
    },
    // 查询生产类型
    findProduceTypeList() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
    // 添加
    handleAdd() {
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
            name: this.substrateForm.implication,
            remark: this.substrateForm.remark
          }
          save(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.findProduceTypeList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 启用禁用
    switchChange(row) {
      if (row.status) {
        this.$confirm('确定启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const requestParams = {
            id: row.id,
            status: row.status ? 0 : 1
          }
          disableEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findProduceTypeList()
          })
        }, () => {
          row.status = false
        })
      } else {
        this.$confirm('确定弃用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const requestParams = {
            id: row.id,
            status: row.status ? 0 : 1
          }
          disableEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findProduceTypeList()
          })
        }, () => {
          row.status = true
        })
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
        deleteAny(param).then(res => {
          if (this.list.length === 1 && this.pageNum !== 1) {
            this.pageNum -= 1
          }
          this.findProduceTypeList()
        })
      }).catch(() => {
      })
    }
  }
}

