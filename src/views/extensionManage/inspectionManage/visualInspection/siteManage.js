
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { testingTicket, matfindList, furnacefindAll, add, reasonQuery, levelQuery } from '@/api/extensionManage/visualInspection/visualInspection'
const defaultFormThead = [
  {
    thName: '导入时间',
    thKey: 'name'
  },
  {
    thName: '镭刻号',
    thKey: 'status'
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      innerVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      list: [],
      defaultFormThead: [],
      formThead: defaultFormThead,
      waferTol: 0,
      isActive: 0,
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      setIndex: 0,
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
      userOptions: [],
      tipOutForm: {
        runId: '',
        jglx: '',
        jtbh: '',
        lcbh: '',
        fpr: '',
        dpbh: '',
        pdzx: '',
        mbbc: '',
        djsj: '',
        cdlx: '',
        sclx: '',
        tipOutDate: '',
        tipOutTime: '',
        dpsycs: '',
        recipeName: '',
        djyy: '',
        bctzr: '',
        tipOutEndDate: '',
        qpr: '',
        remark: ''
      },
      wafers: [
        { name: 1, isActive: false }, { name: 2, isActive: false }, { name: 3, isActive: false }, { name: 4, isActive: false }, { name: 5, isActive: false },
        { name: 6, isActive: false }, { name: 7, isActive: false }, { name: 8, isActive: false }, { name: 9, isActive: false }, { name: 10, isActive: false },
        { name: 11, isActive: false }, { name: 12, isActive: false }, { name: 13, isActive: false }, { name: 14, isActive: false }, { name: 15, isActive: false },
        { name: 16, isActive: false }, { name: 17, isActive: false }, { name: 18, isActive: false }, { name: 19, isActive: false }, { name: 20, isActive: false },
        { name: 21, isActive: false }, { name: 22, isActive: false }, { name: 23, isActive: false }, { name: 24, isActive: false }, { name: 25, isActive: false },
        { name: 26, isActive: false }, { name: 27, isActive: false }, { name: 28, isActive: false }, { name: 29, isActive: false }, { name: 30, isActive: false },
        { name: 31, isActive: false }, { name: 32, isActive: false }, { name: 33, isActive: false }, { name: 34, isActive: false }, { name: 35, isActive: false },
        { name: 36, isActive: false }, { name: 37, isActive: false }, { name: 38, isActive: false }, { name: 39, isActive: false }, { name: 40, isActive: false },
        { name: 41, isActive: false }, { name: 42, isActive: false }, { name: 43, isActive: false }, { name: 44, isActive: false }, { name: 45, isActive: false },
        { name: 46, isActive: false }, { name: 47, isActive: false }, { name: 48, isActive: false }, { name: 49, isActive: false }, { name: 50, isActive: false },
        { name: 51, isActive: false }, { name: 52, isActive: false }, { name: 53, isActive: false }, { name: 54, isActive: false }
      ],
      rowInfo: {
        adjusts: '',
        createTime: '',
        creator: '',
        creatorName: '',
        decideId: '',
        endTime: '',
        exception: '',
        finalStatus: '',
        id: '',
        machineCode: '',
        machineId: '',
        measureId: '',
        oldRunId: '',
        platterId: '',
        platterNo: '',
        platterTotal: '',
        produceCode: '',
        produceId: '',
        recipeName: '',
        remark: '',
        runId: '',
        runTime: '',
        standbyReason: '',
        standbyTime: '',
        startTime: '',
        status: '',
        stoveCode: '',
        stoveId: '',
        structureCode: '',
        structureTypeId: '',
        substrateCode: '',
        substrateTypeId: '',
        taker: '',
        takerName: '',
        waferList: '',
        wafers: [],
        decisionRuleId: 0,
        wavelength: ''
      },
      activeTabIndex: 0,
      selectedRightItem: '',
      selectedLeftItem: '',
      selectedList: [],
      runTime: '',
      currentTime: '',
      isSelectedEnd: false,
      showExceptionHandle: false,
      currentId: '',
      anotherlist: [],
      anotherlist1: [],
      runId: '',
      machineValue: '',
      machineOptions: [],
      furnaceOptions: [],
      furnaceValue: '',
      radio: '1',
      searchRadio: '1',
      substrateFindOptions: [],
      decisionRuleList: [
        { id: 1, name: '1片代1圈' },
        { id: 2, name: '1片代2圈' },
        { id: 3, name: '1片代4圈' }
      ],
      levelList: [],
      reasonList: [],
      isSearch: '1',
      allvisualLevelValue: '',
      allexceptionId: '',
      isDisabled: false,
      isShowMenu: {
        'wyproductionManage-visualInspection-start': false,
        'wyproductionManage-visualInspection-update': false
      }
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'wyproductionManage') {
            for (const items of item.children) {
              if (items.path === 'inspectionManage') {
                for (const citems of items.children) {
                  if (citems.path === 'visualInspections') {
                    const menus = citems.funIds.split(',')
                    for (const menu of menus) {
                      _this.isShowMenu[menu] = true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    this.fetchData()
    this.matfindList()
    this.furnacefindAll()
  },
  methods: {
    // 导入完成
    importsClosure() {
      this.innerVisible = false
      this.activeTabIndex = 1
    },
    timeStop(val) {
      if (val) {
        this.currentTime = this.getCurrentTime()
      }
    },
    tableRowClassColors({ row, column, rowIndex, columnIndex }) {
      if (row.finalStatus === '10') {
        if (columnIndex === 3) {
          return 'background: #F56C6C !important;color:#fff'
        }
      }
    },
    // 选择Laser_Mark
    toLeft() {
      if (!this.selectedRightItem) {
        this.$message({
          type: 'error',
          message: '请先选择衬底信息!'
        })
      } else {
        var delectIndex
        this.rightList.forEach((item, index) => {
          if (item.Laser_Mark === this.selectedRightItem.Laser_Mark) {
            delectIndex = index
          }
        })
        this.rightList.splice(delectIndex, 1)
        this.selectedList.push(this.selectedRightItem)
        for (const item of this.leftList) {
          if (item.Laser_Mark === '') {
            item.Laser_Mark = this.selectedRightItem.Laser_Mark
            return
          }
        }
      }
    },
    toRight() {
      if (this.selectedLeftItem === '') {
        this.$message({
          type: 'error',
          message: '请选择要解绑的Wafer信息!'
        })
      } else {
        if (this.selectedLeftItem.Laser_Mark === '') {
          this.$message({
            type: 'error',
            message: '请先选择衬底信息!'
          })
        } else {
          this.deleteItem(this.selectedLeftItem)
          this.$refs.waferTable.setCurrentRow()
        }
      }
    },
    // 上移
    handleUp(row, index) {
      if (index > 0) {
        const beforeLaserMark = this.leftList[index - 1].Laser_Mark
        const currentLaserMark = row.Laser_Mark
        this.leftList[index - 1].Laser_Mark = currentLaserMark
        this.leftList[index].Laser_Mark = beforeLaserMark
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(row, index) {
      if ((index + 1) === this.leftList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const nextLaserMark = this.leftList[index + 1].Laser_Mark
        const currentLaserMark = row.Laser_Mark
        this.leftList[index + 1].Laser_Mark = currentLaserMark
        this.leftList[index].Laser_Mark = nextLaserMark
      }
    },
    deleteItem(row, index) {
      if (row.Laser_Mark === '') {
        this.$message({
          type: 'error',
          message: '请先选择衬底信息!'
        })
      } else {
        var delectIndex
        var delectItem
        this.selectedList.forEach((item, index) => {
          if (item.Laser_Mark === row.Laser_Mark) {
            delectIndex = index
            delectItem = item
          }
        })
        this.selectedList.splice(delectIndex, 1)
        this.rightList.push(delectItem)
        row.Laser_Mark = ''
      }
    },
    showtime() {
      this.runTime = this.getCurrentTime()
      setTimeout(this.showtime, 1000)
    },
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    subStrateCurrentChange(row) {
      this.selectedRightItem = row
    },
    waferCurrentChange(row) {
      this.selectedLeftItem = row
    },
    waferClick(data) {
      // data.isActive = !data.isActive
    },
    editSubstrateInfo() {
      this.innerVisible = true
    },
    // 异常处理
    exceptionHandling() {
      this.showExceptionHandle = true
    },
    // 生成WaferID
    createWaferID() {
      this.activeTabIndex = 1
    },
    reasonQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000000,
        status: 0
      }
      reasonQuery(params).then(res => {
        this.reasonList = res.data.list
      })
    },
    levelQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000000,
        status: 0
      }
      levelQuery(params).then(res => {
        this.levelList = res.data.list
      })
    },
    // 单击Run信息
    handleCurrentChange(row) {
      this.anotherpageSize = 1
      this.anotherpageNum = 12
      this.anotherlist = []
      var waferIdArr = []
      this.waferTol = 0
      if (row !== null) {
        // this.selectbillNo = row.machineCode
        this.rowInfo = row
        if (this.rowInfo.createTime !== null && this.rowInfo.createTime.length > 0) {
          this.rowInfo.createTimes = this.rowInfo.createTime.substring(0, 10)
        }
        if (this.rowInfo.startTime !== null && this.rowInfo.startTime.length > 0) {
          this.rowInfo.startTimes = this.rowInfo.startTime.substring(11)
        }
        // if (this.rowInfo.endTime !== null && this.rowInfo.endTime.length > 0) {
        //   this.rowInfo.endTimes = this.rowInfo.endTime.substring(0, 10)
        // }
        this.rowInfo.endTimes = this.rowInfo.endTime
        for (let i = 0; i < row.wafers.length; i++) {
          row.wafers[i].isSelected = false
          row.wafers[i].isAcceptSlice = false
          row.wafers[i].type = ''
          row.wafers[i].visualLevelValue = ''
          waferIdArr.push(parseInt(row.wafers[i].waferId.substr(10, 2)))
          this.anotherlist.push(row.wafers[i])
        }
        this.wafers.map((item) => {
          item.isActive = false
        })
        this.wafers.forEach((item, index) => {
          waferIdArr.map((waferId) => {
            if (waferId - 1 === index) {
              item.isActive = true
            }
          })
        })
        this.waferTol = row.wafers.length
      }
      // this.queryOneDetail()
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      // this.isActive = 1
      this.rowInfo = row
      var waferIdArr = []
      this.anotherlist = []
      if (row !== null) {
        // this.selectbillNo = row.machineCode
        this.rowInfo = row
        if (this.rowInfo.createTime !== null && this.rowInfo.createTime.length > 0) {
          this.rowInfo.createTimes = this.rowInfo.createTime.substring(0, 10)
        }
        if (this.rowInfo.startTime !== null && this.rowInfo.startTime.length > 0) {
          this.rowInfo.startTimes = this.rowInfo.startTime.substring(11)
        }
        if (this.rowInfo.endTime !== null && this.rowInfo.endTime.length > 0) {
          this.rowInfo.endTimes = this.rowInfo.endTime.substring(0, 10)
        }
        for (let i = 0; i < row.wafers.length; i++) {
          row.wafers[i].isSelected = false
          row.wafers[i].isAcceptSlice = false
          row.wafers[i].type = ''
          row.wafers[i].visualLevelValue = ''
          waferIdArr.push(parseInt(row.wafers[i].waferId.substr(10, 2)))
          this.anotherlist.push(row.wafers[i])
        }
        this.wafers.map((item) => {
          item.isActive = false
        })
        this.wafers.forEach((item, index) => {
          waferIdArr.map((waferId) => {
            if (waferId - 1 === index) {
              item.isActive = true
            }
          })
        })
        this.waferTol = row.wafers.length
      }
    },
    checklevels(row, index, event) {
      let flag = true
      for (const item of this.levelList) {
        if (item.quickSearch === row.visualLevelValue) {
          row.visualLevelValue = item.name
          row.visualLevelId = item.id
          flag = false
          break
        }
        if (item.name === row.visualLevelValue && row.visualLevelId === item.id) {
          flag = false
          break
        }
      }
      if (flag) {
        row.visualLevelValue = ''
        row.visualLevelId = ''
      }
    },
    checklevel(row, index, event) {
      if (event.key === 'Enter' || event.keyIdentifier === 'Enter') {
        let flag = true
        for (const item of this.levelList) {
          if (item.quickSearch === row.visualLevelValue) {
            row.visualLevelValue = item.name
            row.visualLevelId = item.id
            flag = false
            break
          }
          if (item.name === row.visualLevelValue && row.visualLevelId === item.id) {
            flag = false
            break
          }
        }
        if (flag) {
          row.visualLevelValue = ''
          row.visualLevelId = ''
        }
        if (index < this.anotherlist1.length - 1) {
          this.setIndex = index + 1
          this.$refs[this.anotherlist1[this.setIndex].waferId].$el.querySelector('input').focus()
        }
      } else if (event.key === 'ArrowDown' || event.keyIdentifier === 'ArrowDown') {
        if (index < this.anotherlist1.length - 1) {
          this.setIndex = index + 1
          this.$refs[this.anotherlist1[this.setIndex].waferId].$el.querySelector('input').focus()
          this.setCurrRow()
        }
      } else if (event.key === 'ArrowUp' || event.keyIdentifier === 'ArrowUp') {
        if (index !== 0) {
          this.setIndex = index - 1
          this.$refs[this.anotherlist1[this.setIndex].waferId].$el.querySelector('input').focus()
          this.setCurrRow()
        }
      } else if (event.key === 'Backspace' || event.keyIdentifier === 'Backspace') {
        let flag = true
        for (const item of this.levelList) {
          if (item.quickSearch === row.visualLevelValue) {
            row.visualLevelValue = item.name
            row.visualLevelId = item.id
            flag = false
            break
          }
          if (item.name === row.visualLevelValue && row.visualLevelId === item.id) {
            flag = false
            break
          }
        }
        if (flag) {
          row.visualLevelValue = ''
          row.visualLevelId = ''
        }
      }
    },
    // 衬底投片 基本信息/Wafer信息
    tabClick(index) {
      this.activeTabIndex = index
      if (this.activeTabIndex === 1) {
        setTimeout(this.setCurrRow(), 1000)
        this.$nextTick(() => {
          this.$refs[this.anotherlist1[this.setIndex].waferId].$el.querySelector('input').focus()
        })
      }
    },
    setCurrRow() {
      this.$refs.setAnothers.setCurrentRow(this.anotherlist1[this.setIndex])
    },
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.runId = ''
      this.machineValue = ''
      this.furnaceValue = ''
      this.pageNum = 1
      this.radio = '1'
      this.fetchData()
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    furnacefindAll() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      furnacefindAll(params).then(res => {
        this.furnaceOptions = res.data.list
      })
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
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
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        runId: this.runId,
        mCode: this.machineValue,
        stoveCode: this.furnaceValue
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      if (this.radio === '1') {
        requestParams.pendingStatus = this.radio
      } else {
        requestParams.completedStatus = this.radio
      }
      this.searchRadio = this.radio
      testingTicket(requestParams).then(res => {
        this.isSearch = this.radio
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        } else {
          this.rowInfo = {
            adjusts: '',
            createTime: '',
            creator: '',
            creatorName: '',
            decideId: '',
            endTime: '',
            exception: '',
            finalStatus: '',
            id: '',
            machineCode: '',
            machineId: '',
            measureId: '',
            oldRunId: '',
            platterId: '',
            platterNo: '',
            platterTotal: '',
            produceCode: '',
            produceId: '',
            recipeName: '',
            remark: '',
            runId: '',
            runTime: '',
            standbyReason: '',
            standbyTime: '',
            startTime: '',
            status: '',
            stoveCode: '',
            stoveId: '',
            structureCode: '',
            structureTypeId: '',
            substrateCode: '',
            substrateTypeId: '',
            taker: '',
            takerName: '',
            waferList: '',
            wafers: [],
            decisionRuleId: 0,
            wavelength: ''
          }
        }
      })
    },
    // 衬底投片
    tipOut() {
      if (this.rowInfo.runId === '') {
        this.$message({
          type: 'error',
          message: '请选择要选片的Run信息!'
        })
        return
      }
      if (this.rowInfo.qualityTested !== 0 && this.rowInfo.finalStatus !== '10') {
        this.$message({
          type: 'error',
          message: '目检已检测!'
        })
        return
      }
      // if (this.searchRadio === '1') {
      this.levelQuery()
      this.reasonQuery()
      this.addDialogVisible = true
      this.allvisualLevelValue = ''
      this.allexceptionId = ''
      this.setIndex = 0
      this.anotherlist1 = []
      for (let i = 0; i < this.anotherlist.length; i++) {
        var data = {
          waferId: this.anotherlist[i].waferId,
          substrateType: this.anotherlist[i].substrateType,
          boxNo: this.anotherlist[i].boxNo,
          singleDoubleThrow: this.anotherlist[i].singleDoubleThrow,
          measureCode: this.anotherlist[i].measureCode,
          supplier: this.anotherlist[i].supplier,
          laserMark: this.anotherlist[i].laserMark,
          swr: this.anotherlist[i].swr,
          visualLevelId: this.anotherlist[i].visualLevelId,
          visualLevelValue: this.anotherlist[i].visualLevelCode,
          exceptionId: this.anotherlist[i].exceptionId,
          remark: this.anotherlist[i].remark
        }
        this.anotherlist1.push(data)
      }
      this.activeTabIndex = 0
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择待目检信息!'
      //   })
      // }
    },
    // 衬底投片
    tipOuts() {
      if (this.rowInfo.runId === '') {
        this.$message({
          type: 'error',
          message: '请选择要选片的Run信息!'
        })
        return
      }
      this.levelQuery()
      this.reasonQuery()
      this.addDialogVisible = true
      this.allvisualLevelValue = ''
      this.setIndex = 0
      this.anotherlist1 = []
      for (let i = 0; i < this.anotherlist.length; i++) {
        var data = {
          waferId: this.anotherlist[i].waferId,
          substrateType: this.anotherlist[i].substrateType,
          boxNo: this.anotherlist[i].boxNo,
          singleDoubleThrow: this.anotherlist[i].singleDoubleThrow,
          measureCode: this.anotherlist[i].measureCode,
          supplier: this.anotherlist[i].supplier,
          laserMark: this.anotherlist[i].laserMark,
          swr: this.anotherlist[i].swr,
          visualLevelId: this.anotherlist[i].visualLevelId,
          visualLevelValue: this.anotherlist[i].visualLevelCode,
          exceptionId: this.anotherlist[i].exceptionId,
          remark: this.anotherlist[i].remark
        }
        this.anotherlist1.push(data)
      }
      this.activeTabIndex = 0
    },
    // 关闭
    handleClose() {
      this.addDialogVisible = false
    },
    // 添加提交
    submitForm() {
      let flag = true
      const data = []
      for (const item of this.anotherlist1) {
        if (item.visualLevelId === null || item.visualLevelId === '') {
          flag = false
          break
        }
        data.push({
          remark: item.remark,
          runId: this.rowInfo.runId,
          visualLevelId: item.visualLevelId,
          visualLevelValue: '',
          visualReasonId: item.exceptionId,
          waferId: item.waferId
        })
      }
      if (flag) {
        this.isDisabled = true
        add(data).then(res => {
          this.isDisabled = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '目检完成!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        }, res => {
          this.isDisabled = false
        })
      } else {
        this.isDisabled = false
        this.$message({
          type: 'error',
          message: 'wafer信息目检不能为空或匹配不正确!'
        })
      }
    },
    // 关闭1
    handleClose1() {
      this.$confirm('关闭后若有未保存的信息将丢失，确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addDialogVisible = false
      }).catch(() => {
        this.addDialogVisible = true
      })
    },
    // 取消
    resetForm() {
      this.addDialogVisible = false
    },
    checkalllevel() {
      let value = ''
      let id = ''
      let flag = true
      for (const item of this.levelList) {
        if (item.quickSearch === this.allvisualLevelValue) {
          value = item.name
          id = item.id
          flag = false
          break
        }
        if (item.name === this.allvisualLevelValue) {
          value = item.name
          id = item.id
          flag = false
          break
        }
      }
      if (flag) {
        value = ''
        id = ''
      }
      for (let i = 0; i < this.anotherlist1.length; i++) {
        this.anotherlist1[i].visualLevelValue = value
        this.anotherlist1[i].visualLevelId = id
      }
    },
    seupallexp() {
      for (let i = 0; i < this.anotherlist1.length; i++) {
        this.anotherlist1[i].exceptionId = this.allexceptionId
      }
    }
  }
}

