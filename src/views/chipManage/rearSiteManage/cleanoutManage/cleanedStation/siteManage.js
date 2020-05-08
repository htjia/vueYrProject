
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { nowProcessList } from '@/api/chipManage/transitSiteConfig'
import { addReceive } from '@/api/chipManage/rearSiteManage/inciseOverSite'
import { getdList, addDeliver } from '@/api/extensionManage/cleanoutManage/clean'
import { batchInsert, afterSortingScan } from '@/api/chipManage/rearSiteManage/tensileTest'
import { findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
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
      notBastic: false,
      waferTotalNum: 0,
      selectedAbnormalNum: 0,
      waferTotal: 0,
      abnormalList: [],
      detailList: [],
      receiveList: [],
      userOptions: [],
      processId: '',
      abnormalBatchNum: '',
      selectedRunRow: {},
      selectedAbnormalRow: {},
      batchNo: '',
      waferNo: '', // -------------
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
      pageSize: 12,
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
      program: '',
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.nowProcessListFun()
    this.findMachineUserFun()
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
  methods: {
    processCChange() {
      this.receiveList = []
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 30 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: '下Bin清洗操作员' }).then(res => {
        this.userOptions = res.data
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
      this.waferTotalNum = 0
      this.detailList = []
      for (const item of this.receiveList) {
        this.detailList.push({
          checkProcess: this.jProcess,
          creator: sessionStorage.getItem('User-Id'),
          pattern: 1,
          reason: '',
          waferNo: item.batchNo,
          abnormalStatus: false
        })
      }
      this.abnormalReportDialog = true
    },
    // 异常选中
    abnormalChange(data) {
      this.selectedAbnormalNum = data.filter(item => { return item.abnormalStatus === true }).length
    },
    // 异常详情选中
    abnormalDetailChange(data) {
      this.waferTotalNum = 0
      for (const item of this.detailList) {
        if (item.abnormalStatus) {
          this.waferTotalNum = this.waferTotalNum + 1
        }
      }
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
      let itemFlag = false
      for (const item of this.detailList) {
        if (item.abnormalStatus) {
          if (item.reason.trim() === '') {
            itemFlag = true
            break
          }
          details.push(item)
        }
      }
      if (itemFlag) {
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
      batchInsert(details).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.abnormalReportDialog = false
      })
    },
    // 导出

    exportExcel() {
      // console.log(process.env.BASE_API + '/xp-clean-crossing/export-data')
      const requestParams = '?waferNo=' + this.waferNo + '&startTime' + (this.beginDate === '' ? '' : this.formatDate(this.beginDate)) + '&endTime' + (this.endDate === '' ? '' : this.formatDate(this.endDate))
      window.open(process.env.BASE_API + '/xp-clean-crossing/export-data' + requestParams, '_blank')
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
      this.waferNo = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
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
    handleReceiveInput() {
      if (this.receiveList.filter(item => { return item.batchNo === this.jBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      const requestParams = {
        binNo: this.jBatchNum
      }
      afterSortingScan(requestParams).then(res => {
        if (res.data !== null) {
          this.receiveList.push(res.data)
          this.jBatchNum = ''
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
          piecesNum: item.piecesNum
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
      this.cBatchNum = ''
      this.cOperator = ''
      this.cRemarkLeft = ''
      this.receiveList = []
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片扫描
    handleDeliverInput() {
      if (this.receiveList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前片已存在!'
        })
        return false
      }
      const requestParams = {
        binNo: this.cBatchNum,
        processId: this.jProcess
      }
      afterSortingScan(requestParams).then(res => {
        if (res.data !== null) {
          for (const item of res.data.wafers) {
            this.receiveList.push({
              batchNo: item,
              emergency: res.data.emergency
            })
          }
          this.cBatchNum = ''
          this.program = res.data.program
          this.jRemark = res.data.remark
        }
      }).catch(() => { this.cBatchNum = '' })
    },
    // 传片确认
    handleTransmitDialog() {
      if (this.cOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const details = []
      this.receiveList.map(item => {
        details.push({
          waferNo: item.batchNo
        })
      })
      const requestParams = {
        creator: this.cOperator,
        remark: this.cRemarkLeft,
        details
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
    downLoadFile(url) {
      window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        // batchNo: this.batchNum,
        waferNo: this.waferNo,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getdList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
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
      this.jProcess = this.proceOptions[0].id
      this.jRemark = ''
      this.program = ''
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.cOperator = ''
      this.cRemarkLeft = ''
      this.jProcess = ''
      this.cProcess = ''
      this.sProcess = ''
      this.sRemark = ''
      this.cRemark = ''
      this.receiveList = []
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

