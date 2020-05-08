
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { typeList, measureList } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo'
import { getList, addSubstrate, dataOperateRecord, remove, update, deleteDataRecord } from '@/api/extensionManage/stockManage/substrate'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateGys = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入衬底厂家'))
      } else {
        if (pattern.test(value)) {
          callback(new Error('衬底厂家不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateLkh = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const reg = /\s/
      if (value.trim().length === 0) {
        callback(new Error('请输入镭刻号'))
      } else if (reg.test(value)) {
        callback(new Error('镭刻号不能包含空格'))
      } else if (chinese.test(value)) {
        callback(new Error('镭刻号必须为数字或字母'))
      } else if (pattern.test(value)) {
        callback(new Error('镭刻号必须为数字或字母'))
      } else {
        callback()
      }
    }
    const validatePch = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入批次号'))
      } else if (chinese.test(value)) {
        callback(new Error('批次号必须为数字或字母'))
      } else if (pattern.test(value)) {
        callback(new Error('批次号必须为数字或字母'))
      } else {
        callback()
      }
    }
    const validateBoxNum = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入盒号'))
      } else if (chinese.test(value)) {
        callback(new Error('盒号必须为数字或字母'))
      } else if (pattern.test(value)) {
        callback(new Error('盒号必须为数字或字母'))
      } else {
        callback()
      }
    }
    const validateXh = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const az = new RegExp('[a-zA-Z]')
      if ((value + '').trim().length === 0) {
        callback(new Error('请输入箱号'))
      } else if (chinese.test(value)) {
        callback(new Error('箱号必须为数字'))
      } else if (az.test(value)) {
        callback(new Error('箱号必须为数字'))
      } else if (pattern.test(value)) {
        callback(new Error('箱号必须为数字'))
      } else {
        callback()
      }
    }
    const validateCxh = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const az = new RegExp('[a-z]')
      if ((value + '').trim().length === 0) {
        callback(new Error('请输入次序号'))
      } else if (chinese.test(value)) {
        callback(new Error('次序号必须为数字'))
      } else if (az.test(value)) {
        callback(new Error('次序号必须为数字'))
      } else if (pattern.test(value)) {
        callback(new Error('次序号必须为数字'))
      } else if (value === 0 || value < 0) {
        callback(new Error('次序号必须大于0'))
      } else {
        callback()
      }
    }
    return {
      fileUrl: process.env.BASE_API + '/wySubstrate/importExcel',
      showHandle: false,
      importDialogVisible: false,
      listLoading: false,
      loading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      tableKey: 1,
      list: [{}],
      defaultFormThead: [],
      fileList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageSizeSp: 15,
      pageNum: 1,
      pageNumSp: 1,
      isActive: 0,
      totalPage: 0,
      totalPageSp: 0,
      beginDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      fileName: '',
      operatorName: '',
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
      pickerOptionsStartTime: {
        disabledDate: (time) => {
          const endDateVal = this.endTime
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEndTime: {
        disabledDate: (time) => {
          const beginDateVal = this.startTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      siteOptions: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ],
      siteSelectOptions: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '前段站点'
        },
        {
          id: 1,
          name: '后段站点'
        }
      ],
      siteStatusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
      singleDoubleOptions: [
        {
          id: 0,
          name: '单抛'
        },
        {
          id: 1,
          name: '双抛'
        }
      ],
      whetherOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      userOptions: [],
      typeList: [],
      measureList: [],
      importRecords: [],
      uploadParams: { userId: sessionStorage.getItem('User-Id') },
      substrateForm: {
        lkh: '',
        pch: '',
        chic: '',
        cdlx: '',
        cxh: '',
        gys: '',
        boxNum: '',
        sd: '',
        xh: ''
      },
      rules: {
        lkh: [{ required: true, validator: validateLkh, trigger: 'blur' }],
        pch: [{ required: true, validator: validatePch, trigger: 'blur' }],
        cxh: [{ required: true, validator: validateCxh, trigger: 'blur' }],
        chic: [{ required: true, message: '请选择衬底尺寸', trigger: 'blur' }],
        cdlx: [{ required: true, message: '请选择衬底工艺', trigger: 'blur' }],
        gys: [{ required: true, validator: validateGys, trigger: 'blur' }],
        boxNum: [{ required: true, validator: validateBoxNum, trigger: 'blur' }],
        sd: [{ required: true, message: '请选择单/双抛', trigger: 'blur' }],
        xh: [{ required: true, validator: validateXh, trigger: 'blur' }]
      },
      searchKeys: {
        lkh: '',
        xh: '',
        sd: '',
        gys: '',
        pch: '',
        boxNum: '',
        cdlx: '',
        cdcc: '',
        sfsz: '',
        sfld: ''
      },
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.fetchTypeList()
    this.fetchMeasureList()
  },
  methods: {
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 10MB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      console.log(res)
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        this.$message({
          type: 'success',
          message: '数据导入成功'
        })
        this.fetchData()
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '数据导入失败，请重试！'
      })
      this.loading = false
    },
    clearDialogSearch() {
      this.startTime = ''
      this.endTime = ''
      this.fileName = ''
      this.operatorName = ''
    },
    // 导入记录
    viewImportRecords() {
      this.importDialogVisible = true
      const param = {
        operatorName: this.operatorName,
        fileName: this.fileName,
        startTime: this.startTime === '' ? '' : this.formatDate(this.startTime),
        endTime: this.endTime === '' ? '' : this.formatDate(this.endTime),
        pageNum: this.pageNumSp,
        pageSize: this.pageSizeSp,
        route: 'substrate'
      }
      dataOperateRecord(param).then(res => {
        this.importRecords = res.data.list
        this.totalPageSp = res.data.total
      })
    },
    // 数据管理
    dataManage() {
      this.showHandle = true
      this.tableKey = Math.random()
    },
    // 数据管理返回
    dataManageSave() {
      this.showHandle = false
      this.tableKey = Math.random()
    },
    // 查询衬底工艺
    fetchTypeList() {
      typeList({}).then(res => {
        this.typeList = res.data
      })
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      measureList({}).then(res => {
        this.measureList = res.data
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
    // 导入记录当前页数改变
    currentChangeSp(pageNumSp) {
      this.pageNumSp = pageNumSp
      this.viewImportRecords()
    },
    // 导入记录每页数量改变
    sizeChangeSp(pageSizeSp) {
      this.pageSizeSp = pageSizeSp
      this.viewImportRecords()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 重置
    clearSearch() {
      this.searchKeys.lkh = ''
      this.searchKeys.cdlx = ''
      this.searchKeys.pch = ''
      this.searchKeys.gys = ''
      this.searchKeys.xh = ''
      this.searchKeys.boxNum = ''
      this.searchKeys.cdcc = ''
      this.searchKeys.sd = ''
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.sfsz = ''
      this.searchKeys.sfld = ''
      this.handleSearch()
    },
    // 导出
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wySubstrate/exportExcel?laserMark=${this.searchKeys.lkh}&cartonNo=${this.searchKeys.xh}&batchNo=${this.searchKeys.pch}&singleDoubleThrow=${this.searchKeys.sd}&supplier=${this.searchKeys.gys}&startTime=${startTime}&endTime=${endTime}&boxNo=${this.searchKeys.boxNum}&typeId=${this.searchKeys.cdlx}&measureId=${this.searchKeys.cdcc}&growIs=${this.searchKeys.sfsz}&alnIs=${this.searchKeys.sfld}`)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        laserMark: this.searchKeys.lkh,
        typeId: this.searchKeys.cdlx, // 衬底工艺
        batchNo: this.searchKeys.pch, // 批次号
        supplier: this.searchKeys.gys, // 衬底厂家
        cartonNo: this.searchKeys.xh, // 箱号
        boxNo: this.searchKeys.boxNum, // 盒号
        measureId: this.searchKeys.cdcc, // 尺寸
        singleDoubleThrow: this.searchKeys.sd,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        growIs: this.searchKeys.sfsz,
        alnIs: this.searchKeys.sfld
      }
      getList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.substrateForm.lkh = ''
      this.substrateForm.cdlx = '' // 衬底工艺
      this.substrateForm.pch = '' // 批次号
      this.substrateForm.gys = '' // 衬底厂家
      this.substrateForm.xh = '' // 箱号
      this.substrateForm.boxNum = '' // 盒号
      this.substrateForm.cxh = '' // 次序号
      this.substrateForm.chic = '' // 尺寸
      this.substrateForm.sd = '' // 单双抛
      this.fetchTypeList()
      this.fetchMeasureList()
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    handleCloseImportDialog() {
      this.fetchData()
      this.operatorName = ''
      this.fileName = ''
      this.startTime = ''
      this.endTime = ''
      this.pageSizeSp = 15
      this.pageNumSp = 1
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            laserMark: this.substrateForm.lkh,
            typeId: this.substrateForm.cdlx, // 衬底工艺
            batchNo: this.substrateForm.pch, // 批次号
            supplier: this.substrateForm.gys, // 衬底厂家
            cartonNo: this.substrateForm.xh, // 箱号
            boxNo: this.substrateForm.boxNum, // 盒号
            sequence: this.substrateForm.cxh, // 次序号
            measureId: this.substrateForm.chic, // 尺寸
            singleDoubleThrow: this.substrateForm.sd // 单双抛
            // createTime: '2019-05-04'
          }
          addSubstrate(params).then(res => {
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.fetchTypeList()
      this.fetchMeasureList()
      this.currentId = row.id
      this.substrateForm.lkh = row.laserMark
      this.substrateForm.cdlx = row.typeId
      this.substrateForm.pch = row.batchNo
      this.substrateForm.gys = row.supplier
      this.substrateForm.xh = row.cartonNo
      this.substrateForm.boxNum = row.boxNo
      this.substrateForm.cxh = row.sequence
      this.substrateForm.chic = row.measureId
      this.substrateForm.sd = row.singleDoubleThrow
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            laserMark: this.substrateForm.lkh,
            typeId: this.substrateForm.cdlx, // 衬底工艺
            batchNo: this.substrateForm.pch, // 批次号
            supplier: this.substrateForm.gys, // 衬底厂家
            cartonNo: this.substrateForm.xh, // 箱号
            boxNo: this.substrateForm.boxNum, // 盒号
            sequence: this.substrateForm.cxh, // 次序号
            measureId: this.substrateForm.chic, // 尺寸
            singleDoubleThrow: this.substrateForm.sd // 单双抛
          }
          console.log(params)
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteDataRecordFun(row) {
      if (row.isDeleted === 1) {
        this.$message({
          type: 'error',
          message: '文档已经撤销，请勿重复操作!'
        })
      } else {
        this.$confirm('此操作将永久撤销导入信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            dataRecordId: row.id
          }
          deleteDataRecord(param).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '撤销成功!'
              })
              this.viewImportRecords()
            }
          })
        })
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该衬底信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

