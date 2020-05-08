
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, getSampleNo, insert, remove, findDepartment, getUserList, edit } from '@/api/iqc/smallBatchSampleManage'
import { findSupplierList, findUnitByMaterialId, findModelByMaterialId } from '@/api/iqc/examinationMaterial'
import { getMaterialByType } from '@/api/iqc/basicInfoConfig'
import { findByDataId } from '@/api/iqc/examinationMaterial'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  watch: {
    addForm: {
      handler(val, oldVal) {
        this.materialDialogChange = true
      },
      deep: true
    }
  },
  data() {
    const validateSysl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入试样数量'))
      } else {
        if (parseInt(this.addForm.llsl) < parseInt(value)) {
          callback(new Error('试样数量不能大于来料数量'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addMetalDialogVisible: false,
      editMetalDialogVisible: false,
      dialogVisible: false,
      needSample: false,
      materialDialogChange: false,
      isView: false,
      isAdd: true,
      dialogImageUrl: '',
      materialType: 0,
      currentInitiator: '',
      list: [{}],
      fileList: [],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      dialogTitle: '',
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      timeRadio: 0,
      departmentOptions: [], // 试样部门
      supplierOptions: [], // 供应商
      supplierDialogOptions: [], // 供应商
      materialOptions: [ // 材料类型
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
      ],
      materialNameOptions: [], // 材料名称
      materialNameDialogOptions: [], // 材料名称
      unitOptions: [], // 单位
      modelOptions: [], // 型号规格
      resultOptions: [
        { id: 0, name: '合格' },
        { id: 1, name: '不合格' }
      ],
      statusOptions: [ // 试样状态
        { id: 0, name: '待接收' },
        { id: 1, name: '试样中' },
        { id: 2, name: '试样完成' }
      ],
      unitsOptions: [],
      userOptions: [],
      activeTabIndex: 0,
      vaildityOptions: [ // 是否在有效期
        { id: 0, name: '是' },
        { id: 1, name: '否' }
      ],
      smallBatchOptions: [ // 是否小批量试样
        { id: 0, name: '是' },
        { id: 1, name: '否' }
      ],
      searchKeys: {
        sybh: '',
        ylph: '',
        sybm: '',
        gys: '',
        cllb: '',
        clmc: '',
        syjg: '',
        syzt: '',
        fqr: ''
      },
      addForm: {
        sybh: '',
        gys: '',
        dhrq: '',
        ylph: '',
        sybm: '',
        clmc: '',
        xhgg: '',
        llsl: '',
        yldw: '',
        sysl: '',
        jsr: '',
        wcrq: '',
        syjg: 0,
        sysm: ''
      },
      rules: {
        sybh: [{ required: true, message: '请输入试样编号', trigger: 'blur' }],
        gys: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        dhrq: [{ required: true, message: '请输入到货日期', trigger: 'blur' }],
        ylph: [{ required: true, message: '请输入原料批号', trigger: 'blur' }],
        sybm: [{ required: true, message: '请选择试样部门', trigger: 'blur' }],
        clmc: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        xhgg: [{ required: true, message: '请输入型号规格', trigger: 'blur' }],
        llsl: [{ required: true, message: '请输入来料数量', trigger: 'blur' }],
        yldw: [{ required: true, message: '请选择原料单位', trigger: 'blur' }],
        sysl: [{ required: true, validator: validateSysl, trigger: 'blur' }]
        // file: [{ required: true, validator: validateFile, trigger: 'change' }]
      },
      currentId: ''
    }
  },
  mounted() {
    console.log(this.$route.query)
    if (this.$route.query.supplierId !== undefined) {
      if (parseInt(this.$route.query.materialType) === 0) {
        this.dialogTitle = '新增金属小批量试样'
      } else {
        this.dialogTitle = '新增化学小批量试样'
      }
      this.materialType = parseInt(this.$route.query.materialType)
      // 根据材料类型获取供应商
      this.findSupplierListByTypeFun(this.$route.query.materialType)
      this.getSampleNoFun() // 获取试样编号
      this.getSampleNoFun()
      // 单位
      this.findUnitByMaterialIdFun(this.$route.query.materialType)
      // 材料
      this.getMaterialNameOptions(this.$route.query.materialType)
      this.addForm.dhrq = this.$route.query.reachDate
      this.addForm.ylph = this.$route.query.materialBatch
      this.addForm.clmc = parseInt(this.$route.query.materialId)
      this.materialChange(parseInt(this.$route.query.materialId))
      setTimeout(() => {
        this.addForm.xhgg = parseInt(this.$route.query.specificationsId)
        this.addForm.gys = parseInt(this.$route.query.supplierId)
      }, 200)
      this.addForm.llsl = this.$route.query.num
      this.addForm.yldw = parseInt(this.$route.query.unitId)
      this.addMetalDialogVisible = true
    }
    this.fetchData()
    this.findSupplierListFun()
    this.findDepartmentFun()
    this.getUserListFun()
  },
  methods: {
    handleDialogClose(done) {
      if (this.materialDialogChange) {
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      } else {
        done()
      }
    },
    getUserListFun() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      getUserList(params).then(res => {
        this.userOptions = res.data.list
      })
    },
    // 根据材料类型查询材料名称
    materialTypeChange(type) {
      this.searchKeys.clmc = ''
      if (type !== null) {
        const params = {
          materialType: type
        }
        getMaterialByType(params).then(res => {
          this.materialNameOptions = res.data
        })
      } else {
        this.materialNameOptions = []
      }
    },
    // 试样数量
    syslChange() {
      if (this.addForm.sysl.length > 10) {
        this.addForm.sysl = this.addForm.sysl.substr(0, 10)
      }
    },
    handlePreview(file) {
      window.open(process.env.BASE_API + `/attachment/down?id=${file.id}`)
    },
    // 来料数量
    llslChange() {
      if (this.addForm.llsl.length > 10) {
        this.addForm.llsl = this.addForm.llsl.substr(0, 10)
      }
      if (this.addForm.sysl !== '') {
        this.$refs.addForm.validateField('sysl')
      }
    },
    // 查询供应商
    findSupplierListFun() {
      findSupplierList({ goodsType: '0,1' }).then(res => {
        this.supplierOptions = res.data
      })
    },
    // 查询对应材料类型的供应商
    findSupplierListByTypeFun(goodsType) {
      findSupplierList({ goodsType }).then(res => {
        this.supplierDialogOptions = res.data
      })
    },
    // 材料名称
    getMaterialNameOptions(type) {
      const params = {
        materialType: type
      }
      getMaterialByType(params).then(res => {
        this.materialNameDialogOptions = res.data
      })
    },
    // 部门
    findDepartmentFun() {
      findDepartment().then(res => {
        this.departmentOptions = res.data
      })
    },
    // 查看
    handleView(row) {
      if (row.status === 2 || row.status === 1) {
        this.dialogTitle = '查看'
        this.isView = true
      } else {
        this.isView = false
      }
      this.materialType = row.materialType
      // 根据材料类型获取供应商
      this.findSupplierListByTypeFun(row.materialType)
      // 材料
      this.getMaterialNameOptions(row.materialType)
      // 单位
      this.findUnitByMaterialIdFun(row.materialType)
      this.currentInitiator = row.initiator
      this.currentId = row.id
      this.addForm.sybh = row.sampleNo
      this.addForm.gys = row.supplierId
      this.addForm.dhrq = row.reachDate
      this.addForm.ylph = row.materialBatch
      this.addForm.sybm = row.departmentId
      this.addForm.clmc = parseInt(row.materialId)
      this.materialChange(parseInt(row.materialId))
      setTimeout(() => {
        this.addForm.xhgg = parseInt(row.specificationsId)
      }, 200)
      this.addForm.llsl = row.num
      this.addForm.yldw = row.unitId
      this.addForm.sysl = row.sampleNum
      this.addForm.jsr = row.receiverName
      this.addForm.wcrq = row.finishDate
      this.addForm.sysm = row.explains
      this.addForm.syjg = row.result
      this.findDataByDataId(row.id)
      setTimeout(() => {
        this.materialDialogChange = false
      }, 500)
      this.editMetalDialogVisible = true
    },
    // 编辑
    handleEdit(firstRow, index) {
      this.fetchData()
      setTimeout(() => {
        const row = this.list[index]
        if (row.materialType === '0') {
          this.dialogTitle = '编辑金属小批量试样'
        } else {
          this.dialogTitle = '编辑化学小批量试样'
        }
        if (row.status === 2 || row.status === 1) {
          if (row.status === 1) {
            this.$confirm('当前试样状态已变为试样中，仅允许查看！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {})
          } else {
            this.$confirm('当前试样状态已变为试样完成，仅允许查看！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {})
          }
          this.dialogTitle = '查看'
          this.isView = true
        } else {
          this.isView = false
        }
        this.materialType = row.materialType
        // 根据材料类型获取供应商
        this.findSupplierListByTypeFun(row.materialType)
        // 材料
        this.getMaterialNameOptions(row.materialType)
        // 单位
        this.findUnitByMaterialIdFun(row.materialType)
        this.currentInitiator = row.initiator
        this.currentId = row.id
        this.addForm.sybh = row.sampleNo
        this.addForm.gys = row.supplierId
        this.addForm.dhrq = row.reachDate
        this.addForm.ylph = row.materialBatch
        this.addForm.sybm = row.departmentId
        this.addForm.clmc = parseInt(row.materialId)
        this.materialChange(parseInt(row.materialId))
        setTimeout(() => {
          this.addForm.xhgg = parseInt(row.specificationsId)
        }, 200)
        this.addForm.llsl = row.num
        this.addForm.yldw = row.unitId
        this.addForm.sysl = row.sampleNum
        this.addForm.jsr = row.receiverName
        this.addForm.wcrq = row.finishDate
        this.addForm.sysm = row.explains
        this.addForm.syjg = row.result
        this.findDataByDataId(row.id)
        setTimeout(() => {
          this.materialDialogChange = false
        }, 500)
        this.editMetalDialogVisible = true
      }, 200)
    },
    findDataByDataId(dataId) {
      findByDataId({ dataId }).then(res => {
        const fileList = []
        res.data.map(item => {
          fileList.push({
            name: item.name,
            url: 'https:' + item.path,
            id: item.id
          })
        })
        console.log(fileList)
        this.fileList = fileList
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            initiator: sessionStorage.getItem('User-Id'),
            sampleNo: this.addForm.sybh, // 试样编号
            supplierId: this.addForm.gys, // 供应商
            reachDate: this.addForm.dhrq, // 到货日期
            materialBatch: this.addForm.ylph, // 原料批号
            departmentId: this.addForm.sybm, // 试样部门
            materialId: this.addForm.clmc, // 材料名称
            specificationsId: this.addForm.xhgg, // 型号规格
            num: this.addForm.llsl, // 来料数量
            unitId: this.addForm.yldw, // 原料单位
            sampleNum: this.addForm.sysl, // 试样数量
            materialType: this.materialType // 材料类型
          }
          // checkId
          if (this.$route.query.checkId !== undefined) {
            params.checkId = this.$route.query.checkId
          }
          console.log(params)
          insert(params).then(res => {
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
            initiator: this.currentInitiator,
            sampleNo: this.addForm.sybh, // 试样编号
            supplierId: this.addForm.gys, // 供应商
            reachDate: this.addForm.dhrq, // 到货日期
            materialBatch: this.addForm.ylph, // 原料批号
            departmentId: this.addForm.sybm, // 试样部门
            materialId: this.addForm.clmc, // 材料名称
            specificationsId: this.addForm.xhgg, // 型号规格
            num: this.addForm.llsl, // 来料数量
            unitId: this.addForm.yldw, // 原料单位
            sampleNum: this.addForm.sysl, // 试样数量
            materialType: this.materialType, // 材料类型
            id: this.currentId // ID
          }
          // checkId
          console.log(params)
          edit(params).then(res => {
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
    viewDetail(row) {
      console.log(row)
    },
    // 删除
    handleDelete(firstRow, index) {
      this.fetchData()
      setTimeout(() => {
        const row = this.list[index]
        if (row.status === 2 || row.status === 1) {
          if (row.status === 1) {
            this.$confirm('当前试样状态已变为试样中，不允许删除！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {})
          } else {
            this.$confirm('当前试样状态已变为试样完成，不允许删除！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {})
          }
        } else {
          this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              id: row.id
            }
            remove(param).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchData()
            })
          })
        }
      }, 200)
    },
    // 获取试样编号
    getSampleNoFun() {
      getSampleNo().then(res => {
        this.addForm.sybh = res.data
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess(res, file, fileList) {
      this.fileName = file.name
      this.driveDownKey = res.data.dataId
    },
    handleRemove(file, fileList) {
      this.$refs.upload.uploadFiles = fileList
      this.isEditDeleted = true
      // this.$refs.deviceForm.validateField('file')
    },
    uploadChange(file, fileList) {
      console.log(fileList)
      this.$refs.upload.uploadFiles = fileList
      this.$refs.deviceForm.validateField('file')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 获取单位
    findUnitByMaterialIdFun(materialType) {
      findUnitByMaterialId({ materialType }).then(res => {
        this.unitOptions = res.data
      })
    },
    // 小批量试样
    smallBatchSample(index) {
      this.getSampleNoFun()
      this.addForm.gys = ''
      this.addForm.dhrq = ''
      this.addForm.ylph = ''
      this.addForm.sybm = ''
      this.addForm.cllb = ''
      this.addForm.clmc = ''
      this.addForm.xhgg = ''
      this.addForm.llsl = ''
      this.addForm.yldw = ''
      this.addForm.sysl = ''
      this.addForm.jsr = ''
      this.addForm.wcrq = ''
      this.addForm.syjg = 0
      this.addForm.sysm = ''
      this.addForm.tjfj = ''
      this.materialType = index - 1
      // 根据材料类型获取供应商
      this.findSupplierListByTypeFun(index - 1)
      // 单位
      this.findUnitByMaterialIdFun(index - 1)
      // 材料
      this.getMaterialNameOptions(index - 1)
      if (index === 1) {
        this.dialogTitle = '新增金属小批量试样'
      } else {
        this.dialogTitle = '新增化学小批量试样'
      }
      setTimeout(() => {
        this.materialDialogChange = false
      }, 500)
      this.addMetalDialogVisible = true
    },
    tabClick(index) {
      this.activeTabIndex = index
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
    // 材料选中
    materialChange(materialId) {
      this.addForm.xhgg = ''
      if (materialId !== null) {
        findModelByMaterialId({ materialId }).then(res => {
          this.modelOptions = res.data
        })
      }
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sampleNo: this.searchKeys.sybh, // 试样编号
        materialBatch: this.searchKeys.ylph, // 原料批号
        departmentId: this.searchKeys.sybm, // 试样部门
        supplierId: this.searchKeys.gys, // 供应商ID
        material: this.searchKeys.clmc, // 材料名称
        result: this.searchKeys.syjg, // 检验结论(result)[0-合格 1-不合格]
        timeType: this.timeRadio, // 时间
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        status: this.searchKeys.syzt, // 试样状态(status)[0-待接收 1-试样中 2-式样完成]
        initiator: this.searchKeys.fqr, // 发起人
        materialType: this.searchKeys.cllb // 材料类型
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 导出
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/zlSample/exportFQ?materialType=${this.searchKeys.cllb}&initiator=${this.searchKeys.fqr}&result=${this.searchKeys.syjg}&material=${this.searchKeys.clmc}&supplierId=${this.searchKeys.gys}&departmentId=${this.searchKeys.sybm}&materialBatch=${this.searchKeys.ylph}&sampleNo=${this.searchKeys.sybh}&timeType=${this.timeRadio}startTime=${startTime}&endTime=${endTime}`)
    },
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.sybh = ''
      this.searchKeys.ylph = ''
      this.searchKeys.sybm = ''
      this.searchKeys.gys = ''
      this.searchKeys.cllb = ''
      this.searchKeys.clmc = ''
      this.searchKeys.syjg = ''
      this.searchKeys.syzt = ''
      this.searchKeys.fqr = ''
      this.timeRadio = 0
      this.materialNameOptions = []
      this.handleSearch()
    },
    handleClose() {
      this.$refs.addForm.resetFields()
    },
    rowClick(row) {
      console.log(row)
    },
    // 取消
    resetForm(formName) {
      if (this.materialDialogChange) {
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addMetalDialogVisible = false
          this.editMetalDialogVisible = false
          this.$refs[formName].resetFields()
        })
      } else {
        this.addMetalDialogVisible = false
        this.editMetalDialogVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
}

