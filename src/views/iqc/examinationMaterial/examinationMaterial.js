import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  findSupplierList,
  checkerList,
  buyerList,
  insert,
  findModelByMaterialId,
  findYearsByMaterialId,
  queryBymaterialType,
  findUnitByMaterialId,
  getCKNO,
  queryList,
  findByDataId,
  edit,
  deleteFile,
  remove
} from '@/api/iqc/examinationMaterial'
import { getMaterialByType } from '@/api/iqc/basicInfoConfig'
import { getToken, getUserId } from '@/utils/auth'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  watch: {
    addForm: {
      handler(val, oldVal) {
        this.materialDialogChange = true
      },
      deep: true
    },
    uploadFileFlag: {
      handler(val, oldVal) {
        this.uploadFileChange = true
      },
      deep: true
    }
  },
  data() {
    const validateBls = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入不良数'))
      } else {
        if (this.addForm.cysl !== '' && parseInt(this.addForm.cysl) < parseInt(value)) {
          callback(new Error('不良数量不能大于抽样数量'))
        } else {
          callback()
        }
      }
    }
    const validateCysl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入抽样数量'))
      } else {
        if (this.addForm.num !== '' && parseInt(this.addForm.num) < parseInt(value)) {
          callback(new Error('抽样数量不能大于总数量'))
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
      uploadFileChange: false,
      hideUpload: false,
      fileUrl: process.env.BASE_API + '/attachment/upload',
      // fileUrl: process.env.BASE_API + '/attachment/uploadMore',
      dialogImageUrl: '',
      driveDownKey: '',
      checker: '',
      isUpload: false,
      uploadParams: { dataId: '' },
      list: [],
      fileList: [],
      checkerList: [],
      buyerList: [],
      addFileList: [],
      editUploadIds: [],
      removeEditUploadId: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      currentMaterialType: 0,
      uploadFileFlag: 0,
      dialogTitle: '',
      selectedRow: {},
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      pickerOptionsProduction: {
        disabledDate: (time) => {
          const endDateVal = this.addForm.arrivalDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsArrival: {
        disabledDate: (time) => {
          const beginDateVal = this.addForm.productionDate - 57540000
          const testDateVal = this.addForm.testDate
          if (beginDateVal && testDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > testDateVal
          } else {
            return time.getTime() > testDateVal
          }
        }
      },
      pickerOptionsTestDate: {
        disabledDate: (time) => {
          const beginDateVal = this.addForm.arrivalDate - 57540000
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > (Date.now())
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      timeRadio: 0,
      supplierOptions: [], // 供应商
      supplierDialogOptions: [], // 供应商
      materialOptions: [
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
      ], // 材料类型
      materialNameOptions: [], // 材料名称
      materialNameDialogOptions: [],
      modelOptions: [], // 型号规格
      year: [], // 年限
      threshold: '', // 过期时间
      resultOptions: [
        { id: 0, name: '合格' },
        { id: 1, name: '不合格' }
      ],
      unitsOptions: [],
      userOptions: [],
      activeTabIndex: 0,
      vaildityOptions: [ // 是否在有效期
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ],
      smallBatchOptions: [ // 是否小批量试样
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ],
      searchKeys: {
        jybh: '',
        pch: '',
        clmc: '',
        gys: '',
        cllb: '',
        pd: '',
        jyy: '',
        sfyxq: '',
        sfxplsy: '',
        cgy: ''
      },
      addForm: {
        gys: '',
        cgy: '',
        pch: '',
        clmc: '',
        xhgg: '',
        num: '',
        dw: '',
        productionDate: '', // 生产日期
        arrivalDate: '', // 到货日期
        expriationDate: '', // 过期日期
        validDate: '', // 有效日期
        jybh: '',
        cysl: '',
        bls: '',
        result: 0,
        testDate: '', // 检验日期
        jyr: '',
        hgv: '',
        sfxplsy: false,
        blnr: '',
        remark: ''
      },
      rules: {
        gys: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        pch: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        clmc: [{ required: true, message: '请选择材料名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        xhgg: [{ required: true, message: '请选择型号规格', trigger: 'blur' }],
        dw: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        productionDate: [{ required: true, message: '请选择生产日期', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '请选择到货日期', trigger: 'blur' }],
        expriationDate: [{ required: true, message: '请选择过期日期', trigger: 'blur' }],
        testDate: [{ required: true, message: '请选择检验日期', trigger: 'blur' }],
        cysl: [{ required: true, validator: validateCysl, trigger: 'blur' }],
        bls: [{ required: true, validator: validateBls, trigger: 'blur' }]
      },
      currentId: ''
    }
  },
  computed: {
    getToken,
    getUserId
  },
  mounted() {
    this.fetchData()
    this.findSupplierListFun()
    this.checkerListFun()
    this.buyerListFun()
  },
  methods: {
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15
      if (!isLt15M) {
        this.$message({
          type: 'error',
          message: '上传图片大小不能超过 15MB!'
        })
      }
      return isLt15M
    },
    handleDialogClose(done) {
      if (this.materialDialogChange || this.uploadFileChange) {
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.editUploadIds.map(item => {
            deleteFile({ id: item }).then(res => {
            })
          })
        })
      } else {
        done()
      }
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
    // 编辑
    handleEdit(row) {
      this.editUploadIds = []
      this.removeEditUploadId = []
      this.activeTabIndex = 0
      this.currentMaterialType = row.materialType
      // 获取对应的供应商
      this.findSupplierListByTypeFun(row.materialType)
      this.getDialogTitle(row.materialType)
      // 材料
      this.getMaterialNameOptions(row.materialType)
      // 过期时间
      this.queryBymaterialTypeFun(row.materialType)
      // 单位
      this.findUnitByMaterialIdFun(row.materialType)
      this.addForm.sfxplsy = row.sample === 1
      this.addForm.pch = row.materialBatch
      let hasBuyer = false
      this.buyerList.map(item => {
        if (item.id === row.buyer) {
          hasBuyer = true
        }
      })
      this.addForm.cgy = hasBuyer ? row.buyer : ''
      this.addForm.clmc = row.materialId
      // 材料名称--> 获取 型号与年限
      this.materialChange(row.materialId)
      setTimeout(() => {
        this.addForm.xhgg = row.specificationsId
        this.addForm.gys = row.supplierId
      }, 200)
      this.addForm.num = row.num
      this.addForm.dw = row.unitId
      this.addForm.productionDate = new Date(row.makeDate).getTime()
      console.log(this.addForm.productionDate, '----------------')
      this.addForm.arrivalDate = new Date(row.reachDate).getTime()
      this.addForm.expriationDate = new Date(row.overDate).getTime()
      this.addForm.testDate = new Date(row.checkDate).getTime()
      this.addForm.validDate = row.effectiveTime
      this.addForm.jybh = row.checkNo
      this.addForm.cysl = row.sampleNum
      this.addForm.bls = row.badNum
      this.addForm.result = row.result
      this.addForm.jyr = row.checkerName
      this.checker = row.checker
      this.addForm.hgv = row.rate + '%'
      this.addForm.blnr = row.badContent
      this.addForm.remark = row.remark
      this.findDataByDataId(row.id)
      this.uploadParams.dataId = row.id
      if (row.materialType === 0 || row.materialType === 1) {
        this.needSample = true
      } else {
        this.needSample = false
      }
      setTimeout(() => {
        this.materialDialogChange = false
        this.uploadFileChange = false
      }, 500)
      this.editMetalDialogVisible = true
    },
    findDataByDataId(dataId) {
      findByDataId({ dataId }).then(res => {
        const fileList = []
        res.data.map(item => {
          fileList.push({
            name: item.name,
            url: '/images' + item.webPath,
            id: item.id
          })
        })
        console.log(fileList)
        this.fileList = fileList
        this.hideUpload = this.fileList.length > 4
      })
    },
    // 删除
    handleDelete(row) {
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
    },
    // 生产日期
    productionDateChange(productionDate) {
      if (this.addForm.productionDate !== '') {
        // 过期日期 = (生产日期 + 年限)
        this.addForm.expriationDate = this.addForm.productionDate + (this.year * 24 * 60 * 60 * 1000)
        // 校验过期提醒【（过期日期 - 当前时间）< 过期提醒 ? 】
        if ((this.addForm.expriationDate - new Date().getTime()) < 0) {
          this.$alert('当前批次已经过期！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        } else if ((this.addForm.expriationDate - new Date().getTime()) < this.threshold * 24 * 60 * 60 * 1000) {
          this.$alert('当前批次即将过期！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }
      if (this.addForm.arrivalDate !== '') {
        this.arrivalDateChange()
      }
    },
    numChange() {
      if (this.addForm.num.length > 10) {
        this.addForm.num = this.addForm.num.substr(0, 10)
      }
      if (this.addForm.cysl !== '') {
        this.$refs.addForm.validateField('cysl')
      }
    },
    // 到货时间
    arrivalDateChange() {
      if (this.addForm.productionDate !== '') {
        this.addForm.validDate = parseInt((this.addForm.expriationDate - this.addForm.arrivalDate) / (24 * 60 * 60 * 1000))
      }
    },
    // 材料选中
    materialChange(materialId) {
      this.addForm.xhgg = ''
      if (materialId !== null) {
        findModelByMaterialId({ materialId }).then(res => {
          this.modelOptions = res.data
        })
        findYearsByMaterialId({ materialId }).then(res => {
          this.year = res.data[0].years
          this.productionDateChange()
        })
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess(res, file, fileList) {
      this.uploadParams.dataId = res.data.dataId
    },
    onEditUploadSuccess(res, file, fileList) {
      this.hideUpload = fileList.length >= 5
      file['id'] = file.response.data.id
      this.editUploadIds.push(res.data.id)
    },
    uploadChange(file, fileList) {
      this.uploadFileFlag++
      this.hideUpload = fileList.length >= 5
      // this.$refs.addForm.validateField('file')
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            materialType: this.currentMaterialType, // 材料类型
            supplierId: this.addForm.gys, // 供应商
            materialBatch: this.addForm.pch, // 批次号
            buyer: this.addForm.cgy, // 采购员
            materialId: this.addForm.clmc, // 材料
            num: this.addForm.num, // 数量
            specificationsId: this.addForm.xhgg, // 型号规格
            unitId: this.addForm.dw, // 单位
            makeDate: this.formatDate(this.addForm.productionDate), // 生产日期
            reachDate: this.formatDate(this.addForm.arrivalDate), // 到货日期
            overDate: this.formatDate(this.addForm.expriationDate), // 过期日期
            effectiveTime: this.addForm.validDate, // 有效使用时长
            checkNo: this.addForm.jybh, // 检验编号
            sampleNum: this.addForm.cysl, // 抽样数量
            badNum: this.addForm.bls, // 不良数
            result: this.addForm.result, // 判定
            checkDate: this.formatDate(this.addForm.testDate), // 检验日期
            checker: this.getUserId, // 检验人
            rate: (((this.addForm.cysl - this.addForm.bls) / this.addForm.cysl) * 100).toFixed(2), // 合格率
            badContent: this.addForm.blnr, // 不良内容
            remark: this.addForm.remark, // 备注
            id: this.uploadParams.dataId // 图片ID
          }
          console.log(params)
          insert(params).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.addMetalDialogVisible = false
            this.fetchData()
            if (this.addForm.sfxplsy) {
              this.$router.push({
                path: '/inputQualityControl/smallBatchSample',
                query: {
                  checkId: res.data,
                  unitId: this.addForm.dw,
                  materialType: this.currentMaterialType,
                  num: this.addForm.num,
                  specificationsId: this.addForm.xhgg,
                  materialId: this.addForm.clmc,
                  materialBatch: this.addForm.pch,
                  reachDate: this.formatDate(this.addForm.arrivalDate),
                  supplierId: this.addForm.gys
                }
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onExceed() {
      this.$message({
        type: 'error',
        message: '最多可以上传 5 张!'
      })
    },
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            materialType: this.currentMaterialType,
            supplierId: this.addForm.gys, // 供应商
            materialBatch: this.addForm.pch, // 批次号
            buyer: this.addForm.cgy, // 采购员
            materialId: this.addForm.clmc, // 材料
            num: this.addForm.num, // 数量
            specificationsId: this.addForm.xhgg, // 型号规格
            unitId: this.addForm.dw, // 单位
            makeDate: this.formatDate(this.addForm.productionDate), // 生产日期
            reachDate: this.formatDate(this.addForm.arrivalDate), // 到货日期
            overDate: this.formatDate(this.addForm.expriationDate), // 过期日期
            effectiveTime: this.addForm.validDate, // 有效使用时长
            checkNo: this.addForm.jybh, // 检验编号
            sampleNum: this.addForm.cysl, // 抽样数量
            badNum: this.addForm.bls, // 不良数
            result: this.addForm.result, // 判定
            checkDate: this.formatDate(this.addForm.testDate), // 检验日期
            checker: this.checker, // 检验人
            rate: (((this.addForm.cysl - this.addForm.bls) / this.addForm.cysl) * 100).toFixed(2), // 合格率
            badContent: this.addForm.blnr, // 不良内容
            remark: this.addForm.remark, // 备注
            id: this.uploadParams.dataId // 图片ID
          }
          console.log(params)
          edit(params).then(res => {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.removeEditUploadId.map(item => {
              deleteFile({ id: item }).then(res => {
              })
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
    getMaterialType(type) {
      // 0-金属  1-化学  2-气体 3-包材  4-衬底  5-MO源
      let materialType = ''
      switch (type) {
        case 0 :
          materialType = '金属'
          break
        case 1 :
          materialType = '化学'
          break
        case 2 :
          materialType = '气体'
          break
        case 3 :
          materialType = '包材'
          break
        case 4 :
          materialType = '衬底'
          break
        case 5 :
          materialType = 'MO源'
          break
      }
      return materialType
    },
    // 查询供应商
    findSupplierListFun() {
      findSupplierList().then(res => {
        this.supplierOptions = res.data
      })
    },
    // 查询对应材料类型的供应商
    findSupplierListByTypeFun(goodsType) {
      findSupplierList({ goodsType }).then(res => {
        this.supplierDialogOptions = res.data
      })
    },
    // 检验员
    checkerListFun() {
      checkerList().then(res => {
        this.checkerList = res.data
      })
    },
    // 采购员
    buyerListFun() {
      buyerList().then(res => {
        this.buyerList = res.data
      })
    },
    // 根据材料类型查询材料名称
    materialTypeChange(type) {
      console.log(type)
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
    // 材料名称
    getMaterialNameOptions(type) {
      const params = {
        materialType: type
      }
      getMaterialByType(params).then(res => {
        this.materialNameDialogOptions = res.data
      })
    },
    // 过期时间
    queryBymaterialTypeFun(materialType) {
      queryBymaterialType({ materialType }).then(res => {
        this.threshold = res.data.threshold
      })
    },
    // 获取单位
    findUnitByMaterialIdFun(materialType) {
      findUnitByMaterialId({ materialType }).then(res => {
        this.unitsOptions = res.data
      })
    },
    // 检验编号
    getCKNOFun() {
      getCKNO().then(res => {
        this.addForm.jybh = res.data
      })
    },
    // 计算合格率
    getYidld() {
      if (this.addForm.cysl !== '' && this.addForm.bls !== '') {
        this.addForm.hgv = (((this.addForm.cysl - this.addForm.bls) / this.addForm.cysl) * 100).toFixed(2) + '%'
      }
    },
    cyslChange() {
      if (this.addForm.cysl.length > 10) {
        this.addForm.cysl = this.addForm.cysl.substr(0, 10)
      }
      if (this.addForm.bls !== '') {
        this.$refs.addForm.validateField('bls')
      }
      this.getYidld()
    },
    blsChange() {
      if (this.addForm.bls.length > 10) {
        this.addForm.bls = this.addForm.bls.substr(0, 10)
      }
      if (this.addForm.cysl !== '' && parseInt(this.addForm.bls) > parseInt(this.addForm.cysl)) {
        this.addForm.bls = this.addForm.cysl
      }
      this.getYidld()
    },
    getDialogTitle(index) {
      switch (index) {
        case 0 :
          this.dialogTitle = '金属'
          this.needSample = true
          break
        case 1 :
          this.dialogTitle = '化学'
          this.needSample = true
          break
        case 2 :
          this.dialogTitle = '气体'
          this.needSample = false
          break
        case 3 :
          this.dialogTitle = '包材'
          this.needSample = false
          break
        case 4 :
          this.dialogTitle = '衬底'
          this.needSample = false
          break
        case 5 :
          this.dialogTitle = 'MO源'
          this.needSample = false
          break
      }
    },

    // 新增按钮
    addMaterial(index) {
      this.hideUpload = false
      this.addFileList = []
      this.activeTabIndex = 0
      // 获取对应的供应商
      this.findSupplierListByTypeFun(index - 1)
      this.currentMaterialType = index - 1
      // 材料
      this.getMaterialNameOptions(index - 1)
      // 过期时间
      this.queryBymaterialTypeFun(index - 1)
      // 单位
      this.findUnitByMaterialIdFun(index - 1)
      this.getCKNOFun()
      this.addForm.testDate = new Date().getTime()
      this.getDialogTitle(index - 1)
      this.addForm.sfxplsy = false
      this.addForm.jyr = this.getToken
      const params = {
        pageNum: 1,
        pageSize: 10,
        materialType: index - 1 // 材料类型
      }
      queryList(params).then(res => {
        if (res.data.list.length > 0) {
          const lastAddMaterial = res.data.list[0]
          this.addForm.pch = lastAddMaterial.materialBatch
          let hasBuyer = false
          this.buyerList.map(item => {
            if (item.id === lastAddMaterial.buyer) {
              hasBuyer = true
            }
          })
          this.addForm.cgy = hasBuyer ? lastAddMaterial.buyer : ''
          this.addForm.clmc = lastAddMaterial.materialId
          // 材料名称--> 获取 型号与年限
          this.materialChange(lastAddMaterial.materialId)
          setTimeout(() => {
            this.addForm.xhgg = lastAddMaterial.specificationsId
            this.addForm.gys = lastAddMaterial.supplierId
          }, 200)
          this.addForm.num = lastAddMaterial.num
          this.addForm.dw = lastAddMaterial.unitId
          this.addForm.productionDate = new Date(lastAddMaterial.makeDate).getTime() // 生产日期
          this.addForm.arrivalDate = new Date(lastAddMaterial.reachDate).getTime() // 到货日期
          this.addForm.expriationDate = new Date(lastAddMaterial.overDate).getTime() // 过期日期
          this.addForm.testDate = new Date().getTime()
          this.addForm.validDate = lastAddMaterial.effectiveTime
          this.addForm.cysl = lastAddMaterial.sampleNum
          this.addForm.bls = lastAddMaterial.badNum
          this.addForm.result = lastAddMaterial.result
          this.checker = lastAddMaterial.checker
          this.addForm.hgv = lastAddMaterial.rate + '%'
          this.addForm.blnr = lastAddMaterial.badContent
          this.addForm.remark = lastAddMaterial.remark
        } else {
          this.addForm.pch = ''
          this.addForm.cgy = ''
          this.addForm.clmc = ''
          this.addForm.xhgg = ''
          this.addForm.gys = ''
          this.addForm.num = ''
          this.addForm.dw = ''
          this.addForm.productionDate = ''
          this.addForm.arrivalDate = new Date().getTime()
          this.addForm.expriationDate = ''
          this.addForm.testDate = new Date().getTime()
          this.addForm.validDate = ''
          this.addForm.cysl = ''
          this.addForm.bls = ''
          this.addForm.result = 0
          this.checker = ''
          this.addForm.hgv = ''
          this.addForm.blnr = ''
          this.addForm.remark = ''
        }
        this.addMetalDialogVisible = true
      })
      this.uploadParams.dataId = ''
      setTimeout(() => {
        this.materialDialogChange = false
        this.uploadFileChange = false
      }, 500)
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= 5
      deleteFile({ id: file.id }).then(res => {
      })
    },
    handleIsAddRemove(file, fileList) {
      this.hideUpload = fileList.length >= 5
      deleteFile({ id: file.response.data.id }).then(res => {
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 小批量试样
    smallBatchSample() {
      if (this.selectedRow.sample === 1) {
        this.$message({
          type: 'error',
          message: '请勿重复试样!'
        })
        return false
      }
      if (this.selectedRow.materialType === 2 || this.selectedRow.materialType === 3 || this.selectedRow.materialType === 4 || this.selectedRow.materialType === 5) {
        this.$message({
          type: 'error',
          message: '所选原材料类型无需进行小批量试样!'
        })
        return false
      }
      this.$router.push({
        path: '/inputQualityControl/smallBatchSample',
        query: {
          checkId: this.selectedRow.id,
          unitId: this.selectedRow.unitId,
          materialType: this.selectedRow.materialType,
          num: this.selectedRow.num,
          specificationsId: this.selectedRow.specificationsId,
          materialId: this.selectedRow.materialId,
          materialBatch: this.selectedRow.materialBatch,
          reachDate: this.selectedRow.reachDate,
          supplierId: this.selectedRow.supplierId
        }
      })
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
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        checkNo: this.searchKeys.jybh, // 检验编号
        materialBatch: this.searchKeys.pch, // 原料批号
        supplierId: this.searchKeys.gys, // 供应商
        materialType: this.searchKeys.cllb, // 材料类型
        result: this.searchKeys.pd, // 判定
        timeType: this.timeRadio, // 时间
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        checker: this.searchKeys.jyy, // 检验员
        isOver: this.searchKeys.sfyxq, // 是否过期 0 不过，1过
        sample: this.searchKeys.sfxplsy, // 是否小批量试样 0否1是
        buyer: this.searchKeys.cgy, // 采购员
        materialName: this.searchKeys.clmc // 材料名称
      }
      queryList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        if (res.data.list.length !== 0) {
          this.$refs.billTable.setCurrentRow(this.list[0])
          this.selectedRow = this.list[0]
        }
      })
    },
    // 导出
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/zlMaterialCheck/export?timeType=${this.timeRadio}&materialName=${this.searchKeys.clmc}&startTime=${startTime}&endTime=${endTime}&buyer=${this.searchKeys.cgy}&sample=${this.searchKeys.sfxplsy}&isOver=${this.searchKeys.sfyxq}&checker=${this.searchKeys.jyy}&result=${this.searchKeys.pd}&checkNo=${this.searchKeys.jybh}&materialBatch=${this.searchKeys.pch}&supplierId=${this.searchKeys.gys}`)
    },
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.jybh = ''
      this.searchKeys.pch = ''
      this.searchKeys.clmc = ''
      this.searchKeys.gys = ''
      this.searchKeys.cllb = ''
      this.searchKeys.pd = ''
      this.searchKeys.jyy = ''
      this.searchKeys.sfyxq = ''
      this.searchKeys.sfxplsy = ''
      this.searchKeys.cgy = ''
      this.timeRadio = 0
      this.materialNameOptions = []
      this.handleSearch()
    },
    handleClose() {
      this.$refs.addForm.resetFields()
    },
    rowClick(row) {
      this.selectedRow = row
    },
    handleRemoveEditUpload(file, fileList) {
      this.uploadFileFlag++
      this.removeEditUploadId.push(file.id)
      this.hideUpload = fileList.length >= 5
    },
    // 取消
    resetForm(formName, index) {
      if (this.materialDialogChange || this.uploadFileChange) {
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
      if (index === 1 && this.editUploadIds.length > 0) {
        this.editUploadIds.map(item => {
          deleteFile({ id: item }).then(res => {
          })
        })
      }
    }
  }
}

