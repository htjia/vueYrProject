
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getTensileList, deliverScanning, addDeliver, receiveScanning, abnormalSave, addReceive, findModelList, addDropElectrodeRecord } from '@/api/chipManage/rearSiteManage/tensileTest'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
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
      isReceive: 0,
      waferTotalNum: 0,
      selectedAbnormalNum: 0,
      waferTotal: 0,
      abnormalList: [],
      abnormalBatchList: [],
      detailList: [],
      receiveList: [],
      userOptions: [],
      abnormalBatchNum: '',
      selectedRunRow: {},
      selectedAbnormalRow: {},
      batchNo: '',
      processId: '',
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
      modelList: [],
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
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.getListFun()
    this.nowProcessListFun()
    this.findMachineUserFun()
    this.findModelListFun()
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
    getListFun() {
      const params = {
        siteId: 21
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
      })
    },
    findModelListFun() {
      findModelList({}).then(res => {
        this.modelList = res.data
      })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: '拉力测试操作员' }).then(res => {
        this.userOptions = res.data
      })
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 21 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
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
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
      this.handleSearch()
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
      this.abnormalReportDialog = true
      setTimeout(() => {
        this.$refs.runTable.setCurrentRow(this.receiveList[0])
      }, 500)
      console.log(this.receiveList)
      this.detailList = this.receiveList[0].wafers
      console.log(this.detailList)
      this.waferTotalNum = this.receiveList[0].wafers.length
      this.abnormalBatchNum = this.receiveList[0].batchNo
      this.selectedAbnormalRow = this.receiveList[0]
      this.textareaRow = 18
    },
    // 异常选中
    abnormalChange(data) {
      this.selectedAbnormalNum = data.filter(item => { return item.abnormalStatus === true }).length
    },
    // 异常详情选中
    abnormalDetailChange(data) {
      const selectedNum = data.filter(item => { return item.abnormalStatus === true }).length
      if (selectedNum > 0) {
        this.selectedAbnormalRow.abnormalStatus = true
        this.selectedAbnormalRow.selectedWafer = selectedNum
      } else {
        this.selectedAbnormalRow.abnormalStatus = false
        this.selectedAbnormalRow.selectedWafer = 0
      }
      this.selectedAbnormalNum = this.receiveList.filter(item => { return item.abnormalStatus === true }).length
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
      const poleList = []
      let flag = false
      let hasAblm = false
      const itemFlag = false
      this.receiveList.map(item => {
        if (item.abnormalStatus) {
          abnormalBatchList.push(item.batchNo)
          hasAblm = true
          if (item.selectedWafer === 0) {
            flag = true
            console.log(123)
          }
          item.wafers.map(subItem => {
            if (subItem.status) {
              poleList.push({
                batchNo: item.batchNo,
                rankNum: subItem.sequence,
                isDrop: subItem.pole
              })
            }
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
      console.log(poleList)
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
        processId: this.jProcess,
        exceptionSiteCode: 'H02',
        details
      }
      console.log(abnormalBatchList)
      abnormalSave(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.abnormalBatchList = abnormalBatchList
        this.abnormalReportDialog = false
        // poleList
        addDropElectrodeRecord(poleList).then(res => {})
      })
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
        this.cBatchNum = ''
        return false
      }
      deliverScanning({ batchNo: this.cBatchNum, processId: this.jProcess }).then(res => {
        this.program = res.data.program
        this.jRemark = res.data.remark
        this.processId = res.data.processId
        res.data.wafers.map(item => {
          item['status'] = false
          item['remark'] = ''
          item['abnormalCause'] = ''
          item['abnormalStatus'] = false
          item['pole'] = 0
        })
        res.data['abnormalStatus'] = false
        res.data['selectedWafer'] = 0
        this.receiveList.push(res.data)
        console.log(this.receiveList)
        this.batchNo = this.receiveList[0].batchNo
        this.rightList = this.receiveList[0].wafers
        setTimeout(() => {
          this.$refs.leftTable.setCurrentRow(this.receiveList[0])
        }, 500)
        this.cBatchNum = ''
      })
    },
    // 传片提交
    handleTransmitSubmit() {
      // 掉电极
      let flag = false
      let abnormalBatch = false
      var abnormalBatchs = []
      this.receiveList.map(item => {
        if (this.abnormalBatchList.indexOf(item.batchNo) !== -1) {
          abnormalBatch = true
          abnormalBatchs.push(item.batchNo)
        }
        item.wafers.map(wafer => {
          if (wafer.pole === 1) {
            flag = true
          }
        })
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: '存在异常Wafer信息，请先进行异常上报!'
        })
        return false
      }
      if (abnormalBatch) {
        const batchs = abnormalBatchs.join(',')
        this.$message({
          type: 'error',
          message: `${batchs}批次异常,请先进行异常处理！`
        })
        return false
      }
      if (this.cOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const details = []
      this.receiveList.map(item => {
        item.wafers.map(wafer => {
          details.push({
            isDrop: wafer.pole,
            isTest: wafer.status ? 1 : 0,
            remark: wafer.remark,
            slicePosition: wafer.sequence,
            waferNo: wafer.waferNo,
            batchNo: item.batchNo
          })
        })
      })
      const requestParams = {
        creator: this.cOperator,
        remark: this.cRemarkLeft,
        details
      }
      console.log(requestParams)
      addDeliver(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.transmitDialogVisible = false
      })
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
        siteCode: 'H02',
        processId: this.jProcess
      }
      receiveScanning(requestParams).then(res => {
        if (res.data !== null) {
          this.program = res.data.program
          this.jRemark = res.data.remark
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
        this.batchNo = ''
        this.rightList = []
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
        this.fetchData()
        this.receiveDialogVisible = false
      })
    },
    // 传片按钮
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
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
        timeType: this.timeRadio,
        batchNo: this.batchNum,
        isDrop: this.pole,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        model: this.model
      }
      getTensileList(requestParams).then(res => {
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
    switchChange(data) {
      console.log(data)
    },
    // 关闭
    handleClose() {
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.sBatchNum = ''
      this.jProcess = this.proceOptions[0].id
      this.cProcess = ''
      this.sProcess = ''
      this.jRemark = ''
      this.program = ''
      this.sRemark = ''
      this.cRemark = ''
      this.batchNo = ''
      this.receiveList = []
      this.rightList = []
      this.abnormalBatchList = []
      this.cOperator = ''
      this.jOperator = ''
      this.jRemarkLeft = ''
      this.cRemarkLeft = ''
    },
    leftRowClick(row) {
      this.selectedRow = row
      this.waferTotal = row.total
      this.batchNo = row.batchNo
      this.rightList = row.wafers
    },
    // 取消
    resetForm() {
      this.transmitDialogVisible = false
      this.receiveDialogVisible = false
    }
  }
}

