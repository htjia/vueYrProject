
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import { findAbnormalList } from '@/api/chipManage/rearSiteManage/cowOverSite'
import { addReceive } from '@/api/chipManage/rearSiteManage/inciseOverSite'
import { getdList, scanning, findAbnormalList, addDeliver } from '@/api/extensionManage/cleanoutManage/clean'
import { abnormalSave, findMachineUser, receiveScanning } from '@/api/chipManage/rearSiteManage/tensileTest'
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
  mounted() {
    this.fetchData()
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
    // 人员
    findMachineUserFun() {
      findMachineUser({}).then(res => {
        this.userOptions = res.data.list
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
      let flag = false
      const itemFlag = false
      let hasAblm = false
      this.abnormalReport.map(item => {
        if (item.abnormalStatus) {
          hasAblm = true
          if (item.selectedWafer === 0) {
            flag = true
          }
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
        processId: this.processId,
        description: this.abnormalRemark,
        exceptionSiteCode: 'H04',
        details
      }
      console.log(params)
      abnormalSave(params).then(res => {
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
      this.batchNum = ''
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
        key: this.jBatchNum,
        siteCode: 'H04'
      }
      receiveScanning(requestParams).then(res => {
        if (res.data !== null) {
          this.receiveList.push(res.data)
          this.this.jBatchNum = ''
        }
      }).catch(() => {
        this.this.jBatchNum = ''
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
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片扫描
    handleDeliverInput() {
      if (this.receiveList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      const requestParams = {
        key: this.cBatchNum,
        siteCode: 'H13'
      }
      scanning(requestParams).then(res => {
        if (res.data !== null) {
          this.receiveList.push(res.data)
          this.cBatchNum = ''
          this.processId = res.data.processId
        }
      }).catch(() => { this.cBatchNum = '' })
    },
    // 传片确认
    handleTransmitDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const details = []
      this.receiveList.map(item => {
        for (const wafer of item.waferNo) {
          details.push({
            waferNo: wafer.waferNo,
            batchNo: item.batchNo
          })
        }
      })
      const requestParams = {
        creator: this.jOperator,
        remark: this.jRemarkLeft,
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
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.sBatchNum = ''
      this.jProcess = ''
      this.cProcess = ''
      this.sProcess = ''
      this.jRemark = ''
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

