
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, receive, findDepartment, edit, getUserList } from '@/api/iqc/smallBatchSampleManage'
import { getMaterialByType } from '@/api/iqc/basicInfoConfig'
import { findSupplierList, findUnitByMaterialId, findModelByMaterialId } from '@/api/iqc/examinationMaterial'
import { findByDataId } from '@/api/iqc/examinationMaterial'
import { getToken, getUserId } from '@/utils/auth'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  computed: {
    getToken,
    getUserId
  },
  watch: {
    addForm: {
      handler(val, oldVal) {
        this.materialDialogChange = true
      },
      deep: true
    },
    fileUploadFlag: {
      handler(val, oldVal) {
        this.fileChange = true
      },
      deep: true
    }
  },
  data() {
    // const validateFile = (rule, value, callback) => {
    //   console.log(this.$refs.upload.uploadFiles)
    //   let flag = false
    //   this.$refs.upload.uploadFiles.forEach(item => {
    //     if (item.size / 1024 / 1024 > 50) {
    //       flag = true
    //     }
    //   })
    //   if (flag) {
    //     callback(new Error('上传文件大小不能超过 50MB!'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      listLoading: false,
      addMetalDialogVisible: false,
      dialogVisible: false,
      needSample: false,
      materialDialogChange: false,
      fileChange: false,
      dialogImageUrl: '',
      currentInitiator: '',
      currentReceiver: '',
      receiveDate: '',
      list: [{}],
      fileList: [],
      fileUploadFlag: 0,
      materialType: 0, // 材料类型
      materialNameDialogOptions: [],
      modelOptions: [],
      reciveOptions: [],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      tableKey: 0,
      currentStatus: 0,
      dialogTitle: '',
      beginDate: '',
      endDate: '',
      uploadParams: { dataId: '' },
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
      pickerOptionsFinishDate: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime(this.receiveDate) || time.getTime() > Date.now()
        }
      },
      timeRadio: 2,
      departmentOptions: [], // 试样部门
      supplierOptions: [], // 供应商
      materialOptions: [
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
      ], // 材料名称
      materialNameOptions: [], // 材料名称
      unitOptions: [], // 单位
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
        syzt: '',
        fqr: '',
        ylph: '',
        sybm: '',
        gys: '',
        cllb: '',
        clmc: '',
        syjg: '',
        jsr: ''
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
        sysl: [{ required: true, message: '请输入试样数量', trigger: 'blur' }],
        wcrq: [{ required: true, message: '请选择完成日期', trigger: 'change' }],
        syjg: [{ required: true, message: '请选择试样结果', trigger: 'change' }]
        // file: [{ required: true, validator: validateFile, trigger: 'change' }]
      },
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.findDepartmentFun()
    this.findSupplierListFun()
    this.getUserListFun()
  },
  methods: {
    handleDialogClose(done) {
      if (this.materialDialogChange || this.fileChange) {
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
        this.reciveOptions = res.data.list
      })
    },
    // 查询供应商
    findSupplierListFun() {
      findSupplierList({ goodsType: '0,1' }).then(res => {
        this.supplierOptions = res.data
      })
    },
    // 接收
    handleReceiver(currentRow) {
      const currentRowId = currentRow.id
      let flag = false
      this.fetchData()
      setTimeout(() => {
        this.list.map(item => {
          if (item.id === currentRowId) {
            flag = true
          }
        })
        if (flag) {
          this.$confirm('是否确认接收?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            receive({ id: currentRow.id, receiveId: this.getUserId }).then(res => {
              this.$message({
                type: 'success',
                message: '接收成功!'
              })
              this.tableKey++
              this.fetchData()
            })
          })
        } else {
          this.$confirm('此任务已被发起者删除！', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          }).then(() => {})
        }
      }, 200)
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
    submitUpload() {
      this.$refs.upload.submit()
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
            result: this.addForm.syjg, // 试样结果
            finishDate: this.formatDate(this.addForm.wcrq), // 完成日期
            explains: this.addForm.sysm, // 试样说明
            receiver: this.currentReceiver, // 接收人
            status: 2, // 完成状态
            id: this.currentId // ID
          }
          // checkId
          console.log(params)
          edit(params).then(res => {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.$refs.upload.submit()
            this.addMetalDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // this.$refs.upload.submit()
    onSuccess(res, file, fileList) {
      this.fileName = file.name
    },
    handleRemove(file, fileList) {
      this.$refs.upload.uploadFiles = fileList
      this.isEditDeleted = true
      // this.$refs.deviceForm.validateField('file')
    },
    uploadChange(file, fileList) {
      this.fileUploadFlag++
      // this.$refs.upload.uploadFiles = fileList
      this.$refs.addForm.validateField('file')
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
    // 材料选中
    materialChange(materialId) {
      this.addForm.xhgg = ''
      if (materialId !== null) {
        findModelByMaterialId({ materialId }).then(res => {
          this.modelOptions = res.data
        })
      }
    },
    // 部门
    findDepartmentFun() {
      findDepartment().then(res => {
        console.log(1)
        this.departmentOptions = res.data
      })
    },
    // 获取单位
    findUnitByMaterialIdFun(materialType) {
      findUnitByMaterialId({ materialType }).then(res => {
        this.unitOptions = res.data
      })
    },
    handleEdit(row) {
      this.receiveDate = row.receiveDate
      this.materialType = row.materialType
      this.currentStatus = row.status
      this.currentReceiver = row.receiver
      // 材料
      this.getMaterialNameOptions(row.materialType)
      // 单位
      this.findUnitByMaterialIdFun(row.materialType)
      this.currentInitiator = row.initiator
      this.uploadParams.dataId = row.id
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
      this.addForm.wcrq = new Date().getTime()
      this.addForm.syjg = row.result === -1 ? 0 : row.result
      this.addForm.sysm = row.explains
      this.findDataByDataId(row.id)
      setTimeout(() => {
        this.materialDialogChange = false
        this.fileChange = false
      }, 500)
      this.addMetalDialogVisible = true
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
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate
      return currentDate
    },
    viewDetail() {
      this.addMetalDialogVisible = true
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    handlePreview(file) {
      window.open(process.env.BASE_API + `/attachment/down?id=${file.id}`)
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
        receiver: this.searchKeys.jsr, // 接收人
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
      window.open(process.env.BASE_API + `/zlSample/exportJS?sampleNo=${this.searchKeys.sybh}&receiver=${this.searchKeys.jsr}&initiator=${this.searchKeys.fqr}&status=${this.searchKeys.syzt}&result=${this.searchKeys.syjg}&material=${this.searchKeys.clmc}&supplierId=${this.searchKeys.gys}&materialType=${this.searchKeys.cllb}&timeType=${this.timeRadio}&startTime=${startTime}&endTime=${endTime}`)
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
      this.searchKeys.syzt = ''
      this.searchKeys.syjg = ''
      this.searchKeys.jsr = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    handleClose() {
      this.fetchData()
    },
    rowClick(row) {
      console.log(row)
    },
    onExceed() {
      this.$message({
        type: 'error',
        message: '超出文件上传数量!'
      })
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message({
          type: 'error',
          message: '上传文件大小不能超过 50MB!'
        })
      }
      return isLt50M
    },
    // 取消
    resetForm(formName) {
      if (this.materialDialogChange || this.fileChange) {
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addMetalDialogVisible = false
          this.$refs[formName].resetFields()
        })
      } else {
        this.addMetalDialogVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
}

