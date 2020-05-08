
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  materialAdd, materialDelete, materialUpdate, getMaterialByType, materialQuery,
  specificationsAdd, specificationsDelete, specificationsUpdate, specificationsQuery,
  unitAdd, unitDelete, unitUpdate, unitQuery,
  yearAdd, yearDelete, yearUpdate, yearQuery,
  overdueConfigUpdate, overdueConfigQuery
} from '@/api/iqc/basicInfoConfig'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addMaterialDialogVisible: false,
      addModelDialogVisible: false,
      addUnitDialogVisible: false,
      addAgeLimitDialogVisible: false,
      showAddBtn: true,
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      typeList: [],
      supplierList: [],
      measureList: [],
      userOptions: [],
      materialNameOptions: [],
      // 0-金属  1-化学  2-气体 3-包材  4-衬底  5-MO源
      materialOptions: [
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
      ],
      materialForm: {
        type: '',
        name: '',
        remark: ''
      },
      materialRules: {
        type: [{ required: true, message: '请选择材料类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      modelForm: {
        type: '',
        name: '',
        model: '',
        remark: ''
      },
      modelRules: {
        type: [{ required: true, message: '请选择材料类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      unitForm: {
        type: '',
        name: '',
        remark: ''
      },
      unitRules: {
        type: [{ required: true, message: '请选择材料类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      ageLimitForm: {
        type: '',
        name: '',
        year: '',
        remark: ''
      },
      ageLimitRules: {
        type: [{ required: true, message: '请选择材料类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        year: [{ required: true, message: '请输入年限', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findMaterialList()
  },
  methods: {
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      this.list = []
      switch (index) {
        case 0 :
          this.findMaterialList()
          this.showAddBtn = true
          break
        case 1 :
          this.findSpecificationsList()
          this.showAddBtn = true
          break
        case 2 :
          this.findUnitList()
          this.showAddBtn = true
          break
        case 3 :
          this.findYearList()
          this.showAddBtn = true
          break
        case 4 :
          this.remindConfig()
          this.showAddBtn = false
          break
      }
    },
    // 过期提醒
    remindConfig() {
      overdueConfigQuery({}).then(res => {
        res.data.map((item) => {
          item['edit'] = false
          item['oldVal'] = item.threshold
        })
        this.list = res.data
      })
    },
    // 过期配置编辑
    handleEdit(row) {
      row.edit = true
    },
    // 过期配置保存
    handleSubmitItem(row) {
      console.log(row)
      if (row.threshold === '') {
        this.$message({
          type: 'error',
          message: '请输入报警阈值!'
        })
        return false
      }
      const params = {
        materialType: row.materialType,
        threshold: row.threshold
      }
      overdueConfigUpdate(params).then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.remindConfig()
        row.edit = false
      })
    },
    // 过期配置取消
    handleCancel(row) {
      row.threshold = row.oldVal
      row.edit = false
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      switch (this.activeTabIndex) {
        case 0 : this.findMaterialList()
          break
        case 1 : this.findSpecificationsList()
          break
        case 2 : this.findUnitList()
          break
        case 3 : this.findYearList()
          break
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      switch (this.activeTabIndex) {
        case 0 : this.findMaterialList()
          break
        case 1 : this.findSpecificationsList()
          break
        case 2 : this.findUnitList()
          break
        case 3 : this.findYearList()
          break
      }
    },
    // 查询材料名称
    findMaterialList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      materialQuery(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询型号类型
    findSpecificationsList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      specificationsQuery(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 查询炉次
    findUnitList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      unitQuery(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 年限查询
    findYearList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      yearQuery(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 添加
    handleAdd() {
      this.materialForm.remark = ''
      this.modelForm.remark = ''
      this.unitForm.remark = ''
      this.ageLimitForm.remark = ''
      switch (this.activeTabIndex) {
        case 0 : this.addMaterialDialogVisible = true
          break
        case 1 : this.addModelDialogVisible = true
          break
        case 2 : this.addUnitDialogVisible = true
          break
        case 3 : this.addAgeLimitDialogVisible = true
          break
      }
    },
    // 根据材料类型查询材料名称
    materialTypeChange(type) {
      this.modelForm.name = ''
      this.ageLimitForm.name = ''
      const params = {
        materialType: type
      }
      getMaterialByType(params).then(res => {
        this.materialNameOptions = res.data
      })
    },
    getMaterialType(type) {
      // 0-金属  1-化学  2-气体 3-包材  4-衬底  5-MO源
      let materialType = ''
      switch (type) {
        case 0 : materialType = '金属'
          break
        case 1 : materialType = '化学'
          break
        case 2 : materialType = '气体'
          break
        case 3 : materialType = '包材'
          break
        case 4 : materialType = '衬底'
          break
        case 5 : materialType = 'MO源'
          break
      }
      return materialType
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
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
          if (this.activeTabIndex === 0) {
            const params = {
              materialType: this.materialForm.type,
              name: this.materialForm.name,
              remark: this.materialForm.remark
            }
            materialAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addMaterialDialogVisible = false
                this.findMaterialList()
              }
            })
          } else if (this.activeTabIndex === 1) {
            const params = {
              materialId: this.modelForm.name,
              materialType: this.modelForm.type,
              model: this.modelForm.model,
              remark: this.modelForm.remark
            }
            specificationsAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addModelDialogVisible = false
                this.findSpecificationsList()
              }
            })
          } else if (this.activeTabIndex === 2) {
            const params = {
              materialType: this.unitForm.type,
              unit: this.unitForm.name,
              remark: this.unitForm.remark
            }
            unitAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addUnitDialogVisible = false
                this.findUnitList()
              }
            })
          } else {
            const params = {
              materialType: this.ageLimitForm.type,
              materialId: this.ageLimitForm.name,
              years: this.ageLimitForm.year,
              remark: this.ageLimitForm.remark
            }
            yearAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.addAgeLimitDialogVisible = false
                this.findYearList()
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
        this.statusChange(param)
      }).catch(() => {
        row.status = !row.status
      })
    },
    // 修改状态
    statusChange(param) {
      switch (this.activeTabIndex) {
        case 0 :
          materialUpdate(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findMaterialList()
          })
          break
        case 1 :
          specificationsUpdate(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findSpecificationsList()
          })
          break
        case 2 :
          unitUpdate(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findUnitList()
          })
          break
        case 3 :
          yearUpdate(param).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.findYearList()
          })
          break
      }
    },
    // 取消
    resetForm(formName) {
      this.addMaterialDialogVisible = false
      this.addModelDialogVisible = false
      this.addUnitDialogVisible = false
      this.addAgeLimitDialogVisible = false
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
            materialDelete(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findMaterialList()
            })
            break
          case 1 :
            specificationsDelete(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findSpecificationsList()
            })
            break
          case 2 :
            unitDelete(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findUnitList()
            })
            break
          case 3 :
            yearDelete(param).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.findYearList()
            })
        }
      }).catch(() => {
      })
    }
  }
}

