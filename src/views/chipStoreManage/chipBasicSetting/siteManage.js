
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  storehouseTypeList, placeOriginList, storehouseTypeAdd, storehouseTypeDelete, placeOriginAdd, placeOriginDelete, reservedFieldList, reservedFieldAdd,
  reservedFieldAddOption, findReservedFieldOption, deleteReservedFieldOption
} from '@/api/chipStoreManage/chipBasicSetting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
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
      editDialogVisible: false,
      activeTabIndex: '入库类型',
      pageNum: 1,
      pageSize: 10000,
      totalPage: 0,
      list: [],
      dialogList: [],
      reservedFields: [],
      rieldsOption: [
        {
          name: '选项型'
        }
      ],
      filedValue: '选项型',
      addForm: {
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getStorehouseTypeList()
    this.findReservedFieldList()
  },
  methods: {
    handleAddItem() {
      if (this.dialogList.length === 5) {
        this.$message({
          type: 'error',
          message: '预留字段最多可设置5个!'
        })
        return false
      }
      this.dialogList.push({
        name: '',
        remark: ''
      })
      setTimeout(() => {
        this.$refs[Object.keys(this.$refs)[this.dialogList.length - 1]].focus()
      }, 100)
    },
    handleAddReservedFields() {
      this.editDialogVisible = true
      this.findReservedFieldList()
    },
    // 对象数组克隆
    deepClone(obj) {
      const newObj = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = (obj && typeof obj[key] === 'object') ? this.deepClone(obj[key]) : obj[key]
          }
        }
      }
      return newObj
    },
    findReservedFieldList() {
      reservedFieldList().then(res => {
        if (res.data.length === 0) {
          this.tabClick('入库类型')
        }
        this.dialogList = res.data
        this.reservedFields = this.deepClone(res.data)
      })
    },
    // 新增预留字段
    submitReservedField() {
      const params = []
      let flag = false
      const nameList = []
      this.dialogList.map(item => {
        if (item.name.toString().trim() === '') {
          flag = true
        }
        nameList.push(item.name)
        params.push({
          id: item.id ? item.id : '',
          code: item.code ? item.code : '',
          name: item.name,
          remark: item.remark
        })
      })
      if (Array.from(new Set(nameList)).length !== this.dialogList.length) {
        this.$message({
          type: 'error',
          message: '预留字段名称不能重复!'
        })
        return false
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '预留字段名称不能为空!'
        })
        return false
      }
      reservedFieldAdd(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.findReservedFieldList()
        this.editDialogVisible = false
      })
    },
    deleteInItem(index) {
      // 此操作会删除仓库内当前字段的全部历史数据且无法恢复，请慎重操作，是否仍要删除？
      this.$confirm('此操作会删除仓库内当前字段的全部历史数据且无法恢复，请慎重操作，是否仍要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogList.splice(index, 1)
      })
    },
    addDialogClose() {
      this.addForm.name = ''
      this.addForm.remark = ''
    },
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      this.list = []
      if (index === '入库类型') {
        this.getStorehouseTypeList()
      } else if (index === '芯片产地') {
        this.findPlaceOriginList()
      } else {
        this.findReservedFieldListOption()
      }
    },
    // 查询入库类型
    getStorehouseTypeList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      storehouseTypeList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 产地查询
    findPlaceOriginList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      placeOriginList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.addForm.remark = ''
      this.addDialogVisible = true
    },
    yearChange() {
      if (this.ageLimitForm.year.length > 5) {
        this.ageLimitForm.year = this.ageLimitForm.year.substr(0, 5)
      }
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeTabIndex === '入库类型') {
            const params = {
              name: this.addForm.name,
              remark: this.addForm.remark
            }
            storehouseTypeAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.getStorehouseTypeList()
              }
            })
          } else if (this.activeTabIndex === '芯片产地') {
            const params = {
              name: this.addForm.name,
              remark: this.addForm.remark
            }
            placeOriginAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findPlaceOriginList()
              }
            })
          } else {
            const params = {
              feildId: this.activeTabIndex,
              name: this.addForm.name,
              remark: this.addForm.remark
            }
            reservedFieldAddOption(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addDialogVisible = false
                this.findReservedFieldListOption()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    findReservedFieldListOption() {
      const params = {
        feild: this.activeTabIndex
      }
      findReservedFieldOption(params).then(res => {
        this.list = res.data
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
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
        if (this.activeTabIndex === '入库类型') {
          storehouseTypeDelete(param).then(res => {
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.getStorehouseTypeList()
          })
        } else if (this.activeTabIndex === '芯片产地') {
          placeOriginDelete(param).then(res => {
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.findPlaceOriginList()
          })
        } else {
          deleteReservedFieldOption(param).then(res => {
            this.findReservedFieldListOption()
          })
        }
      }).catch(() => {
      })
    }
  }
}

