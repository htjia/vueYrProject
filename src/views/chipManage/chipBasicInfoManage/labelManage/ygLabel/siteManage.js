
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findFormEdit, findFormTitle, pageList, insert, deleteLabel, update } from '@/api/chipBasicInfoManage/labelManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      machineForm: {
        colorId: '',
        modelId: ''
      },
      rules: {
        colorId: [{ required: true, message: '请选择光色', trigger: 'blur' }],
        modelId: [{ required: true, message: '请选择型号', trigger: 'blur' }]
      },
      model: '',
      modelList: [],
      colorList: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      addLabelList: [],
      titleList: []
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findFormEdit()
    this.findFormTitle()
  },
  methods: {
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data
      })
    },
    findFormEdit() {
      const params = {
        id: 1
      }
      findFormEdit(params).then(res => {
        this.addLabelList = res.data
        const validateCode = (rule, value, callback) => {
          value = value + ''
          if (value.trim().length === 0) {
            callback(new Error('输入不能为空'))
          } else {
            callback()
          }
        }
        for (const item of this.addLabelList) {
          if (item.enname !== 'order_no') {
            this.rules[item.enname] = [{ required: true, validator: validateCode, trigger: 'blur' }]
          }
        }
      })
    },
    findFormTitle() {
      const params = {
        id: 1
      }
      findFormTitle(params).then(res => {
        this.titleList = res.data
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (this.titleList.length + 1 === columnIndex) {
        return 'background: #fff'
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        customerId: 1,
        modelId: this.model
      }
      pageList(params).then(res => {
        this.list = res.data.list
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 添加
    handleAdd() {
      var machineForm = {
        colorId: '',
        modelId: ''
      }
      for (const item of this.addLabelList) {
        machineForm[item.enname] = ''
      }
      this.machineForm = { ...machineForm }
      this.addDialogVisible = true
      this.findColorList()
      this.findModelList()
    },
    handleEdit(row) {
      var machineForm = {
        colorId: row.color_id,
        modelId: row.model_id
      }
      machineForm.id = row.id
      for (const item of this.addLabelList) {
        machineForm[item.enname] = row[item.enname]
      }
      this.machineForm = { ...machineForm }
      this.editDialogVisible = true
      this.findColorList()
      this.findModelList()
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.addDialogVisible = false
      this.editDialogVisible = false
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var msg = ''
          const num = /^[0-9]+.?[0-9]*$/
          for (const item of this.addLabelList) {
            if (item.enname.indexOf('_Min') > -1) {
              const lab = item.enname.substring(0, item.enname.length - 4)
              if (!num.test(this.machineForm[lab + '_Min'])) {
                msg = lab + '_Min必须为数字'
              }
              if (!num.test(this.machineForm[lab + '_Max'])) {
                msg = lab + '_Max必须为数字'
              }
              if (parseFloat(this.machineForm[lab + '_Min']) > parseFloat(this.machineForm[lab + '_Max'])) {
                msg = lab + '最小值不能大于最大值'
              }
            }
          }
          if (msg !== '') {
            this.$message({
              type: 'error',
              message: msg
            })
          } else {
            this.machineForm.creator = sessionStorage.getItem('User-Id')
            this.machineForm.customerId = 1
            insert(this.machineForm).then(res => {
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var msg = ''
          const num = /^[0-9]+.?[0-9]*$/
          for (const item of this.addLabelList) {
            if (item.enname.indexOf('_Min') > -1) {
              const lab = item.enname.substring(0, item.enname.length - 4)
              if (!num.test(this.machineForm[lab + '_Min'])) {
                msg = lab + '_Min必须为数字'
              }
              if (!num.test(this.machineForm[lab + '_Max'])) {
                msg = lab + '_Max必须为数字'
              }
              if (parseFloat(this.machineForm[lab + '_Min']) > parseFloat(this.machineForm[lab + '_Max'])) {
                msg = lab + '最小值不能大于最大值'
              }
            }
          }
          if (msg !== '') {
            this.$message({
              type: 'error',
              message: msg
            })
          } else {
            this.machineForm.creator = sessionStorage.getItem('User-Id')
            this.machineForm.customerId = 1
            update(this.machineForm).then(res => {
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前标签信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteLabel(params).then(res => {
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

