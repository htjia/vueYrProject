
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { abnormalSave } from '@/api/chipManage/rearSiteManage/tensileTest'
import { findRecord, receiveScanning, addReceive, findScanByBatchNo, addDeliver, findException } from '@/api/chipManage/rearSiteManage/cotTestData'
import { nowProcessList } from '@/api/chipManage/transitSiteConfig'
import { getRemark, getProgram, findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      batchDialogVisible: false,
      abnormalReportDialog: false,
      exceptionRecordDialog: false,
      notBastic: false,
      waferTotalNum: 0,
      abnormalList: [],
      proceOptions: [],
      detailList: [{}],
      receiveList: [],
      normalList: [],
      userOptions: [],
      abnormalReport: [],
      abnormalNumList: [],
      normalNumList: [],
      selectedRunRow: {},
      abnormalRemark: '',
      pole: '',
      textareaRow: 0,
      abnormalTimeRadio: 0,
      timeRadio: 0,
      abnormalBatchNum: 0,
      batch: 5,
      totalNum: 0,
      dialogBatchNum: '',
      batchNum: '',
      jBatchNum: '',
      sBatchNum: '',
      cBatchNum: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
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
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      batchOrPiece: 0,
      selectedAbnormalNum: 0,
      beginDate: '',
      endDate: '',
      beginDateDlg: '',
      endDateDlg: '',
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
      pickerOptionsStartDlg: {
        disabledDate: (time) => {
          const endDateVal = this.endDateDlg
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
      pickerOptionsEndDlg: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDateDlg
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
      poleOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.nowProcessListFun()
    this.findMachineUserFun()
  },
  methods: {
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 28 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
    },
    // 获取备注
    getRemarkFun() {
      const requestParams = {
        siteId: 28,
        processId: this.jProcess,
        batchNo: this.cBatchNum
      }
      getRemark(requestParams).then(res => {
        this.jRemark = res.data
      })
    },
    // 获取程序
    getProgramFun() {
      const requestParams = {
        siteId: 28,
        processId: this.jProcess,
        batchNo: this.cBatchNum
      }
      getProgram(requestParams).then(res => {
        this.program = res.data
      })
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    processJChange() {
      this.receiveList = []
      if (this.jBatchNum !== '') {
        this.handleReceiveInput()
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
        siteCode: 'H09'
      }
      receiveScanning(requestParams).then(res => {
        if (res.data !== null) {
          this.jBatchNum = ''
          this.program = res.data.program
          this.jRemark = res.data.remark
          this.receiveList.push(res.data)
          this.waferTotalNum = 0
          this.receiveList.map(item => {
            this.waferTotalNum += item.total
          })
        }
      }).catch(() => {
        this.jBatchNum = ''
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
    processCChange() {
      this.receiveList = []
      this.normalList = []
      if (this.cBatchNum !== '') {
        this.handleDeliverInput()
      }
    },
    downLoadFile(url) {
      window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: 'COT测试操作员' }).then(res => {
        this.userOptions = res.data
      })
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
        this.abnormalNumList = []
        this.receiveList.map(item => {
          this.abnormalNumList.push(item.batchNO)
        })
        this.abnormalNumList = Array.from(new Set(this.abnormalNumList))
      })
    },
    deleteNormalItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.normalList.splice(index, 1)
        this.normalNumList = []
        this.normalList.map(item => {
          this.normalNumList.push(item.batchNO)
        })
        this.normalNumList = Array.from(new Set(this.normalNumList))
      })
    },
    handleDeliverInput() {
      if (this.jProcess === '') {
        this.$message({
          type: 'error',
          message: '请先选择工序!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.waferNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.normalList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批次已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      findScanByBatchNo({ batchNo: this.cBatchNum }).then(res => {
        this.getRemarkFun()
        this.getProgramFun()
        res.data.map(item => {
          if (item.status === 0) {
            this.normalList.push(item)
          } else {
            this.receiveList.push(item)
          }
          this.cBatchNum = ''
        })
        // batch
        this.abnormalNumList = []
        this.receiveList.map(item => {
          this.abnormalNumList.push(item.batchNO)
        })
        this.abnormalNumList = Array.from(new Set(this.abnormalNumList))
        this.normalNumList = []
        this.normalList.map(item => {
          this.normalNumList.push(item.batchNO)
        })
        this.normalNumList = Array.from(new Set(this.normalNumList))
      }).catch(() => { this.cBatchNum = '' })
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xpCotDeliver/excelRecord?batchNo=${this.batchNum}&timeType=${this.timeRadio}&startTime=${startTime}&endTime=${endTime}`)
    },
    exceptionRecord() {
      this.exceptionRecordDialog = true
      const params = {
        pageSize: 10000,
        pageNum: 1,
        startTime: this.beginDateDlg === '' ? '' : this.formatDate(this.beginDateDlg),
        endTime: this.endDateDlg === '' ? '' : this.formatDate(this.endDateDlg),
        batchNo: this.dialogBatchNum,
        timeType: this.abnormalTimeRadio
      }
      findException(params).then(res => {
        this.abnormalList = res.data.list
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.batchNum = ''
      this.beginDate = ''
      this.endDate = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    clearDialogSearch() {
      this.dialogBatchNum = ''
      this.beginDateDlg = ''
      this.endDateDlg = ''
      this.abnormalTimeRadio = 0
      this.exceptionRecord()
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
    // 异常提交
    handleReporting() {
      this.abnormalRemark = ''
      const details = []
      this.receiveList.map(item => {
        details.push({
          batchNo: item.batchNO,
          reason: item.error.join(','),
          waferNo: item.waferNo
        })
      })
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        processId: this.jProcess,
        description: this.abnormalRemark,
        exceptionSiteCode: 'H06',
        details
      }
      console.log(params)
      abnormalSave(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.receiveList = []
        this.abnormalReportDialog = false
      })
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    handleTransmitDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const detailList = []
      this.normalList.map(item => {
        detailList.push({
          batchNo: item.batchNo,
          waferNo: item.waferNo
        })
      })
      const requestParams = {
        siteId: 28,
        processId: this.jProcess,
        creator: this.jOperator,
        remark: this.jRemarkLeft,
        detailList
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
        timeType: this.timeRadio,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        batchNo: this.batchNum,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      findRecord(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose() {
      this.jProcess = this.proceOptions[0].id
      this.jRemark = ''
      this.program = ''
      this.cBatchNum = ''
      this.jOperator = ''
      this.cRemarkLeft = ''
      this.receiveList = []
      this.normalList = []
    },
    // 取消
    resetForm() {
      this.transmitDialogVisible = false
      this.receiveDialogVisible = false
    }
  }
}

