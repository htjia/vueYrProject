import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { add, remove, edit, getSampleNo, queryList, findDepartment, getSampleType } from '@/api/iqc/firstSampleManage'
import { findSupplierList, findModelByMaterialId, findByDataId, deleteFile } from '@/api/iqc/examinationMaterial'
import { getMaterialByType } from '@/api/iqc/basicInfoConfig'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    // const validateFile = (rule, value, callback) => {
    //   if (this.$refs.upload.uploadFiles.length === 0) {
    //     callback(new Error('请选择要上传的文件'))
    //     this.$message({
    //       type: 'error',
    //       message: '请选择要上传的文件!'
    //     })
    //   } else {
    //     console.log(this.$refs.upload.uploadFiles[0])
    //     // var regx = new RegExp('(.xlsx)$|(.doc)$|(.docx)$|(.xls)$')
    //     var regx = new RegExp('(.dll)$|(.dlL)$|(.dLl)$|(.dLL)$|(.Dll)$|(.DlL)$|(.DLl)$|(.DLL)$')
    //     if (!regx.test(this.$refs.upload.uploadFiles[0].name)) {
    //       callback(new Error('文件格式只支持dll'))
    //       this.$message({
    //         type: 'error',
    //         message: '文件格式只支持dll!'
    //       })
    //     }
    //     if (this.$refs.upload.uploadFiles[0].size / 1024 / 1024 > 1) {
    //       callback(new Error('文件大小必须小于1Mb'))
    //       this.$message({
    //         type: 'error',
    //         message: '文件大小必须小于1Mb!'
    //       })
    //     }
    //     callback()
    //   }
    // }
    return {
      listLoading: false,
      addMetalDialogVisible: false,
      editMetalDialogVisible: false,
      dialogVisible: false,
      needSample: false,
      materialDialogChange: false,
      uploadFileChange: false,
      dialogImageUrl: '',
      list: [{}],
      fileList: [],
      removeEditUploadId: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      modelOptions: [], // 型号规格
      sampleTypeOptions: [],
      firstSampleId: '',
      firstSampleParams: { dataId: '' },
      batchSampleParams1: { dataId: '' },
      batchSampleParams2: { dataId: '' },
      batchSampleParams3: { dataId: '' },
      batchSampleId1: '',
      batchSampleId2: '',
      batchSampleId3: '',
      fileUrl: process.env.BASE_API + '/attachment/upload',
      pageSize: 15,
      pageNum: 1,
      currentMaterialType: 0,
      totalPage: 0,
      uploadFlg: 0,
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
      materialNameOptions: [], // 材料名称
      materialNameDialogOptions: [], // 材料名称
      unitOptions: [], // 单位
      resultOptions: [
        { id: 0, name: '合格' },
        { id: 1, name: '不合格' }
      ],
      statusOptions: [ // 试样状态
        { id: 0, name: '试样中' },
        { id: 1, name: '试样完成' }
      ],
      materialOptions: [
        { id: 0, name: '金属' },
        { id: 1, name: '化学' },
        { id: 2, name: '气体' },
        { id: 3, name: '包材' },
        { id: 4, name: '衬底' },
        { id: 5, name: 'MO源' }
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
        dh: '',
        sybm: '',
        gys: '',
        cllx: '',
        clmc: '',
        syjg: '',
        syzt: '',
        sfyxq: '',
        sfxplsy: '',
        cgy: ''
      },
      addForm: {
        dh: '',
        sylx: '',
        sybm: '',
        jsrq: '',
        sjwcrq: '',
        xhgg: '',
        syjg: '',
        gys: '',
        clmc: '',
        clxh: '',
        sysl: '',
        yjwcrq: '',
        yzsl1: '',
        jyjg1: '-1',
        yzsl2: '',
        jyjg2: '-1',
        yzsl3: '',
        jyjg3: '-1',
        bgdh: '',
        bz: ''
      },
      rules: {},
      currentId: ''
    }
  },
  mounted() {
    console.log(this.$route.params.supplierId)
    this.fetchData()
    this.findSupplierListFun()
    this.findDepartmentFun()
    this.getSampleTypeFun()
  },
  watch: {
    addForm: {
      handler(val, oldVal) {
        this.materialDialogChange = true
      },
      deep: true
    },
    uploadFlg: {
      handler(val, oldVal) {
        this.uploadFileChange = true
      },
      deep: true
    }
  },
  methods: {
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
    // 试样单号
    getSampleNoFun() {
      getSampleNo().then(res => {
        this.addForm.dh = res.data
      })
    },
    // 试样类型
    getSampleTypeFun() {
      getSampleType().then(res => {
        this.sampleTypeOptions = res.data
      })
    },
    dateChange() {
      console.log(1)
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
        sampleNo: this.searchKeys.dh, // 单号
        supplierId: this.searchKeys.gys, // 供应商
        materialType: this.searchKeys.cllx, // 材料类型
        sampleWorkshopId: this.searchKeys.sybm, // 试样部门
        result: this.searchKeys.syjg, // 检验结论(result)[0-合格 1-不合格]
        material: this.searchKeys.clmc, // 材料名称
        timeType: this.timeRadio, // 时间
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      queryList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
      })
    },
    // 导出
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/zlFirstSample/export?sampleNo=${this.searchKeys.dh}&material=${this.searchKeys.clmc}&result=${this.searchKeys.syjg}&sampleWorkshopId=${this.searchKeys.sybm}&materialType=${this.searchKeys.cllx}&supplierId=${this.searchKeys.gys}&timeType=${this.timeRadio}&startTime=${startTime}&endTime=${endTime}`)
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
      console.log(materialId)
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
        this.departmentOptions = res.data
      })
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
    // 根据材料类型查询材料名称
    materialTypeChange(type) {
      this.searchKeys.clmc = ''
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const zlBatchSamples = [
            {
              checkNum: this.addForm.yzsl1,
              result: this.addForm.jyjg1,
              checkOrder: 1,
              id: this.batchSampleId1
            },
            {
              checkNum: this.addForm.yzsl2,
              result: this.addForm.jyjg2,
              checkOrder: 2,
              id: this.batchSampleId2
            },
            {
              checkNum: this.addForm.yzsl3,
              result: this.addForm.jyjg3,
              checkOrder: 3,
              id: this.batchSampleId3
            }
          ]
          const params = {
            zlFirstSample: {
              materialType: this.currentMaterialType, // 材料类型
              sampleNo: this.addForm.dh, // 试样编号
              sampleTypeId: this.addForm.sylx, // 试样类型
              sampleWorkshopId: this.addForm.sybm, // 试样部门
              receiveDate: this.addForm.jsrq, // 接收样品日期
              finishDate: this.addForm.sjwcrq, // 实际完成日期
              result: this.addForm.syjg, // 试样结果
              supplierId: this.addForm.gys, // 供应商
              materialId: this.addForm.clmc, // 材料名称
              materialModel: this.addForm.xhgg, // 型号规格
              sampleNum: this.addForm.sysl, // 试样数量
              expectDate: this.addForm.yjwcrq, // 预计完成日期
              noticeNo: this.addForm.bgdh, // 转生产变更通知单号
              remark: this.addForm.bz, // 转生产变更通知单号
              id: this.firstSampleId // 文件Id
            },
            zlBatchSamples
          }
          // checkId
          console.log(params)
          add(params).then(res => {
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
          const zlBatchSamples = [
            {
              checkNum: this.addForm.yzsl1,
              result: this.addForm.jyjg1,
              checkOrder: 1,
              id: this.batchSampleId1
            },
            {
              checkNum: this.addForm.yzsl2,
              result: this.addForm.jyjg2,
              checkOrder: 2,
              id: this.batchSampleId2
            },
            {
              checkNum: this.addForm.yzsl3,
              result: this.addForm.jyjg3,
              checkOrder: 3,
              id: this.batchSampleId3
            }
          ]
          const params = {
            zlFirstSample: {
              materialType: this.currentMaterialType,
              sampleNo: this.addForm.dh, // 试样编号
              sampleTypeId: this.addForm.sylx, // 试样类型
              sampleWorkshopId: this.addForm.sybm, // 试样部门
              receiveDate: this.addForm.jsrq, // 接收样品日期
              finishDate: this.addForm.sjwcrq, // 实际完成日期
              result: this.addForm.syjg, // 试样结果
              supplierId: this.addForm.gys, // 供应商
              materialId: this.addForm.clmc, // 材料名称
              materialModel: this.addForm.xhgg, // 型号规格
              sampleNum: this.addForm.sysl, // 试样数量
              expectDate: this.addForm.yjwcrq, // 预计完成日期
              noticeNo: this.addForm.bgdh, // 转生产变更通知单号
              remark: this.addForm.bz, // 转生产变更通知单号
              id: this.firstSampleParams.dataId // 文件Id
            },
            zlBatchSamples
          }
          // checkId
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
    yzslChange() {
      if (this.addForm.yzsl1.length > 10) {
        this.addForm.yzsl1 = this.addForm.yzsl1.substr(0, 10)
      }
      if (this.addForm.yzsl2.length > 10) {
        this.addForm.yzsl2 = this.addForm.yzsl2.substr(0, 10)
      }
      if (this.addForm.yzsl3.length > 10) {
        this.addForm.yzsl3 = this.addForm.yzsl3.substr(0, 10)
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess(res, file, fileList) {
      this.fileName = file.name
      this.firstSampleId = res.data.dataId
    },
    onEditUploadSuccess(res, file, fileList) {
      file['id'] = file.response.data.id
      this.editUploadIds.push(res.data.id)
    },
    onSuccess1(res, file, fileList) {
      this.batchSampleId1 = res.data.dataId
      console.log(res.data.dataId)
    },
    onSuccess2(res, file, fileList) {
      this.batchSampleId2 = res.data.dataId
    },
    onSuccess3(res, file, fileList) {
      this.batchSampleId3 = res.data.dataId
    },
    // 添加时删除
    handleRemove(file, fileList) {
      deleteFile({ id: file.response.data.id }).then(res => {
      })
    },
    // 编辑时删除
    handleEditRemove(file) {
      this.uploadFlg++
      this.removeEditUploadId.push(file.id)
    },
    uploadChange(file, fileList) {
      this.uploadFlg++
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onExceed() {
      this.$message({
        type: 'error',
        message: '超出文件上传数量!'
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
    // 编辑
    handleEdit(row) {
      this.editUploadIds = []
      this.removeEditUploadId = []
      this.activeTabIndex = 0
      // 材料
      this.getMaterialNameOptions(row.materialType)
      this.findSupplierListByTypeFun(row.materialType)
      this.currentMaterialType = row.materialType
      this.addForm.dh = row.sampleNo
      this.addForm.sylx = row.sampleTypeId
      this.addForm.sybm = row.sampleWorkshopId
      this.addForm.jsrq = row.receiveDate
      this.addForm.sjwcrq = row.finishDate
      this.addForm.syjg = row.result
      this.addForm.clmc = parseInt(row.materialId)
      this.materialChange(row.materialId)
      setTimeout(() => {
        this.addForm.xhgg = parseInt(row.materialModel)
        this.addForm.gys = row.supplierId
      }, 200)
      this.addForm.sysl = row.sampleNum
      this.addForm.yjwcrq = row.expectDate
      this.addForm.yzsl1 = row.bcheckNum1
      this.addForm.jyjg1 = parseInt(row.bresult1)
      this.addForm.yzsl2 = row.bcheckNum2
      this.addForm.jyjg2 = parseInt(row.bresult2)
      this.addForm.yzsl3 = row.bcheckNum3
      this.addForm.jyjg3 = parseInt(row.bresult3)
      this.addForm.bgdh = row.noticeNo
      this.addForm.bz = row.remark
      this.findDataByDataId(row.id)
      this.findDataByDataId1(row.bid1)
      this.findDataByDataId2(row.bid2)
      this.findDataByDataId3(row.bid3)
      this.firstSampleParams.dataId = row.id
      this.batchSampleId1 = row.bid1
      this.batchSampleParams1.dataId = row.bid1
      this.batchSampleId2 = row.bid2
      this.batchSampleParams2.dataId = row.bid2
      this.batchSampleId3 = row.bid3
      this.batchSampleParams3.dataId = row.bid3
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
            url: 'https:' + item.path,
            id: item.id
          })
        })
        console.log(fileList)
        this.fileList = fileList
      })
    },
    findDataByDataId1(dataId) {
      findByDataId({ dataId }).then(res => {
        const fileList = []
        res.data.map(item => {
          fileList.push({
            name: item.name,
            url: item.path,
            id: item.id
          })
        })
        this.fileList1 = fileList
      })
    },
    findDataByDataId2(dataId) {
      findByDataId({ dataId }).then(res => {
        const fileList = []
        res.data.map(item => {
          fileList.push({
            name: item.name,
            url: 'https:' + item.path,
            id: item.id
          })
        })
        this.fileList2 = fileList
      })
    },
    findDataByDataId3(dataId) {
      findByDataId({ dataId }).then(res => {
        const fileList = []
        res.data.map(item => {
          fileList.push({
            name: item.name,
            url: 'https:' + item.path,
            id: item.id
          })
        })
        this.fileList3 = fileList
      })
    },
    // 新增试样
    batchSample(title, type) {
      this.activeTabIndex = 0
      this.fileList = []
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.firstSampleId = ''
      this.batchSampleId1 = ''
      this.batchSampleId2 = ''
      this.batchSampleId3 = ''
      this.firstSampleParams.dataId = ''
      this.batchSampleParams1.dataId = ''
      this.batchSampleParams2.dataId = ''
      this.batchSampleParams3.dataId = ''
      this.addForm.dh = ''
      this.addForm.sylx = ''
      this.addForm.sybm = ''
      this.addForm.jsrq = ''
      this.addForm.sjwcrq = ''
      this.addForm.syjg = '-1'
      this.addForm.gys = ''
      this.addForm.clmc = ''
      this.addForm.xhgg = ''
      this.addForm.sysl = ''
      this.addForm.yjwcrq = ''
      this.addForm.yzsl1 = ''
      this.addForm.jyjg1 = '-1'
      this.addForm.yzsl2 = ''
      this.addForm.jyjg2 = '-1'
      this.addForm.yzsl3 = ''
      this.addForm.jyjg3 = '-1'
      this.addForm.bgdh = ''
      this.addForm.bz = ''
      this.findSupplierListByTypeFun(type)
      // 材料
      this.getMaterialNameOptions(type)
      // 试样单号
      this.getSampleNoFun()
      this.currentMaterialType = type
      this.dialogTitle = title
      this.activeTabIndex = 0
      setTimeout(() => {
        this.materialDialogChange = false
        this.uploadFileChange = false
      }, 500)
      this.addMetalDialogVisible = true
    },
    numChange() {
      if (this.addForm.sysl.length > 10) {
        this.addForm.sysl = this.addForm.sysl.substr(0, 10)
      }
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
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.dh = ''
      this.searchKeys.sybm = ''
      this.searchKeys.gys = ''
      this.searchKeys.cllx = ''
      this.searchKeys.clmc = ''
      this.searchKeys.syjg = ''
      this.searchKeys.syzt = ''
      this.searchKeys.sfyxq = ''
      this.searchKeys.sfxplsy = ''
      this.searchKeys.cgy = ''
      this.timeRadio = 0
      this.materialNameOptions = []
      this.handleSearch()
    },
    handleClose() {
      console.log(0)
    },
    handlePreview(file) {
      console.log(file)
      window.open(process.env.BASE_API + `/attachment/down?id=${file.id}`)
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
    rowClick(row) {
      console.log(row)
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

