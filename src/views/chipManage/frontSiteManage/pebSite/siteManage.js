
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findAbnormalList } from '@/api/chipManage/rearSiteManage/cowOverSite'
import { abnormalSave } from '@/api/chipManage/rearSiteManage/tensileTest'
import { proceList } from '@/api/processManagement/proceManage'
import { siteSelect, acceptSliceScan, acceptSlice, cutSlice, upSlice, sendSlice, getRemark, getProgram, findMachinList, downLoadFile, findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      selectTheadVisble: false,
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
      cutSliceList: [],
      abnormalReport: [],
      machinList: [],
      slotList: [],
      hoseNoList: [],
      machineType: '',
      machineCode: '',
      abnormalBatchNum: '',
      program: '',
      selectedRunRow: {},
      selectedAbnormalRow: {},
      batchNo: '',
      model: '',
      pole: '',
      timeRadio: 1,
      textareaRow: 0,
      batch: 0,
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
      motionRadio: 0,
      list: [],
      proceOptions: [],
      transmitList: [],
      rightList: [],
      abnormalRemark: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      theadOptions: [
        { thName: '片数', thKey: 'sliceNum' },
        { thName: '工序', thKey: 'processName' },
        { thName: '接片时间', thKey: 'receivedTime' },
        { thName: '接片人', thKey: 'receivedPeople' },
        { thName: '接片备注', thKey: 'receivedRemark' },
        { thName: '上片时间', thKey: 'upTime' },
        { thName: '上片人', thKey: 'upPeople' },
        { thName: '上片备注', thKey: 'upRemark' },
        { thName: '传片时间', thKey: 'deliverTime' },
        { thName: '传片人', thKey: 'deliverPeople' },
        { thName: '传片备注', thKey: 'deliverRemark' }
      ],
      formTheadOptions: [
        '片数',
        '工序',
        '接片时间',
        '接片人',
        '接片备注',
        '上片时间',
        '上片人',
        '上片备注',
        '传片时间',
        '传片人',
        '传片备注'
      ],
      checkboxVal: [
        '片数',
        '工序',
        '接片时间',
        '接片人',
        '备注',
        '上片时间',
        '上片人',
        '备注',
        '传片时间',
        '传片人',
        '备注'
      ],
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
      currentId: '',
      formThead: [],
      handParams: [],
      handTestParams: [],
      autoParams: [],
      autoTestParams: [],
      isSplit: 0,
      split: 0,
      isReceive: 0
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
    this.findMachineUserFun()
    this.nowProcessListFun()
    this.getProceList()
    this.getListFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('pebHeaders') === null ? this.formTheadOptions : localStorage.getItem('pebHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    downLoadFile(batchNo, processId) {
      const params = {
        siteId: 10,
        batchNo,
        processId
      }
      downLoadFile(params).then(res => {
        window.open(process.env.BASE_API + `/xp-produceTrack/down?siteId=10&batchNo=${batchNo}&processId=${processId}`)
      })
    },
    getListFun() {
      const params = {
        siteId: 10
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
        this.isSplit = res.data[0].isSplit
        if (this.isReceive === 0) {
          this.timeRadio = 2
        }
        this.getParamsData(res.data[0])
      })
    },
    inputChange(data) {
      if (data.paramsCode === 'hongkaoshijian' && parseInt(data.val) < 0) {
        data.val = 0
      }
    },
    getParamsData(row) {
      // pattern 0 自动  1 手动
      // type 0 上片  1 传片
      // paramsType 0 基础  1 参数
      // status 0 启用  1 禁用
      this.handParams = []
      this.handTestParams = []
      this.autoParams = []
      this.autoTestParams = []
      row.params.map(item => {
        // 手动参数                  0 上片                参数（非基础）            启用
        if (item.pattern === 1 && item.type === 0 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.handParams.push(item)
        }
        // 自动参数
        if (item.pattern === 0 && item.type === 0 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.autoParams.push(item)
        }
        // 手动测试参数              1 传片
        if (item.pattern === 1 && item.type === 1 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.handTestParams.push(item)
        }
        // 自动测试参数
        if (item.pattern === 0 && item.type === 1 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.autoTestParams.push(item)
        }
      })
      console.log(this.handParams)
    },
    // 获取机台
    findMachinListFun() {
      const params = {
        siteId: 10,
        processId: this.jProcess,
        pageNum: 1,
        pageSize: 1000
      }
      findMachinList(params).then(res => {
        this.machinList = res.data.list
      })
    },
    // 机台改变
    machineChange(val) {
      this.machinList.map(item => {
        if (item.id === val) {
          this.slotList = item.slotNo === '' ? [] : item.slotNo.split(',')
          this.hoseNoList = item.hoseNo.split(',')
          this.machineType = item.slotNo === '' ? (item.hoseNo === '' ? '' : 1) : 0
          this.machineCode = item.machineCode
        }
      })
      this.trench = ''
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
        if (this.receiveList.length === 0) {
          this.waferTotalNum = 0
        }
      })
    },
    setThead(checkboxVal) {
      var arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    submitOption() {
      const arr = []
      console.log(this.checkboxVal)
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      localStorage.setItem('pebHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 6 ? 120 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    // 获取对应站点的工序
    getProceList() {
      const requestParams = {
        status: 0,
        siteId: 10,
        pageNum: 1,
        pageSize: 10000
      }
      proceList(requestParams).then(res => {
        this.proceOptions = res.data.list
      })
    },
    // 扫描回车
    handleReceiveInput(index) {
      if (this.jProcess === '') {
        this.$message({
          type: 'error',
          message: '请先选择工序!'
        })
        this.jBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.jBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        this.jBatchNum = ''
        return false
      }
      this.receiveFun(index)
    },
    processJChange() {
      this.waferTotalNum = 0
      this.receiveList = []
      if (this.jBatchNum !== '') {
        this.receiveFun(1)
      }
    },
    processSChange() {
      this.waferTotalNum = 0
      this.receiveList = []
      this.machineType = ''
      if (this.jBatchNum !== '') {
        this.receiveFun(2)
      }
      this.machineNum = ''
      this.trench = ''
      this.findMachinListFun()
    },
    processCChange() {
      this.waferTotalNum = 0
      this.receiveList = []
      if (this.jBatchNum !== '') {
        this.receiveFun(3)
      }
    },
    // 扫描请求数据
    receiveFun(index) {
      const requestParams = {
        siteId: 10,
        processId: this.jProcess,
        type: index,
        batchNo: this.jBatchNum
      }
      acceptSliceScan(requestParams).then(res => {
        this.getRemarkFun()
        this.getProgramFun()
        if (index === 3) {
          this.isSplit = res.data.isSplit
        }
        res.data.oldNum = res.data.sliceNum
        this.receiveList.push(res.data)
        this.jBatchNum = ''
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
      }).catch(res => {
        this.jBatchNum = ''
      })
    },
    // 获取备注
    getRemarkFun() {
      const requestParams = {
        siteId: 10,
        processId: this.jProcess,
        batchNo: this.jBatchNum
      }
      getRemark(requestParams).then(res => {
        this.jRemark = res.data
      })
    },
    // 获取程序
    getProgramFun() {
      const requestParams = {
        siteId: 10,
        processId: this.jProcess,
        batchNo: this.jBatchNum
      }
      getProgram(requestParams).then(res => {
        this.program = res.data
      })
    },
    onInput(data) {
      if (data.sliceNum > data.oldNum) {
        data.sliceNum = data.oldNum
      }
      if (data.sliceNum < 1 || data.sliceNum === null) {
        data.sliceNum = 1
      }
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
        processId: this.jProcess,
        description: this.abnormalRemark,
        exceptionSiteCode: 'Q10',
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
    // 拆批接片
    handleJiePian(row) {
      if (this.receiveList.filter(item => { return item.batchNo === row.batchNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      } else {
        this.receiveList.push({
          batchNo: row.batchNo,
          priority: row.priority,
          isSplit: row.isSplit,
          sliceNum: row.waitNum,
          oldNum: row.waitNum
        })
        this.jBatchNum = row.batchNo
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
        this.getRemarkFun()
        this.getProgramFun()
        this.batchDialogVisible = false
      }
    },
    // 拆批上片
    handleShangPian() {
      console.log(1)
    },
    // 拆批传片
    handleChuanPian() {
      console.log(1)
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
      this.handleSearch()
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xp-beforeProcessManage/export?siteId=10&siteName=PEB站点&batchNo=${this.batchNum}&processId=${this.process}&startTime=${startTime}&endTime=${endTime}&timeType=${this.timeRadio}`)
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
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
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      const params = {
        siteId: 10,
        processId: this.jProcess,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList)
      }
      acceptSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.receiveDialogVisible = false
      })
    },
    // 上片
    handleDeliver() {
      this.deliverDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputSp.focus()
      }, 100)
    },
    // 上片确认
    handleDeliverSubmit() {
      if (this.machineNum === '') {
        this.$message({
          type: 'error',
          message: '请选择机台编号!'
        })
        return false
      }
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      for (const item of this.handParams) {
        if (item.val === '') {
          this.$message({
            type: 'error',
            message: '请输入参数信息!'
          })
          return false
        }
      }
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      const paramsList = {}
      this.handParams.map(item => {
        const keys = item.paramsCode
        paramsList[keys] = item.val
      })
      paramsList.machineCode = this.machineCode
      const params = {
        siteId: 10,
        processId: this.jProcess,
        machineCode: this.machineNum,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList),
        paramsList: JSON.stringify(paramsList)
      }
      console.log(params)
      upSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.deliverDialogVisible = false
      })
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
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
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      const params = {
        siteId: 10,
        processId: this.jProcess,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList)
      }
      console.log(params)
      sendSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.transmitDialogVisible = false
      })
    },
    // 拆批数据
    batchDate(index) {
      this.runStatus = index
      const params = {
        siteId: 10,
        processId: this.jProcess,
        type: index
      }
      cutSlice(params).then(res => {
        this.cutSliceList = res.data
      })
      this.batchDialogVisible = true
    },
    // 上片确认
    handleDeliverDialog() {
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
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 10 }).then(res => {
        this.proceOptions = res.data
      })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: '黄光车间' }).then(res => {
        this.userOptions = res.data
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        siteId: 10,
        processId: this.process,
        batchNo: this.batchNum,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        timeType: this.timeRadio
      }
      siteSelect(requestParams).then(res => {
        res.data.list.map(item => {
          var timeArr = []
          var upTimeArr = []
          var deliverTimeArr = []
          var peopleArr = []
          var upPeopleArr = []
          var deliverPeopleArr = []
          var remarkArr = []
          var upRemarkArr = []
          var deliverRemarkArr = []
          item.received.map(sub => {
            timeArr.push(sub.doTime)
            peopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              remarkArr.push(sub.remark)
            }
            item['receivedTime'] = timeArr.join(',')
            item['receivedPeople'] = peopleArr.join(',')
            item['receivedRemark'] = remarkArr.join(',')
          })
          item.upSlice.map(sub => {
            upTimeArr.push(sub.doTime)
            upPeopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              upRemarkArr.push(sub.remark)
            }
            item['upTime'] = upTimeArr.join(',')
            item['upPeople'] = upPeopleArr.join(',')
            item['upRemark'] = upRemarkArr.join(',')
          })
          item.deliver.map(sub => {
            deliverTimeArr.push(sub.doTime)
            deliverPeopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              deliverRemarkArr.push(sub.remark)
            }
            item['deliverTime'] = deliverTimeArr.join(',')
            item['deliverPeople'] = deliverPeopleArr.join(',')
            item['deliverRemark'] = deliverRemarkArr.join(',')
          })
          // 设置参数列显示
          item.arrayFilted = this.mergeObject(item.paramLists)
          item.arrayFilted.map(sub => {
            var key = sub.paramName
            item[key] = sub.paramValue
          })
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    mergeObject(item) {
      // 创建映射
      /* eslint-disable */
      var map = item.reduce((p, c) => [p[c.paramName] = p[c.paramName] || 0, p[c.paramName] += ',' + c.paramValue, p][2], {})
      // 获取映射结果
      var arrayFilted = Object.keys(map).map(key => [{ paramName: key, paramValue: map[key].substr(2) }][0])
      console.log(arrayFilted)
      return arrayFilted
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
      this.machineNum = ''
      this.jBatchNum = ''
      this.jProcess = ''
      this.jRemark = ''
      this.jOperator = ''
      this.jRemarkLeft = ''
      this.program = ''
      this.motionRadio = 0
      this.waferTotalNum = 0
      this.receiveList = []
      this.handParams.map(item => {
        item.val = ''
      })
    },
    // 取消
    resetForm() {
      this.deliverDialogVisible = false
      this.receiveDialogVisible = false
      this.transmitDialogVisible = false
    }
  }
}

