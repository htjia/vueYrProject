
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findSupplierList, addSupplier, deleteSupplier, updateSupplier, findMaterialCheck } from '@/api/iqc/supplierManage'
import { getMaterialByType } from '@/api/iqc/basicInfoConfig'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addMetalDialogVisible: false,
      editMetalDialogVisible: false,
      supplyRecordDialogVisible: false,
      list: [],
      dialogList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      pageSizeDialog: 15,
      pageNumDialog: 1,
      totalPageDialog: 0,
      beginDate: '',
      endDate: '',
      timeRadio: 0,
      searchKeys: {
        csmc: '',
        cllx: ''
      },
      dialogSearchKeys: {
        cllx: '',
        clmc: ''
      },
      materialNameOptions: [],
      addForm: {
        csmc: '',
        ghlx: [],
        remark: ''
      },
      rules: {
        csmc: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
        ghlx: [{ required: true, message: '请选择供货类型', trigger: 'blur' }]
      },
      materialOptions: [
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
      ],
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleEdit(row) {
      this.currentId = row.id
      this.addForm.csmc = row.name
      this.addForm.remark = row.remark
      this.addForm.ghlx = row.goodsType.split(',')
      this.editMetalDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          if (this.list.length === 1 && this.pageNum !== 1) {
            this.pageNum -= 1
          }
          this.fetchData()
        })
      })
    },
    // 根据材料类型查询材料名称
    materialTypeChange(type) {
      const params = {
        materialType: type
      }
      if (type !== null) {
        getMaterialByType(params).then(res => {
          this.materialNameOptions = res.data
        })
      } else {
        this.materialNameOptions = []
      }
    },
    // 导出
    handleExport() {
      window.open(process.env.BASE_API + `/zlSupplier/export?name=${this.searchKeys.csmc}&goodsType=${this.searchKeys.cllx}`)
    },
    handleAdd() {
      this.addForm.csmc = ''
      this.addForm.remark = ''
      this.addForm.ghlx = []
      this.addMetalDialogVisible = true
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
    // Dialog每页数量改变
    sizeChangeDialog(pageSize) {
      this.pageSizeDialog = pageSize
      this.fetchData()
    },
    // Dialog当前页数改变
    currentChangeDialog(pageNum) {
      this.pageNumDialog = pageNum
      this.fetchData()
    },
    // 供货记录查询
    handleSearchDialog() {
      this.pageNumDialog = 1
      this.viewSupplyRecord(this.dialogCurrentRow)
    },
    clearSearchDialog() {
      this.dialogSearchKeys.cllx = ''
      this.dialogSearchKeys.clmc = ''
      this.handleSearchDialog()
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
    handleCloseRecord() {
      this.dialogSearchKeys.cllx = ''
      this.dialogSearchKeys.clmc = ''
    },
    // 查看供货记录
    viewSupplyRecord(row) {
      this.dialogCurrentRow = row
      const params = {
        supplierId: row.id,
        materialType: this.dialogSearchKeys.cllx,
        materialName: this.dialogSearchKeys.clmc,
        pageNum: this.pageNumDialog,
        pageSize: this.pageSizeDialog
      }
      findMaterialCheck(params).then(res => {
        this.dialogList = res.data.list
        this.totalPageDialog = res.data.total
      })
      this.supplyRecordDialogVisible = true
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    handleClose() {
      console.log(0)
    },
    clearSearch() {
    },
    fetchData() {
      const params = {
        name: this.searchKeys.csmc,
        goodsType: this.searchKeys.cllx,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findSupplierList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    getGoodsType(types) {
      const names = []
      const typeIds = types.split(',').map(Number)
      this.materialOptions.map(material => {
        if (typeIds.indexOf(material.id) !== -1) {
          names.push(material.name)
        }
      })
      return names.join(',')
    },
    submitForm(formName) {
      console.log(this.addForm.ghlx)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.addForm.csmc,
            goodsType: this.addForm.ghlx.join(','),
            remark: this.addForm.remark
          }
          addSupplier(params).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.addMetalDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            name: this.addForm.csmc,
            goodsType: this.addForm.ghlx.join(','),
            remark: this.addForm.remark
          }
          updateSupplier(params).then(res => {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.editMetalDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.editMetalDialogVisible = false
      this.addMetalDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

