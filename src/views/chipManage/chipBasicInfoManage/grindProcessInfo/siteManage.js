
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { scProductModel } from '@/api/pcChipCasting/pcChipCasting'
import { queryList, deletes, findSubstrateMeasureList, productList, customerList, add, update } from '@/api/chipBasicInfoManage/grindProcessInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validate = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入粘片厚度'))
      } else {
        const flags = parseFloat(value) + '' === value
        if (!flags) {
          callback(new Error('粘片厚度必须为数字'))
        } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
          callback(new Error('粘片厚度在0~1000之间'))
        } else if (value.indexOf('.') > -1) {
          const tofixlength = (value.split('.')[1]).length
          if (tofixlength > 2) {
            callback(new Error('粘片厚度小数点不超过两位'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    const validate1 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入粘片厚度阈值'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        callback(new Error('粘片厚度阈值在0~1000之间'))
      } else if (value.indexOf('.') > -1) {
        const tofixlength = (value.split('.')[1]).length
        if (tofixlength > 2) {
          callback(new Error('粘片厚度阈值小数点不超过两位'))
        } else {
          callback()
        }
      } else {
        const flags = parseFloat(value) + '' === value
        if (!flags) {
          callback(new Error('粘片厚度阈值必须为数字'))
        } else {
          callback()
        }
      }
    }
    const validate2 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入减薄厚度'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        callback(new Error('减薄厚度在0~1000之间'))
      } else if (value.indexOf('.') > -1) {
        const tofixlength = (value.split('.')[1]).length
        if (tofixlength > 2) {
          callback(new Error('减薄厚度小数点不超过两位'))
        } else {
          callback()
        }
      } else {
        const flags = parseFloat(value) + '' === value
        if (!flags) {
          callback(new Error('减薄厚度必须为数字'))
        } else {
          callback()
        }
      }
    }
    const validate3 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入减薄厚度阈值'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        callback(new Error('减薄厚度阈值在0~1000之间'))
      } else if (value.indexOf('.') > -1) {
        const tofixlength = (value.split('.')[1]).length
        if (tofixlength > 2) {
          callback(new Error('减薄厚度阈值小数点不超过两位'))
        } else {
          callback()
        }
      } else {
        const flags = parseFloat(value) + '' === value
        if (!flags) {
          callback(new Error('减薄厚度阈值必须为数字'))
        } else {
          callback()
        }
      }
    }
    const validate4 = (rule, value, callback) => {
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入抛光厚度阈值'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        callback(new Error('抛光厚度阈值在0~1000之间'))
      } else if (value.indexOf('.') > -1) {
        const tofixlength = (value.split('.')[1]).length
        if (tofixlength > 2) {
          callback(new Error('抛光厚度阈值小数点不超过两位'))
        } else {
          callback()
        }
      } else {
        const flags = parseFloat(value) + '' === value
        if (!flags) {
          callback(new Error('抛光厚度阈值必须为数字'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      machineForm: {
        productModelId: '',
        measureId: '',
        stickPly: '',
        stickVal: '',
        polishingPly: '',
        polishingVal: '',
        grindingPly: '',
        grindingVal: ''
      },
      rules: {
        productModelId: [{ required: true, message: '请选择产品型号', trigger: 'blur' }],
        measureId: [{ required: true, message: '请选择尺寸', trigger: 'blur' }],
        stickPly: [{ required: true, validator: validate, trigger: 'blur' }],
        stickVal: [{ required: true, validator: validate1, trigger: 'blur' }],
        polishingPly: [{ required: true, validator: validate2, trigger: 'blur' }],
        polishingVal: [{ required: true, validator: validate3, trigger: 'blur' }],
        grindingVal: [{ required: true, validator: validate4, trigger: 'blur' }]
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      productModelId: '',
      measureId: '',
      creator: '',
      productLists: [],
      measureList: [],
      userLists: [],
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.findSubstrateMeasureList()
    this.productList()
    this.customerList()
  },
  methods: {
    // 查询
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.measureList = res.data
      })
    },
    // 查询
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    // 查询
    customerList() {
      customerList().then(res => {
        this.userLists = res.data.list
      })
    },
    scProductModel() {
      let code = ''
      for (const item of this.productLists) {
        if (item.id === this.machineForm.productModelId) {
          code = item.code
          break
        }
      }
      const param = {
        code: code
      }
      scProductModel(param).then(res => {
        if (res.data.list.length > 0) {
          this.machineForm.grindingPly = res.data.list[0].grindPly
        }
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        productModelId: this.productModelId,
        measureId: this.measureId,
        creator: this.creator
      }
      queryList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.productModelId = ''
      this.measureId = ''
      this.creator = ''
      this.fetchData()
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
    // 添加
    handleAdd() {
      this.machineForm = {
        productModelId: '',
        measureId: '',
        stickPly: '',
        stickVal: '',
        polishingPly: '',
        polishingVal: '',
        grindingPly: '',
        grindingVal: ''
      }
      this.addDialogVisible = true
    },
    // 添加
    handleEdit(row) {
      this.currentId = row.id
      this.machineForm = {
        productModelId: row.productModelId,
        measureId: row.measureId,
        stickPly: row.stickPly,
        stickVal: row.stickVal,
        polishingPly: row.polishingPly,
        polishingVal: row.polishingVal,
        grindingPly: row.grindingPly,
        grindingVal: row.grindingVal
      }
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
          const params = {
            productModelId: this.machineForm.productModelId,
            measureId: this.machineForm.measureId,
            stickPly: this.machineForm.stickPly,
            stickVal: this.machineForm.stickVal,
            polishingPly: this.machineForm.polishingPly,
            polishingVal: this.machineForm.polishingVal,
            grindingPly: this.machineForm.grindingPly,
            grindingVal: this.machineForm.grindingVal,
            creator: sessionStorage.getItem('User-Id')
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
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            productModelId: this.machineForm.productModelId,
            measureId: this.machineForm.measureId,
            stickPly: this.machineForm.stickPly,
            stickVal: this.machineForm.stickVal,
            polishingPly: this.machineForm.polishingPly,
            polishingVal: this.machineForm.polishingVal,
            grindingPly: this.machineForm.grindingPly,
            grindingVal: this.machineForm.grindingVal,
            creator: sessionStorage.getItem('User-Id')
          }
          update(params).then(res => {
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deletes(params).then(res => {
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

