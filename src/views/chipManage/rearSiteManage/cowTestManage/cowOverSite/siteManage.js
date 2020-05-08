
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { abnormalSave, receiveScanning } from '@/api/chipManage/rearSiteManage/tensileTest'
import { getCowList, cowDeliverScanning, addReceive, addDeliver, findAbnormalList, chipTypeList, findCowWaferFile, updateCowWaferFile } from '@/api/chipManage/rearSiteManage/cowOverSite'
import { downByPath } from '@/api/chipManage/rearSiteManage/inciseOverSite'
import { findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      fileDialogVisible: false,
      editDialogVisible: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      batchDialogVisible: false,
      abnormalReportDialog: false,
      downFileVisble: false,
      notBastic: false,
      isReceive: 0,
      waferTotalNum: 0,
      selectedAbnormalNum: 0,
      waferTotal: 0,
      abnormalBatchList: [],
      abnormalList: [],
      fileList: [],
      detailList: [],
      receiveList: [],
      chipTypeOptions: [],
      chipType: '',
      userOptions: [],
      abnormalBatchNum: '',
      processId: '',
      selectedRunRow: {},
      selectedAbnormalRow: {},
      batchNo: '',
      model: '',
      pole: '',
      timeRadio: 0,
      textareaRow: 0,
      batch: 5,
      batchNum: '',
      jBatchNum: '',
      sBatchNum: '',
      cBatchNum: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
      program: '',
      cRemark: '',
      sRemark: '',
      jOperator: '',
      sOperator: '',
      cOperator: '',
      jRemarkLeft: '',
      sRemarkLeft: '',
      cRemarkLeft: '',
      trench: '', // 槽位
      grandTotal: '', // 累计片数
      threshold: '', // 阈值
      temperature: '', // 溶液温度
      etchingTime: '', // 腐蚀时间
      machineNum: '', // 机台编号
      motionRadio: '1',
      list: [],
      proceOptions: [],
      transmitList: [],
      rightList: [],
      abnormalReport: [],
      abnormalRemark: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
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
      poleOptions: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      abnormalFeedbackVisible: false,
      selectWaferVisible: false,
      alertDialogVisible: false,
      splicingTime: '',
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
      processOptions: [
        {
          id: 0,
          name: '工序1'
        },
        {
          id: 1,
          name: '工序2'
        }
      ],
      currentId: ''
    }
  },
  computed: {
    totalNum() {
      let num = 0
      this.receiveList.map(item => {
        num += item.total
      })
      return num
    }
  },
  mounted() {
    this.fetchData()
    this.getListFun()
    this.chipTypeListFun()
    this.nowProcessListFun()
    this.findMachineUserFun()
  },
  methods: {
    getListFun() {
      const params = {
        siteId: 20
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
      })
    },
    downLoadFile(url) {
      if (url === null) {
        this.$message({
          type: 'error',
          message: '附件不存在!'
        })
        return false
      }
      downByPath({ path: url }).then(res => {
        window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
      })
    },
    downLoad(row) {
      this.fileList = row.flies
      this.downFileVisble = true
    },
    chipTypeListFun() {
      chipTypeList({}).then(res => {
        this.chipTypeOptions = res.data
      })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: 'COW测试操作员' }).then(res => {
        this.userOptions = res.data
      })
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 20 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
    },
    // 异常原因合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: 12,
          colspan: 1
        }
      }
    },
    // 异常上报
    handleReporting() {
      this.abnormalRemark = ''
      const params = []
      this.receiveList.map(item => {
        params.push(item.batchNo)
      })
      findAbnormalList(params).then(res => {
        res.data.map(item => {
          item.selectedWafer = 0
          item.abnormalStatus = false
          if (item.wafers.length !== 0) {
            item.wafers.map(wafer => {
              wafer.abnormalStatus = false
              wafer.abnormalCause = ''
            })
          }
        })
        this.abnormalReport = res.data
        this.abnormalReportDialog = true
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.abnormalReport[0])
        }, 500)
        this.detailList = this.abnormalReport.length === 0 ? [] : this.abnormalReport[0].wafers
        this.waferTotalNum = this.abnormalReport[0].wafers.length
        this.abnormalBatchNum = this.abnormalReport[0].batchNo
        this.selectedAbnormalRow = this.abnormalReport[0]
        this.textareaRow = 18
      })
    },
    // 异常选中
    abnormalChange(data) {
      this.selectedAbnormalNum = data.filter(item => { return item.abnormalStatus === true }).length
    },
    // 异常详情选中
    abnormalDetailChange(data) {
      const selectedNum = data.filter(item => { return item.abnormalStatus === true }).length
      console.log(selectedNum)
      if (selectedNum > 0) {
        this.selectedAbnormalRow.abnormalStatus = true
        this.selectedAbnormalRow.selectedWafer = selectedNum
      } else {
        this.selectedAbnormalRow.abnormalStatus = false
        this.selectedAbnormalRow.selectedWafer = 0
      }
      this.selectedAbnormalNum = this.abnormalReport.filter(item => { return item.abnormalStatus === true }).length
    },
    // 单击异常信息
    rowClick(row) {
      this.detailList = row.wafers
      this.waferTotalNum = row.wafers.length
      this.abnormalBatchNum = row.batchNo
      this.selectedAbnormalRow = row
    },
    // 异常提交
    abnormalSubmit() {
      const details = []
      const abnormalBatchList = []
      let flag = false
      const itemFlag = false
      let hasAblm = false
      this.abnormalReport.map(item => {
        if (item.abnormalStatus) {
          abnormalBatchList.push(item.batchNo)
          hasAblm = true
          if (item.selectedWafer === 0) {
            flag = true
          }
          item.wafers.map(subItem => {
            if (subItem.abnormalStatus) {
              details.push({
                initAbnormal: true,
                batchNo: item.batchNo,
                reason: subItem.abnormalCause ? subItem.abnormalCause : this.abnormalRemark,
                waferNo: subItem.waferNo
              })
            } else {
              details.push({
                initAbnormal: false,
                batchNo: item.batchNo,
                reason: '',
                waferNo: subItem.waferNo
              })
            }
          })
        }
      })
      if (!hasAblm) {
        this.$message({
          type: 'error',
          message: '异常数据不能为空!'
        })
        return false
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '请选择异常wafer!'
        })
        return false
      }
      if (itemFlag) {
        this.$message({
          type: 'error',
          message: '请输入异常原因!'
        })
        return false
      }
      if (this.abnormalRemark.trim() === '') {
        this.$message({
          type: 'error',
          message: '请输入异常原因!'
        })
        return false
      }
      if (details.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择异常信息!'
        })
        return false
      }
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        description: this.abnormalRemark,
        processId: this.processId,
        exceptionSiteCode: 'H01',
        details
      }
      abnormalSave(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.abnormalBatchList = abnormalBatchList
        this.abnormalReportDialog = false
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
    // 搜索
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.chipType = ''
      this.handleSearch()
    },
    // 异常反馈
    abnormalFeedback() {
      this.abnormalFeedbackVisible = true
    },
    // 异常提交
    submitAbnormal() {
      this.abnormalFeedbackVisible = false
    },
    // 异常片子选择提交
    submitAbnormalWafer() {
      this.selectWaferVisible = false
    },
    // 选择片子
    selectFilm() {
      this.selectWaferVisible = true
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    // 传片扫描
    handleDeliverInput() {
      if (this.cBatchNum.trim() === '') {
        this.$message({
          type: 'error',
          message: '该扫描数据不存在，请确认后，再扫描!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      cowDeliverScanning({ batchNo: this.cBatchNum, processId: this.jProcess }).then(res => {
        if (res.data !== null) {
          this.program = res.data.program
          this.jRemark = res.data.remark
          this.processId = res.data.processId
          this.receiveList.push(res.data)
          this.cBatchNum = ''
        }
      }).catch(() => { this.cBatchNum = '' })
    },
    processJChange() {
      this.receiveList = []
      if (this.jBatchNum !== '') {
        this.handleReceiveInput()
      }
    },
    processCChange() {
      this.receiveList = []
      if (this.cBatchNum !== '') {
        this.handleDeliverInput()
      }
    },
    // 接片扫描
    handleReceiveInput() {
      if (this.jBatchNum.trim() === '') {
        this.$message({
          type: 'error',
          message: '该扫描数据不存在，请确认后，再扫描!'
        })
        this.jBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.jBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      const requestParams = {
        key: this.jBatchNum,
        processId: this.jProcess,
        siteCode: 'H01'
      }
      receiveScanning(requestParams).then(res => {
        if (res.data !== null) {
          this.jBatchNum = ''
          this.program = res.data.program
          this.jRemark = res.data.remark
          this.receiveList.push(res.data)
        }
      }).catch(() => {
        this.jBatchNum = ''
      })
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
      })
    },
    // 接片确认
    handleReceiveDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const details = []
      this.receiveList.map(item => {
        details.push({
          batchNo: item.batchNo,
          piecesNum: item.total
        })
      })
      const requestParams = {
        creator: this.jOperator,
        remark: this.jRemarkLeft,
        details
      }
      addReceive(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.receiveDialogVisible = false
        this.fetchData()
      })
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片时检测有无多个文件
    findCowWaferFileFun() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const requestParams = []
      this.receiveList.map(item => {
        item.wafers.map(wafer => {
          requestParams.push(wafer.waferNo)
        })
      })
      findCowWaferFile(requestParams).then(res => {
        if (res.data.length === 0) {
          console.log('调传片接口')
          this.handleTransmitDialog()
        } else {
          this.fileDialogVisible = true
          res.data.map(item => {
            item['selectedFile'] = ''
          })
          this.fileList = res.data
        }
      })
    },
    // 文件提交
    fileSubmit() {
      const requestParams = []
      var flag = false
      this.fileList.map(item => {
        if (item.selectedFile === '') {
          flag = true
        }
        requestParams.push(item.selectedFile)
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: '请选择上传文件!'
        })
        return false
      }
      updateCowWaferFile(requestParams).then(res => {
        this.fileDialogVisible = false
        this.handleTransmitDialog()
      })
    },
    // 传片确认
    handleTransmitDialog() {
      const details = []
      let abnormalBatch = false
      var abnormalBatchs = []
      this.receiveList.map(item => {
        if (this.abnormalBatchList.indexOf(item.batchNo) !== -1) {
          abnormalBatch = true
          abnormalBatchs.push(item.batchNo)
        }
        details.push({
          batchNo: item.batchNo
        })
      })
      const requestParams = {
        creator: this.jOperator,
        remark: this.jRemarkLeft,
        details
      }
      if (abnormalBatch) {
        const batchs = abnormalBatchs.join(',')
        this.$message({
          type: 'error',
          message: `${batchs}批次异常,请先进行异常处理！`
        })
        return false
      }
      addDeliver(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.transmitDialogVisible = false
      })
    },
    // 拆批数据
    batchDate() {
      this.batchDialogVisible = true
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        batchNo: this.batchNum,
        chipType: this.chipType,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        model: this.model
      }
      getCowList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 导出
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xp-cow-test/export-crossing-data?batchNo=${this.batchNum}&chipType=${this.chipType}&startTime=${startTime}&endTime=${endTime}`)
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.jOperator = ''
      this.jRemarkLeft = ''
      this.cProcess = ''
      this.sProcess = ''
      this.jProcess = this.proceOptions[0].id
      this.jRemark = ''
      this.program = ''
      this.sRemark = ''
      this.cRemark = ''
      this.chipType = ''
      this.receiveList = []
      this.abnormalBatchList = []
    },
    // 取消
    resetForm() {
      this.transmitDialogVisible = false
      this.receiveDialogVisible = false
    }
  }
}

